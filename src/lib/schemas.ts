//Imports the z object, which is Zod's toolbox containing all primitive types
// (z.string(), z.number(), z.boolean(), etc.) and validation rules.
import { z } from 'zod';

// Tells Zod we are defining the validation rules for a JavaScript object
// (like a form payload or an API response).
export const jobApplicationSchema = z.object({
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters'),

  jobTitle: z
    .string()
    .min(2, 'Job title must be at least 2 characters'),

  // Restricts the value to only one of those four exact string choices.
  // If someone passes "PENDING",
  // Zod immediately rejects it because it isn't in the allowed list.
  status: z.enum(['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED'], {
    message: 'Please select a valid status',
  }),

  salary: z.string().optional(),
  notes: z
    .string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional(),

});

export type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;
