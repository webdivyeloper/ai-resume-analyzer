import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createAnalysisApi,
  getResumesApi,
  getSampleTemplatesApi,
} from '../services/api';
import {
  UploadCloud,
  FileText,
  Briefcase,
  Sparkles,
  AlertCircle,
  CheckCircle,
  FileCheck2,
  Trash2,
  ListFilter,
  ArrowRight,
} from 'lucide-react';

const AnalyzeResume = () => {
  const navigate = useNavigate();

  // Mode: upload new file or select existing
  const [sourceMode, setSourceMode] = useState('upload'); // 'upload' | 'select'
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');

  // File state
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Job Description state
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [templates, setTemplates] = useState([]);

  // Processing state
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState('');

  const steps = [
    'Validating PDF & extracting text...',
    'Identifying resume sections (Skills, Experience, Education)...',
    'Analyzing target job description keywords...',
    'Calculating ATS scores & generating AI recommendations...',
  ];

  useEffect(() => {
    // Fetch user's existing resumes
    getResumesApi()
      .then((res) => {
        const list = res.data?.resumes || [];
        setResumes(list);
        if (list.length > 0) {
          setSelectedResumeId(list[0]._id || list[0].id);
        }
      })
      .catch((e) => console.warn(e));

    // Fetch preset sample job templates
    getSampleTemplatesApi()
      .then((res) => {
        setTemplates(res.data?.templates || []);
      })
      .catch((e) => console.warn(e));
  }, []);

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
      setError('File is too large. Maximum size is 5MB.');
      return;
    }
    setFile(selectedFile);
  };

  const applyTemplate = (template) => {
    setJobTitle(template.title);
    setJobDescription(template.description);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (sourceMode === 'upload' && !file) {
      setError('Please upload a PDF resume file.');
      return;
    }

    if (sourceMode === 'select' && !selectedResumeId) {
      setError('Please select an existing resume from your locker.');
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      setError('Please enter a target job description (at least 20 characters).');
      return;
    }

    setLoading(true);
    setProgressStep(0);

    const stepInterval = setInterval(() => {
      setProgressStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 700);

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
      setError(err.response?.data?.message || 'Failed to process resume analysis.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Analyze Resume & Match Job
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload your resume PDF and match it against any job description to evaluate ATS compatibility.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-10 text-center max-w-xl mx-auto my-12">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Analyzing Resume...</h3>
          <p className="text-sm font-medium text-blue-600 mb-6 transition-all">
            {steps[progressStep]}
          </p>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-700 ease-out"
              style={{ width: `${((progressStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-3">This normally takes just a few seconds.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Step 1: Resume Upload / Select */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center">
                      1
                    </div>
                    <h2 className="text-base font-bold text-slate-900">Candidate Resume (PDF)</h2>
                  </div>

                  {resumes.length > 0 && (
                    <div className="flex gap-1 p-0.5 rounded-lg bg-slate-100 text-xs font-medium">
                      <button
                        type="button"
                        onClick={() => setSourceMode('upload')}
                        className={`px-2.5 py-1 rounded-md transition-colors ${
                          sourceMode === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Upload PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => setSourceMode('select')}
                        className={`px-2.5 py-1 rounded-md transition-colors ${
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
                          ? 'border-blue-500 bg-blue-50/50'
                          : file
                          ? 'border-emerald-300 bg-emerald-50/30'
                          : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
                      }`}
                    >
                      {file ? (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                            <FileCheck2 className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-bold text-slate-900">{file.name}</p>
                          <p className="text-xs text-slate-500 mt-1">
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
                          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-semibold text-slate-700">
                            Drag & drop your resume PDF here
                          </p>
                          <p className="text-xs text-slate-500 mt-1">Supports PDF format up to 5MB</p>
                          <label className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors">
                            <FileText className="w-3.5 h-3.5" />
                            Browse Files
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
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Select Previously Uploaded Resume:
                    </label>
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm bg-white"
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

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>ATS Tip: Ensure text in PDF is selectable.</span>
              </div>
            </div>

            {/* Step 2: Target Job Description */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Target Job Description</h2>
                </div>

                {/* Templates quick selector */}
                {templates.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Quick Templates (1-Click Fill):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {templates.map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => applyTemplate(tpl)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors"
                        >
                          {tpl.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Job Title / Role
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Job Description & Requirements
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description, required skills, tools, and qualifications here..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{jobDescription.length} characters</span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/25 transition-all hover:scale-105 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              Evaluate & Generate ATS Report
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AnalyzeResume;
