'use client';

import React, { useState, useEffect } from 'react';
import { Job } from '@/types/job';

interface EditJobModalProps {
  isOpen: boolean;
  job: Job | null;
  // void means that the function does not return a value.
  // In this case, onClose is a callback function that is called when the modal is closed, and it does not return anything.
  // In Vue, we would use an event emitter to achieve the same effect, but in React, we pass a function as a prop.
  onClose: () => void;
  // Promise<void> means that the function returns a promise that resolves to void.
  // In this case, onSave is a callback function that is called when the user saves changes to the job, and it returns a promise that resolves to void.
  // Why do we use Promise<void> instead of just void? Because the onSave function is asynchronous,
  // meaning that it may take some time to complete, and we want to be able to wait for it to finish before closing the modal.
  onSave: (updatedJob: Job) => Promise<void>;
}

export default function EditJobModal({ isOpen, job, onClose, onSave }: EditJobModalProps) {
  const [ company, setCompany ] = useState('');
  const [ position, setPosition ] = useState('');
  const [ salary, setSalary ] = useState('');
  const [ appliedDate, setAppliedDate ] = useState('');
  const [ rating, setRating ] = useState<number>(0);
  const [ workMode, setWorkMode ] = useState('Remote');
  const [ url, setUrl ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  // Pre-fill form values whenever a new job is selected for editing
  // UseEffect is a React hook that allows you to perform side effects in function components.
  // In this case, we are using useEffect to update the form fields whenever the job prop changes.
  // The dependency array [job] means that this effect will run whenever the job prop changes.
  // In Vue, we would use a watcher to achieve the same effect, but in React, we use useEffect.
  useEffect(() => {
    if (job) {
      setCompany(job.company || '');
      setPosition(job.role || job.position || '');
      setSalary(job.salary || '');
      setAppliedDate(job.appliedDate || job.date || '');
      setRating(job.rating || 0);
      setWorkMode(job.workMode || 'Remote');
      setUrl(job.url || '');
      setDescription(job.description || '');
    }
  }, [job]);

  // If the modal is not open or no job is selected, don't render anything
  if (!isOpen || !job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // try ... catch is a JavaScript construct that allows you to handle errors in asynchronous code.
    // It means that if an error occurs in the try block, the catch block will be executed, allowing you to handle the error gracefully.
    // In Vue, we would use a .catch() method on the promise to achieve the same effect.
    try {
      // Build updated job object
      const updatedJob: Job = {
        ...job,
        company,
        role: position,
        position,
        salary,
        appliedDate,
        rating,
        workMode,
        url,
        description,
      };

      await onSave(updatedJob);
      onClose();
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0e1013] border border-[#1a1d24] w-full max-w-xl p-6 rounded-2xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 border-b border-[#171920] pb-3">
          <div>
            <h3 className="text-sm font-bold tracking-wider text-slate-200 uppercase">
              Edit Application
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Update application details and fit assessment
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-white cursor-pointer text-sm p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Row 1: Company Name & Position */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-[#08090b] border border-[#171920] focus:border-cyan-500/50 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
                Position / Title *
              </label>
              <input
                type="text"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full bg-[#08090b] border border-[#171920] focus:border-cyan-500/50 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Row 2: Salary Target & Application Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
                Salary Target
              </label>
              <input
                type="text"
                placeholder="e.g. £85,000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full bg-[#08090b] border border-[#171920] focus:border-cyan-500/50 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none transition-colors placeholder:text-slate-700"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
                Application Date
              </label>
              <input
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                className="w-full bg-[#08090b] border border-[#171920] focus:border-cyan-500/50 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Row 3: Job Fit Match & Work Setup */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
                Job Fit Match
              </label>
              {/* Interactive Star Rating */}
              <div className="flex gap-1 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(rating === star ? 0 : star)}
                    className={`text-lg cursor-pointer transition-colors ${
                      star <= rating ? 'text-amber-400' : 'text-slate-700 hover:text-slate-500'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
                Work Setup
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full bg-[#08090b] border border-[#171920] focus:border-cyan-500/50 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          {/* Row 4: Application Link */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
              Application Link
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[#08090b] border border-[#171920] focus:border-cyan-500/50 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none transition-colors placeholder:text-slate-700"
            />
          </div>

          {/* Row 5: Job Description / Notes */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
              Job Description / Notes
            </label>
            <textarea
              rows={4}
              placeholder="Paste job details or requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#08090b] border border-[#171920] focus:border-cyan-500/50 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none transition-colors placeholder:text-slate-700 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4 border-t border-[#171920] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#121418] hover:bg-[#181b21] text-xs font-bold text-slate-400 rounded-xl cursor-pointer transition-colors border border-[#1d2028]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}