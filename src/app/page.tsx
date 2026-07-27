'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import JobStats from '@/components/JobStats';
import AddJobModal from '@/components/AddJobModal';
import { KanbanColumn } from '@/components/KanbanColumn';
import { Job, JobStatus } from '@/types/job';

const COLUMNS: { title: string; status: JobStatus }[] = [
  { title: 'Wishlist', status: 'wishlist' },
  { title: 'Applied', status: 'applied' },
  { title: 'Interviewing', status: 'interviewing' },
  { title: 'Offer', status: 'offer' },
  { title: 'Rejected', status: 'rejected' },
];

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const stats = {
    totalApplications: jobs.length,
    interviewing: jobs.filter((j) => j.status === 'interviewing').length,
    offers: jobs.filter((j) => j.status === 'offer').length,
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header />
        
        <div className="flex justify-between items-center">
          <JobStats
            total={stats.totalApplications}
            interviewing={stats.interviewing}
            offers={stats.offers}
          />
          <AddJobModal />
        </div>

        {/* Integrated Kanban Board */}
        {loading ? (
          <div className="text-center text-slate-400 py-10">Loading Data...</div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.status}
                title={col.title}
                status={col.status}
                jobs={jobs.filter((j) => j.status === col.status)}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}