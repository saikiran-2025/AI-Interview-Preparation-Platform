import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub
} from "react-icons/fa";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* About */}
        <div className="footer-section">

          <h2>AI Interview Preparation Platform</h2>

          <p>
            AI Interview Preparation Platform helps students and job seekers
            improve their interview skills through AI-powered mock interviews,
            ATS resume analysis, performance tracking, and personalized
            feedback to boost confidence and career success.
          </p>

        </div>

        {/* Features */}
        <div className="footer-section">

          <h3>Platform Features</h3>

          <ul>
            <li>AI Mock Interviews</li>
            <li>ATS Resume Checker</li>
            <li>Performance Analysis</li>
            <li>Technical Questions</li>
          </ul>

        </div>

        {/* Contact */}
        <div className="footer-section">

          <h3>Contact Us</h3>

          <p>Email : support@aiinterview.com</p>

          <p>Phone : +91 98765 43210</p>

          <p>Available : Monday - Saturday</p>

        </div>

        {/* Social */}
        <div className="footer-section">

          <h3>Follow Us</h3>

          <div className="social-icons">

            <a href="#"><FaFacebookF /></a>

            <a href="#"><FaTwitter /></a>

            <a href="#"><FaInstagram /></a>

            <a href="#"><FaLinkedinIn /></a>

            <a href="#"><FaGithub /></a>

          </div>

        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 AI Interview Preparation Platform. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
};

export default Footer;