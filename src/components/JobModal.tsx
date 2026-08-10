'use client';

import React, { useState, useEffect } from 'react';
import { Job } from '@/types/job';

export interface JobModalFormData {
  company: string;
  role: string;
  salary?: string;
  link?: string;
  rating?: number;
  workMode?: 'Remote' | 'Hybrid' | 'On-site';
  commuteTimeMinutes?: number;
  description?: string;
  appliedDate?: string;
}

interface ColumnData {
  title: string;
  cards: Job[];
}

interface JobModalProps {
  activeModal: {
    mode: 'add' | 'edit';
    columnId?: string;
    colId?: string;
    cardId?: string;
    card?: Job;
  } | null;
  columns: Record<string, ColumnData>;
  onClose: () => void;
  onSubmit: (formData: JobModalFormData) => void;
}

export default function JobModal({
  activeModal,
  columns,
  onClose,
  onSubmit,
}: JobModalProps) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [link, setLink] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Remote');
  const [commuteTimeMinutes, setCommuteTimeMinutes] = useState<string>('');
  const [description, setDescription] = useState('');
  const [appliedDate, setAppliedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Normalize column ID across different naming conventions
  const targetColId = activeModal?.columnId || activeModal?.colId || '';

  useEffect(() => {
    if (!activeModal) return;

    if (activeModal.mode === 'edit') {
      // Find card either from direct prop or by searching column
      const targetCard =
        activeModal.card ||
        (targetColId && columns[targetColId]?.cards.find((c) => c.id === activeModal.cardId));

      if (targetCard) {
        setCompany(targetCard.company || '');
        setRole(targetCard.role || targetCard.position || '');
        setSalary(targetCard.salary || '');
        setLink(targetCard.link || '');
        setRating(targetCard.rating || 0);
        setWorkMode((targetCard.workMode as 'Remote' | 'Hybrid' | 'On-site') || 'Remote');
        setCommuteTimeMinutes(targetCard.commuteTimeMinutes?.toString() || '');
        setDescription(targetCard.description || '');
        setAppliedDate(targetCard.appliedDate || targetCard.date || new Date().toISOString().split('T')[0]);
        return;
      }
    }

    // Default resetting state for 'add' mode
    setCompany('');
    setRole('');
    setSalary('');
    setLink('');
    setRating(0);
    setWorkMode('Remote');
    setCommuteTimeMinutes('');
    setDescription('');
    setAppliedDate(new Date().toISOString().split('T')[0]);
  }, [activeModal, columns, targetColId]);

  // Keyboard Escape shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (activeModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, onClose]);

  if (!activeModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!company.trim() || !role.trim()) return;

    onSubmit({
      company: company.trim(),
      role: role.trim(),
      salary: salary.trim() || undefined,
      link: link.trim() || undefined,
      rating,
      workMode,
      commuteTimeMinutes:
        workMode !== 'Remote' && commuteTimeMinutes ? Number(commuteTimeMinutes) : undefined,
      description: description.trim() || undefined,
      appliedDate: appliedDate || undefined,
    });
  };

  const columnTitle = columns[targetColId]?.title || 'Board';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#11141b] border border-[#1f2533] w-full max-w-lg p-6 rounded-2xl shadow-2xl my-8 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#1a1f2c]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {activeModal.mode === 'add' ? `Add Application → ${columnTitle}` : 'Modify Application Profile'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-white text-sm cursor-pointer transition-colors p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Company & Role */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="company-name" className="text-[9px] uppercase font-extrabold tracking-widest text-slate-500">
                Company Name *
              </label>
              <input
                id="company-name"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                autoFocus
                placeholder="e.g. Stripe"
                className="bg-[#08090c] border border-[#1a1e28] text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="role" className="text-[9px] uppercase font-extrabold tracking-widest text-slate-500">
                Position / Title *
              </label>
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                placeholder="e.g. Frontend Engineer"
                className="bg-[#08090c] border border-[#1a1e28] text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Salary & Application Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="salary-target" className="text-[9px] uppercase font-extrabold tracking-widest text-slate-500">
                Salary Target
              </label>
              <input
                id="salary-target"
                type="text"
                placeholder="e.g. £120,000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="bg-[#08090c] border border-[#1a1e28] text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="application-date" className="text-[9px] uppercase font-extrabold tracking-widest text-slate-500">
                Application Date
              </label>
              <input
                id="application-date"
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                className="bg-[#08090c] border border-[#1a1e28] text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Star Rating & Work Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-extrabold tracking-widest text-slate-500">
                Job Fit Match
              </label>
              <div className="flex items-center gap-1.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-base cursor-pointer transition-transform hover:scale-125 ${
                      star <= rating ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]' : 'text-slate-700'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="work-setup" className="text-[9px] uppercase font-extrabold tracking-widest text-slate-500">
                Work Setup
              </label>
              <select
                id="work-setup"
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as 'Remote' | 'Hybrid' | 'On-site')}
                className="bg-[#08090c] border border-[#1a1e28] text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          {/* Conditional Commute Time */}
          {workMode !== 'Remote' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="commute-time" className="text-[9px] uppercase font-extrabold tracking-widest text-slate-500">
                Commute Time (Minutes, one-way)
              </label>
              <input
                id="commute-time"
                type="number"
                placeholder="e.g. 30"
                value={commuteTimeMinutes}
                onChange={(e) => setCommuteTimeMinutes(e.target.value)}
                min="0"
                className="bg-[#08090c] border border-[#1a1e28] text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
          )}

          {/* Link */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="application-link" className="text-[9px] uppercase font-extrabold tracking-widest text-slate-500">
              Application Link
            </label>
            <input
              id="application-link"
              type="url"
              placeholder="https://..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="bg-[#08090c] border border-[#1a1e28] text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="job-description" className="text-[9px] uppercase font-extrabold tracking-widest text-slate-500">
              Job Description / Notes
            </label>
            <textarea
              id="job-description"
              rows={3}
              placeholder="Paste job details or key requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#08090c] border border-[#1a1e28] text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end mt-3 pt-3 border-t border-[#1a1f2c]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-bold text-xs uppercase tracking-widest px-5 py-2 rounded-lg transition-colors cursor-pointer shadow-[0_0_12px_rgba(34,211,238,0.25)]"
            >
              {activeModal.mode === 'add' ? 'Confirm Placement' : 'Save Adjustments'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}