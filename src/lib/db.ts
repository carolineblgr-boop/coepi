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

function ensureSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL,
      role_title TEXT NOT NULL,
      status TEXT DEFAULT 'applied',
      application_date TEXT
    );
  `);

  const columns = db
    .prepare('PRAGMA table_info(applications)')
    .all() as Array<{ name: string }>;
  const existingColumns = new Set(columns.map((column) => column.name));

  const migrations: Array<[string, string]> = [
    ['salary', 'TEXT'],
    ['rating', 'INTEGER'],
    ['work_mode', 'TEXT'],
    ['url', 'TEXT'],
    ['description', 'TEXT'],
  ];

  for (const [columnName, columnType] of migrations) {
    if (!existingColumns.has(columnName)) {
      db.exec(`ALTER TABLE applications ADD COLUMN ${columnName} ${columnType}`);
      existingColumns.add(columnName);
    }
  }
}

ensureSchema();