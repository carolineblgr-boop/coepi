import sqlite3
import json
import os

# Calculate paths relative to project root
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(PROJECT_ROOT, 'data')

db_path = os.path.join(DATA_DIR, 'job_tracker.db')
json_path = os.path.join(DATA_DIR, 'jobs_database.json') # Or wherever your JSON source lives

def migrate():
    if not os.path.exists(json_path):
        print(f"⚠️  No JSON file found at {json_path}. Skipping migration or add sample data.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    with open(json_path, 'r') as f:
        jobs = json.load(f)

    for job in jobs:
        cursor.execute('''
            INSERT OR REPLACE INTO applications (id, company_name, role_title, status, application_date)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            job.get('id'),
            job.get('company_name', 'Unknown Company'),
            job.get('role_title', 'Role Not Specified'),
            job.get('status', 'applied'),
            job.get('application_date')
        ))

    conn.commit()
    conn.close()
    print("✅ Data migrated successfully into job_tracker.db!")

if __name__ == '__main__':
    migrate()