let mongoose = require("mongoose");

let pus = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  profileImage: { type: String, default: "" },
  name: String,
  email: String,
  phone: Number,
  gender: String,
  dob: String,
  location: String,
  undergraduate: String,
  degree: String,
  specialization: String,
  graduationYear: Number,
  cgpa: String,
  targetRole: String,
  skills: String,
  projectLinks: [String],
  socialMedia: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" }
  }
});

let pum = mongoose.model("profile", pus);
module.exports = pum;