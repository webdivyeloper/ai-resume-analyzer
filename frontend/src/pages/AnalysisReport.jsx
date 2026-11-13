import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnalysisByIdApi } from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import confetti from 'canvas-confetti';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Printer,
  TrendingUp,
  Award,
  Layers,
  HelpCircle,
  Copy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const AnalysisReport = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('recommendations'); // 'recommendations' | 'keywords' | 'sections'

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await getAnalysisByIdApi(id);
        setData(res.data);
        if (res.data?.analysis?.overallScore >= 80) {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analysis report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm font-medium">Generating Report View...</p>
      </div>
    );
  }

  if (error || !data?.analysis) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-2xl border border-red-200 text-center shadow-sm">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-2">Report Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">{error || 'This analysis could not be retrieved.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0">
      {/* Top action navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 print:hidden">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            New Analysis
          </Link>
        </div>
      </div>

      {/* Header Info */}
      <div className="mt-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 uppercase tracking-wide">
              ATS Match Report
            </span>
            <span className="text-xs text-slate-400">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {jobTitle || 'Target Position'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            Resume File: <span className="font-semibold text-slate-700">{resumeName}</span>
            <span>•</span>
            <span>Engine: {aiMetadata.provider || 'NLP Engine'}</span>
          </p>
        </div>
      </div>

      {/* Main Scoring Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Overall Score Circle (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
          <ScoreGauge score={overallScore} size={170} />
          <p className="text-xs text-slate-500 mt-4 max-w-xs leading-relaxed">
            Composite ATS compatibility score weighted by technical skills, quantifiable experience,
            qualifications, and structural readability.
          </p>
        </div>

        {/* 4 Category Breakdown Bars (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-around">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Category Breakdown
          </h3>

          <div className="space-y-4">
            {/* Skills */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Skills & Technology Match</span>
                <span className="text-blue-600">{categoryScores.skills || 0}%</span>
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
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Experience & Action Verbs</span>
                <span className="text-indigo-600">{categoryScores.experience || 0}%</span>
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
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Education & Academic Alignment</span>
                <span className="text-emerald-600">{categoryScores.education || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${categoryScores.education || 0}%` }}
                ></div>
              </div>
            </div>

            {/* ATS Formatting */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">ATS Structure & Formatting</span>
                <span className="text-amber-600">{categoryScores.formatting || 0}%</span>
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

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`py-2.5 px-4 text-xs font-bold rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'recommendations'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          AI Suggestions & Feedback
        </button>

        <button
          onClick={() => setActiveTab('keywords')}
          className={`py-2.5 px-4 text-xs font-bold rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'keywords'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Keywords Match & Gaps ({matchedKeywords.length} / {missingKeywords.length})
        </button>

        {resume?.sections && (
          <button
            onClick={() => setActiveTab('sections')}
            className={`py-2.5 px-4 text-xs font-bold rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'sections'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Parsed Sections
          </button>
        )}
      </div>

      {/* Tab 1: AI Suggestions & Feedback */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {/* Actionable Recommendations */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Actionable Recommendations for Higher ATS Ranking
              </h3>
            </div>
            <ul className="space-y-3">
              {recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Strengths & Issues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Identified Strengths ({strengths.length})
                </h3>
              </div>
              <ul className="space-y-2.5">
                {strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                    <span className="leading-relaxed">{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvement Areas */}
            <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Improvement Areas & Issues ({issues.length})
                </h3>
              </div>
              <ul className="space-y-2.5">
                {issues.map((iss, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="text-amber-500 font-bold mt-0.5">⚠</span>
                    <span className="leading-relaxed">{iss}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Keywords Match & Gaps */}
      {activeTab === 'keywords' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Matched Keywords */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Matched Skills & Keywords ({matchedKeywords.length})
              </h3>
            </div>
            {matchedKeywords.length === 0 ? (
              <p className="text-xs text-slate-400">No matching keywords found in this resume.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5"
                  >
                    <span>✓</span>
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Missing Keywords */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-rose-700 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Missing Target Keywords ({missingKeywords.length})
              </h3>
            </div>
            {missingKeywords.length === 0 ? (
              <p className="text-xs text-emerald-600 font-medium">
                Outstanding! All core target keywords from the job description are present.
              </p>
            ) : (
              <div>
                <p className="text-xs text-slate-500 mb-3">
                  Consider integrating these keywords into your skills, work experience, or project bullet points:
                </p>
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1"
                    >
                      <span>+</span>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Parsed Resume Sections */}
      {activeTab === 'sections' && resume?.sections && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Extracted Resume Content</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sections detected by the automated PDF parsing pipeline
            </p>
          </div>

          {/* Summary */}
          {resume.sections.summary && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Summary / Objective
              </h4>
              <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                {resume.sections.summary}
              </p>
            </div>
          )}

          {/* Skills */}
          {resume.sections.skills && resume.sections.skills.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Identified Skills ({resume.sections.skills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {resume.sections.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {resume.sections.experience && resume.sections.experience.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Work Experience Bullets
              </h4>
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                {resume.sections.experience.map((exp, idx) => (
                  <p key={idx} className="text-xs text-slate-700 leading-relaxed">
                    • {exp}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.sections.education && resume.sections.education.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Education
              </h4>
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
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
