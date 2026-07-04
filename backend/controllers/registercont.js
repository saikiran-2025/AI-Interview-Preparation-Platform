let bcrypt = require("bcrypt");
let User = require("../models/usermodel");

let regcont = async (req, res) => {
  try {
    let { username, pwd } = req.body;

    if (!username || !pwd) {
      return res.status(400).json({ err: "username and password are required" });
    }

    let exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ err: "username already exists" });
    }

    let hashedPwd = await bcrypt.hash(pwd, 10);

    let user = await User.create({
      username,
      pwd: hashedPwd
    });

    return res.status(201).json({
      msg: "Registration successful",
      user: { username: user.username, _id: user._id }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: error.message || "Registration failed" });
  }
};

module.exports = { regcont };