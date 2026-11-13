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
    'Parsing PDF text stream & sanitizing data...',
    'Identifying resume sections (Skills, Experience, Education)...',
    'Analyzing target job description qualifications...',
    'Generating category scores & actionable recommendations...',
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
      console.warn(e);
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
      setError('Could not load sample resume: ' + e.message);
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
      setError('Please enter a target job description (minimum 20 characters).');
      return;
    }

    setLoading(true);
    setProgressStep(0);

    const stepInterval = setInterval(() => {
      setProgressStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 600);

    try {
      let res;
      if (sourceMode === 'upload') {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobTitle', jobTitle || 'Software Engineer');
        formData.append('jobDescriptionText', jobDescription);
        res = await createAnalysisApi(formData, true);
      } else {
        res = await createAnalysisApi({
          resumeId: selectedResumeId,
          jobTitle: jobTitle || 'Software Engineer',
          jobDescriptionText: jobDescription,
        });
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Analyze Resume & Match Job
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare candidate PDF against job requirements to evaluate ATS score and keyword gaps
          </p>
        </div>

        {/* 1-Click Demo Evaluation */}
        <button
          type="button"
          disabled={loadingSampleResume}
          onClick={handleLoadSampleResume}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all hover:scale-105 active:scale-95 shadow-xs"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-600" />
          {loadingSampleResume ? 'Loading Sample...' : 'Quick Demo: Load Sample Resume'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-10 text-center max-w-lg mx-auto my-12">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Analyzing Resume...</h3>
          <p className="text-sm font-semibold text-indigo-600 mb-6 transition-all">
            {steps[progressStep]}
          </p>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 to-violet-600 h-full transition-all duration-700 ease-out"
              style={{ width: `${((progressStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-4">Evaluating against modern ATS algorithms...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Step 1: Resume Selection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Candidate Resume (PDF)</h2>
                  </div>

                  {resumes.length > 0 && (
                    <div className="flex gap-1 p-0.5 rounded-lg bg-slate-100 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setSourceMode('upload')}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          sourceMode === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Upload New
                      </button>
                      <button
                        type="button"
                        onClick={() => setSourceMode('select')}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          sourceMode === 'select' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
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
                          ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                          : file
                          ? 'border-emerald-300 bg-emerald-50/20'
                          : 'border-slate-300 hover:border-indigo-400 bg-slate-50/40'
                      }`}
                    >
                      {file ? (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                            <FileCheck2 className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-bold text-slate-900">{file.name}</p>
                          <p className="text-xs text-slate-500 font-mono mt-1">
                            {Math.round(file.size / 1024)} KB • Ready for extraction
                          </p>
                          <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="mt-3 text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-bold text-slate-700">
                            Drag & drop your PDF resume here
                          </p>
                          <p className="text-xs text-slate-400 mt-1">Supports PDF format up to 5MB</p>
                          <label className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 cursor-pointer transition-colors border border-indigo-200">
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
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Select Previously Uploaded Resume:
                    </label>
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
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

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>OCR Note: Machine text must be readable in PDF</span>
              </div>
            </div>

            {/* Step 2: Target Job Description */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-700 font-black text-xs flex items-center justify-center">
                      2
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Target Job Description</h2>
                  </div>
                </div>

                {templates.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      1-Click Preset Roles:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {templates.map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => applyTemplate(tpl)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors"
                        >
                          {tpl.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Job Description Text
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste required skills, languages, qualifications, and responsibilities..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{jobDescription.length} characters</span>
                <span className={jobDescription.length >= 20 ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                  {jobDescription.length >= 20 ? '✔ Valid Input' : 'Min. 20 chars'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
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
