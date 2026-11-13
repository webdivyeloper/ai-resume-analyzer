const mongoose = require('mongoose');
const { getMongoStatus } = require('../config/db');
const { createLocalModel } = require('../config/localStore');

const analysisSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    resumeId: { type: String, required: true },
    jobDescriptionId: { type: String },
    jobTitle: { type: String, default: 'General Software Engineer' },
    resumeName: { type: String, default: 'Resume.pdf' },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    categoryScores: {
      skills: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      formatting: { type: Number, default: 0 },
    },
    matchedKeywords: { type: [String], default: [] },
    missingKeywords: { type: [String], default: [] },
    strengths: { type: [String], default: [] },
    issues: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
    aiMetadata: {
      provider: { type: String, default: 'Rule-Based NLP Engine' },
      model: { type: String, default: 'standard-nlp-v1' },
      processingStatus: { type: String, enum: ['completed', 'failed', 'pending'], default: 'completed' },
    },
  },
  { timestamps: true }
);

const MongoAnalysis = mongoose.models.Analysis || mongoose.model('Analysis', analysisSchema);
const LocalAnalysis = createLocalModel('analyses');

const AnalysisModel = {
  async find(query = {}) {
    return getMongoStatus() ? MongoAnalysis.find(query).sort({ createdAt: -1 }).lean() : (await LocalAnalysis.find(query)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  async findOne(query = {}) {
    return getMongoStatus() ? MongoAnalysis.findOne(query).lean() : LocalAnalysis.findOne(query);
  },
  async findById(id) {
    return getMongoStatus() ? MongoAnalysis.findById(id).lean() : LocalAnalysis.findById(id);
  },
  async create(data) {
    return getMongoStatus() ? MongoAnalysis.create(data) : LocalAnalysis.create(data);
  },
  async findByIdAndUpdate(id, update, opts = { new: true }) {
    return getMongoStatus() ? MongoAnalysis.findByIdAndUpdate(id, update, opts).lean() : LocalAnalysis.findByIdAndUpdate(id, update, opts);
  },
  async findByIdAndDelete(id) {
    return getMongoStatus() ? MongoAnalysis.findByIdAndDelete(id).lean() : LocalAnalysis.findByIdAndDelete(id);
  },
  async countDocuments(query = {}) {
    return getMongoStatus() ? MongoAnalysis.countDocuments(query) : LocalAnalysis.countDocuments(query);
  },
};

module.exports = AnalysisModel;

