# AI Resume Analyzer — Software Engineering Project (SEM 5)
**Medicaps University — Department of Computer Science & Engineering**

An AI-powered, ATS-oriented Resume Analyzer web platform built strictly in accordance with the **Software Requirements Specification (SRS v1.0)**.

- 🌐 **Live Website**: [https://ai-resume-analyzer-fsqj.onrender.com/](https://ai-resume-analyzer-fsqj.onrender.com/)
- 💻 **GitHub Repository**: [https://github.com/webdivyeloper/ai-resume-analyzer](https://github.com/webdivyeloper/ai-resume-analyzer)
- 📊 **Project Presentation**: [AI_Resume_Analyzer_Presentation.pptx](./AI_Resume_Analyzer_Presentation.pptx)

---

## 🌟 Overview & Key Highlights

- **Simple, Fast & Robust**: Designed to be lightweight, straightforward to run, and reliable for university presentation and evaluation.
- **Zero-Setup Database Architecture**: Out-of-the-box support for MongoDB via Mongoose. If MongoDB is not running locally on the evaluator's machine, it **automatically and gracefully activates persistent local JSON storage** (`backend/data/db.json`) without any crashes.
- **Automated PDF Parsing**: Extracts text from PDF resumes and classifies common sections: *Summary, Skills, Work Experience, Education, Projects, and Certifications*.
- **ATS Keyword Gap Analysis**: Matches target job requirements against resume content, detecting matched skills and highlighting missing competencies.
- **Dual AI Advisory Engine**:
  - **Built-in Intelligent NLP Engine**: Evaluates quantifiable metrics, action verbs, and ATS formatting rules immediately without needing an external API key.
  - **Google Gemini API Support**: Optionally plug in a `GEMINI_API_KEY` in `backend/.env` for LLM-powered feedback.
- **Role-Based Access Control**: Pre-seeded demo user and administrator accounts for 1-click evaluation.

---

## 🚀 How to Run the Project

### Option A: One-Click Startup (Recommended for Windows)
Simply double-click the included batch script:
```cmd
run.bat
```
This automatically boots both the backend API server on **port 5000** and the frontend React application on **port 5173**.

### Option B: Terminal Command
From the root project directory:
```bash
npm start
```

### Option C: Running Backend and Frontend Separately

**1. Start Backend:**
```bash
cd backend
npm start
```
*Backend runs on `http://localhost:5000`*

**2. Start Frontend:**
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔑 Pre-Seeded Test Credentials

For effortless grading and demonstration, the database comes pre-seeded with two accounts (also available via 1-click fill buttons on the login screen):

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Demo Student / Candidate** | `user@example.com` | `password123` | Upload resumes, match jobs, view ATS reports & history |
| **Administrator** | `admin@example.com` | `admin123` | Access admin panel, monitor system stats, manage registered users |

---

## 📁 System Architecture & Directory Structure

```text
se_project/
├── backend/
│   ├── sample_resumes/            # Sample PDF resumes ready for immediate testing
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # Mongoose DB connector with auto-fallback
│   │   │   └── localStore.js      # Persistent local JSON storage adapter
│   │   ├── controllers/
│   │   │   ├── authController.js  # JWT authentication & profile logic
│   │   │   ├── resumeController.js# PDF upload & parser controller
│   │   │   ├── analysisController.js# ATS & AI matching controller
│   │   │   └── adminController.js # Admin dashboard & user management
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  # JWT verification & admin guard
│   │   │   └── uploadMiddleware.js# Multer PDF file size/type filter
│   │   ├── models/                # User, Resume, JobDescription, Analysis
│   │   ├── routes/                # Express API endpoints
│   │   ├── services/
│   │   │   ├── pdfService.js      # PDF text & section extraction
│   │   │   ├── nlpService.js      # ATS scoring, keyword match & gap analysis
│   │   │   └── aiService.js       # AI analysis with Gemini / NLP fallback
│   │   └── server.js              # Main Express application entry point
│   ├── uploads/                   # Uploaded resume PDF storage
│   ├── data/                      # Persistent database file (db.json)
│   ├── .env                       # Environment configurations
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/            # Navbar, ScoreGauge, ProtectedRoute
│   │   ├── context/               # AuthContext (React Context API)
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page with system overview
│   │   │   ├── Login.jsx          # Sign-in with 1-click demo accounts
│   │   │   ├── Register.jsx       # Account registration
│   │   │   ├── Dashboard.jsx      # Metrics overview & recent scans
│   │   │   ├── AnalyzeResume.jsx  # PDF upload, job description & templates
│   │   │   ├── AnalysisReport.jsx # Interactive ATS scorecard & recommendations
│   │   │   ├── History.jsx        # Previous evaluations with filter/delete
│   │   │   ├── Profile.jsx        # Account details & password change
│   │   │   └── AdminPanel.jsx     # Admin monitoring & registered users
│   │   ├── services/              # Axios API service client
│   │   ├── App.jsx                # React Router v7 routes
│   │   └── index.css              # Tailwind CSS v4 styling
│   ├── vite.config.js             # Vite config with backend proxy
│   └── package.json
│
├── run.bat                        # 1-click Windows runner
├── start.js                       # Cross-platform concurrent runner
└── README.md
```

---

## 🎯 Verification with the SRS

| SRS Requirement | Feature Implemented |
| :--- | :--- |
| **FR-1.1 - FR-1.4** | JWT Authentication, registration, login, logout, and profile management |
| **FR-2.1 - FR-2.5** | PDF file validation (type & size < 5MB), text extraction, and section parsing |
| **FR-3.1 - FR-3.3** | Target job description input with pre-filled templates |
| **FR-4.1 - FR-4.4** | Resume-to-Job matching, keyword comparison, category scores (0-100%) |
| **FR-5.1 - FR-5.5** | AI/NLP analysis identifying strengths, weaknesses, and actionable advice |
| **FR-6.1 - FR-6.3** | ATS-oriented missing keyword identification and formatting recommendations |
| **FR-7.1 - FR-7.4** | Full ATS report with visual score gauge, category bars, export/print, and history |
| **FR-8.1 - FR-8.3** | Protected Admin Panel displaying system stats, user list, and moderation |
| **NFR-5.1** | Failure resilience: graceful fallback to local storage and NLP heuristics |

