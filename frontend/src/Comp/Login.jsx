import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Ct from "./Ct";

const Login = () => {
  const [data, setData] = useState({ username: "", pwd: "" });
  const [msg, setMsg] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const obj = useContext(Ct);
  const navigate = useNavigate();

  const fun = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const login = async () => {
    try {
      const res = await axios.post("https://ai-interview-preparation-platform-backend-ks11.onrender.com/login", data);
      if (res.data.token) {
        obj.setToken(res.data.token);
        obj.setUser({ username: res.data.username });
        navigate("/profile");
      }
    } catch (error) {
      setMsg(error.response?.data?.err || error.response?.data?.msg || "Login Failed");
    }
  };

  return (
     <div className="auth-wrapper">
    <div className="auth-card login">
      <h3 className="msg">{msg}</h3>

      <h2>Login</h2>

      <div className="input-group">
        <input
          name="username"
          value={data.username}
          onChange={fun}
          placeholder="Enter Username"
        />
        <i className="fa-solid fa-user"></i>
      </div>

      <div className="input-group">
        <input
          type={showPwd ? "text" : "password"}
          name="pwd"
          value={data.pwd}
          onChange={fun}
          placeholder="Enter Password"
        />

        <i
          className="fa-solid fa-eye"
          onMouseDown={() => setShowPwd(true)}
          onMouseUp={() => setShowPwd(false)}
          onMouseLeave={() => setShowPwd(false)}
        ></i>
      </div>

      <button onClick={login}>Login</button>

      <div className="reglink">
        Don't have an account?
        <Link to="/register"> Register</Link>
      </div>
    </div>
  </div>
  );
};

export default Login;
