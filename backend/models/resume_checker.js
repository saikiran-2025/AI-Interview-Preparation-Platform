let mongoose = require("mongoose");

let usrc = new mongoose.Schema({
  originalName: { type: String, required: true },
  resumePath: { type: String, required: true },
  atsScore: { type: Number, required: true, default: 0, min: 0, max: 100 },
  aiFeedback: {
    matchedSkills: [String],
    missingSkills: [String],
    formattingIssues: [String],
    summaryImprovement: { type: String, default: "" }
  },
  checkedAt: { type: Date, default: Date.now }
});

let umrc = mongoose.model("Resume_checker", usrc);
module.exports = umrc;