// src/components/AddJobModal.tsx
'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobApplicationSchema, JobApplicationFormValues } from '@/lib/schemas';

export default function AddJobModal() {
  const [open, setOpen] = useState(false);

  // Initialize React Hook Form with Zod validation
  const {
    register, // A function we attach to each <input /> so RHF can track its value and errors
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JobApplicationFormValues>({
    resolver: zodResolver(jobApplicationSchema), // Plugs Zod into React Hook Form
    defaultValues: {
      companyName: '',
      jobTitle: '',
      status: 'APPLIED',
      salary: '',
      notes: '',
    },
  });

  const onSubmit = (data: JobApplicationFormValues) => {
    console.log('Valid submitted data:', data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-indigo-600 cursor-pointer hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2 rounded-lg transition shadow-md hover:shadow-indigo-500/20">
          + Add New Job
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" />

        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl w-full max-w-md focus:outline-none">
          <Dialog.Title className="text-xl font-bold text-slate-100">
            Add Job Application
          </Dialog.Title>
          <Dialog.Description className="text-sm text-slate-400 mt-1 mb-5">
            Fill in the details below. Zod will validate input before saving.
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Company Name *
              </label>
              <input
                {...register('companyName')}
                type="text"
                placeholder="e.g. OpenAI"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.companyName && (
                <p className="text-xs text-rose-400 mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Job Title *
              </label>
              <input
                {...register('jobTitle')}
                type="text"
                placeholder="e.g. Frontend Engineer"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.jobTitle && (
                <p className="text-xs text-rose-400 mt-1">
                  {errors.jobTitle.message}
                </p>
              )}
            </div>

            {/* Status Select */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Application Status
              </label>
              <select
                {...register('status')}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEWING">Interviewing</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm px-4 py-2 rounded-lg transition"
              >
                Save Application
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-sm p-1 rounded-md"
              aria-label="Close"
            >
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}