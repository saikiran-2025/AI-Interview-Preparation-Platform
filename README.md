# AI-Interview-Preparation-Platform

🤖 AI Interview Preparation Platform
📌 Project Overview

The AI Interview Preparation Platform is a full-stack web application developed to help students, freshers, and professionals prepare for technical interviews using Artificial Intelligence. The platform provides secure user authentication, profile management, ATS resume analysis, and AI-powered mock interviews with personalized feedback.

The application is built using the MERN Stack (MongoDB, Express.js, React.js, Node.js) and integrates Google Gemini AI to generate interview questions and evaluate user responses.

🚀 Technologies Used
Frontend:-
 React.js
 React Router DOM
 Axios
 CSS3
 Font Awesome
 React Icons
 
Backend:-
 Node.js
 Express.js
 MongoDB
 Mongoose
 Authentication & Security
 JSON Web Token (JWT)
 bcrypt.js
 AI Integration
 Google Gemini AI API
 Middleware
 CORS
 Express JSON Middleware
 Multer (for file uploads)

✨ Features:-

🔐 User Authentication
User Registration
User Login
Secure password encryption using bcrypt
JWT-based authentication for secure access
Logout functionality
👤 Profile Management

After logging in, users are redirected to the Profile page where they can:

Create Profile
Update Profile
Delete Profile
Upload Profile Photo
Save Personal Information
Save Educational Details
Save Technical Skills
Add GitHub and LinkedIn Profile Links

📄 ATS Resume Checker:-
The ATS Resume Checker allows users to upload their resume in PDF format.

The system performs:
ATS Score Analysis
Resume Skill Matching
Missing Skills Detection
Resume Formatting Analysis
Resume Summary Improvement Suggestions
Resume Text Extraction

This helps users improve their resume before applying for jobs.

💻 AI Mock Interview:-
The AI Mock Interview module enables users to practice interviews interactively.

Step 1:
Enter the programming language (Java, Python, C++, JavaScript, etc.)
Step 2:
Select the interview level:
Fresher
Experienced
Step 3:
Click Start Test
The application communicates with Google Gemini AI, which dynamically generates interview questions based on the selected language and experience level.
Step 4:
Answer each question in the provided text area.
Step 5:
Click Submit Test

Google Gemini AI evaluates the responses and provides detailed feedback including:-
Communication Score
Technical Accuracy
Confidence Level
Total Interview Score
AI-generated Performance Feedback

This feature helps users identify their strengths and improve their interview performance before attending real interviews.

⚙ Backend Middleware:-
The project uses several Express middleware components:
CORS
Allows secure communication between the React frontend and Express backend.
Express JSON Middleware
Parses incoming JSON request bodies.
Multer
Handles file uploads such as profile images and resumes.

🔒 Security:-
The application follows secure authentication practices.
Passwords are encrypted using bcrypt
JWT Tokens are generated after successful login
Protected routes require authentication
Secure user session handling

📂 Project Structure:-
AI-Interview-Preparation-Platform
│
├── client
│   ├── React.js Frontend
│   ├── Components
│   ├── CSS
│   └── Axios API Calls
│
├── server
│   ├── Express.js Backend
│   ├── Routes
│   ├── Controllers
│   ├── Models
│   ├── Middleware
│   ├── JWT Authentication
│   └── Google Gemini Integration
│
└── MongoDB Database

👨‍💻 Conclusion:-
The AI Interview Preparation Platform is designed to help job seekers improve their interview skills through AI-driven learning. By combining secure authentication, profile management, ATS resume evaluation, and intelligent mock interviews powered by Google Gemini AI, the platform provides users with a realistic interview experience and actionable feedback to boost confidence and increase their chances of success in technical interviews.
