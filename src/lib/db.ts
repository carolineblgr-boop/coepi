import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Dynamically resolves to <your-project-root>/data/job_tracker.db
const dbPath = path.resolve(process.cwd(), 'data/job_tracker.db');

if (!fs.existsSync(dbPath)) {
  console.error(`❌ SQLite DB file NOT found at: ${dbPath}`);
} else {
  console.log(`✅ SQLite DB file successfully connected at: ${dbPath}`);
}

export const db = new Database(dbPath);