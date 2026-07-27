import { Job } from '@/types/job';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700/80 shadow-sm hover:border-slate-600 transition-colors">
      <h3 className="font-semibold text-slate-100 text-base mb-1">{job.position}</h3>
      <p className="text-sm font-medium text-slate-300 mb-2">{job.company}</p>

      {job.location && (
        <p className="text-xs text-slate-400 mb-2">📍 {job.location}</p>
      )}

      {job.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-2">{job.description}</p>
      )}

      {job.appliedDate && (
        <div className="text-xs text-slate-500 border-t border-slate-700/60 pt-2 mt-2">
          Applied: {job.appliedDate}
        </div>
      )}
    </div>
  );
}