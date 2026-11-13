const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  createAnalysis,
  getUserAnalyses,
  getAnalysisById,
  deleteAnalysis,
  getSampleJobTemplates,
} = require('../controllers/analysisController');

router.get('/sample-templates', getSampleJobTemplates);
router.post('/', authMiddleware, upload.single('resume'), createAnalysis);
router.get('/', authMiddleware, getUserAnalyses);
router.get('/:id', authMiddleware, getAnalysisById);
router.delete('/:id', authMiddleware, deleteAnalysis);

module.exports = router;
