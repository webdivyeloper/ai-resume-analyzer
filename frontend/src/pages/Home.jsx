import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Target,
  Cpu,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  FileCheck2,
  Zap,
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [activeFeatureTab, setActiveFeatureTab] = useState('pipeline');

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                AI ATS Resume Screener & Matcher
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                AI-Powered Resume Analysis &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  ATS Screening System
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Parse candidate PDF resumes, identify missing technical qualifications against job
                descriptions, evaluate structural formatting, and generate actionable ATS recommendations.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {isAuthenticated ? (
                  <Link
                    to="/analyze"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all hover:-translate-y-0.5"
                  >
                    <UploadCloudIcon className="w-4 h-4" />
                    Open Resume Analyzer
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all hover:-translate-y-0.5"
                    >
                      Sign In (1-Click Demo)
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-colors"
                    >
                      Register New User
                    </Link>
                  </>
                )}
              </div>

              {/* Fast Stats */}
              <div className="mt-10 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-2xl font-black text-slate-900 font-mono">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Automated Parsing</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-600 font-mono">4-in-1</div>
                  <div className="text-xs text-slate-500 font-medium">Category Scoring</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-600 font-mono">Instant</div>
                  <div className="text-xs text-slate-500 font-medium">Keyword Extraction</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-2xl border border-slate-800">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    <span className="text-xs font-mono text-slate-400 ml-2">ATS_Evaluation_Engine.v1</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                    LIVE PREVIEW
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Full Stack Software Engineer</h4>
                      <p className="text-xs text-slate-400">Target Candidate: John_Doe_Resume.pdf</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-sm border border-emerald-500/30">
                      94% MATCH
                    </div>
                  </div>

                  {/* Progress bars preview */}
                  <div className="space-y-2.5 pt-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Technical Skills Match</span>
                        <span className="text-emerald-400 font-mono">92%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Quantifiable Metrics & Verbs</span>
                        <span className="text-blue-400 font-mono">100%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300">ATS Structure & Format</span>
                        <span className="text-indigo-400 font-mono">95%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Overlap tags */}
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 block mb-2 font-mono">Identified Keywords:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'AWS', 'TypeScript'].map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-blue-300 border border-slate-700">
                          ✓ {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline & Features */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Comprehensive SRS Architectural Pipeline
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Engineered strictly to the IEEE SRS standards for 5th semester Software Engineering evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 card-hover">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">PDF Extraction & Classification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accepts PDF resumes up to 5MB, performs text extraction, and segments sections into Summary,
              Technical Skills, Experience, Education, Projects, and Certifications (FR-2.1 – FR-2.5).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 card-hover">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">ATS Keyword Overlap & Gaps</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Analyzes job descriptions for programming languages, cloud stacks, and tools. Identifies matched
              competencies while flagging missing keywords with actionable insertion recommendations (FR-4.1 – FR-4.4).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 card-hover">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Hybrid Heuristic & AI Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evaluates measurable impact metrics and action verbs with a built-in intelligent NLP heuristic engine,
              alongside seamless Google Gemini API integration (FR-5.1 – FR-5.5).
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-slate-400 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-slate-300 font-semibold">AI Resume Analyzer — Software Engineering Project</p>
          <p className="text-slate-500 mt-1">Medicaps University • Department of Computer Science & Engineering</p>
        </div>
      </footer>
    </div>
  );
};

const UploadCloudIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);

export default Home;
