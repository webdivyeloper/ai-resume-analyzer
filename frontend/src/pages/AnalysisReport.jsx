import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnalysisByIdApi } from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Printer,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
  Zap,
} from 'lucide-react';

const AnalysisReport = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('recommendations'); // 'recommendations' | 'keywords' | 'sections'

  // Interactive Checklist State
  const [checkedRecs, setCheckedRecs] = useState({});
  const [copiedKeyword, setCopiedKeyword] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await getAnalysisByIdApi(id);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to retrieve analysis report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold">Generating ATS Evaluation Report...</p>
      </div>
    );
  }

  if (error || !data?.analysis) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-rose-200 text-center shadow-sm">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Analysis Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">{error || 'This evaluation does not exist or access was denied.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { analysis, resume } = data;
  const {
    jobTitle,
    resumeName,
    overallScore,
    categoryScores = {},
    matchedKeywords = [],
    missingKeywords = [],
    strengths = [],
    issues = [],
    recommendations = [],
    aiMetadata = {},
    createdAt,
  } = analysis;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyKeyword = (kw) => {
    navigator.clipboard.writeText(kw);
    setCopiedKeyword(kw);
    setTimeout(() => setCopiedKeyword(null), 1500);
  };

  const toggleRec = (index) => {
    setCheckedRecs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const completedRecCount = Object.values(checkedRecs).filter(Boolean).length;
  const potentialBoost = Math.min(100, Math.round(overallScore + completedRecCount * 4));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800 print:p-0">
      {/* Top action navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-6 print:hidden">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            New Evaluation
          </Link>
        </div>
      </div>

      {/* Header Info Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                ATS Evaluation Report
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(createdAt).toLocaleString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {jobTitle}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Resume File: <strong className="text-slate-700 font-semibold">{resumeName}</strong></span>
              <span>•</span>
              <span>Provider: <strong className="text-slate-700 font-semibold">{aiMetadata.provider || 'Heuristic NLP Engine'}</strong></span>
            </p>
          </div>

          {/* Interactive potential score pill */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center gap-3">
            <Zap className="w-5 h-5 text-blue-600" />
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                Potential Score with Edits
              </span>
              <span className="text-sm font-black font-mono text-blue-900">
                Up to {potentialBoost}% Match
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Scoring Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Score Dial (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col items-center justify-center text-center">
          <ScoreGauge score={overallScore} size={170} />
          <p className="text-xs text-slate-500 mt-4 leading-relaxed max-w-xs">
            Weighted composite score based on technical keyword density, action verbs, education alignment, and structural ATS readability.
          </p>
        </div>

        {/* 4 Category Breakdown Bars (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-around">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
            Category Breakdown & Metrics
          </h2>

          <div className="space-y-4">
            {/* Skills */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">Skills & Technology Match</span>
                <span className="font-mono text-blue-600">{categoryScores.skills || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${categoryScores.skills || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">Work Experience & Impact Metrics</span>
                <span className="font-mono text-indigo-600">{categoryScores.experience || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${categoryScores.experience || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">Education & Academic Alignment</span>
                <span className="font-mono text-emerald-600">{categoryScores.education || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${categoryScores.education || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Formatting */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">ATS Structure & Section Readiness</span>
                <span className="font-mono text-amber-600">{categoryScores.formatting || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${categoryScores.formatting || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`py-2.5 px-4 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
            activeTab === 'recommendations'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Actionable Recommendations ({recommendations.length})
        </button>

        <button
          onClick={() => setActiveTab('keywords')}
          className={`py-2.5 px-4 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
            activeTab === 'keywords'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Keywords ({matchedKeywords.length} Matched / {missingKeywords.length} Missing)
        </button>

        {resume?.sections && (
          <button
            onClick={() => setActiveTab('sections')}
            className={`py-2.5 px-4 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'sections'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Parsed Sections
          </button>
        )}
      </div>

      {/* Tab 1: Recommendations with Interactive Checklist */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Interactive Optimization Checklist
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Check off recommendations as you apply them to your resume:
                </p>
              </div>
              <span className="text-xs font-bold font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                {completedRecCount} of {recommendations.length} Addressed
              </span>
            </div>

            <div className="space-y-2.5">
              {recommendations.map((rec, i) => {
                const isChecked = !!checkedRecs[i];
                return (
                  <div
                    key={i}
                    onClick={() => toggleRec(i)}
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed cursor-pointer transition-all flex items-start gap-3 select-none ${
                      isChecked
                        ? 'bg-emerald-50/40 border-emerald-300 text-slate-500 line-through'
                        : 'bg-slate-50 hover:bg-blue-50/50 border-slate-200/80 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center flex-shrink-0 border transition-all ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{rec}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-xs p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Key Candidate Strengths ({strengths.length})
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span className="leading-relaxed">{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                ATS Gaps & Flags ({issues.length})
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {issues.map((iss, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span className="leading-relaxed">{iss}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Keywords with Interactive 1-Click Copy */}
      {activeTab === 'keywords' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Matched Keywords */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Matched Skills & Keywords ({matchedKeywords.length})
            </h3>
            {matchedKeywords.length === 0 ? (
              <p className="text-xs text-slate-400">No overlapping keywords detected.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    onClick={() => handleCopyKeyword(kw)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 cursor-pointer hover:bg-emerald-100 transition-colors"
                  >
                    <span>✓</span>
                    {kw}
                    {copiedKeyword === kw && <span className="text-[10px] text-emerald-600 font-bold ml-1">Copied!</span>}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Missing Keywords */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Missing Target Keywords ({missingKeywords.length})
            </h3>
            {missingKeywords.length === 0 ? (
              <p className="text-xs text-emerald-700 font-semibold">
                Perfect! All target keywords from the job description are present in the resume.
              </p>
            ) : (
              <div>
                <p className="text-xs text-slate-500 mb-3">
                  Click any keyword to copy it to clipboard for adding to your resume:
                </p>
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((kw, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleCopyKeyword(kw)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5 hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3 text-rose-500" />
                      {kw}
                      {copiedKeyword === kw && <span className="text-[10px] text-rose-800 font-bold ml-1">Copied!</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Parsed Resume Sections */}
      {activeTab === 'sections' && resume?.sections && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Extracted Resume Content</h3>
              <p className="text-xs text-slate-500">Structural sections parsed from PDF</p>
            </div>
          </div>

          {resume.sections.summary && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Summary / Objective
              </h4>
              <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed font-mono">
                {resume.sections.summary}
              </p>
            </div>
          )}

          {resume.sections.skills && resume.sections.skills.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Identified Skills ({resume.sections.skills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {resume.sections.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {resume.sections.experience && resume.sections.experience.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Work Experience Bullets
              </h4>
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                {resume.sections.experience.map((exp, idx) => (
                  <p key={idx} className="text-xs text-slate-700 leading-relaxed">
                    • {exp}
                  </p>
                ))}
              </div>
            </div>
          )}

          {resume.sections.education && resume.sections.education.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Education
              </h4>
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                {resume.sections.education.map((edu, idx) => (
                  <p key={idx} className="text-xs text-slate-700 leading-relaxed">
                    • {edu}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisReport;
