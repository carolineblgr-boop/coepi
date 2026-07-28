// src/components/AddJobModal.tsx
'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobApplicationSchema, JobApplicationFormValues } from '@/lib/schemas';

interface AddJobModalProps {
  trigger?: ReactNode;
}

export default function AddJobModal({ trigger }: AddJobModalProps) {
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
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111317] border border-[#1F232D] rounded-xl p-6 shadow-2xl w-full max-w-md focus:outline-none">
          <Dialog.Title className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">3            Add Job Application
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Company Name */}
            <div>
              <label className="text-[9px] uppercase font-bold tracking-wider text-slate-300">
                Company Name *
              </label>
              <input
                {...register('companyName')}
                type="text"
                placeholder="e.g. OpenAI"
                className="w-full bg-[#090A0C] border border-[#181a1f] rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60"
              />
              {errors.companyName && (
                <p className="text-xs text-rose-400 mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Job Title */}
            <div>
              <label className="text-[9px] uppercase font-bold tracking-wider text-slate-300">
                Job Title *
              </label>
              <input
                {...register('jobTitle')}
                type="text"
                placeholder="e.g. Frontend Engineer"
                className="w-full bg-[#090A0C] border border-[#181a1f] rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60"
              />
              {errors.jobTitle && (
                <p className="text-xs text-rose-400 mt-1">
                  {errors.jobTitle.message}
                </p>
              )}
            </div>

            {/* Status Select */}
            <div>
              <label className="text-[9px] uppercase font-bold tracking-wider text-slate-300">
                Application Status
              </label>
              <select
                {...register('status')}
                className="w-full bg-[#090A0C] border border-[#181a1f] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/60"
              >
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEWING">Interviewing</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-sm cursor-pointer text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-cyan-500 hover:bg-cyan-700 hover:text-cyan-100 cursor-pointer disabled:opacity-50 text-cyan-950 font-medium text-sm px-4 py-2 rounded-lg transition"
              >
                Save Application
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute cursor-pointer top-4 right-4 text-slate-500 hover:text-cyan-400 text-sm p-1 rounded-md"
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