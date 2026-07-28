export interface JobStatsProps {
  total: number;
  interviewing: number;
  offers: number;
}

export default function JobStats({ total, interviewing, offers }: JobStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-[#14171d] border border-[#1f232c] p-4 rounded-xl shadow-neumorphic">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Applications</p>
        <p className="text-2xl font-bold tracking-tight text-white">{total}</p>
      </div>
      <div className="bg-[#14171d] border border-[#1f232c] p-4 rounded-xl shadow-neumorphic">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Interviewing</p>
        <p className="text-2xl font-bold tracking-tight text-white">{interviewing}</p>
      </div>
      <div className="bg-[#14171d] border border-[#1f232c] p-4 rounded-xl shadow-neumorphic">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Offers</p>
        <p className="text-2xl font-bold tracking-tight text-white">{offers}</p>
      </div>
    </div>
  );
}