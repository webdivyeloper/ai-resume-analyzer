const fs = require('fs');
const ResumeModel = require('../models/Resume');
const { extractTextAndSections } = require('../services/pdfService');

// Upload and parse PDF resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please upload a PDF resume.' });
    }

    const filePath = req.file.path;
    let parseResult;

    try {
      parseResult = await extractTextAndSections(filePath);
    } catch (parseErr) {
      return res.status(422).json({
        message: 'Could not extract text from this PDF. Please ensure the PDF is not password-protected or scanned image.',
        error: parseErr.message,
      });
    }

    const newResume = await ResumeModel.create({
      userId: req.user.id,
      originalFileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.path,
      extractedText: parseResult.text,
      sections: parseResult.sections,
      uploadStatus: 'processed',
    });

    return res.status(201).json({
      message: 'Resume uploaded and parsed successfully!',
      resume: newResume,
    });
  } catch (err) {
    console.error('Resume upload error:', err);
    return res.status(500).json({ message: 'Failed to process uploaded resume.' });
  }
};

// Get all resumes for current user
const getUserResumes = async (req, res) => {
  try {
    const resumes = await ResumeModel.find({ userId: req.user.id });
    return res.status(200).json({ resumes });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch resumes.' });
  }
};

// Get single resume
const getResumeById = async (req, res) => {
  try {
    const resume = await ResumeModel.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found.' });
    }
    if (resume.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to view this resume.' });
    }
    return res.status(200).json({ resume });
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving resume.' });
  }
};

// Delete resume
const deleteResume = async (req, res) => {
  try {
    const resume = await ResumeModel.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found.' });
    }
    if (resume.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to delete this resume.' });
    }

    if (resume.filePath && fs.existsSync(resume.filePath)) {
      try {
        fs.unlinkSync(resume.filePath);
      } catch (e) {
        console.warn('Could not delete physical file:', e.message);
      }
    }

    await ResumeModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Resume deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete resume.' });
  }
};

module.exports = {
  uploadResume,
  getUserResumes,
  getResumeById,
  deleteResume,
};
