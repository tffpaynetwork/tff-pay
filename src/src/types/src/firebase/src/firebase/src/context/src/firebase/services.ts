import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, query, where, orderBy, serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
import { Task, TaskSubmission, WithdrawalRequest, SupportTicket } from '../types';

// Task Services
export const fetchActiveTasks = async (): Promise<Task[]> => {
  const q = query(collection(db, 'tasks'), where('status', '==', 'active'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
};

export const fetchAllTasksAdmin = async (): Promise<Task[]> => {
  const snapshot = await getDocs(collection(db, 'tasks'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
};

export const createNewTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'claimedSlots'>) => {
  await addDoc(collection(db, 'tasks'), {
    ...taskData,
    claimedSlots: 0,
    createdAt: new Date().toISOString()
  });
};

export const updateTaskStatus = async (taskId: string, status: 'active' | 'paused' | 'closed') => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, { status });
};

// Screenshot Upload Service
export const uploadScreenshot = async (file: File, userId: string): Promise<string> => {
  const fileName = `screenshots/${userId}_${Date.now()}_${file.name}`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// Task Submission Services
export const submitTaskProof = async (submission: Omit<TaskSubmission, 'id' | 'submittedAt' | 'status'>) => {
  await addDoc(collection(db, 'submissions'), {
    ...submission,
    status: 'pending',
    submittedAt: new Date().toISOString()
  });
};

export const fetchUserSubmissions = async (userId: string): Promise<TaskSubmission[]> => {
  const q = query(collection(db, 'submissions'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TaskSubmission));
};

export const fetchAllSubmissionsAdmin = async (): Promise<TaskSubmission[]> => {
  const snapshot = await getDocs(collection(db, 'submissions'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TaskSubmission));
};

export const updateSubmissionStatusAdmin = async (
  subId: string, 
  status: 'approved' | 'rejected', 
  userId: string, 
  rewardAmount: number,
  rejectionReason?: string
) => {
  const subRef = doc(db, 'submissions', subId);
  await updateDoc(subRef, {
    status,
    rejectionReason: rejectionReason || '',
    reviewedAt: new Date().toISOString()
  });

  // If approved, credit balance to user
  if (status === 'approved') {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const currentBalance = userSnap.data().mainBalance || 0;
      await updateDoc(userRef, {
        mainBalance: currentBalance + rewardAmount
      });
    }
  }
};

// Withdrawal Services
export const requestWithdrawal = async (withdrawal: Omit<WithdrawalRequest, 'id' | 'requestedAt' | 'status'>) => {
  await addDoc(collection(db, 'withdrawals'), {
    ...withdrawal,
    status: 'pending',
    requestedAt: new Date().toISOString()
  });
};

export const fetchUserWithdrawals = async (userId: string): Promise<WithdrawalRequest[]> => {
  const q = query(collection(db, 'withdrawals'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithdrawalRequest));
};

export const fetchAllWithdrawalsAdmin = async (): Promise<WithdrawalRequest[]> => {
  const snapshot = await getDocs(collection(db, 'withdrawals'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithdrawalRequest));
};

export const updateWithdrawalStatusAdmin = async (withdrawalId: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
  const wRef = doc(db, 'withdrawals', withdrawalId);
  await updateDoc(wRef, {
    status,
    rejectionReason: rejectionReason || '',
    processedAt: new Date().toISOString()
  });
};

// Support Tickets
export const createSupportTicket = async (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
  await addDoc(collection(db, 'tickets'), {
    ...ticket,
    status: 'open',
    createdAt: new Date().toISOString()
  });
};

export const fetchUserTickets = async (userId: string): Promise<SupportTicket[]> => {
  const q = query(collection(db, 'tickets'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
};

export const fetchAllTicketsAdmin = async (): Promise<SupportTicket[]> => {
  const snapshot = await getDocs(collection(db, 'tickets'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
};
