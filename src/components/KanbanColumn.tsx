'use client';

import React, { memo, useState } from 'react';
import JobCard from './JobCard';
import AddJobModal from './AddJobModal';
import { Job } from '@/types/job';

// interface in react is used to define the shape of props that a component expects.
// It helps with type-checking and ensures that the component receives the correct data types.
// ie, in vue, we use props: { type: String, required: true } to define the expected props for a component.
interface ColumnProps {
  columnId: string;
  title: string;
  cards?: Job[];
  jobs?: Job[]; // Backward-compatibility fallback, meaning either cards or jobs can be passed in, but not both.
  onDragStart?: (e: React.DragEvent, cardId: string, sourceColId: string) => void;
  onDrop?: (e: React.DragEvent, targetColId: string) => void;
  onDeleteCard?: (cardId: string, colId: string) => void;
  onEditCard?: (cardId: string, colId: string) => void;
  onAddClick?: (colId: string) => void;
}

// memo means that React will only re-render this component if its props change,
// which is useful for performance in a Kanban board with many cards.
export const KanbanColumn = memo(function KanbanColumn({
  columnId,
  title,
  cards,
  jobs,
  onDragStart,
  onDrop,
  onDeleteCard,
  onEditCard,
  onAddClick,
}: ColumnProps) {
  const cardList = cards || jobs || [];

  // UseState means that the component will re-render when the state changes.
  // In this case, we are tracking the drag state of the column.
  const [dragCounter, setDragCounter] = useState(0);
  // Use useState<> means that the component will re-render when the state changes. In this case, we are tracking the card that is being read in a modal.
  // We use useState<Job | null> because the card can be null when no card is being read.
  // <> means that we are using a generic type, which allows us to specify the type of the state variable.
  // in Vue, we use data() { return { readingCard: null } } to define the state of the component.
  const [readingCard, setReadingCard] = useState<Job | null>(null); 

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter((prev) => prev + 1);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Decrement the drag counter when the dragged item leaves the column area
    // We do this because the onDragLeave event can fire multiple times when dragging over child elements,
    // so we need to keep track of how many times the dragged item has entered and left the column.
    setDragCounter((prev) => prev - 1); 
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleLocalDrop = (e: React.DragEvent) => {
    setDragCounter(0);
    if (onDrop) {
      onDrop(e, columnId);
    }
  };

  const isOver = dragCounter > 0;

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleLocalDrop}
        className={`flex-1 min-w-[280px] max-w-[320px] rounded-xl p-4 flex flex-col self-start min-h-[500px] transition-colors duration-200 ${
          isOver ? 'border-cyan-500/40 bg-[#111419]' : 'border-[#17191d]'
        }`}
      >
        {/* Column Header Panel */}
        <div className="flex justify-between items-center mb-4 pb-2">
          <div className="flex items-center gap-2.5">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              {title}
            </h3>
            <span className="text-[10px] text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono font-semibold">
              {cardList.length}
            </span>
          </div>

          <AddJobModal
            trigger={
              <button
                type="button"
                className="w-5 h-5 flex items-center justify-center border border-[#20222585] bg-[#121418] shadow-neumorphic hover:border-cyan-500/30 text-slate-500 hover:text-cyan-400 rounded transition-all cursor-pointer text-xs font-bold hover:shadow-[0_0_6px_rgba(34,211,238,0.2)]"
                title={`Add job to ${title} column`}
              >
                +
              </button>
            }
          />
        </div>

        <div className="flex flex-col gap-2 px-1">
          {cardList.map((card) => (
            <JobCard
              key={card.id}
              card={card}
              columnId={columnId}
              onDragStart={onDragStart}
              onDeleteCard={onDeleteCard}
              onEditCard={onEditCard}
              onReadDescription={(cardToRead) => setReadingCard(cardToRead)}
            />
          ))}

          {cardList.length === 0 && (
            <div className="text-[11px] font-medium text-slate-700 italic text-center py-6 rounded-lg shadow-neumorphic-inset">
              No applications here yet
            </div>
          )}
        </div>
      </div>

      {/* Description Reader Modal */}
      {readingCard && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setReadingCard(null)}
        >
          <div
            className="bg-[#11141b] border border-[#1f2533] w-full max-w-lg p-6 rounded-2xl shadow-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-base font-bold text-white">{readingCard.company}</h3>
                <p className="text-xs text-cyan-400 font-semibold mt-0.5">
                  {readingCard.role || readingCard.position || 'Role Not Specified'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReadingCard(null)}
                className="text-slate-500 hover:text-white cursor-pointer text-sm p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Job Description */}
            <div className="overflow-y-auto my-2 p-4 bg-[#08090c] border border-[#171b24] rounded-xl text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {readingCard.description}
            </div>

            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={() => setReadingCard(null)}
                className="px-4 py-1.5 bg-[#1a1f2c] hover:bg-[#23293a] text-xs font-bold text-white rounded-lg cursor-pointer transition-colors border border-[#272e40]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default KanbanColumn;