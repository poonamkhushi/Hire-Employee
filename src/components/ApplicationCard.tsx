import React from 'react';
import { ChevronRight } from 'lucide-react';
import { STAGE_META } from '../data/initialCareerData';
import { JobApplication } from '../types/career';

interface ApplicationCardProps {
  application: JobApplication;
  onSelect: (app: JobApplication) => void;
  isSelected?: boolean;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onSelect,
  isSelected = false,
}) => {
  const stageStyle = STAGE_META[application.stage];

  return (
    <button
      type="button"
      onClick={() => onSelect(application)}
      className={`w-full text-left bg-white rounded-2xl p-4 border transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5] group ${
        isSelected
          ? 'border-[#4F46E5] shadow-[0_8px_16px_-4px_rgba(30,27,75,0.08)]'
          : 'border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:border-[#CBD5E1] hover:shadow-[0_6px_14px_-4px_rgba(30,27,75,0.06)]'
      }`}
    >
      {/* Header: Company & Role */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold tracking-tight text-white"
            style={{ backgroundColor: application.brandHue }}
            aria-hidden="true"
          >
            {application.initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#475569] truncate">
              {application.company}
            </p>
            <h3 className="text-[15px] font-semibold text-[#0B1C30] leading-snug mt-0.5 line-clamp-2">
              {application.role}
            </h3>
          </div>
        </div>
        <ChevronRight
          className="w-4 h-4 text-[#94A3B8] group-hover:text-[#4F46E5] group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
          aria-hidden="true"
        />
      </div>

      {/* Middle row: Pay & Location */}
      <div className="mt-3.5 pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className="text-xs font-bold text-[#1E1B4B] tabular-nums">
          {application.payLabel}
        </span>
        <span className="text-xs text-[#64748B] truncate">
          {application.location} <span aria-hidden="true">·</span> {application.workMode}
        </span>
      </div>

      {/* Bottom footer: Current Stage badge + next event timestamp */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-tight whitespace-nowrap shrink-0 ${stageStyle.badgeBg} ${stageStyle.badgeText}`}
        >
          {application.offer?.isSigned ? 'Offer Signed' : stageStyle.shortLabel}
        </span>
        <span className="text-[11px] font-medium text-[#64748B] tabular-nums truncate">
          {application.nextEventTime}
        </span>
      </div>
    </button>
  );
};
