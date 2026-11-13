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
  Zap,
} from 'lucide-react';

const AnalysisReport = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('recommendations');

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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 theme-text-muted">
        <div className="w-10 h-10 border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold">Generating ATS Evaluation Report...</p>
      </div>
    );
  }

  if (error || !data?.analysis) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 theme-card rounded-2xl border border-rose-500/30 text-center shadow-2xl">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h2 className="text-base font-bold theme-text-main">Analysis Record Not Found</h2>
        <p className="text-xs theme-text-muted mt-1 mb-6">{error || 'This evaluation does not exist or access was denied.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 theme-text-main print:p-0 transition-colors">
      {/* Top action navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b theme-border gap-4 mb-6 print:hidden">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold theme-text-muted hover:theme-text-main transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold theme-card hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 border theme-border transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            New Evaluation
          </Link>
        </div>
      </div>

      {/* Header Info Banner */}
      <div className="theme-card p-6 rounded-2xl border mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-700/60 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                ATS Evaluation Report
              </span>
              <span className="text-xs theme-text-muted font-mono">
                {new Date(createdAt).toLocaleString()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black theme-text-main tracking-tight">
              {jobTitle || 'Target Position'}
            </h1>
            <p className="text-xs theme-text-muted mt-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Evaluated File: <span className="font-semibold theme-text-main">{resumeName || 'Resume.pdf'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 theme-card-subtle px-4 py-2.5 rounded-xl border theme-border self-stretch md:self-auto justify-between md:justify-start">
            <div>
              <span className="text-[10px] uppercase font-bold theme-text-muted block">Analysis Engine</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {aiMetadata?.modelUsed ? `Gemini AI (${aiMetadata.modelUsed})` : 'Algorithmic ATS Rule Engine'}
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Score Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left: Overall Circular Score Gauge */}
        <div className="theme-card p-6 rounded-2xl border flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider theme-text-muted mb-2">
            Overall ATS Match Score
          </span>
          <ScoreGauge score={overallScore} size={190} />

          {/* Interactive Checklist Boost Indicator */}
          {completedRecCount > 0 && (
            <div className="mt-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-500 animate-bounce" />
              <span>
                Projected Score: <strong className="theme-text-main font-black">{potentialBoost}%</strong> (+{potentialBoost - overallScore}%)
              </span>
            </div>
          )}
        </div>

        {/* Right: Category Breakdown Bars (2 cols) */}
        <div className="lg:col-span-2 theme-card p-6 rounded-2xl border flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b theme-border pb-3">
            <h3 className="text-sm font-bold theme-text-main">ATS Category Competency Scores</h3>
            <span className="text-xs theme-text-muted">Weight: 40% Skills, 30% Exp, 15% Edu, 15% Format</span>
          </div>

          <div className="space-y-4">
            {/* Skills */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Technical & Job Skills Match</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">{categoryScores.skills || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#0f172a] h-2.5 rounded-full overflow-hidden border theme-border">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${categoryScores.skills || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Experience & Project Alignment</span>
                <span className="text-violet-600 dark:text-violet-400 font-mono">{categoryScores.experience || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#0f172a] h-2.5 rounded-full overflow-hidden border theme-border">
                <div
                  className="bg-violet-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${categoryScores.experience || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Education & Academic Background</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">{categoryScores.education || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#0f172a] h-2.5 rounded-full overflow-hidden border theme-border">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${categoryScores.education || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Formatting */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Formatting & ATS Parsability</span>
                <span className="text-sky-600 dark:text-sky-400 font-mono">{categoryScores.formatting || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#0f172a] h-2.5 rounded-full overflow-hidden border theme-border">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${categoryScores.formatting || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t theme-border flex items-center justify-between text-xs theme-text-muted">
            <span>Matched Keywords: <strong className="theme-text-main font-mono">{matchedKeywords.length}</strong></span>
            <span>Keyword Gaps: <strong className="text-rose-500 font-mono">{missingKeywords.length}</strong></span>
            <span>Actionable Tips: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{recommendations.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Header */}
      <div className="flex border-b theme-border mb-6 gap-2 overflow-x-auto print:hidden">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'recommendations'
              ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent theme-text-muted hover:theme-text-main'
          }`}
        >
          Recommendations Checklist ({recommendations.length})
        </button>
        <button
          onClick={() => setActiveTab('keywords')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'keywords'
              ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent theme-text-muted hover:theme-text-main'
          }`}
        >
          Keyword Match Analysis ({matchedKeywords.length}/{matchedKeywords.length + missingKeywords.length})
        </button>
        <button
          onClick={() => setActiveTab('strengths')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'strengths'
              ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent theme-text-muted hover:theme-text-main'
          }`}
        >
          Strengths & Issues ({strengths.length + issues.length})
        </button>
        <button
          onClick={() => setActiveTab('extracted')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'extracted'
              ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent theme-text-muted hover:theme-text-main'
          }`}
        >
          Parsed Resume Structure
        </button>
      </div>

      {/* Tab 1: Recommendations Checklist */}
      {activeTab === 'recommendations' && (
        <div className="theme-card p-6 rounded-2xl border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b theme-border">
            <div>
              <h3 className="text-sm font-bold theme-text-main">ATS Optimization Action Items</h3>
              <p className="text-xs theme-text-muted mt-0.5">Check off recommendations as you apply them to your resume</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-700/60 text-indigo-700 dark:text-indigo-300">
              {completedRecCount} of {recommendations.length} applied
            </span>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, idx) => {
              const isChecked = !!checkedRecs[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleRec(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-emerald-500/10 border-emerald-500/30 theme-text-muted line-through'
                      : 'theme-card-subtle hover:border-indigo-500/50 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      isChecked
                        ? 'bg-emerald-500 text-white'
                        : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs leading-relaxed">{rec}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Keywords Analysis */}
      {activeTab === 'keywords' && (
        <div className="space-y-6">
          {/* Missing Keywords (Gaps) */}
          <div className="theme-card p-6 rounded-2xl border">
            <div className="flex items-center justify-between pb-3 border-b theme-border mb-4">
              <div>
                <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Missing Keywords (Detected in Job Description)
                </h3>
                <p className="text-xs theme-text-muted mt-0.5">Click any keyword to copy to clipboard for easy insertion</p>
              </div>
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30">
                {missingKeywords.length} gaps
              </span>
            </div>

            {missingKeywords.length === 0 ? (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Great job! All required keywords appear to be present.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((kw, i) => (
                  <button
                    key={i}
                    onClick={() => handleCopyKeyword(kw)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all cursor-pointer"
                  >
                    <span>{kw}</span>
                    {copiedKeyword === kw ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-rose-500 opacity-70" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Matched Keywords */}
          <div className="theme-card p-6 rounded-2xl border">
            <div className="flex items-center justify-between pb-3 border-b theme-border mb-4">
              <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Successfully Matched Keywords
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30">
                {matchedKeywords.length} matched
              </span>
            </div>

            {matchedKeywords.length === 0 ? (
              <p className="text-xs theme-text-muted">No explicit matching keywords identified.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Strengths & Issues */}
      {activeTab === 'strengths' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="theme-card p-6 rounded-2xl border">
            <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 pb-3 border-b theme-border mb-4 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Identified Strengths ({strengths.length})
            </h3>
            <ul className="space-y-2.5">
              {strengths.map((s, i) => (
                <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Issues */}
          <div className="theme-card p-6 rounded-2xl border">
            <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 pb-3 border-b theme-border mb-4 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Detected Flags & Weaknesses ({issues.length})
            </h3>
            <ul className="space-y-2.5">
              {issues.map((issue, i) => (
                <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 4: Parsed Resume Structure */}
      {activeTab === 'extracted' && (
        <div className="theme-card p-6 rounded-2xl border space-y-6">
          <div className="pb-3 border-b theme-border">
            <h3 className="text-sm font-bold theme-text-main">Parsed Document Sections</h3>
            <p className="text-xs theme-text-muted mt-0.5">
              How the automated parser extracted and partitioned your resume content
            </p>
          </div>

          {resume?.sections ? (
            <div className="space-y-4">
              {resume.sections.summary && (
                <div>
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                    Summary / Objective
                  </h4>
                  <div className="p-3 theme-card-subtle rounded-xl border text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-mono">
                    {resume.sections.summary}
                  </div>
                </div>
              )}

              {resume.sections.skills && resume.sections.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                    Extracted Skills ({resume.sections.skills.length})
                  </h4>
                  <div className="p-3 theme-card-subtle rounded-xl border text-xs text-slate-800 dark:text-slate-300 font-mono">
                    {resume.sections.skills.join(', ')}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold theme-text-muted uppercase tracking-wider mb-1">
                  Raw Extracted Text Sample (First 600 characters)
                </h4>
                <div className="p-3 theme-card-subtle rounded-xl border text-[11px] theme-text-muted font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {resume.extractedText?.slice(0, 600)}...
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 theme-card-subtle rounded-xl border text-xs theme-text-muted font-mono whitespace-pre-wrap">
              {resume?.extractedText || 'No extracted text details available.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisReport;
