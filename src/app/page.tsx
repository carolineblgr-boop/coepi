'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import JobStats from '@/components/JobStats';
import { KanbanColumn } from '@/components/KanbanColumn';
import EditJobModal from '@/components/EditJobModal';
import { Job, JobStatus } from '@/types/job';

const COLUMNS: { title: string; status: JobStatus | 'stale' }[] = [
  { title: 'Wishlist', status: 'wishlist' },
  { title: 'Applied', status: 'applied' },
  { title: 'Interviewing', status: 'interviewing' },
  { title: 'Offer', status: 'offer' },
  { title: 'Rejected', status: 'rejected' },
  { title: 'Stale', status: 'stale' },
];

// Helper function to normalize raw database statuses and compute stale status
function getEffectiveJobStatus(job: Job): string {
  const rawStatus = (job.status || '').toLowerCase();

  let status = rawStatus;
  if (rawStatus === 'active') status = 'applied';
  if (rawStatus === 'archived') status = 'rejected';

  // Automatically classify applied jobs as "stale" if > 14 days old
  if (status === 'applied') {
    const dateStr = job.appliedDate || (job as any).date || (job as any).createdAt;
    if (dateStr) {
      const appliedDate = new Date(dateStr);
      if (!isNaN(appliedDate.getTime())) {
        const now = new Date();
        const diffInDays = (now.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffInDays >= 14) {
          return 'stale';
        }
      }
    }
  }
  return status;
}

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Keep track of the specific job ID currently being dragged
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  // Track which job is being editef in the modal
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Fetch jobs on initial mount or when clicking manual resync
  useEffect(() => {
    let isMounted = true;

    async function loadJobs() {
      if (refreshTrigger > 0) {
        setIsSyncing(true);
      }

      try {
        const res = await fetch('/api/jobs');
        if (res.ok && isMounted) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsSyncing(false);
        }
      }
    }

    loadJobs();

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  const handleManualResync = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Called as soon as the user starts dragging a card.
  // Stores the card's ID in React state and in HTML5 dataTransfer payload
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCardId(cardId);
    e.dataTransfer.setData('text/plain', cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetColStatus: string) => {
    e.preventDefault();

    // Extra the card ID from dataTransfer, or fallback to React sate tracking
    const cardId = e.dataTransfer.getData('text/plain') || draggedCardId;
    if (!cardId) return;

    // Find the matching job object in current list
    const targetJob = jobs.find((j) => j.id === cardId);
    if (!targetJob) return;

    // Check if the card is already in that column. If so, do nothing
    const currentStatus = getEffectiveJobStatus(targetJob);
    if (currentStatus === targetColStatus) {
      setDraggedCardId(null);
      return;
    }

    // Snapshot previous state, then immediately move the card in local React state
    const previousJobs = [...jobs];
    setJobs((prevJobs) => 
      prevJobs.map((j) => 
        j.id === cardId ? { ...j, status: targetColStatus as JobStatus } : j
      )
    );
    setDraggedCardId(null);

    // Backend persistence: Send PATCH request to our SQLite API endpoint
    try {
      const res = await fetch('/api/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ id: cardId, status: targetColStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update job status on server');
      }
    } catch (err) {
      console.error('Update failed, reverting board state:', err);
      // Rollback to original state if the API call fails
      setJobs(previousJobs);
    }
  };

  // Open edit modal for a specific job card
  const handleEditCard = ( cardId: string ) => {
    const target = jobs.find((j) => j.id === cardId);
    if (target) {
      setEditingJob(target);
    }
  };

  // Save edits to SQLite and update state
  const handleSaveEdits = async (updatedJob: Job) => {
    const previousJobs = [...jobs];

  // Optimistically update local state
    setJobs((prevJobs) => 
      prevJobs.map((j) => (j.id === updatedJob.id ? updatedJob : j))
    );
    setEditingJob(null);

    try {
      const res = await fetch('/api/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJob),
      });

      if (!res.ok) {
        throw new Error('Failed to save job edits on server');
      }
    } catch (err) {
      console.error('Save failed, reverting board state:', err);
      // Rollback to original state if the API call fails
      setJobs(previousJobs);
    }
  };

  const stats = {
    totalApplications: jobs.length,
    interviewing: jobs.filter((j) => getEffectiveJobStatus(j) === 'interviewing').length,
    offers: jobs.filter((j) => getEffectiveJobStatus(j) === 'offer').length,
    rejected: jobs.filter((j) => getEffectiveJobStatus(j) === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-[#0c0d0f] text-slate-200 font-sans flex flex-col justify-between selection:bg-cyan-500/30">
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col">
        {/* Pass resync handlers into Header */}
        <Header onResync={handleManualResync} isSyncing={isSyncing} />

        <div className="px-8 mt-6">
          <div className="flex justify-between items-center mb-8">
            <JobStats
              total={stats.totalApplications}
              interviewing={stats.interviewing}
              offers={stats.offers}
              rejected={stats.rejected}
            />
          </div>

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
                    jobs={jobs.filter((j) => getEffectiveJobStatus(j) === col.status)}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onEditCard={handleEditCard}
                    onDeleteCard={(cardId) => {
                      setJobs((prevJobs) => prevJobs.filter((j) => j.id !== cardId));
                    }}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <EditJobModal
        isOpen={Boolean(editingJob)}
        job={editingJob}
        onClose={() => setEditingJob(null)}
        onSave={handleSaveEdits}
      />

      <footer className="w-full max-w-7xl mx-auto px-6 pb-6 flex justify-between items-center text-[10px] font-mono tracking-wider text-slate-600 border-t border-[#14161a] pt-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400">COEPI</span>
          <span className="text-slate-700">/koy-pee/</span>
          <span className="text-slate-800">|</span>
          <span className="italic text-slate-500">&quot;Now I begin&quot; — marking a fresh path forward.</span>
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