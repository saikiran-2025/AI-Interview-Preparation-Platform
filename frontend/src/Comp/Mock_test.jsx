import React, { useState } from "react";
import axios from "axios";

const Mock_test = () => {
  const [Language, setLanguage] = useState("");
  const [Level, setLevel] = useState("");
  const [examId, setExamId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loadingStart, setLoadingStart] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const startTest = async (e) => {
    e.preventDefault();

    if (!Language || !Level) {
      setMsg("Please enter Language and Level");
      return;
    }

    try {
      setLoadingStart(true);
      setMsg("");
      setResult(null);

      const res = await axios.post("http://localhost:5000/start", {
        Language,
        Level,
      });

      setExamId(res.data.examId);
      setQuestions(res.data.questions || []);
      setAnswers((res.data.questions || []).map(() => ""));
      setMsg(res.data.msg || "Mock Test Started Successfully");
    } catch (error) {
      setMsg(error.response?.data?.err || "Failed to Start Mock Test");
    } finally {
      setLoadingStart(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    const copy = [...answers];
    copy[index] = value;
    setAnswers(copy);
  };

  const submitTest = async (e) => {
    e.preventDefault();

    if (!examId) {
      setMsg("Please Start the Test First");
      return;
    }

    try {
      setLoadingSubmit(true);
      setMsg("");

      const res = await axios.post("http://localhost:5000/submit", {
        examId,
        answers,
      });

      setResult(res.data.results);
      setMsg(res.data.msg || "Interview Submitted Successfully");
    } catch (error) {
      setMsg(error.response?.data?.err || "Failed to Submit Test");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="mock-page">

      <div className="mock-card">

        <h2>💻AI Mock Interview Test</h2>

        <p className="subtitle">
          Choose your programming language and experience level to begin your AI-powered interview.
        </p>

        {/* START FORM */}

        <form className="start-form" onSubmit={startTest}>

          <input
            type="text"
            placeholder="Enter Programming Language"
            value={Language}
            onChange={(e) => setLanguage(e.target.value)}
          />

          <select
            value={Level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="" disabled>
              Level
            </option>

            <option value="Fresher">
              Fresher
            </option>

            <option value="Experienced">
              Experienced
            </option>

          </select>

          <button
            className="start-btn"
            type="submit"
            disabled={loadingStart}
          >
            {loadingStart ? "Starting..." : "Start Test"}
          </button>

        </form>

        {msg && <p className="msg">{msg}</p>}

        {/* QUESTIONS */}

        {questions.length > 0 && (

          <form onSubmit={submitTest}>

            {questions.map((q, index) => (

              <div className="question-card" key={index}>

                <p>

                  <strong>Question {index + 1}</strong>

                </p>

                <p>{q}</p>

                <textarea
                  rows="5"
                  value={answers[index] || ""}
                  placeholder="Type your answer here..."
                  onChange={(e) =>
                    handleAnswerChange(index, e.target.value)
                  }
                />

              </div>

            ))}

            <div className="submit-area">

              <button
                className="submit-btn"
                type="submit"
                disabled={loadingSubmit}
              >
                {loadingSubmit
                  ? "Submitting..."
                  : "Submit Test"}
              </button>

            </div>

          </form>

        )}

        {/* RESULTS */}

        {result && (

          <div className="result-card">

            <h3>Interview Result</h3>

            <div className="score-grid">

              <div className="score-box">

                <h4>Communication</h4>

                <h1>{result.Communication}</h1>

              </div>

              <div className="score-box">

                <h4>Technical Accuracy</h4>

                <h1>{result.TechnicalAccuracy}</h1>

              </div>

              <div className="score-box">

                <h4>Confidence</h4>

                <h1>{result.Confidence}</h1>

              </div>

              <div className="score-box">

                <h4>Total Score</h4>

                <h1>{result.TotalScore}</h1>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default Mock_test;