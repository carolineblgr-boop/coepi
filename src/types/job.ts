export type JobStatus = 'wishlist' | 'applied' | 'interviewing' | 'offer' | 'rejected';

export interface Job {
  id: string;
  company: string;
  role?: string;
  position?: string;
  status: JobStatus | string;
  appliedDate?: string | null;
  date?: string | null;
  location?: string | null;
  description?: string | null;
  salary?: string | null;
  link?: string | null;
  rating?: number | null;
  workMode?: 'Remote' | 'Hybrid' | 'On-site' | string | null;
  commuteTimeMinutes?: number | null;
}