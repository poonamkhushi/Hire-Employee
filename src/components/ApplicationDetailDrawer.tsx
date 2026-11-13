import React, { useEffect, useState } from 'react';
import { CalendarPlus, Check, Trash2, X } from 'lucide-react';
import { STAGE_META } from '../data/initialCareerData';
import { ApplicationStage, InterviewRoundLog, JobApplication } from '../types/career';

interface ApplicationDetailDrawerProps {
  application: JobApplication | null;
  onClose: () => void;
  onMoveStage: (appId: string, nextStage: ApplicationStage) => void;
  onUpdateNotes: (appId: string, notes: string) => void;
  onAddInterviewLog: (appId: string, log: Omit<InterviewRoundLog, 'id'>) => void;
  onDeleteApp: (appId: string) => void;
  onJumpToOffers: () => void;
}

const STAGES: ApplicationStage[] = ['submitted', 'interview', 'offer', 'archived'];

export const ApplicationDetailDrawer: React.FC<ApplicationDetailDrawerProps> = ({
  application,
  onClose,
  onMoveStage,
  onUpdateNotes,
  onAddInterviewLog,
  onDeleteApp,
  onJumpToOffers,
}) => {
  const [notesDraft, setNotesDraft] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [roundTitle, setRoundTitle] = useState('');
  const [dateLabel, setDateLabel] = useState('Nov 16');
  const [timeLabel, setTimeLabel] = useState('2:00 PM');
  const [interviewer, setInterviewer] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [roundOutcome, setRoundOutcome] = useState<'Upcoming' | 'Advanced' | 'Completed'>('Upcoming');
  const [roundNotes, setRoundNotes] = useState('');

  useEffect(() => {
    if (application) {
      setNotesDraft(application.notes);
      setNotesSaved(false);
      setShowLogForm(false);
      setConfirmDelete(false);
    }
  }, [application]);

  if (!application) return null;

  const handleSaveNotes = () => {
    onUpdateNotes(application.id, notesDraft);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 1800);
  };

  const handleCreateRound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roundTitle.trim()) return;
    onAddInterviewLog(application.id, {
      roundTitle: roundTitle.trim(),
      dateLabel: dateLabel.trim() || 'TBD',
      timeLabel: timeLabel.trim() || 'TBD',
      interviewer: interviewer.trim() || 'Hiring Team',
      durationMinutes: Number(durationMinutes) || 45,
      outcome: roundOutcome,
      notes: roundNotes.trim(),
    });
    setRoundTitle('');
    setInterviewer('');
    setRoundNotes('');
    setShowLogForm(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end bg-[#0B1C30]/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-role-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-t-none md:rounded-l-2xl max-h-[90vh] md:max-h-screen flex flex-col border-t md:border-l border-[#E2E8F0] shadow-[0_16px_24px_-6px_rgba(15,23,42,0.12)]"
      >
        {/* Mobile Drag Handle */}
        <div className="md:hidden pt-3 pb-1">
          <div className="w-10 h-1.5 bg-[#CBD5E1] rounded-full mx-auto" />
        </div>

        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: application.brandHue }}
              aria-hidden="true"
            >
              {application.initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#475569]">{application.company}</p>
              <h2
                id="drawer-role-title"
                className="text-lg font-bold text-[#0B1C30] leading-snug"
              >
                {application.role}
              </h2>
              <p className="mt-1 text-xs text-[#64748B] tabular-nums">
                <span className="font-bold text-[#1E1B4B]">{application.payLabel}</span>
                <span className="mx-1.5" aria-hidden="true">·</span>
                {application.location} ({application.workMode})
                <span className="mx-1.5" aria-hidden="true">·</span>
                Applied {application.appliedDate}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close application details"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0B1C30] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Pipeline Stage Progression */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-[#475569]">Pipeline Stage</h3>
              {application.stage === 'offer' && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onJumpToOffers();
                  }}
                  className="text-xs font-semibold text-[#059669] hover:underline"
                >
                  Compare Offer Terms →
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STAGES.map((stageId) => {
                const meta = STAGE_META[stageId];
                const active = application.stage === stageId;
                return (
                  <button
                    key={stageId}
                    type="button"
                    onClick={() => onMoveStage(application.id, stageId)}
                    className={`min-h-[44px] px-2.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      active
                        ? 'bg-[#1E1B4B] border-[#1E1B4B] text-white'
                        : 'bg-white border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {meta.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes & Strategy */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="role-notes" className="text-xs font-bold text-[#475569]">
                Role Strategy & Prep Notes
              </label>
              {notesSaved && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#059669]">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>
            <textarea
              id="role-notes"
              rows={3}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              className="w-full p-3 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5] transition-colors"
              placeholder="Capture hiring manager priorities, key product metrics, or follow-up questions..."
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={notesDraft === application.notes}
                className="h-9 px-3.5 rounded-lg bg-[#4F46E5]/10 hover:bg-[#4F46E5]/15 disabled:opacity-45 text-[#4F46E5] text-xs font-semibold transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>

          {/* Interview Rounds Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#475569]">
                Interview Rounds ({application.interviewLogs.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowLogForm((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] hover:text-[#3323CC]"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>{showLogForm ? 'Cancel' : 'Add Round'}</span>
              </button>
            </div>

            {showLogForm && (
              <form
                onSubmit={handleCreateRound}
                className="mb-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3"
              >
                <input
                  type="text"
                  required
                  value={roundTitle}
                  onChange={(e) => setRoundTitle(e.target.value)}
                  placeholder="Round title (e.g., System Design Loop)"
                  className="w-full h-11 px-3 bg-white border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:border-2 focus:border-[#4F46E5]"
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={dateLabel}
                    onChange={(e) => setDateLabel(e.target.value)}
                    placeholder="Date (e.g., Nov 18)"
                    className="w-full h-11 px-3 bg-white border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:border-2 focus:border-[#4F46E5]"
                  />
                  <input
                    type="text"
                    value={timeLabel}
                    onChange={(e) => setTimeLabel(e.target.value)}
                    placeholder="Time (e.g., 2:00 PM)"
                    className="w-full h-11 px-3 bg-white border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:border-2 focus:border-[#4F46E5]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={interviewer}
                    onChange={(e) => setInterviewer(e.target.value)}
                    placeholder="Interviewer & Role"
                    className="w-full h-11 px-3 bg-white border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:border-2 focus:border-[#4F46E5]"
                  />
                  <select
                    value={roundOutcome}
                    onChange={(e) =>
                      setRoundOutcome(e.target.value as 'Upcoming' | 'Advanced' | 'Completed')
                    }
                    className="w-full h-11 px-3 bg-white border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2.5 items-center">
                  <label className="text-xs font-medium text-[#475569]">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={180}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full h-11 px-3 bg-white border border-[#CBD5E1] rounded-lg text-sm tabular-nums focus:outline-none focus:border-2 focus:border-[#4F46E5]"
                  />
                </div>
                <textarea
                  rows={2}
                  value={roundNotes}
                  onChange={(e) => setRoundNotes(e.target.value)}
                  placeholder="Key topics, questions asked, or feedback..."
                  className="w-full p-3 bg-white border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:border-2 focus:border-[#4F46E5]"
                />
                <button
                  type="submit"
                  className="w-full h-11 rounded-lg bg-[#1E1B4B] hover:bg-[#312E81] text-white text-sm font-semibold transition-colors"
                >
                  Save Interview Round
                </button>
              </form>
            )}

            {application.interviewLogs.length === 0 ? (
              <p className="text-sm text-[#64748B] py-4 border border-dashed border-[#E2E8F0] rounded-xl text-center">
                No interview rounds logged yet.
              </p>
            ) : (
              <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] rounded-xl overflow-hidden">
                {application.interviewLogs.map((log) => (
                  <div key={log.id} className="p-3.5 bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[#0B1C30]">
                          {log.roundTitle}
                        </p>
                        <p className="text-xs text-[#64748B] mt-0.5 tabular-nums">
                          {log.dateLabel} · {log.timeLabel} · {log.durationMinutes} min · {log.interviewer}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                          log.outcome === 'Advanced'
                            ? 'bg-[#ECFDF5] text-[#059669]'
                            : log.outcome === 'Upcoming'
                            ? 'bg-[#FFFBEB] text-[#D97706]'
                            : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}
                      >
                        {log.outcome}
                      </span>
                    </div>
                    {log.notes && (
                      <p className="mt-2 text-xs text-[#475569] leading-relaxed">
                        {log.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer Actions */}
        <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold text-[#BA1A1A] hover:bg-[#FFDAD6]/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              <span>Remove Role</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onDeleteApp(application.id)}
                className="min-h-[40px] px-3 rounded-lg bg-[#BA1A1A] text-white text-xs font-semibold"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="min-h-[40px] px-3 rounded-lg border border-[#CBD5E1] bg-white text-xs font-semibold text-[#475569]"
              >
                Cancel
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 rounded-lg bg-[#1E1B4B] hover:bg-[#312E81] text-white text-sm font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
