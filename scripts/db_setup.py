import sqlite3
import os

# Calculate project root dynamically (one folder up from /scripts)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

# Path to data/ folder in project root
DATA_DIR = os.path.join(PROJECT_ROOT, 'data')
os.makedirs(DATA_DIR, exist_ok=True)

db_path = os.path.join(DATA_DIR, 'job_tracker.db')

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    status TEXT DEFAULT 'applied',
    application_date TEXT
)
''')

conn.commit()
conn.close()

print(f"✅ Database created successfully at: {db_path}")