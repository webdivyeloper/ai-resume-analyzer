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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 theme-text-main transition-colors">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-indigo-700/40">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm mb-3 border border-indigo-500/30">
            Candidate Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome back, {user?.name || 'Candidate'}!
          </h1>
          <p className="mt-2 text-indigo-200 text-sm max-w-xl leading-relaxed">
            Monitor resume ATS compatibility, run real-time job description matching, and review actionable recommendations.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          Analyze New Resume
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="theme-card p-5 rounded-2xl border card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold theme-text-muted uppercase tracking-wider">Total Scans</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono theme-text-main mt-2">{totalAnalyses}</p>
          <span className="text-xs theme-text-muted mt-1 block">Completed evaluations</span>
        </div>

        <div className="theme-card p-5 rounded-2xl border card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold theme-text-muted uppercase tracking-wider">Top Match</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-2">{highestScore}%</p>
          <span className="text-xs theme-text-muted mt-1 block">Peak ATS score</span>
        </div>

        <div className="theme-card p-5 rounded-2xl border card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold theme-text-muted uppercase tracking-wider">Average Score</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-violet-600 dark:text-violet-400 mt-2">{averageScore}%</p>
          <span className="text-xs theme-text-muted mt-1 block">Mean alignment</span>
        </div>

        <div className="theme-card p-5 rounded-2xl border card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold theme-text-muted uppercase tracking-wider">PDF Locker</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono theme-text-main mt-2">{totalResumes}</p>
          <span className="text-xs theme-text-muted mt-1 block">Stored documents</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Evaluations (2 cols) */}
        <div className="lg:col-span-2 theme-card rounded-2xl border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b theme-border gap-4 mb-4">
            <div>
              <h2 className="text-base font-bold theme-text-main">Recent Resume Analyses</h2>
              <p className="text-xs theme-text-muted mt-0.5">Filter and review previous job evaluations</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 theme-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border theme-input text-xs w-36 sm:w-44 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex rounded-xl p-0.5 theme-card-subtle border theme-border text-xs">
                <button
                  onClick={() => setScoreFilter('all')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    scoreFilter === 'all' ? 'bg-indigo-600 text-white font-bold' : 'theme-text-muted hover:theme-text-main'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setScoreFilter('high')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    scoreFilter === 'high' ? 'bg-emerald-600 text-white font-bold' : 'theme-text-muted hover:theme-text-main'
                  }`}
                >
                  80%+
                </button>
                <button
                  onClick={() => setScoreFilter('low')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    scoreFilter === 'low' ? 'bg-rose-600 text-white font-bold' : 'theme-text-muted hover:theme-text-main'
                  }`}
                >
                  &lt;60%
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs theme-text-muted">Loading evaluations...</div>
          ) : filteredAnalyses.length === 0 ? (
            <div className="py-12 text-center">
              <Layers className="w-10 h-10 theme-text-muted mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold theme-text-main">No analyses recorded yet</p>
              <p className="text-xs theme-text-muted mt-1 mb-4">
                Run your first ATS match evaluation to view category breakdown reports.
              </p>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
              >
                Analyze First Resume
              </Link>
            </div>
          ) : (
            <div className="divide-y theme-divide">
              {filteredAnalyses.slice(0, 5).map((item) => {
                const id = item._id || item.id;
                const score = item.overallScore || 0;
                let badgeClass = 'text-rose-700 dark:text-rose-300 bg-rose-500/10 border-rose-500/30';
                if (score >= 80) badgeClass = 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/30';
                else if (score >= 60) badgeClass = 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30';

                return (
                  <div
                    key={id}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-[#162033] px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl border flex flex-col items-center justify-center font-mono font-black text-sm ${badgeClass}`}>
                        {score}%
                      </div>
                      <div>
                        <h4 className="text-xs font-bold theme-text-main">{item.jobTitle || 'Target Position'}</h4>
                        <div className="flex items-center gap-2 text-[11px] theme-text-muted mt-0.5">
                          <span>{item.resumeName || 'Resume.pdf'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/report/${id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-2.5 py-1 rounded-lg"
                    >
                      Report
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {analyses.length > 5 && (
            <div className="pt-4 border-t theme-border text-center">
              <Link to="/history" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                View All {analyses.length} History Records &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Right: Resume Locker (1 col) */}
        <div className="theme-card rounded-2xl border p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b theme-border mb-4">
              <div>
                <h2 className="text-base font-bold theme-text-main">Resume Locker</h2>
                <p className="text-xs theme-text-muted mt-0.5">Manage uploaded PDF files</p>
              </div>
              <button
                type="button"
                disabled={sampleLoading}
                onClick={handleLoadSample}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {sampleLoading ? 'Loading...' : '+ Sample PDF'}
              </button>
            </div>

            {resumes.length === 0 ? (
              <div className="py-8 text-center text-xs theme-text-muted">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                No resumes in locker.
              </div>
            ) : (
              <div className="space-y-2.5">
                {resumes.slice(0, 5).map((r) => {
                  const rId = r._id || r.id;
                  return (
                    <div
                      key={rId}
                      className="p-3 rounded-xl theme-card-subtle border flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileCheck2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <div className="truncate">
                          <p className="font-bold theme-text-main truncate">{r.originalFileName}</p>
                          <p className="text-[10px] theme-text-muted font-mono">
                            {Math.round((r.fileSize || 0) / 1024)} KB • {new Date(r.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-6 border-t theme-border mt-6">
            <Link
              to="/analyze"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <UploadCloud className="w-4 h-4" />
              Upload New PDF
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
