import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Target,
  Cpu,
  ArrowRight,
  FileCheck2,
  UploadCloud,
  Zap,
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="theme-app min-h-[calc(100vh-4rem)] transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b theme-border bg-gradient-to-b from-indigo-50/60 via-transparent to-transparent dark:from-[#0f172a] dark:to-[#0b0f19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                AI ATS Resume Screener & Matcher
              </div>

              <h1 className="text-4xl sm:text-5xl font-black theme-text-main tracking-tight leading-[1.15]">
                AI-Powered Resume Analysis &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 dark:from-indigo-400 dark:via-violet-400 dark:to-blue-400">
                  ATS Screening System
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg theme-text-muted leading-relaxed max-w-2xl">
                Parse candidate PDF resumes, identify missing technical qualifications against job
                descriptions, evaluate structural formatting, and generate actionable ATS recommendations.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {isAuthenticated ? (
                  <Link
                    to="/analyze"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
                  >
                    <UploadCloud className="w-4 h-4" />
                    Open Resume Analyzer
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
                    >
                      Sign In (1-Click Demo)
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold theme-card-subtle hover:border-indigo-500 border theme-border shadow-xs transition-colors"
                    >
                      Register New User
                    </Link>
                  </>
                )}
              </div>

              {/* Fast Stats */}
              <div className="mt-10 pt-6 border-t theme-border grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-2xl font-black theme-text-main font-mono">100%</div>
                  <div className="text-xs theme-text-muted font-medium">Automated Parsing</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">4-in-1</div>
                  <div className="text-xs theme-text-muted font-medium">Category Scoring</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">Instant</div>
                  <div className="text-xs theme-text-muted font-medium">Keyword Extraction</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="theme-card rounded-2xl p-6 border shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b theme-border mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-mono theme-text-muted ml-2">ATS_Evaluation_Engine.v1</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    LIVE PREVIEW
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold theme-text-main">Full Stack Software Engineer</h4>
                      <p className="text-xs theme-text-muted">Target Candidate: John_Doe_Resume.pdf</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-sm border border-emerald-500/30">
                      94% MATCH
                    </div>
                  </div>

                  {/* Progress bars preview */}
                  <div className="space-y-2.5 pt-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="theme-text-muted">Technical Skills Match</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono">92%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border theme-border">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="theme-text-muted">Quantifiable Metrics & Verbs</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-mono">100%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border theme-border">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="theme-text-muted">ATS Structure & Format</span>
                        <span className="text-violet-600 dark:text-violet-400 font-mono">95%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border theme-border">
                        <div className="bg-violet-500 h-full rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Overlap tags */}
                  <div className="pt-2">
                    <span className="text-[11px] theme-text-muted block mb-2 font-mono">Identified Keywords:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'AWS', 'TypeScript'].map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] theme-card-subtle text-indigo-700 dark:text-indigo-300 border theme-border">
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
          <h2 className="text-2xl sm:text-3xl font-bold theme-text-main tracking-tight">
            Comprehensive Architectural Pipeline
          </h2>
          <p className="mt-2 text-sm theme-text-muted">
            Engineered for high accuracy and reliable candidate evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="theme-card p-6 rounded-2xl border card-hover">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold theme-text-main mb-2">PDF Extraction & Classification</h3>
            <p className="text-xs theme-text-muted leading-relaxed">
              Accepts PDF resumes up to 5MB, performs text extraction, and segments sections into Summary,
              Technical Skills, Experience, Education, Projects, and Certifications.
            </p>
          </div>

          <div className="theme-card p-6 rounded-2xl border card-hover">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold theme-text-main mb-2">ATS Keyword Overlap & Gaps</h3>
            <p className="text-xs theme-text-muted leading-relaxed">
              Analyzes job descriptions for programming languages, cloud stacks, and tools. Identifies matched
              competencies while flagging missing keywords with actionable insertion recommendations.
            </p>
          </div>

          <div className="theme-card p-6 rounded-2xl border card-hover">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold theme-text-main mb-2">Hybrid Heuristic & AI Engine</h3>
            <p className="text-xs theme-text-muted leading-relaxed">
              Evaluates measurable impact metrics and action verbs with a built-in intelligent NLP heuristic engine,
              alongside seamless Google Gemini API integration.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-100 dark:bg-[#090d16] theme-text-muted border-t theme-border text-center text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <p className="theme-text-main font-semibold">AI Resume Analyzer</p>
          <p className="theme-text-muted mt-1">Department of Computer Science & Engineering</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
