const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataDir = path.join(__dirname, '../../data');
const dbFile = path.join(dataDir, 'db.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const defaultData = {
  users: [],
  resumes: [],
  jobDescriptions: [],
  analyses: [],
};

const readDB = () => {
  try {
    if (!fs.existsSync(dbFile)) {
      fs.writeFileSync(dbFile, JSON.stringify(defaultData, null, 2));
      return { ...defaultData };
    }
    const raw = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local db file:', err.message);
    return { ...defaultData };
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing local db file:', err.message);
  }
};

const createLocalModel = (collectionName) => {
  return {
    async find(query = {}) {
      const db = readDB();
      let items = db[collectionName] || [];
      return items.filter((item) => {
        for (const [key, val] of Object.entries(query)) {
          if (item[key] !== val) return false;
        }
        return true;
      });
    },

    async findOne(query = {}) {
      const db = readDB();
      const items = db[collectionName] || [];
      const found = items.find((item) => {
        for (const [key, val] of Object.entries(query)) {
          if (item[key] !== val) return false;
        }
        return true;
      });
      return found || null;
    },

    async findById(id) {
      const db = readDB();
      const items = db[collectionName] || [];
      return items.find((item) => item._id === id || item.id === id) || null;
    },

    async create(doc) {
      const db = readDB();
      if (!db[collectionName]) db[collectionName] = [];
      const newDoc = {
        _id: crypto.randomUUID(),
        ...doc,
        createdAt: doc.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db[collectionName].push(newDoc);
      writeDB(db);
      return newDoc;
    },

    async findByIdAndUpdate(id, update, options = {}) {
      const db = readDB();
      const items = db[collectionName] || [];
      const index = items.findIndex((item) => item._id === id || item.id === id);
      if (index === -1) return null;
      items[index] = {
        ...items[index],
        ...update,
        updatedAt: new Date().toISOString(),
      };
      writeDB(db);
      return items[index];
    },

    async findByIdAndDelete(id) {
      const db = readDB();
      const items = db[collectionName] || [];
      const item = items.find((i) => i._id === id || i.id === id);
      db[collectionName] = items.filter((i) => i._id !== id && i.id !== id);
      writeDB(db);
      return item || null;
    },

    async countDocuments(query = {}) {
      const results = await this.find(query);
      return results.length;
    },
  };
};

module.exports = {
  createLocalModel,
  readDB,
  writeDB,
};

