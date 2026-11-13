import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Search,
  CheckCircle,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  FileCheck,
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-3.5rem)] text-slate-800">
      {/* Top Banner / Academic Context */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono uppercase mb-4">
              Software Engineering Project • SEM 5
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              AI Resume Analyzer & ATS Screener
            </h1>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              A Software Requirements Specification (SRS v1.0) compliant system for parsing PDF resumes,
              extracting structural sections, matching candidate qualifications against job descriptions,
              and calculating ATS compatibility scores.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {isAuthenticated ? (
                <Link
                  to="/analyze"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Go to Resume Analysis
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    Sign In to Portal
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
                  >
                    Create User Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Architecture Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Core Processing Pipeline (SRS Sections 2 & 3)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="w-7 h-7 rounded bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-mono font-bold mb-3">
              01
            </div>
            <h3 className="text-sm font-semibold text-slate-900">PDF Text Extraction</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Validates PDF file streams up to 5MB, performs machine text extraction, and sanitizes character encoding.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="w-7 h-7 rounded bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-mono font-bold mb-3">
              02
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Section Identification</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Heuristic segmentation classifying Summary, Skills, Work History, Education, Projects, and Certifications.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="w-7 h-7 rounded bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-mono font-bold mb-3">
              03
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Keyword & ATS Match</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Cross-references job requirements against resume vocabulary, identifying matched skills and missing target terms.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="w-7 h-7 rounded bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-mono font-bold mb-3">
              04
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Diagnostic Scoring</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Computes 4 category scores (Skills, Experience, Education, Formatting) and actionable STAR-format suggestions.
            </p>
          </div>
        </div>

        {/* System Specifications Table */}
        <div className="mt-8 bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-900">System Technical Specifications</h3>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 p-3.5">
              <span className="font-medium text-slate-500">Architecture</span>
              <span className="md:col-span-2 text-slate-800 font-mono">MERN Stack (MongoDB, Express.js, React.js, Node.js)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-3.5">
              <span className="font-medium text-slate-500">Database Layer</span>
              <span className="md:col-span-2 text-slate-800">
                Mongoose ODM with automatic failover to persistent local storage for zero-dependency execution.
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-3.5">
              <span className="font-medium text-slate-500">Security & Session</span>
              <span className="md:col-span-2 text-slate-800">
                JSON Web Token (JWT) authorization header, Bcrypt password hashing, Role-Based Access Control.
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 p-3.5">
              <span className="font-medium text-slate-500">AI / NLP Module</span>
              <span className="md:col-span-2 text-slate-800">
                Autonomous heuristic parser + optional LLM integration (Gemini / OpenAI API compatible).
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <p>AI Resume Analyzer • Software Engineering Laboratory</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Department of Computer Science & Engineering • Medicaps University</p>
      </footer>
    </div>
  );
};

export default Home;
