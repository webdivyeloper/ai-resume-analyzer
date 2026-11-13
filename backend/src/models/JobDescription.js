const mongoose = require('mongoose');
const { getMongoStatus } = require('../config/db');
const { createLocalModel } = require('../config/localStore');

const jobDescriptionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    rawText: { type: String, required: true },
    extractedKeywords: { type: [String], default: [] },
  },
  { timestamps: true }
);

const MongoJD = mongoose.models.JobDescription || mongoose.model('JobDescription', jobDescriptionSchema);
const LocalJD = createLocalModel('jobDescriptions');

const JobDescriptionModel = {
  async find(query = {}) {
    return getMongoStatus() ? MongoJD.find(query).sort({ createdAt: -1 }).lean() : (await LocalJD.find(query)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  async findOne(query = {}) {
    return getMongoStatus() ? MongoJD.findOne(query).lean() : LocalJD.findOne(query);
  },
  async findById(id) {
    return getMongoStatus() ? MongoJD.findById(id).lean() : LocalJD.findById(id);
  },
  async create(data) {
    return getMongoStatus() ? MongoJD.create(data) : LocalJD.create(data);
  },
  async findByIdAndUpdate(id, update, opts = { new: true }) {
    return getMongoStatus() ? MongoJD.findByIdAndUpdate(id, update, opts).lean() : LocalJD.findByIdAndUpdate(id, update, opts);
  },
  async findByIdAndDelete(id) {
    return getMongoStatus() ? MongoJD.findByIdAndDelete(id).lean() : LocalJD.findByIdAndDelete(id);
  },
  async countDocuments(query = {}) {
    return getMongoStatus() ? MongoJD.countDocuments(query) : LocalJD.countDocuments(query);
  },
};

module.exports = JobDescriptionModel;

