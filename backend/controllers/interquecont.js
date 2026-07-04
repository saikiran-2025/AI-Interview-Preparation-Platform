const { GoogleGenAI, Type } = require("@google/genai");

// FIXED: Pass an configuration object containing the API Key into the constructor
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

const Exam = require("../models/interquemodel"); 

/**
 * 1. START MOCK TEST
 * Uses Structured Outputs to guarantee a perfect array of questions is returned.
 */
const startMockTest = async (req, res) => {
    try {
        const { Language, Level } = req.body;

        if (!Language || !Level) {
            return res.status(400).json({ err: "Language and Experience Level are required" });
        }

        const prompt = `You are an expert technical interviewer. Generate exactly 5 challenging technical interview questions for a candidate specializing in ${Language} at a ${Level} level.`;

        // Using config.responseSchema to force the AI to return a clean array of strings
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    description: "List of 5 technical interview questions.",
                    items: { type: Type.STRING }
                }
            }
        });

        // The SDK automatically handles parsing or returns clean JSON text
        const questionsArray = JSON.parse(response.text.trim());
        
        // Map them into our Mongoose schema format
        const examQnA = questionsArray.map(questionText => ({
            "Question": questionText,
            "User Answer": "" 
        }));

        const newExam = new Exam({
            Language,
            Level,
            "Exam QnA": examQnA,
            "Violations": { "Fullscreen Exited": false, "Exit Count": 0 }
        });

        await newExam.save();

        return res.status(201).json({
            msg: "Mock test initialized successfully",
            examId: newExam._id,
            questions: newExam["Exam QnA"].map(q => q["Question"])
        });

    } catch (error) {
        console.error("Error starting mock test:", error);
        return res.status(500).json({ err: "Failed to generate interview questions", details: error.message });
    }
};

/**
 * 2. SUBMIT MOCK TEST & AI EVALUATION
 * Uses Structured Outputs to prevent markdown wrapper syntax errors from breaking JSON.parse.
 */
const submitMockTest = async (req, res) => {
    try {
        const { examId, answers } = req.body; 

        if (!examId || !Array.isArray(answers)) {
            return res.status(400).json({ err: "Exam ID and user answers array are required" });
        }

        const existingExam = await Exam.findById(examId);
        if (!existingExam) {
            return res.status(404).json({ err: "Exam session not found" });
        }

        // Merge user answers into our database structure
        existingExam["Exam QnA"].forEach((item, index) => {
            if (answers[index] !== undefined) {
                item["User Answer"] = answers[index];
            }
        });

        let formattingHistory = "";
        existingExam["Exam QnA"].forEach((item, i) => {
            formattingHistory += `\nQuestion ${i+1}: ${item["Question"]}\nCandidate Answer: ${item["User Answer"]}\n`;
        });

        const evaluationPrompt = `
        You are an elite AI technical evaluator. Review this technical interview history for a ${existingExam.Level} developer in ${existingExam.Language}:
        ${formattingHistory}

        Evaluate the candidate's answers and assign scores out of 100 percentage points for each criteria:
        - Communication
        - TechnicalAccuracy
        - Confidence
        - TotalScore (Calculate this as the direct average of the three components above)
        `;

        // Force Gemini to structure its grading response to match our exact variable needs
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: evaluationPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        Communication: { type: Type.INTEGER },
                        TechnicalAccuracy: { type: Type.INTEGER },
                        Confidence: { type: Type.INTEGER },
                        TotalScore: { type: Type.INTEGER }
                    },
                    required: ["Communication", "TechnicalAccuracy", "Confidence", "TotalScore"]
                }
            }
        });

        // This is guaranteed to be clean JSON stringified text without ```json ``` block markings
        const scores = JSON.parse(response.text.trim());

        // Update the Mongo document
        existingExam["Communication"] = scores.Communication;
        existingExam["Technical Accuracy"] = scores.TechnicalAccuracy;
        existingExam["Confidence"] = scores.Confidence;
        existingExam["Total score"] = scores.TotalScore;

        await existingExam.save();

        return res.status(200).json({
            msg: "Exam evaluated successfully by AI",
            results: {
                Communication: `${existingExam["Communication"]}%`,
                TechnicalAccuracy: `${existingExam["Technical Accuracy"]}%`,
                Confidence: `${existingExam["Confidence"]}%`,
                TotalScore: `${existingExam["Total score"]}%`
            }
        });

    } catch (error) {
        console.error("Error submitting mock test:", error);
        return res.status(500).json({ err: "Failed to analyze answers.", details: error.message });
    }
};

module.exports = { startMockTest, submitMockTest };