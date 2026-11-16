const AnalysisModel = require('../models/Analysis');
const ResumeModel = require('../models/Resume');
const JobDescriptionModel = require('../models/JobDescription');
const { extractKeywords } = require('../services/nlpService');
const { analyzeResumeWithAI } = require('../services/aiService');
const { extractTextAndSections } = require('../services/pdfService');

// Create a new analysis
const createAnalysis = async (req, res) => {
  try {
    const { resumeId, jobTitle } = req.body;
    const jobDescriptionText = (req.body.jobDescriptionText || req.body.jobDescription || req.body.rawText || '').trim();

    if (!jobDescriptionText || jobDescriptionText.length < 20) {
      return res.status(400).json({
        message: 'Job description is required and should be at least 20 characters.',
      });
    }

    let targetResume = null;

    // Check if a direct file was uploaded in this request
    if (req.file) {
      try {
        const parseResult = await extractTextAndSections(req.file.path);
        targetResume = await ResumeModel.create({
          userId: req.user.id,
          originalFileName: req.file.originalname,
          fileType: req.file.mimetype,
          fileSize: req.file.size,
          filePath: req.file.path,
          extractedText: parseResult.text,
          sections: parseResult.sections,
          uploadStatus: 'processed',
        });
      } catch (parseErr) {
        return res.status(422).json({
          message: 'Failed to extract text from the uploaded PDF resume: ' + parseErr.message,
        });
      }
    } else if (resumeId) {
      targetResume = await ResumeModel.findById(resumeId);
      if (!targetResume) {
        return res.status(404).json({ message: 'Selected resume not found.' });
      }
    } else {
      return res.status(400).json({ message: 'Please provide either a resumeId or upload a PDF resume file.' });
    }

    // Extract keywords from Job Description
    const jdKeywords = extractKeywords(jobDescriptionText);

    // Save Job Description
    const cleanJobTitle = jobTitle && jobTitle.trim() ? jobTitle.trim() : 'Software Developer';
    const jdRecord = await JobDescriptionModel.create({
      userId: req.user.id,
      title: cleanJobTitle,
      rawText: jobDescriptionText,
      extractedKeywords: jdKeywords,
    });

    // Run AI & ATS Analysis
    const analysisResult = await analyzeResumeWithAI(
      targetResume,
      jobDescriptionText,
      cleanJobTitle
    );

    // Save Analysis Record
    const newAnalysis = await AnalysisModel.create({
      userId: req.user.id,
      resumeId: targetResume._id || targetResume.id,
      jobDescriptionId: jdRecord._id || jdRecord.id,
      jobTitle: cleanJobTitle,
      resumeName: targetResume.originalFileName || 'Resume.pdf',
      overallScore: analysisResult.overallScore,
      categoryScores: analysisResult.categoryScores,
      matchedKeywords: analysisResult.matchedKeywords,
      missingKeywords: analysisResult.missingKeywords,
      strengths: analysisResult.strengths,
      issues: analysisResult.issues,
      recommendations: analysisResult.recommendations,
      aiMetadata: analysisResult.aiMetadata,
    });

    return res.status(201).json({
      message: 'Analysis completed successfully!',
      analysis: newAnalysis,
    });
  } catch (err) {
    console.error('Analysis creation error:', err);
    return res.status(500).json({ message: 'Failed to process resume analysis.' });
  }
};

// Get all analyses for the current user (History)
const getUserAnalyses = async (req, res) => {
  try {
    const analyses = await AnalysisModel.find({ userId: req.user.id });
    return res.status(200).json({ analyses });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch analysis history.' });
  }
};

// Get single analysis by ID
const getAnalysisById = async (req, res) => {
  try {
    const analysis = await AnalysisModel.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis report not found.' });
    }

    // Enforce FR-7.4: Users shall only access their own analysis records (unless admin)
    if (analysis.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: You do not own this analysis report.' });
    }

    // Also fetch associated resume details if available
    let resume = null;
    if (analysis.resumeId) {
      resume = await ResumeModel.findById(analysis.resumeId);
    }

    return res.status(200).json({
      analysis,
      resume: resume
        ? {
            id: resume._id || resume.id,
            originalFileName: resume.originalFileName,
            sections: resume.sections,
            extractedText: resume.extractedText,
          }
        : null,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving analysis.' });
  }
};

// Delete analysis
const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await AnalysisModel.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found.' });
    }
    if (analysis.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    await AnalysisModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Analysis deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete analysis.' });
  }
};

// Preset job description templates for quick testing & demonstration
const getSampleJobTemplates = async (req, res) => {
  const templates = [
    {
      id: 'fullstack',
      title: 'Full Stack MERN Developer',
      description: `We are looking for a passionate Full Stack Developer to build modern web applications.
Responsibilities:
- Build responsive frontend user interfaces using React, HTML5, CSS3, and modern JavaScript / TypeScript.
- Design and develop scalable RESTful APIs with Node.js and Express.js.
- Work with databases including MongoDB, PostgreSQL, or MySQL.
- Deploy applications using Docker and AWS cloud services in a CI/CD environment.
- Collaborate with agile cross-functional teams and participate in code reviews.
Requirements:
- Strong problem solving skills and solid foundation in Data Structures and Algorithms.
- Experience with Git, GitHub, testing frameworks (Jest), and Agile Scrum methodology.`,
    },
    {
      id: 'data-scientist',
      title: 'AI / Data Science Engineer',
      description: `Seeking a talented Data Scientist / Machine Learning Engineer.
Responsibilities:
- Develop predictive machine learning models and NLP pipelines using Python, Pandas, NumPy, Scikit-Learn, and PyTorch.
- Conduct deep exploratory data analysis and build interactive dashboards using Tableau or Power BI.
- Deploy ML models to production REST APIs using FastAPI or Flask and Docker.
Requirements:
- Bachelor's or Master's degree in Computer Science, Data Science, or related quantitative field.
- Strong understanding of deep learning, NLP, and statistical modeling.`,
    },
    {
      id: 'frontend',
      title: 'Frontend React Engineer',
      description: `Join our team as a Frontend React Engineer.
Responsibilities:
- Architect and develop high-performance web applications using React, Next.js, Redux, and Tailwind CSS.
- Translate Figma designs into pixel-perfect, accessible, and responsive code.
- Optimize frontend bundle size and web performance vitals.
Requirements:
- 1+ years experience in JavaScript, TypeScript, React, and CSS animations.
- Familiarity with REST APIs, GraphQL, and modern CI/CD tooling.`,
    },
  ];

  return res.status(200).json({ templates });
};

module.exports = {
  createAnalysis,
  getUserAnalyses,
  getAnalysisById,
  deleteAnalysis,
  getSampleJobTemplates,
};
