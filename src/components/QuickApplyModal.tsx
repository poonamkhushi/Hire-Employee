import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ApplicationStage, JobApplication, WorkMode } from '../types/career';

interface QuickApplyModalProps {
  isOpen: boolean;
  defaultStage?: ApplicationStage;
  onClose: () => void;
  onAddApplication: (app: Omit<JobApplication, 'id'>) => void;
}

const BRAND_PALETTE = ['#4F46E5', '#1E1B4B', '#059669', '#D97706', '#0F172A', '#6366F1'];

export const QuickApplyModal: React.FC<QuickApplyModalProps> = ({
  isOpen,
  defaultStage = 'submitted',
  onClose,
  onAddApplication,
}) => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [payBand, setPayBand] = useState('195000');
  const [location, setLocation] = useState('San Francisco, CA');
  const [workMode, setWorkMode] = useState<WorkMode>('Hybrid');
  const [stage, setStage] = useState<ApplicationStage>(defaultStage);
  const [nextEventTime, setNextEventTime] = useState('Nov 19 · Pending');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setStage(defaultStage);
  }, [defaultStage, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const cleanCompany = company.trim();
    const initials = cleanCompany
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('')
      .padEnd(2, cleanCompany[1]?.toUpperCase() || 'X')
      .slice(0, 2);

    const numericPay = Math.max(50000, Number(payBand) || 180000);
    const formattedPay = `$${numericPay.toLocaleString('en-US')} / yr`;
    const colorIndex = cleanCompany.length % BRAND_PALETTE.length;

    onAddApplication({
      company: cleanCompany,
      initials,
      brandHue: BRAND_PALETTE[colorIndex],
      role: role.trim(),
      payBand: numericPay,
      payLabel: formattedPay,
      location: location.trim() || 'Remote (US)',
      workMode,
      stage,
      appliedDate: 'Nov 12',
      nextEventLabel: stage === 'offer' ? 'Offer Review' : stage === 'interview' ? 'Upcoming Screen' : 'Application Sent',
      nextEventTime: nextEventTime.trim() || 'Nov 12 · Sent',
      notes: notes.trim(),
      interviewLogs: [],
      ...(stage === 'offer'
        ? {
            offer: {
              baseSalary: numericPay,
              annualEquity: Math.round(numericPay * 0.45),
              signOnBonus: 25000,
              targetBonusPct: 15,
              ptoDays: 20,
              learningStipend: 2500,
              deadlineLabel: 'Nov 30',
            },
          }
        : {}),
    });

    setCompany('');
    setRole('');
    setNotes('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-[#0B1C30]/40 backdrop-blur-[2px] md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-apply-title"
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
          <h2 id="quick-apply-title" className="text-lg font-bold text-[#0B1C30]">
            Quick Apply
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Quick Apply"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="qa-company" className="block text-xs font-bold text-[#475569] mb-1.5">
                Company
              </label>
              <input
                id="qa-company"
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Anthropic"
                className="w-full h-12 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
              />
            </div>

            <div>
              <label htmlFor="qa-stage" className="block text-xs font-bold text-[#475569] mb-1.5">
                Initial Stage
              </label>
              <select
                id="qa-stage"
                value={stage}
                onChange={(e) => setStage(e.target.value as ApplicationStage)}
                className="w-full h-12 px-3 bg-white border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
              >
                <option value="submitted">Application Submitted</option>
                <option value="interview">Interview Round</option>
                <option value="offer">Offer Stage</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="qa-role" className="block text-xs font-bold text-[#475569] mb-1.5">
              Role Title
            </label>
            <input
              id="qa-role"
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Staff Product Manager, Platform"
              className="w-full h-12 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="qa-pay" className="block text-xs font-bold text-[#475569] mb-1.5">
                Base Salary Target (USD / yr)
              </label>
              <input
                id="qa-pay"
                type="number"
                min={40000}
                step={5000}
                value={payBand}
                onChange={(e) => setPayBand(e.target.value)}
                className="w-full h-12 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm tabular-nums text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
              />
            </div>

            <div>
              <label htmlFor="qa-mode" className="block text-xs font-bold text-[#475569] mb-1.5">
                Work Mode
              </label>
              <select
                id="qa-mode"
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                className="w-full h-12 px-3 bg-white border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="qa-location" className="block text-xs font-bold text-[#475569] mb-1.5">
                Location
              </label>
              <input
                id="qa-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-12 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
              />
            </div>

            <div>
              <label htmlFor="qa-next" className="block text-xs font-bold text-[#475569] mb-1.5">
                Next Milestone
              </label>
              <input
                id="qa-next"
                type="text"
                value={nextEventTime}
                onChange={(e) => setNextEventTime(e.target.value)}
                className="w-full h-12 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="qa-notes" className="block text-xs font-bold text-[#475569] mb-1.5">
              Referral or Role Notes
            </label>
            <textarea
              id="qa-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Referral contact, tailored angle, or compensation band notes..."
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
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
