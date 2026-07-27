import { Job, JobStatus } from '@/types/job';
import { JobCard } from './JobCard';

interface KanbanColumnProps {
  title: string;
  status: JobStatus;
  jobs: Job[];
}

export function KanbanColumn({ title, jobs }: KanbanColumnProps) {
  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col min-w-[280px] w-full">
      <div className="flex items-center mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</h2>
        <span className="text-[10px] text-slate-500 px-2 py-0.5 font-mono">
          {jobs.length}
        </span>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h[calc(100vh-220px)]">
        {jobs.length === 0 ? (
          <div className="border-2 border-dashed boder-slate-200 rounded-lg p-6 text-center text-xs text-slate-400">
            No applications
          </div>
        ): (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
};