import React, { useContext, useState } from "react";
import axios from "axios";
import Ct from "./Ct";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {

  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const { setUser } = useContext(Ct);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!username || !pwd) {
      setMsg("Please enter username and password");
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:5000/register",
        {
          username,
          pwd
        }
      );

      setMsg(res.data.msg);

      setUser(res.data.user);

      setUsername("");

      setPwd("");

      setTimeout(() => {
        navigate("/");
      }, 1000);

    }

    catch (error) {

      setMsg(
        error.response?.data?.err ||
        error.response?.data?.msg ||
        "Registration Failed"
      );

    }

  };

  return (

    <div className="auth-wrapper">

      <div className="auth-card register">

        <p className="msg">{msg}</p>

        <h2>Register</h2>

        <form onSubmit={handleSubmit}>

          <div className="input-group">

            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <i className="fa-solid fa-user"></i>

          </div>

          <div className="input-group">

            <input
              type={showPwd ? "text" : "password"}
              placeholder="Enter Password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />

            <i
              className={`fa-solid ${showPwd ? "fa-eye-slash" : "fa-eye"}`}
              onMouseDown={() => setShowPwd(true)}
              onMouseUp={() => setShowPwd(false)}
              onMouseLeave={() => setShowPwd(false)}
            ></i>

          </div>

          <button type="submit">

            Register

          </button>

        </form>

        <div className="reglink">

          Already have an account?

          <Link to="/"> Login</Link>

        </div>

      </div>

    </div>

  );

};

export default Register;