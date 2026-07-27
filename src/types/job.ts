export type JobStatus = 'wishlist' | 'applied' | 'interviewing' | 'offer' | 'rejected';

export interface Job {
  id: string;
  company: string;
  position: string;
  location?: string;
  status: JobStatus;
  appliedDate?: string;
  description?: string;
}