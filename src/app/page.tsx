'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import JobStats from '@/components/JobStats';
import { KanbanColumn } from '@/components/KanbanColumn';
import { Job, JobStatus } from '@/types/job';

const COLUMNS: { title: string; status: JobStatus }[] = [
  { title: 'Wishlist', status: 'wishlist' },
  { title: 'Applied', status: 'applied' },
  { title: 'Interviewing', status: 'interviewing' },
  { title: 'Offer', status: 'offer' },
  { title: 'Rejected', status: 'rejected' },
];

function normalizeJobStatus(status: string): string {
  const normalized = (status || '').toLowerCase();

  if (normalized === 'active') return 'applied';
  if (normalized === 'archived') return 'rejected';

  return normalized;
}

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          console.log("Fetcher output:", data);
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
    interviewing: jobs.filter((j) => normalizeJobStatus(j.status) === 'interviewing').length,
    offers: jobs.filter((j) => normalizeJobStatus(j.status) === 'offer').length,
  };

  return (
    <div className="min-h-screen bg-[#0c0d0f] text-slate-200 font-sans flex flex-col justify-between selection:bg-cyan-500/30">
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col">
        <Header />
        <div className="px-8 mt-6">
          <div className="flex justify-between items-center mb-8">
            <JobStats
              total={stats.totalApplications}
              interviewing={stats.interviewing}
              offers={stats.offers}
            />
          </div>

          {/* Integrated Kanban Board */}
          {loading ? (
            <div className="text-center text-slate-500 py-16 text-xs font-mono tracking-wider animate-pulse">
              Loading...
            </div>
          ) : (
            <section className="flex-1 min-h-0 flex">
              <div className="flex gap-5 overflow-x-auto pb-4 w-full scrollbar-thin scrollbar-thumb-[#17191d] items-start">
                {COLUMNS.map((col) => (
                  <KanbanColumn
                    key={col.status}
                    columnId={col.status}
                    title={col.title}
                    jobs={jobs.filter((j) => normalizeJobStatus(j.status) === col.status)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <footer className="w-full max-w-7xl mx-auto px-6 pb-6 flex justify-between items-center text-[10px] font-mono tracking-wider text-slate-600 border-t border-[#14161a] pt-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400">COEPI</span>
          <span className="text-slate-700">/koy-pee/</span>
          <span className="text-slate-800">|</span>
          <span className="italic text-slate-500">"Now I begin" — marking a fresh path forward.</span>
        </div>
        
        <div className="bg-[#0e1013] px-2.5 py-1 rounded-md border border-[#17191d] flex items-center gap-2 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.5)]">
          <span className="text-[9px] text-slate-500">Version</span>
          <span className="text-cyan-400 font-bold font-sans">v0.0.1</span>
          <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_4px_1px_rgba(16,185,129,0.4)] animate-pulse"></span>
        </div>
      </footer>
    </div>
  );
}