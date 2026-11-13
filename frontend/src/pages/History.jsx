import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnalysesApi, deleteAnalysisApi } from '../services/api';
import {
  Clock,
  Search,
  FileText,
  Trash2,
  AlertCircle,
  ArrowRight,
  Layers,
} from 'lucide-react';

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScore, setFilterScore] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getAnalysesApi();
      setAnalyses(res.data?.analyses || []);
    } catch (err) {
      setError('Failed to retrieve evaluation records.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this evaluation record?')) return;
    try {
      await deleteAnalysisApi(id);
      setAnalyses((prev) => prev.filter((a) => (a._id || a.id) !== id));
    } catch (err) {
      alert('Failed to delete analysis: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredAnalyses = analyses.filter((a) => {
    const matchesQuery =
      (a.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.resumeName || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesQuery) return false;
    const score = a.overallScore || 0;
    if (filterScore === 'high') return score >= 80;
    if (filterScore === 'mid') return score >= 60 && score < 80;
    if (filterScore === 'low') return score < 60;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 theme-text-main transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b theme-border gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black theme-text-main tracking-tight">Analysis History</h1>
          <p className="text-xs theme-text-muted mt-1">
            Browse and inspect historical resume scans and ATS evaluations
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto cursor-pointer"
        >
          New Analysis
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 theme-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title or file name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border theme-input text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto p-1 theme-card-subtle border theme-border rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterScore('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterScore === 'all' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'theme-text-muted hover:theme-text-main'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterScore('high')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterScore === 'high' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'theme-text-muted hover:theme-text-main'
            }`}
          >
            80%+
          </button>
          <button
            onClick={() => setFilterScore('mid')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterScore === 'mid' ? 'bg-amber-600 text-white shadow-xs font-bold' : 'theme-text-muted hover:theme-text-main'
            }`}
          >
            60-79%
          </button>
          <button
            onClick={() => setFilterScore('low')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterScore === 'low' ? 'bg-rose-600 text-white shadow-xs font-bold' : 'theme-text-muted hover:theme-text-main'
            }`}
          >
            &lt;60%
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="theme-card rounded-2xl border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs theme-text-muted">Loading history records...</div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="p-12 text-center theme-text-muted">
            <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-bold theme-text-main">No evaluations found</p>
            <p className="text-xs theme-text-muted mt-1">Try resetting your filter or analyze a new resume.</p>
          </div>
        ) : (
          <div className="divide-y theme-divide">
            {filteredAnalyses.map((analysis) => {
              const id = analysis._id || analysis.id;
              const score = analysis.overallScore || 0;
              let scoreBadge = 'text-rose-700 dark:text-rose-300 bg-rose-500/10 border-rose-500/30';
              if (score >= 80) scoreBadge = 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/30';
              else if (score >= 60) scoreBadge = 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30';

              return (
                <div
                  key={id}
                  className="p-5 hover:bg-slate-50 dark:hover:bg-[#162033] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center flex-shrink-0 ${scoreBadge}`}
                    >
                      <span className="text-lg font-black">{score}%</span>
                      <span className="text-[9px] uppercase font-bold tracking-wider">Score</span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold theme-text-main group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {analysis.jobTitle || 'Target Position'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs theme-text-muted mt-1.5">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 opacity-60" />
                          {analysis.resumeName || 'Resume.pdf'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 opacity-60" />
                          {new Date(analysis.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleDelete(id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/report/${id}`}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-200 dark:border-indigo-700/50 text-xs font-bold transition-all shadow-xs"
                    >
                      View Report
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
