import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnalysisByIdApi } from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import {
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Printer,
  ChevronRight,
  Shield,
  Layers,
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
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2 text-xs text-slate-500">
        <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <span>Loading report data...</span>
      </div>
    );
  }

  if (error || !data?.analysis) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg border border-slate-200 text-center">
        <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
        <h2 className="text-sm font-bold text-slate-900">Report Unavailable</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">{error || 'Record could not be found.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 text-white text-xs font-medium"
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800 print:p-0">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3 mb-6 print:hidden">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
          >
            New Analysis
          </Link>
        </div>
      </div>

      {/* Metadata Card */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono uppercase">
                SRS Diagnostic Report
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {new Date(createdAt).toLocaleString()}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1.5">
              {jobTitle}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Resume: <span className="font-medium text-slate-700">{resumeName}</span> • Parser Engine: <span className="font-mono text-slate-700">{aiMetadata.provider || 'Heuristic NLP'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Scoring Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Score Dial (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 p-6 flex flex-col items-center justify-center text-center">
          <ScoreGauge score={overallScore} size={150} />
          <p className="text-[11px] text-slate-500 mt-4 leading-relaxed max-w-xs">
            Composite ATS compliance weighted according to keyword overlap, section structure, and action-oriented experience.
          </p>
        </div>

        {/* Category Breakdown Bars (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 p-6 flex flex-col justify-around">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
            Category Breakdown (FR-4.4 & FR-7.1)
          </h2>

          <div className="space-y-4 text-xs">
            {/* Skills */}
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Skills & Technology Alignment</span>
                <span className="font-mono text-slate-900">{categoryScores.skills || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                <div
                  className="bg-slate-800 h-full rounded transition-all duration-700"
                  style={{ width: `${categoryScores.skills || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Experience & Verbs (Action impact)</span>
                <span className="font-mono text-slate-900">{categoryScores.experience || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                <div
                  className="bg-slate-800 h-full rounded transition-all duration-700"
                  style={{ width: `${categoryScores.experience || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Education & Academic Background</span>
                <span className="font-mono text-slate-900">{categoryScores.education || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                <div
                  className="bg-slate-800 h-full rounded transition-all duration-700"
                  style={{ width: `${categoryScores.education || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Formatting */}
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">ATS Structure & Formatting Compliance</span>
                <span className="font-mono text-slate-900">{categoryScores.formatting || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                <div
                  className="bg-slate-800 h-full rounded transition-all duration-700"
                  style={{ width: `${categoryScores.formatting || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`py-2 px-3 border-b-2 transition-colors ${
            activeTab === 'recommendations'
              ? 'border-slate-900 text-slate-900 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Recommendations & Feedback
        </button>

        <button
          onClick={() => setActiveTab('keywords')}
          className={`py-2 px-3 border-b-2 transition-colors ${
            activeTab === 'keywords'
              ? 'border-slate-900 text-slate-900 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Keyword Match & Gaps ({matchedKeywords.length} Matched / {missingKeywords.length} Missing)
        </button>

        {resume?.sections && (
          <button
            onClick={() => setActiveTab('sections')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'sections'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Parsed Sections
          </button>
        )}
      </div>

      {/* Tab 1: Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Actionable Recommendations (FR-5.3 & FR-6.3)
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="p-3 rounded bg-slate-50 border border-slate-100 flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="font-mono font-bold text-slate-500 text-[11px] mt-0.5">{i + 1}.</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Identified Strengths ({strengths.length})
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Weaknesses & Gaps ({issues.length})
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold">•</span>
                    <span className="leading-relaxed">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Keywords */}
      {activeTab === 'keywords' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Matched Keywords ({matchedKeywords.length})
            </h3>
            {matchedKeywords.length === 0 ? (
              <p className="text-xs text-slate-400">No direct keyword overlap detected.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Missing Target Keywords ({missingKeywords.length})
            </h3>
            {missingKeywords.length === 0 ? (
              <p className="text-xs text-emerald-700 font-medium">
                All identified job requirements are covered in the resume.
              </p>
            ) : (
              <div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Incorporate relevant experience with these terms where applicable:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Parsed Sections */}
      {activeTab === 'sections' && resume?.sections && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Structural Sections Extracted (FR-2.4)
          </h3>

          {resume.sections.summary && (
            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                Summary Section
              </span>
              <p className="text-xs bg-slate-50 p-3 rounded border border-slate-100 text-slate-700 leading-relaxed font-mono">
                {resume.sections.summary}
              </p>
            </div>
          )}

          {resume.sections.skills && resume.sections.skills.length > 0 && (
            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                Skills Section ({resume.sections.skills.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {resume.sections.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-100 border border-slate-200 text-slate-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {resume.sections.experience && resume.sections.experience.length > 0 && (
            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                Experience Section
              </span>
              <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-100 text-xs text-slate-700">
                {resume.sections.experience.map((exp, idx) => (
                  <p key={idx}>• {exp}</p>
                ))}
              </div>
            </div>
          )}

          {resume.sections.education && resume.sections.education.length > 0 && (
            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                Education Section
              </span>
              <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-100 text-xs text-slate-700">
                {resume.sections.education.map((edu, idx) => (
                  <p key={idx}>• {edu}</p>
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
