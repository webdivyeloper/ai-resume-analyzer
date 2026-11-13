const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const {
  getSystemStats,
  getAllUsers,
  deleteUser,
} = require('../controllers/adminController');

router.get('/stats', authMiddleware, adminOnly, getSystemStats);
router.get('/users', authMiddleware, adminOnly, getAllUsers);
router.delete('/users/:id', authMiddleware, adminOnly, deleteUser);

module.exports = router;
