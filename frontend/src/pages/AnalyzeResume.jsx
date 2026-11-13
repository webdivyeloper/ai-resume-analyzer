import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createAnalysisApi,
  getResumesApi,
  getSampleTemplatesApi,
} from '../services/api';
import {
  Upload,
  FileText,
  AlertCircle,
  FileCheck2,
  Trash2,
  ArrowRight,
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
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getResumesApi()
      .then((res) => {
        const list = res.data?.resumes || [];
        setResumes(list);
        if (list.length > 0) {
          setSelectedResumeId(list[0]._id || list[0].id);
        }
      })
      .catch((e) => console.warn(e));

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
      setError('Invalid file type. Please provide a standard PDF document.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB maximum limit.');
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
      setError('Please select or drag a PDF resume file.');
      return;
    }

    if (sourceMode === 'select' && !selectedResumeId) {
      setError('Please select an existing resume from your locker.');
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      setError('Job description must be at least 20 characters.');
      return;
    }

    setLoading(true);
    setStatusMessage('Extracting PDF text and parsing structural sections...');

    const timer1 = setTimeout(() => {
      setStatusMessage('Extracting target qualifications & computing keyword overlap...');
    }, 800);

    const timer2 = setTimeout(() => {
      setStatusMessage('Calculating category ATS scores & compiling evaluation report...');
    }, 1600);

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

      clearTimeout(timer1);
      clearTimeout(timer2);
      const analysisId = res.data?.analysis?._id || res.data?.analysis?.id;
      navigate(`/report/${analysisId}`);
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setError(err.response?.data?.message || 'Processing failed. Please check the file and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800">
      <div className="mb-6 pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Resume Analysis & ATS Matcher
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload a candidate PDF resume and match against target job description requirements
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center max-w-md mx-auto my-12">
          <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-sm font-semibold text-slate-900 mb-1">Processing Analysis</h2>
          <p className="text-xs text-slate-500 mb-4">{statusMessage}</p>
          <div className="w-full bg-slate-100 h-1.5 rounded overflow-hidden">
            <div className="bg-slate-900 h-full w-2/3 animate-pulse"></div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Col: Resume Selection */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Step 1: Candidate Resume (PDF)
                  </h2>

                  {resumes.length > 0 && (
                    <div className="flex gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setSourceMode('upload')}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          sourceMode === 'upload' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Upload New
                      </button>
                      <button
                        type="button"
                        onClick={() => setSourceMode('select')}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          sourceMode === 'select' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        From Locker ({resumes.length})
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
                      className={`border border-dashed rounded p-6 text-center transition-colors ${
                        dragActive
                          ? 'border-slate-800 bg-slate-50'
                          : file
                          ? 'border-emerald-600 bg-emerald-50/20'
                          : 'border-slate-300 bg-slate-50/40 hover:bg-slate-50'
                      }`}
                    >
                      {file ? (
                        <div className="flex flex-col items-center">
                          <FileCheck2 className="w-8 h-8 text-emerald-700 mb-2" />
                          <p className="text-xs font-bold text-slate-900">{file.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {Math.round(file.size / 1024)} KB
                          </p>
                          <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="mt-3 text-xs text-rose-600 hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove File
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                          <p className="text-xs font-medium text-slate-700">
                            Drag and drop PDF resume here
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Standard PDF format up to 5MB
                          </p>
                          <label className="mt-3 inline-block px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer transition-colors">
                            Select Local File
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
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                      Select From Repository:
                    </label>
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-slate-300 text-xs bg-white focus:outline-none focus:border-slate-800"
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

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Machine text must be selectable for accurate extraction.
              </div>
            </div>

            {/* Right Col: Target Job Description */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Step 2: Target Job Description
                  </h2>
                </div>

                {templates.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Preset Job Descriptions:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {templates.map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => applyTemplate(tpl)}
                          className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                        >
                          {tpl.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wide mb-1">
                      Target Role / Job Title
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Software Development Engineer"
                      className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wide mb-1">
                      Job Description Text & Requirements
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste responsibilities, required programming languages, tools, frameworks, and qualifications..."
                      className="w-full px-3 py-2 rounded border border-slate-300 text-xs leading-relaxed focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
                <span>Input Length: {jobDescription.length} characters</span>
                <span>Minimum: 20 chars</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              Run ATS Analysis
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AnalyzeResume;
