import sqlite3

def run_dashboard():
    conn = sqlite3.connect('../data/job_tracker.db')
    cursor = conn.cursor()

    while True:
        print("\n📊 --- SQL INTERACTIVE METRIC PANEL ---")
        print("1. View ALL Active Applications Chronologically")
        print("2. Search for Specific Company or Role Keywords")
        print("3. View Clean Applications Only (Filter Missing Titles)")
        print("4. Get Total Application Count and Summary Metrics")
        print("5. Exit Panel")
        
        choice = input("\nSelect a metric view option (1-5): ").strip()
        
        if choice == '1':
            query = "SELECT application_date, company_name, role_title FROM applications WHERE status = 'Active' ORDER BY application_date DESC;"
        elif choice == '2':
            keyword = input("Enter keyword to match (e.g. 'Frontend', 'Pleo'): ").strip()
            # The '%' symbol in SQL means match anything before or after this string (Wildcard)
            query = f"SELECT application_date, company_name, role_title FROM applications WHERE company_name LIKE '%{keyword}%' OR role_title LIKE '%{keyword}%' ORDER BY application_date DESC;"
        elif choice == '3':
            # IS NOT filters out lines where our extraction logic couldn't automatically isolate a title
            query = "SELECT application_date, company_name, role_title FROM applications WHERE status = 'Active' AND role_title != 'Could not isolate job title automatically.' ORDER BY application_date DESC;"
        elif choice == '4':
            # COUNT(*) is an aggregate function that computes mathematical tallies on rows instantly
            print("\n📈 Running Table Aggregations...")
            cursor.execute("SELECT COUNT(*) FROM applications;")
            total = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM applications WHERE status = 'Active';")
            active = cursor.fetchone()[0]
            print("-" * 50)
            print(f"📦 Total Historical Logged Entries: {total}")
            print(f"🔥 Current Active In-Flight Funnel : {active}")
            print("-" * 50)
            continue
        elif choice == '5':
            print("🔌 Closing connection. Goodbye!")
            break
        else:
            print("❌ Invalid input option.")
            continue

        print("\n🔍 Running SQL Statement against 'job_tracker.db'...")
        print("-" * 80)
        cursor.execute(query)
        rows = cursor.fetchall()
        
        if not rows:
            print("📭 No matching records found for that SQL condition.")
        for row in rows:
            print(f"📅 {row[0]} | 🏢 {row[1]:<30} | 💼 {row[2]}")
        print("-" * 80)
        print(f"🎉 Engine fetched {len(rows)} rows successfully.")

    conn.close()

if __name__ == '__main__':
    run_dashboard()