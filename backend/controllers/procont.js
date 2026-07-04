let Profile = require("../models/promodel");

const normalize = (u) => (u ? String(u).trim().toLowerCase() : "");

let createpro = async (req, res) => {
  try {
    let { username } = req.params;
    username = normalize(username);

    if (!username) {
      return res.status(400).json({ err: "username is required in URL" });
    }

    let exists = await Profile.findOne({ username });
    if (exists) {
      return res.status(400).json({ err: "Profile already exists" });
    }

    const imagePath = req.file ? req.file.filename : "";

    let profile = new Profile({
      ...req.body,
      username,
      profileImage: imagePath
    });

    await profile.save();

    return res.status(201).json({
      msg: "Profile created successfully",
      profile
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: error.message || "Error while creating profile" });
  }
};

let getpro = async (req, res) => {
  try {
    let { username } = req.params;
    username = normalize(username);

    if (!username) {
      return res.status(400).json({ err: "username is required in URL" });
    }

    let profileData = await Profile.findOne({ username });
    if (!profileData) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    return res.status(200).json({
      msg: "Profile fetched successfully",
      profile: profileData
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Error fetching profile" });
  }
};

let editpro = async (req, res) => {
  try {
    let { username } = req.params;
    username = normalize(username);

    if (!username) {
      return res.status(400).json({ err: "username is required in URL" });
    }

    const updateData = { ...req.body, username };

    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    let updatedProfile = await Profile.findOneAndUpdate(
      { username },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ msg: "Profile not found to update" });
    }

    return res.status(200).json({
      msg: "Profile updated successfully",
      profile: updatedProfile
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: error.message || "Error updating profile" });
  }
};

let deletepro = async (req, res) => {
  try {
    let { username } = req.params;
    username = normalize(username);

    if (!username) {
      return res.status(400).json({ err: "username is required in URL" });
    }

    let deletedProfile = await Profile.findOneAndDelete({ username });

    if (!deletedProfile) {
      return res.status(404).json({ msg: "Profile not found to delete" });
    }

    return res.status(200).json({
      msg: "Profile deleted successfully",
      profile: deletedProfile
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Error deleting profile" });
  }
};

module.exports = { createpro, getpro, editpro, deletepro };