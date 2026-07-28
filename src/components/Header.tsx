export default function Header() {
  return (
    <header className="flex items-center bg-[#0b0d0f] justify-between mb-8 p-4 border-b border-[#141518]">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_1px_rgba(34,211,238,0.5)]"></div>
        <span className="text-base font-bold tracking-wider text-white">COEPI</span>
      </div>

      <nav className="hidden md:flex items-center gap-1 bg-[#0e1013] rounded-2xl p-0.5 shadow-neumorphic-inset">
        <button className="px-4 py-1.5 rounded-2xl text-xs font-medium text-cyan-400 bg-[#121418] shadow-[1px_1px_3px_rgba(0,0,0,0.5)]">Dashboard</button>
        <button className="px-4 py-1.5 rounded-2xl text-xs font-medium text-slate-500 hover:text-slate-400">Insights</button>
        <button className="px-4 py-1.5 rounded-2xl text-xs font-medium text-slate-500 hover:text-slate-400">Archive</button>
      </nav>

      <div className="flex items-center gap-3">
        {/* Undo / Redo Controls */}
        {/* <div className="flex items-center gap-1 bg-[#0e1013] p-0.5 rounded-lg shadow-neumorphic-inset">
          <button
            type="button" 
            onClick={undo} 
            disabled={!canUndo}
            className="px-3 py-1 bg-[#121418] disabled:opacity-30 text-slate-400 disabled:text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer disabled:cursor-not-allowed shadow-[1px_1px_2px_rgba(0,0,0,0.4)] hover:bg-[#16191e]"
          >
            Undo
          </button>
          <button
            type="button" 
            onClick={redo} 
            disabled={!canRedo}
            className="px-3 py-1 bg-[#121418] disabled:opacity-30 text-slate-400 disabled:text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer disabled:cursor-not-allowed shadow-[1px_1px_2px_rgba(0,0,0,0.4)] hover:bg-[#16191e]"
          >
            Redo
          </button>
        </div> */}

        <div className="flex items-center gap-2 bg-[#0e1013] px-3 py-1.5 rounded-2xl shadow-neumorphic-inset">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_1px_rgba(34,211,238,0.4)] animate-pulse"></span>
          <span className="tracking-wider uppercase text-[9px] font-bold text-slate-500">GMAIL SYNCED</span>
        </div>
      </div>
  </header>
  );
}