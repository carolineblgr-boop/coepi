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

cursor.execute('PRAGMA table_info(applications)')
columns = {row[1] for row in cursor.fetchall()}

for column_name, column_type in [
    ('salary', 'TEXT'),
    ('rating', 'INTEGER'),
    ('work_mode', 'TEXT'),
    ('url', 'TEXT'),
    ('description', 'TEXT'),
]:
    if column_name not in columns:
        cursor.execute(f'ALTER TABLE applications ADD COLUMN {column_name} {column_type}')
        columns.add(column_name)

conn.commit()
conn.close()

print(f"✅ Database created successfully at: {db_path}")