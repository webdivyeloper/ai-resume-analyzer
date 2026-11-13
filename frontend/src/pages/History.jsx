import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnalysesApi, deleteAnalysisApi } from '../services/api';
import {
  History as HistoryIcon,
  Search,
  FileText,
  Clock,
  ArrowRight,
  Trash2,
  AlertCircle,
  Sparkles,
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
      setError('Failed to load analysis history.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis report?')) return;
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <HistoryIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Analysis History</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review past resume evaluations, ATS scores, and keyword comparisons
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          New Evaluation
        </Link>
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="mt-6 mb-6">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title or resume name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs transition-all"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading your history...</div>
      ) : filteredAnalyses.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No evaluations found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            {searchTerm ? 'Try adjusting your search query.' : 'Run your first resume scan now.'}
          </p>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Analysis
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnalyses.map((analysis) => {
            const id = analysis._id || analysis.id;
            const score = analysis.overallScore || 0;
            let badgeColor = 'bg-red-50 text-red-700 border-red-200';
            if (score >= 80) badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            else if (score >= 60) badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';

            return (
              <div
                key={id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-sm transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {analysis.jobTitle || 'Software Role'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="font-medium text-slate-700">
                        {analysis.resumeName || 'Resume.pdf'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(analysis.createdAt).toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>{analysis.matchedKeywords?.length || 0} matched skills</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${badgeColor}`}>
                    {score}% ATS
                  </span>
                  <Link
                    to={`/report/${id}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    View Report
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
  );
};

export default History;
