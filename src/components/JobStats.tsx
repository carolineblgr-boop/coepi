export interface JobStatsProps {
  total: number;
  interviewing: number;
  offers: number;
}

export default function JobStats({ total, interviewing, offers }: JobStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/60 text-center">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Apps</p>
        <p className="text-2xl font-bold text-slate-100 mt-1">{total}</p>
      </div>
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/60 text-center">
        <p className="text-xs text-amber-400 font-medium uppercase tracking-wider">Interviewing</p>
        <p className="text-2xl font-bold text-amber-400 mt-1">{interviewing}</p>
      </div>
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/60 text-center">
        <p className="text-xs text-emerald-400 font-medium uppercase tracking-wider">Offers</p>
        <p className="text-2xl font-bold text-emerald-400 mt-1">{offers}</p>
      </div>
    </div>
  );
}