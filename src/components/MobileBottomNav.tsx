import React from 'react';
import { Briefcase, CalendarDays, Mic, Scale } from 'lucide-react';
import { NavTab } from '../types/career';

interface MobileBottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

const MOBILE_TABS: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'applications', label: 'Pipeline', icon: Briefcase },
  { id: 'coach', label: 'Coach', icon: Mic },
  { id: 'offers', label: 'Offers', icon: Scale },
  { id: 'schedule', label: 'Schedule', icon: CalendarDays },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-[0_-4px_16px_rgba(15,23,42,0.06)]"
    >
      <div className="grid grid-cols-4 h-16 px-2">
        {MOBILE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#4F46E5] ${
                isActive ? 'text-[#4F46E5]' : 'text-[#64748B] hover:text-[#0B1C30]'
              }`}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className={`text-[11px] leading-none tracking-tight whitespace-nowrap ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
