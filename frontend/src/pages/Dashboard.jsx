import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAnalysesApi, getResumesApi, loadSampleResumeApi } from '../services/api';
import {
  FileText,
  UploadCloud,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  Clock,
  Search,
  CheckCircle,
  FileCheck2,
  Trash2,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [sampleLoading, setSampleLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analysesRes, resumesRes] = await Promise.all([
        getAnalysesApi(),
        getResumesApi(),
      ]);
      setAnalyses(analysesRes.data?.analyses || []);
      setResumes(resumesRes.data?.resumes || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = async () => {
    setSampleLoading(true);
    try {
      await loadSampleResumeApi();
      await fetchDashboardData();
    } catch (e) {
      alert('Could not load sample resume: ' + e.message);
    } finally {
      setSampleLoading(false);
    }
  };

  const totalAnalyses = analyses.length;
  const totalResumes = resumes.length;
  const highestScore = analyses.length > 0 ? Math.max(...analyses.map((a) => a.overallScore || 0)) : 0;
  const averageScore =
    analyses.length > 0
      ? Math.round(analyses.reduce((acc, c) => acc + (c.overallScore || 0), 0) / analyses.length)
      : 0;

  const filteredAnalyses = analyses.filter((item) => {
    const matchesSearch =
      (item.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.resumeName || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    const score = item.overallScore || 0;
    if (scoreFilter === 'high') return score >= 80;
    if (scoreFilter === 'low') return score < 60;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/40 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-indigo-800/40">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm mb-3 border border-indigo-500/30">
            Candidate Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome back, {user?.name || 'Candidate'}!
          </h1>
          <p className="mt-2 text-slate-300 text-sm max-w-xl leading-relaxed">
            Monitor resume ATS compatibility, run real-time job description matching, and review actionable recommendations.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
        >
          <UploadCloud className="w-4 h-4" />
          Analyze New Resume
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 shadow-xs card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Scans</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-white mt-2">{totalAnalyses}</p>
          <span className="text-xs text-slate-500 mt-1 block">Completed evaluations</span>
        </div>

        <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 shadow-xs card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Match</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-emerald-400 mt-2">{highestScore}%</p>
          <span className="text-xs text-slate-500 mt-1 block">Peak ATS score</span>
        </div>

        <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 shadow-xs card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Score</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-violet-400 mt-2">{averageScore}%</p>
          <span className="text-xs text-slate-500 mt-1 block">Mean alignment</span>
        </div>

        <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 shadow-xs card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">PDF Locker</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-white mt-2">{totalResumes}</p>
          <span className="text-xs text-slate-500 mt-1 block">Stored documents</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Evaluations (2 cols) */}
        <div className="lg:col-span-2 bg-[#111827] rounded-2xl border border-slate-800 shadow-xs p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Recent Resume Analyses</h2>
              <p className="text-xs text-slate-400 mt-0.5">Filter and review previous job evaluations</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl text-xs font-semibold border border-slate-800">
              <button
                onClick={() => setScoreFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  scoreFilter === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setScoreFilter('high')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  scoreFilter === 'high' ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                High (80%+)
              </button>
              <button
                onClick={() => setScoreFilter('low')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  scoreFilter === 'low' ? 'bg-rose-600/30 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Needs Work
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by job title or resume..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 bg-[#0f172a] text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            />
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading analysis reports...</div>
          ) : filteredAnalyses.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">No evaluations found</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Upload a resume and compare against any job description to view detailed scores.
              </p>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
              >
                Start First Analysis
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAnalyses.map((item) => {
                const id = item._id || item.id;
                const score = item.overallScore || 0;
                let badgeStyle = 'bg-rose-950/60 text-rose-300 border-rose-800/60';
                if (score >= 80) badgeStyle = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
                else if (score >= 60) badgeStyle = 'bg-amber-950/60 text-amber-300 border-amber-800/60';

                return (
                  <div
                    key={id}
                    className="p-4 rounded-xl border border-slate-800 hover:border-indigo-500/40 hover:bg-[#0f172a] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f172a]/60"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.jobTitle}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                          <span className="text-slate-300">{item.resumeName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${badgeStyle}`}>
                        {score}% ATS
                      </span>
                      <Link
                        to={`/report/${id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors"
                      >
                        Inspect Report
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Resumes in Locker (1 col) */}
        <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white">Resumes in Locker</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {resumes.length}
              </span>
            </div>

            {loading ? (
              <div className="py-6 text-center text-xs text-slate-500">Loading locker...</div>
            ) : resumes.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <p>No resumes stored in your locker.</p>
                <button
                  type="button"
                  disabled={sampleLoading}
                  onClick={handleLoadSample}
                  className="mt-3 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors"
                >
                  {sampleLoading ? 'Loading...' : '+ Load Demo Resume'}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {resumes.map((r) => {
                  const rid = r._id || r.id;
                  return (
                    <div
                      key={rid}
                      className="p-3 rounded-xl border border-slate-800 bg-[#0f172a] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <span className="truncate font-semibold text-slate-200">
                          {r.originalFileName}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono flex-shrink-0 ml-2">
                        {Math.round((r.fileSize || 0) / 1024)} KB
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
            <Link
              to="/analyze"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              Analyze Another PDF
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
