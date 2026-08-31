const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/db.json');
const seedFilePath = path.join(__dirname, '../data/seedData.json');

// Initialize database file from seed data if not present
function getDbData() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      const seedRaw = fs.readFileSync(seedFilePath, 'utf-8');
      fs.writeFileSync(dataFilePath, seedRaw, 'utf-8');
      return JSON.parse(seedRaw);
    }
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading database file:', error);
    const seedRaw = fs.readFileSync(seedFilePath, 'utf-8');
    return JSON.parse(seedRaw);
  }
}

function saveDbData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving database file:', error);
    return false;
  }
}

module.exports = {
  getDbData,
  saveDbData
};
