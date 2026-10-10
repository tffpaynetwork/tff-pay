import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchActiveTasks, submitTaskProof, uploadScreenshot } from '../../firebase/services';
import { Task } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';
import { CheckSquare, Upload, AlertCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';

export const Tasks: React.FC = () => {
  const { userProfile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userNote, setUserNote] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchActiveTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !file || !userProfile) return;

    try {
      setSubmitting(true);
      const screenshotUrl = await uploadScreenshot(file, userProfile.uid);

      await submitTaskProof({
        taskId: selectedTask.id,
        taskTitle: selectedTask.title,
        userId: userProfile.uid,
        userEmail: userProfile.email,
        screenshots: [screenshotUrl],
        userNote
      });

      setToast({ message: 'Task submitted successfully! Awaiting review.', type: 'success' });
      setSelectedTask(null);
      setFile(null);
      setUserNote('');
    } catch (err: any) {
      setToast({ message: 'Failed to submit task proof. Try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto space-y-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-primary-600" /> Available Tasks
        </h2>
        <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
          {tasks.length} Tasks Left
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">No active tasks right now!</p>
          <p className="text-xs text-slate-400 mt-1">Please check back again later.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md ${
                    task.platform === 'bkash' ? 'bg-pink-50 text-pink-600 border border-pink-100' :
                    task.platform === 'nagad' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                    'bg-sky-50 text-sky-600 border border-sky-100'
                  }`}>
                    {task.platform}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 mt-1">{task.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-600">৳{task.rewardAmount}</span>
                  <p className="text-[10px] text-slate-400">Reward</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">{task.description}</p>

              <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                <span className="text-[11px] text-slate-400">
                  Slots: <strong className="text-slate-700">{task.claimedSlots}/{task.totalSlots}</strong>
                </span>
                <button
                  onClick={() => setSelectedTask(task)}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1"
                >
                  Start Task <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Proof Submission Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title || 'Submit Task Proof'}
      >
        {selectedTask && (
          <form onSubmit={handleTaskSubmit} className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-2">
              <p className="font-bold text-slate-700">Instructions:</p>
              <p className="text-slate-600 whitespace-pre-line">{selectedTask.description}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Upload Proof Screenshot
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-primary-400 transition-colors bg-slate-50 relative">
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-1">
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                  <span className="text-xs text-slate-600 font-medium">
                    {file ? file.name : 'Tap to upload screenshot'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Account/Transaction Details (Optional)
              </label>
              <input
                type="text"
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="e.g., Transaction ID or phone number used"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !file}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Proof'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};
