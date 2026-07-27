import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 1. Define the shape of a row coming out of SQLite
interface DbRow {
  id: string;
  application_date: string;
  company_name: string;
  role_title: string;
  status: string;
}

export async function GET() {
  try {
    // 2. Pass <DbRow> to .all() so TypeScript knows what type 'rows' is
    const rows = db.prepare('SELECT id, application_date, company_name, role_title, status FROM applications').all() as DbRow[];

    // 3. Now 'row' is typed as DbRow instead of 'any'
    const jobs = rows.map((row) => {
      let mappedStatus = 'applied';
      const rawStatus = (row.status || '').toLowerCase();

      if (rawStatus === 'active') mappedStatus = 'applied';
      else if (rawStatus === 'archived') mappedStatus = 'rejected';
      else if (['wishlist', 'applied', 'interviewing', 'offer', 'rejected'].includes(rawStatus)) {
        mappedStatus = rawStatus;
      }

      return {
        id: row.id,
        company: row.company_name || 'Unknown Company',
        position: row.role_title || 'Applied Role',
        status: mappedStatus,
        appliedDate: row.application_date,
      };
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Failed to query SQLite database:', error);
    return NextResponse.json({ error: 'Database fetch failed' }, { status: 500 });
  }
}