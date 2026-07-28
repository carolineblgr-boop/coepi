'use client';

import React, { memo } from 'react';
import { Job } from '@/types/job';

export interface JobCardProps {
  card: Job;
  columnId: string;
  onDragStart?: (e: React.DragEvent, cardId: string, sourceColId: string) => void;
  onDeleteCard?: (cardId: string, colId: string) => void;
  onEditCard?: (cardId: string, colId: string) => void;
  onReadDescription?: (card: Job) => void;
}

/** Dynamic Dwell Time & Color Calculator */
function getDwellStats(appliedDate?: string | null) {
  if (!appliedDate) return null;

  const start = new Date(appliedDate);
  if (isNaN(start.getTime())) return null;

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Default (<10 days): Fresh application -> Emerald green
  let colorClass = 'text-emerald-400 bg-emerald-950/30 border-emerald-500/20';

  if (days >= 21) {
    // > 3 weeks: Stale alert -> Rose red
    colorClass = 'text-rose-400 bg-rose-950/30 border-rose-500/20';
  } else if (days >= 10) {
    // 10-20 days: Waiting period -> Amber orange
    colorClass = 'text-amber-400 bg-amber-950/30 border-amber-500/20';
  }

  return { days, colorClass };
}

/** Reusable Badge for Work Mode */
function ModeBadge({ mode, commute }: { mode?: string | null; commute?: number | null }) {
  if (!mode) return null;
  return (
    <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-md">
      {mode}
      {commute && commute > 0 ? ` (${commute}m)` : ''}
    </span>
  );
}

/** Reusable Star Rating */
function StarRating({ rating }: { rating?: number | null }) {
  if (!rating || rating <= 0) return null;
  return (
    <span className="text-[11px] text-amber-400 bg-amber-950/30 border border-amber-500/20 px-1.5 py-0.5 rounded-md font-bold tracking-widest">
      {'★'.repeat(rating)}
    </span>
  );
}

export const JobCard = memo(function JobCard({
  card,
  columnId,
  onDragStart,
  onDeleteCard,
  onEditCard,
  onReadDescription,
}: JobCardProps) {
  const displayCompany = card.company || 'Unknown Company';
  const displayRole = card.role || card.position || 'Role Not Specified';
  const displayDate = card.appliedDate || card.date;

  // Compute dynamic dwell calculation
  const dwell = getDwellStats(displayDate);

  return (
    <div
      draggable={Boolean(onDragStart)}
      onDragStart={(e) => onDragStart && onDragStart(e, card.id, columnId)}
      className="bg-[#14171d] border border-[#1f232c] p-4 rounded-xl hover:border-cyan-500/30 transition-all shadow-neumorphic group mb-3 cursor-grab active:cursor-grabbing"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-bold text-sm text-slate-100 group-hover:text-cyan-400 transition-colors">
          {displayCompany}
        </h4>
        <div className="flex items-center gap-2 text-slate-500 opacity-60 group-hover:opacity-100 transition-opacity">
          {onEditCard && (
            <button
              type="button"
              onClick={() => onEditCard(card.id, columnId)}
              className="hover:text-slate-300 text-xs cursor-pointer"
              title="Edit application profile"
            >
              ✎
            </button>
          )}
          {onDeleteCard && (
            <button
              type="button"
              onClick={() => onDeleteCard(card.id, columnId)}
              className="hover:text-rose-400 text-xs cursor-pointer"
              title="Delete card"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400 font-medium mb-3">{displayRole}</p>

      {/* Badges Row */}
      <div className="flex items-center gap-2 mb-3">
        <StarRating rating={card.rating} />
        <ModeBadge mode={card.workMode} commute={card.commuteTimeMinutes} />
      </div>

      {/* Description Preview Box */}
      {card.description && (
        <div className="mb-3 text-[11px] text-slate-400 bg-[#0a0c0f] p-2.5 rounded-lg border border-[#191d26] leading-relaxed">
          <p className="line-clamp-2">{card.description}</p>
          {onReadDescription && (
            <button
              type="button"
              onClick={() => onReadDescription(card)}
              className="text-cyan-400 hover:underline font-semibold mt-1.5 text-[10px] block cursor-pointer"
            >
              Read full description →
            </button>
          )}
        </div>
      )}

      {/* Card Footer */}
      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#1a1e27]">
        <span className="text-slate-400 font-medium">{card.salary || '—'}</span>

        {/* Dynamic Dwell Time Badge */}
        {dwell && (
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${dwell.colorClass}`}
            title={`Applied on ${displayDate}`}
          >
            {dwell.days === 0 ? 'Applied today' : `${dwell.days}d ago`}
          </span>
        )}
      </div>
    </div>
  );
});

export default JobCard;