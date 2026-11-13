const mongoose = require('mongoose');
const { getMongoStatus } = require('../config/db');
const { createLocalModel } = require('../config/localStore');

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    originalFileName: { type: String, required: true },
    fileType: { type: String, default: 'application/pdf' },
    fileSize: { type: Number, default: 0 },
    filePath: { type: String },
    extractedText: { type: String, default: '' },
    sections: {
      summary: { type: String, default: '' },
      skills: { type: [String], default: [] },
      education: { type: [String], default: [] },
      experience: { type: [String], default: [] },
      projects: { type: [String], default: [] },
      certifications: { type: [String], default: [] },
    },
    uploadStatus: { type: String, enum: ['pending', 'processed', 'failed'], default: 'processed' },
  },
  { timestamps: true }
);

const MongoResume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
const LocalResume = createLocalModel('resumes');

const ResumeModel = {
  async find(query = {}) {
    return getMongoStatus() ? MongoResume.find(query).sort({ createdAt: -1 }).lean() : (await LocalResume.find(query)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  async findOne(query = {}) {
    return getMongoStatus() ? MongoResume.findOne(query).lean() : LocalResume.findOne(query);
  },
  async findById(id) {
    return getMongoStatus() ? MongoResume.findById(id).lean() : LocalResume.findById(id);
  },
  async create(data) {
    return getMongoStatus() ? MongoResume.create(data) : LocalResume.create(data);
  },
  async findByIdAndUpdate(id, update, opts = { new: true }) {
    return getMongoStatus() ? MongoResume.findByIdAndUpdate(id, update, opts).lean() : LocalResume.findByIdAndUpdate(id, update, opts);
  },
  async findByIdAndDelete(id) {
    return getMongoStatus() ? MongoResume.findByIdAndDelete(id).lean() : LocalResume.findByIdAndDelete(id);
  },
  async countDocuments(query = {}) {
    return getMongoStatus() ? MongoResume.countDocuments(query) : LocalResume.countDocuments(query);
  },
};

module.exports = ResumeModel;
