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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Analysis History</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse and inspect historical resume scans and ATS evaluations
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          New Analysis
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title or file name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterScore('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterScore === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterScore('high')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterScore === 'high' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            80%+
          </button>
          <button
            onClick={() => setFilterScore('mid')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterScore === 'mid' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            60-79%
          </button>
          <button
            onClick={() => setFilterScore('low')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterScore === 'low' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            &lt;60%
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading history records...</div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No evaluations found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting your filter or analyze a new resume.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAnalyses.map((analysis) => {
              const id = analysis._id || analysis.id;
              const score = analysis.overallScore || 0;
              let scoreBadge = 'text-rose-700 bg-rose-50 border-rose-200';
              if (score >= 80) scoreBadge = 'text-emerald-700 bg-emerald-50 border-emerald-200';
              else if (score >= 60) scoreBadge = 'text-amber-700 bg-amber-50 border-amber-200';

              return (
                <div
                  key={id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{analysis.jobTitle}</h3>
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-700">{analysis.resumeName}</span>
                        <span>•</span>
                        <span className="font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(analysis.createdAt).toLocaleString()}
                        </span>
                        <span>•</span>
                        <span>{analysis.matchedKeywords?.length || 0} matched competencies</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${scoreBadge}`}>
                      {score}% ATS
                    </span>
                    <Link
                      to={`/report/${id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                    >
                      Report
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(id)}
                      title="Delete record"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
