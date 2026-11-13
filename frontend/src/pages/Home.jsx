import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  FileCheck,
  Target,
  Cpu,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen AI Resume Screener & ATS Matcher
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Optimize Your Resume for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Modern ATS & Top Recruiters
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload your PDF resume, paste target job descriptions, and unlock instant category-wise
            scores, missing keyword detection, and actionable AI recommendations.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Link
                to="/analyze"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
              >
                Analyze Resume Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm transition-all"
                >
                  Sign In (Demo Available)
                </Link>
              </>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-200">
            <div>
              <p className="text-3xl font-extrabold text-slate-900">95%+</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Parsing Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-blue-600">4-in-1</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Category Scoring</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">Instant</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Keyword Gap Analysis</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-600">AI / NLP</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Advisory Engine</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900">Engineered to SRS Specifications</h2>
            <p className="mt-3 text-slate-600 text-base">
              A comprehensive MERN architecture delivering machine-readable resume parsing,
              ATS-oriented matching, and intelligent career feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Automated PDF Parsing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Extracts machine text and categorizes sections: Summary, Technical Skills, Work
                Experience, Education, Projects, and Certifications.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">ATS Keyword Matching</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Evaluates job descriptions in real-time, matching relevant qualifications while highlighting
                missing technologies and action verbs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI-Driven Recommendations</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Actionable STAR format advice, quantifiable metric suggestions, and formatting
                refinements to pass recruiter screens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-center text-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-slate-300 font-semibold">AI Resume Analyzer — Software Engineering Project</p>
          <p className="text-xs text-slate-500 mt-1">Built to IEEE SRS specification for Medicaps University</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
