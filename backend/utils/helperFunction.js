const crypto = require('crypto'); // CommonJS
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const csv = require('csv-parser');

async function generateSHA256Checksum(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

const readCSVToJsonFromRootFolder = async (filename) => {
  try {
    const csvFilePath = path.join(__dirname, '..', filename);

    console.log(`[INFO] Attempting to read CSV from: ${csvFilePath}`);

    // Check if file exists
    await fsPromises.access(csvFilePath, fs.constants.F_OK);

    const results = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          results.push(row);
        })
        .on('end', () => {
          console.log(`[SUCCESS] Successfully parsed ${results.length} rows from CSV`);
          resolve();
        })
        .on('error', (err) => {
          console.error(`[ERROR] Failed during CSV stream read: ${err.message}`);
          reject(err);
        });
    });

    return { success: true, data: results };
  } catch (err) {
    console.error(`[ERROR] Failed to read CSV file: ${err.message}`);
    return { success: false, error: `Failed to read CSV file: ${err.message}` };
  }
};

module.exports = { generateSHA256Checksum, readCSVToJsonFromRootFolder };