import React from 'react';
import { Plus } from 'lucide-react';
import { NavTab } from '../types/career';

interface TopBarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenQuickApply: () => void;
}

const NAV_ITEMS: { id: NavTab; label: string }[] = [
  { id: 'applications', label: 'Applications' },
  { id: 'coach', label: 'Interview Coach' },
  { id: 'offers', label: 'Offer Comparison' },
  { id: 'schedule', label: 'Schedule' },
];

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickApply,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('applications')}
          className="text-lg font-bold tracking-tight text-[#1E1B4B] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4F46E5] rounded"
        >
          Cadence
        </button>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative py-5 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4F46E5] ${
                  isActive
                    ? 'text-[#1E1B4B] font-semibold'
                    : 'text-[#64748B] hover:text-[#0B1C30]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-[#4F46E5] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenQuickApply}
            className="inline-flex items-center justify-center gap-1.5 h-10 md:h-11 px-4 rounded-lg bg-[#1E1B4B] hover:bg-[#312E81] active:scale-[0.98] text-white text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5]"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Quick Apply</span>
          </button>
        </div>
      </div>
    </header>
  );
};
