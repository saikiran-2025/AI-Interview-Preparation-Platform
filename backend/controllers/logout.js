let Profile = require("../models/promodel");

let logoutUser = async (req, res) => {
  try {
    let { username } = req.params;

    if (!username) {
      return res.status(400).json({ err: "username required" });
    }

    const user = await Profile.findOne({ username });
    if (!user) {
      return res.status(404).json({ err: "User not found" });
    }

    res.clearCookie("token");

    return res.status(200).json({
      msg: "✅ User logged out successfully!"
    });
  } catch (error) {
    return res.status(500).json({ err: "Logout failed: " + error.message });
  }
};

module.exports = { logoutUser };