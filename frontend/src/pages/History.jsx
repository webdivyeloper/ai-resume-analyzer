import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnalysesApi, deleteAnalysisApi } from '../services/api';
import {
  Clock,
  Search,
  FileText,
  Trash2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
    const titleMatch = (a.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    const resumeMatch = (a.resumeName || '').toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || resumeMatch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Analysis History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical candidate evaluations and ATS match records (FR-7.3 & FR-7.4)
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          New Analysis
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter */}
      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by job role or file name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:border-slate-800"
          />
        </div>
      </div>

      {/* Table-like List */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading evaluation records...</div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No evaluations found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAnalyses.map((analysis) => {
              const id = analysis._id || analysis.id;
              const score = analysis.overallScore || 0;
              let scoreClass = 'text-rose-700 bg-rose-50 border-rose-200';
              if (score >= 75) scoreClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
              else if (score >= 55) scoreClass = 'text-amber-700 bg-amber-50 border-amber-200';

              return (
                <div
                  key={id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-slate-100 text-slate-600 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{analysis.jobTitle}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{analysis.resumeName}</span>
                        <span>•</span>
                        <span className="font-mono">{new Date(analysis.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{analysis.matchedKeywords?.length || 0} matched terms</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${scoreClass}`}>
                      {score}% ATS
                    </span>
                    <Link
                      to={`/report/${id}`}
                      className="px-2.5 py-1 rounded text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
                    >
                      Report
                    </Link>
                    <button
                      onClick={() => handleDelete(id)}
                      title="Delete record"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
