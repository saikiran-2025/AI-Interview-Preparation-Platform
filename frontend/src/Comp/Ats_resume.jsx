import React, { useState } from "react";
import axios from "axios";

const Ats_resume = () => {
  const [resume, setResume] = useState(null);
  const [fileName, setFileName] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type !== "application/pdf") {
      setMsg("Only PDF files are allowed");
      setResume(null);
      setFileName("");
      return;
    }

    setResume(file);
    setFileName(file ? file.name : "");
    setMsg("");
  };

  const checkResume = async (e) => {
    e.preventDefault();

    if (!resume) {
      setMsg("Please upload a PDF resume");
      return;
    }

    try {
      setLoading(true);
      setMsg("");
      setResult(null);

      const formData = new FormData();
      formData.append("resume", resume);

      const res = await axios.post(
        "http://localhost:5000/resume-check",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(res.data);
      setMsg(res.data.msg || "Resume checked successfully");
    } catch (error) {
      setMsg(
        error.response?.data?.err || "Error while checking resume"
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ats-page">

      <div className="ats-card">

        <h2>📄ATS Resume Checker</h2>

        <p className="subtitle">
          Upload your resume and get an AI-powered ATS compatibility score.
        </p>

        <form className="ats-form" onSubmit={checkResume}>

          <div className="file-upload">

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />

            {fileName && <p>📄 {fileName}</p>}

          </div>

          <button
            className="check-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Checking..." : "Check Resume"}
          </button>

        </form>

        {msg && <p className="msg">{msg}</p>}

        {result && (

          <div className="result-card">

            <div className="score-box">

              <h1>{result.atsScore}</h1>

              <span>/100 Score</span>

            </div>

            <div className="result-section">

              <h4>✅ Matched Skills</h4>

              <ul>
                {result.matchedSkills?.length ? (
                  result.matchedSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))
                ) : (
                  <li>No matched skills found.</li>
                )}
              </ul>

            </div>

            <div className="result-section">

              <h4>❌ Missing Skills</h4>

              <ul>
                {result.missingSkills?.length ? (
                  result.missingSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))
                ) : (
                  <li>No missing skills found.</li>
                )}
              </ul>

            </div>

            <div className="result-section">

              <h4>⚠ Formatting Issues</h4>

              <ul>
                {result.formattingIssues?.length ? (
                  result.formattingIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))
                ) : (
                  <li>No formatting issues found.</li>
                )}
              </ul>

            </div>

            <div className="summary-box">

              <strong>Summary Improvement</strong>

              <p>{result.summaryImprovement}</p>

            </div>

            {result.extractedText && (

              <div className="preview-box">

                <h4>📄 Extracted Resume Text</h4>

                <pre>{result.extractedText}</pre>

              </div>

            )}

          </div>

        )}

      </div>

    </div>
  );
};

export default Ats_resume;