import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Ct from "./Ct";
import "./Nav.css";

const Nav = () => {

    const { token } = useContext(Ct);
    return (
        <nav className="info-nav">
            <div className="info">
                <div className="interview">
                    🤖AI Interview Preparation Platform
                </div>
            </div>
            {
                token &&
                <div className="nav-links">
                    <Link to="/profile">👤 Profile</Link>
                    <Link to="/resume">📄ATS Resume Checker</Link>
                    <Link to="/mt">💻Mock Test</Link>
                    <Link to="/lg">🚪 Logout</Link>
                </div>
            }
        </nav>
    );
};
export default Nav;