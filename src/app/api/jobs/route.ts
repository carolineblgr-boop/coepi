import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 1. Define the shape of a row coming out of SQLite
// This is important for type safety and to avoid using 'any' type, which can lead to runtime errors.
// This means that we are defining a TypeScript interface that describes the structure of the data we expect to receive from the database.
// in Vue, we would use a data model or a TypeScript interface to achieve the same effect, but in React, we define it directly in the API route file.
interface DbRow {
  id: string;
  application_date: string | null;
  company_name: string | null;
  role_title: string | null;
  status: string | null;
  salary?: string | null;
  rating?: number | null;
  work_mode?: string | null;
  url?: string | null;
  description?: string | null;
}

export async function GET() {
  try {
    // Prepare means that we are creating a SQL statement that can be executed multiple times with different parameters.
    // all() means that we are executing the SQL statement and returning all rows that match the query.
    // The result is an array of objects, where each object represents a row in the database.
    const rows = db.prepare(
      'SELECT id, application_date, company_name, role_title, status, salary, rating, work_mode, url, description FROM applications'
    ).all() as DbRow[];

    // Now 'row' is typed as DbRow instead of 'any'
    // Map the raw database rows to our frontend Job type, filtering out unwanted companies
    // In this case, we are filtering out any rows where the company name is 'stripe' or 'vercel',
    // and mapping the remaining rows to a new object that matches the Job type expected by the frontend.
    const jobs = rows
      .filter((row) => {
        const company = (row.company_name || '').toLowerCase();
        return !['stripe', 'vercel'].includes(company);
      })
      .map((row) => {
        // Map the raw status from the database to our frontend status values
        // This is important because the database may have different status values than what the frontend expects.
        // For example, the database may have 'active' and 'archived', but the frontend expects 'applied' and 'rejected'.
        // This will return a new object that matches the Job type expected by the frontend, with the status normalized to the expected values.
        // Ie: if the database has 'active', we map it to 'applied'; if it has 'archived', we map it to 'rejected'.
      let mappedStatus = 'applied';
      const rawStatus = (row.status || '').toLowerCase();

      if (rawStatus === 'active') mappedStatus = 'applied';
      else if (rawStatus === 'archived') mappedStatus = 'rejected';
      // If the status is one of the expected frontend values, we keep it as is
      else if (['wishlist', 'applied', 'interviewing', 'offer', 'rejected'].includes(rawStatus)) {
        mappedStatus = rawStatus;
      }

      return {
        id: row.id,
        company: row.company_name || 'Unknown Company',
        position: row.role_title || 'Applied Role',
        status: mappedStatus,
        appliedDate: row.application_date,
        salary: row.salary ?? null,
        rating: row.rating ?? null,
        workMode: row.work_mode ?? null,
        url: row.url ?? null,
        description: row.description ?? null,
      };
    });

    // NextResponse.json() is a Next.js utility that formats the response as JSON and sets the appropriate headers.
    // This is important because the frontend expects a JSON response,
    // and it allows us to easily send data back to the client.
    // In Vue, we would use res.json() or a similar method to achieve the same effect.
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Failed to query SQLite database:', error);
    return NextResponse.json({ error: 'Database fetch failed' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    // Extract 'id' and 'status' sent from the frontend request body
    const body = await request.json();
    const {
      id,
      company,
      position,
      status,
      salary,
      appliedDate,
      rating,
      workMode,
      url,
      description,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    // Update the status column in the SQLite database
    const stmt = db.prepare(`
      UPDATE applications
      SET
        company_name = COALESCE(?, company_name),
        role_title = COALESCE(?, role_title),
        status = COALESCE(?, status),
        salary = COALESCE(?, salary),
        application_date = COALESCE(?, application_date),
        rating = COALESCE(?, rating),
        work_mode = COALESCE(?, work_mode),
        url = COALESCE(?, url),
        description = COALESCE(?, description)
      WHERE id = ?
    `);

    // Execute the query (passing undefined preserves existing value via COALESCE)
    const result = stmt.run(
      company ?? null,
      position ?? null,
      status ?? null,
      salary ?? null,
      appliedDate ?? null,
      rating ?? null,
      workMode ?? null,
      url ?? null,
      description ?? null,
      id
    );

    // Check if any row was actually modified (0 means the job ID wasn't found)
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Job application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, id, status });
  } catch (error) {
    console.error('Failed to update status in SQLite:', error);
    return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Extract all relevant fields from the request body
    // This is important for type safety and to ensure that we are only inserting valid data into the database.
    const {
      company,
      position,
      status,
      salary,
      appliedDate,
      rating,
      workMode,
      url,
      description,
    } = body;

    const id =`job_${Date.now()}`; // Generate a unique ID based on timestamp

    // Stmt stands for "statement" and is a common abbreviation in database operations.
    // Here, we are preparing an SQL statement to insert a new job application into the SQLite database.
    // The question marks (?) are placeholders for the values that will be provided when we run the statement.
    // This is important for preventing SQL injection attacks, as it ensures that the values are properly escaped.
    const stmt = db.prepare(`
      INSERT INTO applications (id, company_name, role_title, status, salary, application_date, rating, work_mode, url, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      company ?? null,
      position ?? null,
      status ?? 'wishlist',
      salary ?? null,
      appliedDate ?? new Date().toISOString(), // Default to current date if not provided
      rating ?? null,
      workMode ?? null,
      url ?? null,
      description ?? null
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Failed to insert new job application into SQLite:', error);
    return NextResponse.json({ error: 'Database insert failed' }, { status: 500 });
  }
}