const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  uploadResume,
  getUserResumes,
  getResumeById,
  deleteResume,
} = require('../controllers/resumeController');

router.post('/upload', authMiddleware, upload.single('resume'), uploadResume);
router.get('/', authMiddleware, getUserResumes);
router.get('/:id', authMiddleware, getResumeById);
router.delete('/:id', authMiddleware, deleteResume);

module.exports = router;
