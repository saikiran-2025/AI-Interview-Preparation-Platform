const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const Resume = require("../models/resume_checker");

const getKeywords = (text) => {
  const stopWords = new Set([
    "the","and","for","with","that","from","this","you","your","are","was","were","have","has","had","will","can","to","of","in","on","at","as","is","it","a","an","or","by","be","about","job","role","resume","experience","skills","skill","team","work","worked","responsible","responsibilities"
  ]);

  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w && w.length > 2 && !stopWords.has(w));
};

const hasContactInfo = (text) => {
  const email = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}/.test(text);
  const phone = /(\+?\d[\d\s()-]{8,}\d)/.test(text);
  return email || phone;
};

const hasQuantifiedImpact = (text) => {
  return /(\d+%|\d+\s?(years?|yrs?|months?|projects?|clients?|users?|sales|increase|decrease|growth|revenue|improved|reduced|saved))/i.test(text);
};

const getSectionsFound = (text) => {
  const sections = ["summary", "profile", "experience", "education", "skills", "projects", "certifications", "achievements"];
  return sections.filter(s => new RegExp(`\\b${s}\\b`, "i").test(text));
};

const hasRepetition = (text) => {
  const words = getKeywords(text);
  const freq = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  return Object.values(freq).some(count => count > 6);
};

const scoreFromFlags = (checks) => {
  const weights = {
    atsParseRate: 20,
    quantifiedImpact: 15,
    repetition: 10,
    spellingGrammar: 15,
    sections: 20,
    contactInfo: 10,
    length: 10
  };

  let score = 0;
  if (checks.atsParseRate) score += weights.atsParseRate;
  if (checks.quantifiedImpact) score += weights.quantifiedImpact;
  if (checks.repetition) score += weights.repetition;
  if (checks.spellingGrammar) score += weights.spellingGrammar;
  if (checks.sections) score += weights.sections;
  if (checks.contactInfo) score += weights.contactInfo;
  if (checks.length) score += weights.length;

  return Math.max(0, Math.min(100, score));
};

const analyzeResume = (resumeText, jobDescription = "") => {
  const resumeWords = new Set(getKeywords(resumeText));
  const jobWords = [...new Set(getKeywords(jobDescription))];

  const matched = jobWords.filter(w => resumeWords.has(w));
  const missing = jobWords.filter(w => !resumeWords.has(w));

  const keywordMatchScore = jobWords.length
    ? Math.round((matched.length / jobWords.length) * 100)
    : Math.min(100, Math.max(20, Math.round(resumeWords.size / 8)));

  const sectionsFound = getSectionsFound(resumeText);
  const atsParseRate = resumeText.length > 300 && sectionsFound.length >= 3;
  const quantifiedImpact = hasQuantifiedImpact(resumeText);
  const repetitionFree = !hasRepetition(resumeText);
  const spellingGrammar = true;
  const contactInfo = hasContactInfo(resumeText);
  const lengthOk = resumeText.length >= 1200 && resumeText.length <= 12000;

  const score = scoreFromFlags({
    atsParseRate,
    quantifiedImpact,
    repetition: repetitionFree,
    spellingGrammar,
    sections: sectionsFound.length >= 3,
    contactInfo,
    length: lengthOk
  });

  const formattingIssues = [];
  if (!atsParseRate) formattingIssues.push("ATS parse rate looks weak.");
  if (!quantifiedImpact) formattingIssues.push("Add measurable achievements with numbers or percentages.");
  if (!repetitionFree) formattingIssues.push("Repeated words or phrases detected.");
  if (sectionsFound.length < 3) formattingIssues.push("Missing important sections like Experience, Education, or Skills.");
  if (!contactInfo) formattingIssues.push("Contact information is incomplete.");
  if (!lengthOk) formattingIssues.push("Resume length is not ideal.");

  const contentPercent = Math.min(100, Math.round((keywordMatchScore + (quantifiedImpact ? 100 : 30)) / 2));
  const sectionsPercent = Math.min(100, Math.round((sectionsFound.length / 5) * 100));
  const atsEssentialsPercent = Math.min(100, Math.round((contactInfo ? 100 : 40 + (lengthOk ? 10 : 0) + (atsParseRate ? 20 : 0)) / 2));
  const hrRedFlagsPercent = Math.max(0, 100 - (formattingIssues.length * 15));
  const discriminationPercent = 100;

  const summaryImprovement =
    score < 60
      ? "Improve formatting, add measurable impact, reduce repetition, and strengthen your summary."
      : "Good resume structure. Add more measurable impact and role-specific keywords.";

  return {
    score,
    matched,
    missing,
    formattingIssues,
    summaryImprovement,
    breakdown: {
      content: contentPercent,
      sections: sectionsPercent,
      atsEssentials: atsEssentialsPercent,
      hrRedFlags: hrRedFlagsPercent,
      discrimination: discriminationPercent,
      atsParseRate,
      quantifiedImpact,
      repetitionFree,
      contactInfo,
      lengthOk,
      sectionsFound
    }
  };
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ err: "Please upload a PDF file" });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text || "";

    if (!resumeText.trim()) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({ err: "Could not extract text from PDF" });
    }

    const jobDescription = req.body.jobDescription || "";
    const result = analyzeResume(resumeText, jobDescription);

    const saved = await Resume.create({
      originalName,
      resumePath: filePath,
      atsScore: result.score,
      aiFeedback: {
        matchedSkills: result.matched,
        missingSkills: result.missing,
        formattingIssues: result.formattingIssues,
        summaryImprovement: result.summaryImprovement
      },
      checkedAt: new Date()
    });

    return res.status(201).json({
      msg: "Resume uploaded and analyzed successfully",
      resume: saved,
      atsScore: result.score,
      matchedSkills: result.matched,
      missingSkills: result.missing,
      formattingIssues: result.formattingIssues,
      summaryImprovement: result.summaryImprovement,
      breakdown: result.breakdown,
      extractedText: resumeText.slice(0, 2000)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: error.message || "Error while analyzing resume" });
  }
};

module.exports = { uploadResume };