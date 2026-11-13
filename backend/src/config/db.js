const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_resume_analyzer';
  try {
    mongoose.set('strictQuery', false);
    // Attempt connection with short timeout so it doesn't block startup if MongoDB is not running locally
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully to ${uri}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[Database] MongoDB not reachable at ${uri}. Running in Auto-Local JSON Store mode.`);
    console.warn(`[Database] All data is saved persistently in backend/data/db.json.`);
  }
};

const getMongoStatus = () => isMongoConnected;

module.exports = {
  connectDB,
  getMongoStatus,
};

