let express = require("express");
let rt = express.Router();

let { lgcont } = require("../controllers/logincont");
let { regcont } = require("../controllers/registercont");
let { startMockTest, submitMockTest } = require("../controllers/interquecont");
let { createpro, getpro, editpro, deletepro } = require("../controllers/procont");
let upload = require("../middlewares/upload");
let ur = require("../middlewares/upload_resume");
let { uploadResume } = require("../controllers/resume_cont");
let { logoutUser } = require("../controllers/logout")


rt.post("/register", regcont);
rt.post("/login", lgcont);
rt.post("/start", startMockTest);
rt.post("/submit", submitMockTest);

rt.post("/cp/:username", upload.single("profileImage"), createpro);
rt.get("/gp/:username", getpro);
rt.put("/ep/:username", upload.single("profileImage"), editpro);
rt.delete("/dp/:username", deletepro);

rt.post("/resume-check", ur.single("resume"), uploadResume);

rt.post("/logout/:username",logoutUser)
module.exports = rt;