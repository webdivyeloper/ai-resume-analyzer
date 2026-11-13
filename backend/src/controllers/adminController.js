const UserModel = require('../models/User');
const ResumeModel = require('../models/Resume');
const AnalysisModel = require('../models/Analysis');

// Get overall system stats
const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalResumes = await ResumeModel.countDocuments();
    const totalAnalyses = await AnalysisModel.countDocuments();

    const analyses = await AnalysisModel.find();
    let avgScore = 0;
    if (analyses.length > 0) {
      const sum = analyses.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
      avgScore = Math.round(sum / analyses.length);
    }

    return res.status(200).json({
      stats: {
        totalUsers,
        totalResumes,
        totalAnalyses,
        averageAtsScore: avgScore,
      },
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ message: 'Failed to retrieve administrative statistics.' });
  }
};

// Get all registered users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    const safeUsers = users.map((u) => ({
      id: u._id || u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }));
    return res.status(200).json({ users: safeUsers });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve users.' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Administrators cannot delete their own account.' });
    }

    await UserModel.findByIdAndDelete(id);
    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete user.' });
  }
};

module.exports = {
  getSystemStats,
  getAllUsers,
  deleteUser,
};

