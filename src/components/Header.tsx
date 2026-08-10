'use client'

import React from "react";

interface HeaderProps {
  onResync?: () => void;
  isSyncing?: boolean;
  hasError?: boolean;
}

export default function Header({ onResync, isSyncing, hasError }: HeaderProps) {
  let dotColor = 'bg-green-400 shadow-[0_0_6px_1px_rgba(74,222,128,0.4)]';
  let statusText = 'SYNCED';

  if (isSyncing) {
    dotColor = 'bg-amber-400 shadow-[0_0_6px_1px_rgba(251,191,36,0.4)]';
    statusText = 'SYNCING...';
  } else if (hasError) {
    dotColor = 'bg-rose-500 shadow-[0_0_6px_1px_rgba(244,63,94,0.4)]';
    statusText = 'SYNC ERROR';
  }

  return (
    <header className="flex items-center bg-[#0b0d0f] justify-between mb-8 p-4 border-b border-[#141518]">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_1px_rgba(34,211,238,0.5)]"></div>
        <span className="text-base font-bold tracking-wider text-white">COEPI</span>
      </div>

      <nav className="hidden md:flex items-center gap-1 bg-[#0e1013] rounded-2xl p-0.5 shadow-neumorphic-inset">
        <button className="px-4 py-1.5 rounded-2xl text-xs cursor-pointer font-medium text-cyan-400 bg-[#121418] shadow-[1px_1px_3px_rgba(0,0,0,0.5)]">Dashboard</button>
        <button className="px-4 py-1.5 rounded-2xl text-xs cursor-pointer font-medium text-slate-500 hover:text-slate-400">Insights</button>
        <button className="px-4 py-1.5 rounded-2xl text-xs cursor-pointer font-medium text-slate-500 hover:text-slate-400">Archive</button>
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

          <button
            type="button"
            onClick={onResync}
            disabled={isSyncing}
            className="w-5 h-5 flex items-center justify-center border border-[#20222585] rounded-full bg-[#121418] shadow-neumorphic hover:border-cyan-500/30 text-slate-500 hover:text-cyan-400 rounded transition-all cursor-pointer text-xs font-bold hover:shadow-[0_0_6px_rgba(34,211,238,0.2)]"
            title="Resync jobs"
          >
            <svg
              className={`w-3 h-3 ${isSyncing ? 'animate-spin text-amber-400' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

        <div className="flex items-center gap-2 bg-[#0e1013] px-3 py-1.5 rounded-2xl shadow-neumorphic-inset">
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`}></span>
          <span className={`min-w-[75px] text-center tracking-wider uppercase text-[9px] font-bold ${hasError ? 'text-rose-400' : 'text-slate-500'}`}>
            {statusText}
          </span>
        </div>
      </div>
  </header>
  );
}