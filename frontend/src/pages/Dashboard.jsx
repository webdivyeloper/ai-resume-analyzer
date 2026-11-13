import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAnalysesApi, getResumesApi } from '../services/api';
import {
  FileText,
  UploadCloud,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle,
  ExternalLink,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm mb-3">
            Candidate Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name || 'Candidate'} 👋
          </h1>
          <p className="mt-2 text-blue-100 text-sm max-w-xl">
            Track your ATS scores, optimize your resume against competitive job profiles, and review
            personalized recommendations.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-600 font-bold text-sm shadow-md hover:bg-blue-50 transition-all hover:scale-105"
        >
          <UploadCloud className="w-4 h-4" />
          Analyze New Resume
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Analyses</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalAnalyses}</p>
          <span className="text-xs text-slate-400 mt-1 block">Saved evaluations</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Highest Score</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
            {highestScore}%
          </p>
          <span className="text-xs text-slate-400 mt-1 block">Best candidate match</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Average Score</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-2">{averageScore}%</p>
          <span className="text-xs text-slate-400 mt-1 block">Across all scans</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Uploaded Resumes</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalResumes}</p>
          <span className="text-xs text-slate-400 mt-1 block">PDFs in repository</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Analyses (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Resume Analyses</h2>
              <p className="text-xs text-slate-500 mt-0.5">Your latest job matching reports</p>
            </div>
            <Link
              to="/history"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All ({totalAnalyses})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading analysis reports...</div>
          ) : analyses.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 mx-auto flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-700">No analyses performed yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Upload your first resume and compare it against any target job description.
              </p>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
              >
                Analyze First Resume
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.slice(0, 5).map((analysis) => {
                const id = analysis._id || analysis.id;
                const score = analysis.overallScore || 0;
                let badgeColor = 'bg-red-50 text-red-700 border-red-200';
                if (score >= 80) badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                else if (score >= 60) badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';

                return (
                  <div
                    key={id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">
                          {analysis.jobTitle || 'Target Position'}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                          <span>{analysis.resumeName || 'Resume.pdf'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(analysis.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
                        {score}% ATS
                      </div>
                      <Link
                        to={`/report/${id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 flex items-center gap-1 transition-colors"
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

        {/* Uploaded Resumes Quick Section (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Resumes</h2>
              <p className="text-xs text-slate-500 mt-0.5">Parsed files in your locker</p>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-slate-400">Loading resumes...</div>
          ) : resumes.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No resumes uploaded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.slice(0, 4).map((resume) => {
                const id = resume._id || resume.id;
                return (
                  <div
                    key={id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-xs font-medium text-slate-800 truncate">
                        {resume.originalFileName}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">
                      {Math.round((resume.fileSize || 0) / 1024)} KB
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/analyze"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload Another Resume
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
