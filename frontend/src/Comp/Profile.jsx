import React, { useContext, useEffect, useState } from "react";
import Carousal from "./Carousal";
import axios from "axios";
import Ct from "./Ct";

const Profile = () => {
  const { user } = useContext(Ct);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    location: "",
    undergraduate: "",
    degree: "",
    specialization: "",
    graduationYear: "",
    cgpa: "",
    targetRole: "",
    skills: "",
    github: "",
    linkedin: ""
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [msg, setMsg] = useState("");
  const [profileData, setProfileData] = useState(null);

  const change = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const fillFormFromProfile = (profile) => {
    setForm({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      gender: profile.gender || "",
      dob: profile.dob || "",
      location: profile.location || "",
      undergraduate: profile.undergraduate || "",
      degree: profile.degree || "",
      specialization: profile.specialization || "",
      graduationYear: profile.graduationYear || "",
      cgpa: profile.cgpa || "",
      targetRole: profile.targetRole || "",
      skills: profile.skills || "",
      github: profile.socialMedia?.github || "",
      linkedin: profile.socialMedia?.linkedin || ""
    });

    if (profile.profileImage) {
      setPreview(`http://localhost:5000/uploads/${profile.profileImage}`);
    } else {
      setPreview("");
    }
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("gender", form.gender);
    fd.append("dob", form.dob);
    fd.append("location", form.location);
    fd.append("undergraduate", form.undergraduate);
    fd.append("degree", form.degree);
    fd.append("specialization", form.specialization);
    fd.append("graduationYear", form.graduationYear);
    fd.append("cgpa", form.cgpa);
    fd.append("targetRole", form.targetRole);
    fd.append("skills", form.skills);
    fd.append("socialMedia[github]", form.github);
    fd.append("socialMedia[linkedin]", form.linkedin);

    if (profileImage) {
      fd.append("profileImage", profileImage);
    }

    return fd;
  };

  const getProfile = async () => {
    try {
      if (!user?.username) {
        setMsg("User not found. Please login again.");
        return;
      }

      const res = await axios.get(`http://localhost:5000/gp/${user.username}`);
      setProfileData(res.data.profile);
      fillFormFromProfile(res.data.profile);
      setMsg(res.data.msg || "Profile fetched successfully");
    } catch (error) {
      setProfileData(null);
      setPreview("");
      setMsg(error.response?.data?.msg || error.response?.data?.err || "Profile not found");
    }
  };

  const createProfile = async (e) => {
    e.preventDefault();

    try {
      if (!user?.username) {
        setMsg("User not found. Please login again.");
        return;
      }

      const res = await axios.post(
        `http://localhost:5000/cp/${user.username}`,
        buildFormData()
      );

      setProfileData(res.data.profile);
      setMsg(res.data.msg || "Profile created successfully");

      if (res.data.profile?.profileImage) {
        setPreview(`http://localhost:5000/uploads/${res.data.profile.profileImage}`);
      }
    } catch (error) {
      setMsg(error.response?.data?.err || "Error while creating profile");
    }
  };

  const updateProfile = async () => {
    try {
      if (!user?.username) {
        setMsg("User not found. Please login again.");
        return;
      }

      const fd = buildFormData();

      const res = await axios.put(
        `http://localhost:5000/ep/${user.username}`,
        fd
      );

      setProfileData(res.data.profile);
      setMsg(res.data.msg || "Profile updated successfully");

      if (res.data.profile?.profileImage) {
        setPreview(`http://localhost:5000/uploads/${res.data.profile.profileImage}`);
      }
    } catch (error) {
      setMsg(error.response?.data?.err || "Error while updating profile");
    }
  };

  const deleteProfile = async () => {
    try {
      if (!user?.username) {
        setMsg("User not found. Please login again.");
        return;
      }

      const res = await axios.delete(`http://localhost:5000/dp/${user.username}`);
      setProfileData(null);
      setPreview("");
      setMsg(res.data.msg || "Profile deleted successfully");

      setForm({
        name: "",
        email: "",
        phone: "",
        gender: "",
        dob: "",
        location: "",
        undergraduate: "",
        degree: "",
        specialization: "",
        graduationYear: "",
        cgpa: "",
        targetRole: "",
        skills: "",
        github: "",
        linkedin: ""
      });
      setProfileImage(null);
    } catch (error) {
      setMsg(error.response?.data?.err || "Error while deleting profile");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (user?.username) {
      getProfile();
    }
  }, [user?.username]);

  return (
    <div className="profile-page">

    <Carousal />

    <div className="profile-card">

      <div className="profile-title">
        <h2>👤 My Profile</h2>
        <p>Manage your interview profile information</p>
      </div>

      <div className="photo-box">
        <img
          src={preview || "/default-user.png"}
          alt="profile"
        />
      </div>

      {msg && <p className="msg">{msg}</p>}

      <form className="profile-form" onSubmit={createProfile}>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={change}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={change}
        />

        <input
          type="number"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={change}
        />

        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={form.gender}
          onChange={change}
        />

        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={change}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={change}
        />

        <input
          type="text"
          name="undergraduate"
          placeholder="College / University"
          value={form.undergraduate}
          onChange={change}
        />

        <input
          type="text"
          name="degree"
          placeholder="Degree"
          value={form.degree}
          onChange={change}
        />

        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={form.specialization}
          onChange={change}
        />

        <input
          type="number"
          name="graduationYear"
          placeholder="Graduation Year"
          value={form.graduationYear}
          onChange={change}
        />

        <input
          type="text"
          name="cgpa"
          placeholder="CGPA"
          value={form.cgpa}
          onChange={change}
        />

        <input
          type="text"
          name="targetRole"
          placeholder="Target Role"
          value={form.targetRole}
          onChange={change}
        />

        <input
          className="full"
          type="text"
          name="skills"
          placeholder="Skills (React, Node.js, Express, MongoDB...)"
          value={form.skills}
          onChange={change}
        />

        <input
          type="text"
          name="github"
          placeholder="GitHub Profile"
          value={form.github}
          onChange={change}
        />

        <input
          type="text"
          name="linkedin"
          placeholder="LinkedIn Profile"
          value={form.linkedin}
          onChange={change}
        />

        <input
          className="full"
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleImageChange}
        />

        <div className="btn-area">

          <button
            type="submit"
            className="create"
          >
            Create Profile
          </button>

          <button
            type="button"
            className="update"
            onClick={updateProfile}
          >
            Update Profile
          </button>

          <button
            type="button"
            className="delete"
            onClick={deleteProfile}
          >
            Delete Profile
          </button>

        </div>

      </form>

      {profileData && (

        <div className="profile-details">

          <h3>Profile Information</h3>

          <div className="details-grid">

            <p><strong>Name:</strong> {profileData.name}</p>

            <p><strong>Email:</strong> {profileData.email}</p>

            <p><strong>Phone:</strong> {profileData.phone}</p>

            <p><strong>Gender:</strong> {profileData.gender}</p>

            <p><strong>Date of Birth:</strong> {profileData.dob}</p>

            <p><strong>Location:</strong> {profileData.location}</p>

            <p><strong>College:</strong> {profileData.undergraduate}</p>

            <p><strong>Degree:</strong> {profileData.degree}</p>

            <p><strong>Specialization:</strong> {profileData.specialization}</p>

            <p><strong>Graduation Year:</strong> {profileData.graduationYear}</p>

            <p><strong>CGPA:</strong> {profileData.cgpa}</p>

            <p><strong>Target Role:</strong> {profileData.targetRole}</p>

            <p className="full">
              <strong>Skills:</strong> {profileData.skills}
            </p>

            <p>
              <strong>GitHub:</strong>{" "}
              {profileData.socialMedia?.github}
            </p>

            <p>
              <strong>LinkedIn:</strong>{" "}
              {profileData.socialMedia?.linkedin}
            </p>

          </div>

        </div>

      )}

    </div>

  </div>
  );
};

export default Profile;