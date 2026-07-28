import sqlite3
import json
import os

# Calculate paths relative to project root
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(PROJECT_ROOT, 'data')

db_path = os.path.join(DATA_DIR, 'job_tracker.db')
json_path = os.path.join(DATA_DIR, 'jobs_database.json')

def migrate():
    if not os.path.exists(json_path):
        print(f"⚠️  No JSON file found at {json_path}. Skipping migration.")
        return

    # Ensure data directory exists
    os.makedirs(DATA_DIR, exist_ok=True)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # --- CREATE TABLE IF IT DOES NOT EXIST ---
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id TEXT PRIMARY KEY,
            company_name TEXT NOT NULL,
            role_title TEXT NOT NULL,
            status TEXT NOT NULL,
            application_date TEXT
        )
    ''')

    with open(json_path, 'r') as f:
        jobs = json.load(f)

    for job in jobs:
        company = job.get('company', 'Unknown Company')
        role = job.get('role', 'Role Not Specified')
        date = job.get('date')
        
        # Normalize status so 'Active' -> 'applied' and 'Archived' -> 'rejected'
        raw_status = job.get('status', 'applied').lower()
        if raw_status == 'active':
            status = 'applied'
        elif raw_status == 'archived':
            status = 'rejected'
        else:
            status = raw_status

        cursor.execute('''
            INSERT OR REPLACE INTO applications (id, company_name, role_title, status, application_date)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            job.get('id'),
            company,
            role,
            status,
            date
        ))

    conn.commit()
    conn.close()
    print("✅ Data migrated successfully into job_tracker.db!")

if __name__ == '__main__':
    migrate()