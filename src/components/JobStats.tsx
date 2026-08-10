export interface JobStatsProps {
  total: number;
  interviewing: number;
  offers: number;
  rejected: number;
}

export default function JobStats({ total, interviewing, offers, rejected }: JobStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div className="bg-[#14171d] border border-[#1f232c] p-4 rounded-xl shadow-neumorphic">
        <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Total Applications</p>
        <p className="text-2xl font-bold tracking-tight text-cyan-400">{total}</p>
      </div>
      <div className="bg-[#14171d] border border-[#1f232c] p-4 rounded-xl shadow-neumorphic">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Interviewing</p>
        <p className="text-2xl font-bold tracking-tight text-white">{interviewing}</p>
      </div>
      <div className="bg-[#14171d] border border-[#1f232c] p-4 rounded-xl shadow-neumorphic">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Offers</p>
        <p className="text-2xl font-bold tracking-tight text-white">{offers}</p>
      </div>
      <div className="bg-[#14171d] border border-[#1f232c] p-4 rounded-xl shadow-neumorphic">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Rejected</p>
        <p className="text-2xl font-bold tracking-tight text-white">{rejected}</p>
      </div>
    </div>
  );
}