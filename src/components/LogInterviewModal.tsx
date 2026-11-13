import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { InterviewRoundLog, JobApplication } from '../types/career';

interface LogInterviewModalProps {
  isOpen: boolean;
  applications: JobApplication[];
  onClose: () => void;
  onLogInterview: (appId: string, log: Omit<InterviewRoundLog, 'id'>) => void;
}

export const LogInterviewModal: React.FC<LogInterviewModalProps> = ({
  isOpen,
  applications,
  onClose,
  onLogInterview,
}) => {
  const activeApps = applications.filter((a) => a.stage !== 'archived');
  const [selectedAppId, setSelectedAppId] = useState(activeApps[0]?.id ?? '');
  const [roundTitle, setRoundTitle] = useState('');
  const [dateLabel, setDateLabel] = useState('Nov 16');
  const [timeLabel, setTimeLabel] = useState('2:00 PM');
  const [interviewer, setInterviewer] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [outcome, setOutcome] = useState<'Upcoming' | 'Advanced' | 'Completed'>('Upcoming');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen && activeApps.length > 0 && !activeApps.some((a) => a.id === selectedAppId)) {
      setSelectedAppId(activeApps[0].id);
    }
  }, [isOpen, activeApps, selectedAppId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId || !roundTitle.trim()) return;
    onLogInterview(selectedAppId, {
      roundTitle: roundTitle.trim(),
      dateLabel: dateLabel.trim() || 'Nov 16',
      timeLabel: timeLabel.trim() || '2:00 PM',
      interviewer: interviewer.trim() || 'Hiring Panel',
      durationMinutes: Number(durationMinutes) || 45,
      outcome,
      notes: notes.trim(),
    });
    setRoundTitle('');
    setInterviewer('');
    setNotes('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-[#0B1C30]/40 backdrop-blur-[2px] md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="log-interview-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-2xl border border-[#E2E8F0] shadow-[0_16px_24px_-6px_rgba(15,23,42,0.12)] max-h-[90vh] flex flex-col"
      >
        <div className="md:hidden pt-3 pb-1">
          <div className="w-10 h-1.5 bg-[#CBD5E1] rounded-full mx-auto" />
        </div>

        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 id="log-interview-title" className="text-lg font-bold text-[#0B1C30]">
            Log Interview Round
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Log Interview"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <div>
            <label htmlFor="li-app" className="block text-xs font-bold text-[#475569] mb-1.5">
              Target Application
            </label>
            <select
              id="li-app"
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="w-full h-12 px-3 bg-white border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
            >
              {activeApps.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.company} — {app.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="li-round" className="block text-xs font-bold text-[#475569] mb-1.5">
              Interview Round Title
            </label>
            <input
              id="li-round"
              type="text"
              required
              value={roundTitle}
              onChange={(e) => setRoundTitle(e.target.value)}
              placeholder="e.g., Executive Product Strategy Loop"
              className="w-full h-12 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="li-date" className="block text-xs font-bold text-[#475569] mb-1.5">
                Date
              </label>
              <input
                id="li-date"
                type="text"
                value={dateLabel}
                onChange={(e) => setDateLabel(e.target.value)}
                className="w-full h-12 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
              />
            </div>

            <div>
              <label htmlFor="li-time" className="block text-xs font-bold text-[#475569] mb-1.5">
                Time
              </label>
              <input
                id="li-time"
                type="text"
                value={timeLabel}
                onChange={(e) => setTimeLabel(e.target.value)}
                className="w-full h-12 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="li-interviewer" className="block text-xs font-bold text-[#475569] mb-1.5">
                Interviewer
              </label>
              <input
                id="li-interviewer"
                type="text"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                placeholder="Name & Title"
                className="w-full h-12 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
              />
            </div>

            <div>
              <label htmlFor="li-outcome" className="block text-xs font-bold text-[#475569] mb-1.5">
                Status
              </label>
              <select
                id="li-outcome"
                value={outcome}
                onChange={(e) =>
                  setOutcome(e.target.value as 'Upcoming' | 'Advanced' | 'Completed')
                }
                className="w-full h-12 px-3 bg-white border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Advanced">Advanced</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <label htmlFor="li-duration" className="text-xs font-bold text-[#475569]">
              Duration (minutes)
            </label>
            <input
              id="li-duration"
              type="number"
              min={15}
              max={240}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full h-12 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm tabular-nums text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
            />
          </div>

          <div>
            <label htmlFor="li-notes" className="block text-xs font-bold text-[#475569] mb-1.5">
              Prep Focus / Feedback Notes
            </label>
            <textarea
              id="li-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Topics to cover, interviewer focus, or key takeaways..."
              className="w-full p-3 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] text-sm font-semibold text-[#1E1B4B] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] h-12 rounded-lg bg-[#1E1B4B] hover:bg-[#312E81] text-white text-sm font-semibold transition-colors"
            >
              Save Interview Round
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
