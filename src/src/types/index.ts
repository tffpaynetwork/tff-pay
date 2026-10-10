export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  role: UserRole;
  mainBalance: number;
  commissionBalance: number;
  referralCode: string;
  referredBy?: string;
  totalReferredCount: number;
  createdAt: string;
  isBlocked?: boolean;
}

export type TaskPlatform = 'bkash' | 'nagad' | 'other';
export type TaskStatus = 'active' | 'paused' | 'closed';

export interface Task {
  id: string;
  title: string;
  description: string;
  platform: TaskPlatform;
  rewardAmount: number;
  instructions: string[];
  requiredScreenshotCount: number;
  totalSlots: number;
  claimedSlots: number;
  status: TaskStatus;
  createdAt: string;
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface TaskSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  userId: string;
  userEmail: string;
  screenshots: string[];
  userNote?: string;
  status: SubmissionStatus;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export type WithdrawalMethod = 'bkash' | 'nagad';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  method: WithdrawalMethod;
  accountNumber: string;
  status: WithdrawalStatus;
  rejectionReason?: string;
  requestedAt: string;
  processedAt?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'task_reward' | 'referral_commission' | 'withdrawal' | 'refund';
  description: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: string;
}
