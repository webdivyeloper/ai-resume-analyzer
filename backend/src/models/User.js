const mongoose = require('mongoose');
const { getMongoStatus } = require('../config/db');
const { createLocalModel } = require('../config/localStore');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

const MongoUser = mongoose.models.User || mongoose.model('User', userSchema);
const LocalUser = createLocalModel('users');

const UserModel = {
  async find(query = {}) {
    return getMongoStatus() ? MongoUser.find(query).lean() : LocalUser.find(query);
  },
  async findOne(query = {}) {
    return getMongoStatus() ? MongoUser.findOne(query).lean() : LocalUser.findOne(query);
  },
  async findById(id) {
    return getMongoStatus() ? MongoUser.findById(id).lean() : LocalUser.findById(id);
  },
  async create(data) {
    return getMongoStatus() ? MongoUser.create(data) : LocalUser.create(data);
  },
  async findByIdAndUpdate(id, update, opts = { new: true }) {
    return getMongoStatus() ? MongoUser.findByIdAndUpdate(id, update, opts).lean() : LocalUser.findByIdAndUpdate(id, update, opts);
  },
  async findByIdAndDelete(id) {
    return getMongoStatus() ? MongoUser.findByIdAndDelete(id).lean() : LocalUser.findByIdAndDelete(id);
  },
  async countDocuments(query = {}) {
    return getMongoStatus() ? MongoUser.countDocuments(query) : LocalUser.countDocuments(query);
  },
};

module.exports = UserModel;
