import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAnalysesApi, getResumesApi } from '../services/api';
import {
  FileText,
  Upload,
  BarChart2,
  Clock,
  ArrowRight,
  ChevronRight,
  Database,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  const totalAnalyses = analyses.length;
  const totalResumes = resumes.length;
  const highestScore = analyses.length > 0 ? Math.max(...analyses.map((a) => a.overallScore || 0)) : 0;
  const averageScore =
    analyses.length > 0
      ? Math.round(analyses.reduce((acc, c) => acc + (c.overallScore || 0), 0) / analyses.length)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Candidate Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as <span className="font-semibold text-slate-700">{user?.name}</span> ({user?.email})
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5" />
          Analyze New Resume
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Total Analyses
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{totalAnalyses}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Stored job evaluations</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Highest Score
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">{highestScore}%</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Best match achieved</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Average ATS Score
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{averageScore}%</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Mean across all scans</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Resumes in Locker
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{totalResumes}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Parsed PDF documents</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Analyses (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Recent Evaluations
              </h2>
            </div>
            <Link
              to="/history"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View Full History
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading records...</div>
          ) : analyses.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              <p>No resume analyses performed yet.</p>
              <Link
                to="/analyze"
                className="mt-3 inline-block px-3 py-1.5 rounded bg-slate-900 text-white text-xs font-medium"
              >
                Start First Analysis
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {analyses.slice(0, 6).map((item) => {
                const id = item._id || item.id;
                const score = item.overallScore || 0;
                let scoreClass = 'text-rose-700 bg-rose-50 border-rose-200';
                if (score >= 75) scoreClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
                else if (score >= 55) scoreClass = 'text-amber-700 bg-amber-50 border-amber-200';

                return (
                  <div
                    key={id}
                    className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded bg-slate-100 text-slate-600 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">{item.jobTitle}</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {item.resumeName} • {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${scoreClass}`}>
                        {score}% ATS
                      </span>
                      <Link
                        to={`/report/${id}`}
                        className="px-2.5 py-1 rounded text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Resumes Locker (1 col) */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Parsed Resumes
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-xs text-slate-400">Loading files...</div>
          ) : resumes.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No resumes stored yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {resumes.slice(0, 5).map((r) => {
                const rid = r._id || r.id;
                return (
                  <div key={rid} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate font-medium text-slate-700">{r.originalFileName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono ml-2 flex-shrink-0">
                      {Math.round((r.fileSize || 0) / 1024)} KB
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="p-3 border-t border-slate-100 bg-slate-50/30">
            <Link
              to="/analyze"
              className="w-full block text-center py-1.5 px-3 rounded border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Upload New PDF
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
