require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

const { connectDB } = require('./config/db');
const UserModel = require('./models/User');

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'AI Resume Analyzer API',
    timestamp: new Date().toISOString(),
  });
});

// Seed default accounts if database is empty
const seedDefaultAccounts = async () => {
  try {
    const adminUser = await UserModel.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await UserModel.create({
        name: 'System Administrator',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('[Seed] Created default admin account: admin@example.com / admin123');
    }

    const demoUser = await UserModel.findOne({ email: 'user@example.com' });
    if (!demoUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      await UserModel.create({
        name: 'Demo Student',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'user',
      });
      console.log('[Seed] Created default user account: user@example.com / password123');
    }
  } catch (err) {
    console.warn('[Seed] Note: Account seeding check skipped:', err.message);
  }
};

// Global error handler (NFR-5.1)
app.use((err, req, res, next) => {
  console.error('Unhandled error caught:', err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'An unexpected internal server error occurred.',
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  await seedDefaultAccounts();

  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 AI Resume Analyzer Backend running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`===============================================`);
  });
};

startServer();

