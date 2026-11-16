import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createAnalysisApi,
  getResumesApi,
  getSampleTemplatesApi,
  loadSampleResumeApi,
} from '../services/api';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  FileCheck2,
  Trash2,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

const AnalyzeResume = () => {
  const navigate = useNavigate();

  const [sourceMode, setSourceMode] = useState('upload');
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [templates, setTemplates] = useState([]);

  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState('');
  const [loadingSampleResume, setLoadingSampleResume] = useState(false);

  const steps = [
    'Parsing PDF text stream & extracting metadata...',
    'Segmenting sections (Skills, Experience, Education)...',
    'Analyzing target job description qualifications...',
    'Computing ATS scores & actionable recommendations...',
  ];

  useEffect(() => {
    fetchResumes();
    getSampleTemplatesApi()
      .then((res) => {
        setTemplates(res.data?.templates || []);
      })
      .catch((e) => console.warn(e));
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await getResumesApi();
      const list = res.data?.resumes || [];
      setResumes(list);
      if (list.length > 0 && !selectedResumeId) {
        setSelectedResumeId(list[0]._id || list[0].id);
      }
    } catch (e) {
      console.warn('Could not load existing resumes', e);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Invalid file type. Please upload a standard PDF file.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB maximum limit.');
      return;
    }
    setFile(selectedFile);
  };

  const handleLoadSampleResume = async () => {
    setLoadingSampleResume(true);
    setError('');
    try {
      const res = await loadSampleResumeApi();
      const newResume = res.data?.resume;
      await fetchResumes();
      setSelectedResumeId(newResume._id || newResume.id);
      setSourceMode('select');
      if (!jobTitle && templates.length > 0) {
        applyTemplate(templates[0]);
      }
    } catch (e) {
      setError('Could not load sample resume: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoadingSampleResume(false);
    }
  };

  const applyTemplate = (template) => {
    setJobTitle(template.title);
    setJobDescription(template.description);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (sourceMode === 'upload' && !file) {
      setError('Please select or drag a PDF resume file.');
      return;
    }

    if (sourceMode === 'select' && !selectedResumeId) {
      setError('Please select an existing resume from your locker.');
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      setError('Please provide a target job description of at least 20 characters.');
      return;
    }

    setLoading(true);
    setProgressStep(0);

    const stepInterval = setInterval(() => {
      setProgressStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);

    try {
      const formData = new FormData();
      if (sourceMode === 'upload') {
        formData.append('resume', file);
      } else {
        formData.append('resumeId', selectedResumeId);
      }

      formData.append('jobTitle', jobTitle || 'Target Position');
      formData.append('jobDescription', jobDescription);
      formData.append('jobDescriptionText', jobDescription);

      const res = await createAnalysisApi(formData);

      if (sourceMode === 'upload') {
        fetchResumes();
      }

      clearInterval(stepInterval);
      const analysisId = res.data?.analysis?._id || res.data?.analysis?.id;
      navigate(`/report/${analysisId}`);
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.response?.data?.message || 'Processing failed. Please check input and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 theme-text-main transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b theme-border gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black theme-text-main tracking-tight">
            Analyze Resume & Match Job
          </h1>
          <p className="text-xs theme-text-muted mt-1">
            Compare candidate PDF against job requirements to evaluate ATS score and keyword gaps
          </p>
        </div>

        {/* 1-Click Demo Evaluation */}
        <button
          type="button"
          disabled={loadingSampleResume}
          onClick={handleLoadSampleResume}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-700/60 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          {loadingSampleResume ? 'Loading Sample...' : 'Quick Demo: Load Sample Resume'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="theme-card rounded-3xl border p-10 text-center max-w-lg mx-auto my-12">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-950 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
          </div>
          <h3 className="text-lg font-bold theme-text-main mb-2">Analyzing Resume...</h3>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-6 transition-all">
            {steps[progressStep]}
          </p>

          <div className="w-full theme-card-subtle h-2.5 rounded-full overflow-hidden border theme-border">
            <div
              className="bg-gradient-to-r from-indigo-600 to-violet-600 h-full transition-all duration-700 ease-out"
              style={{ width: `${((progressStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs theme-text-muted mt-4">Evaluating against modern ATS algorithms...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Step 1: Resume Selection */}
            <div className="theme-card p-6 rounded-2xl border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b theme-border">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-sm font-bold theme-text-main">Candidate Resume (PDF)</h2>
                  </div>

                  {resumes.length > 0 && (
                    <div className="flex gap-1 p-0.5 rounded-lg theme-card-subtle border theme-border text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setSourceMode('upload')}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          sourceMode === 'upload' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'theme-text-muted hover:theme-text-main'
                        }`}
                      >
                        Upload New
                      </button>
                      <button
                        type="button"
                        onClick={() => setSourceMode('select')}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          sourceMode === 'select' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'theme-text-muted hover:theme-text-main'
                        }`}
                      >
                        Locker ({resumes.length})
                      </button>
                    </div>
                  )}
                </div>

                {sourceMode === 'upload' ? (
                  <div>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                        dragActive
                          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                          : file
                          ? 'border-emerald-500/60 bg-emerald-500/10'
                          : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-slate-50/50 dark:bg-[#0f172a]/60'
                      }`}
                    >
                      {file ? (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                            <FileCheck2 className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-bold theme-text-main">{file.name}</p>
                          <p className="text-xs theme-text-muted font-mono mt-1">
                            {Math.round(file.size / 1024)} KB • Ready for extraction
                          </p>
                          <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="mt-3 text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-bold theme-text-main">
                            Drag & drop your PDF resume here
                          </p>
                          <p className="text-xs theme-text-muted mt-1">Supports standard PDF format up to 5MB</p>
                          <label className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-700/60 cursor-pointer transition-colors shadow-sm">
                            <FileText className="w-3.5 h-3.5" />
                            Choose PDF File
                            <input
                              type="file"
                              accept=".pdf,application/pdf"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold theme-text-main uppercase tracking-wider mb-2">
                      Select Previously Uploaded Resume:
                    </label>
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border theme-input text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                    >
                      {resumes.map((r) => (
                        <option key={r._id || r.id} value={r._id || r.id}>
                          {r.originalFileName} ({new Date(r.createdAt).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t theme-border flex items-center justify-between text-xs theme-text-muted">
                <span>OCR Note: Machine text must be readable in PDF</span>
              </div>
            </div>

            {/* Step 2: Target Job Description */}
            <div className="theme-card p-6 rounded-2xl border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b theme-border">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-violet-50 dark:bg-violet-950/80 border border-violet-200 dark:border-violet-700/50 text-violet-700 dark:text-violet-300 font-black text-xs flex items-center justify-center">
                      2
                    </span>
                    <h2 className="text-sm font-bold theme-text-main">Target Job Description</h2>
                  </div>
                </div>

                {templates.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[11px] font-bold theme-text-muted uppercase tracking-wider block mb-1.5">
                      1-Click Preset Roles:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {templates.map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => applyTemplate(tpl)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold theme-card-subtle hover:border-indigo-500 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border theme-border transition-colors cursor-pointer"
                        >
                          {tpl.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold theme-text-main uppercase tracking-wider mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full px-3.5 py-2 rounded-xl border theme-input text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold theme-text-main uppercase tracking-wider mb-1">
                      Job Description Text
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste required skills, languages, qualifications, and responsibilities..."
                      className="w-full px-3.5 py-2.5 rounded-xl border theme-input text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t theme-border flex items-center justify-between text-xs theme-text-muted">
                <span>{jobDescription.length} characters</span>
                <span className={jobDescription.length >= 20 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''}>
                  {jobDescription.length >= 20 ? '✔ Valid Input' : 'Min. 20 chars'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Run ATS Analysis & Generate Report
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AnalyzeResume;
