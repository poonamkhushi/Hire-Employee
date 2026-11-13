import React, { useMemo, useState } from 'react';
import { CalendarPlus, LayoutGrid, List, Search, X } from 'lucide-react';
import { STAGE_META } from '../data/initialCareerData';
import { ApplicationStage, JobApplication, WorkMode } from '../types/career';
import { ApplicationCard } from './ApplicationCard';

interface ApplicationsBoardProps {
  applications: JobApplication[];
  selectedAppId: string | null;
  onSelectApp: (app: JobApplication) => void;
  onOpenQuickApply: (defaultStage?: ApplicationStage) => void;
  onOpenLogInterview: () => void;
  onMoveStage: (appId: string, nextStage: ApplicationStage) => void;
}

const STAGES_ORDER: ApplicationStage[] = ['submitted', 'interview', 'offer', 'archived'];

export const ApplicationsBoard: React.FC<ApplicationsBoardProps> = ({
  applications,
  selectedAppId,
  onSelectApp,
  onOpenQuickApply,
  onOpenLogInterview,
  onMoveStage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState<'All' | WorkMode>('All');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [activeStageColumn, setActiveStageColumn] = useState<ApplicationStage>('interview');

  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return applications.filter((app) => {
      const matchesQuery =
        !q ||
        app.company.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q) ||
        app.location.toLowerCase().includes(q);
      const matchesMode = workModeFilter === 'All' || app.workMode === workModeFilter;
      return matchesQuery && matchesMode;
    });
  }, [applications, searchQuery, workModeFilter]);

  const groupedByStage = useMemo(() => {
    const map: Record<ApplicationStage, JobApplication[]> = {
      submitted: [],
      interview: [],
      offer: [],
      archived: [],
    };
    for (const app of filteredApps) {
      map[app.stage].push(app);
    }
    return map;
  }, [filteredApps]);

  const activeCount = useMemo(
    () => applications.filter((a) => a.stage !== 'archived').length,
    [applications]
  );
  const interviewCount = useMemo(
    () => applications.filter((a) => a.stage === 'interview').length,
    [applications]
  );
  const offerCount = useMemo(
    () => applications.filter((a) => a.stage === 'offer').length,
    [applications]
  );

  const hasActiveFilters = searchQuery.trim().length > 0 || workModeFilter !== 'All';

  return (
    <section aria-labelledby="applications-heading" className="space-y-6">
      {/* Page Anchor & Inline Summary Tally */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1
            id="applications-heading"
            className="text-[28px] md:text-[36px] font-bold leading-tight tracking-tight text-[#0B1C30]"
          >
            Active Applications
          </h1>
          <p className="mt-1.5 text-sm text-[#475569] tabular-nums">
            <span className="font-semibold text-[#0B1C30]">{activeCount}</span> active roles
            <span className="mx-2 text-[#CBD5E1]" aria-hidden="true">·</span>
            <span className="font-semibold text-[#D97706]">{interviewCount}</span> in interview rounds
            <span className="mx-2 text-[#CBD5E1]" aria-hidden="true">·</span>
            <span className="font-semibold text-[#059669]">{offerCount}</span> active offers
          </p>
        </div>

        {/* Desktop Secondary Workspace Action */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenLogInterview}
            className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-[#4F46E5]/8 hover:bg-[#4F46E5]/15 text-[#4F46E5] text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#4F46E5]"
          >
            <CalendarPlus className="w-4 h-4" aria-hidden="true" />
            <span>Log Interview</span>
          </button>
        </div>
      </div>

      {/* Workspace Filter & View Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, role, or location..."
            aria-label="Search applications"
            className="w-full h-12 pl-10 pr-10 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B1C30] placeholder:text-[#94A3B8] focus:outline-none focus:border-2 focus:border-[#4F46E5] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md text-[#64748B] hover:text-[#0B1C30]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
          {/* Work Mode Segmented Filter */}
          <div
            role="group"
            aria-label="Filter by work mode"
            className="inline-flex items-center p-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg"
          >
            {(['All', 'Remote', 'Hybrid'] as const).map((mode) => {
              const active = workModeFilter === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setWorkModeFilter(mode)}
                  className={`min-h-[36px] px-3 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white text-[#1E1B4B] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0B1C30]'
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>

          {/* Board / List Switcher */}
          <div
            role="group"
            aria-label="Switch layout view"
            className="inline-flex items-center p-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg"
          >
            <button
              type="button"
              onClick={() => setViewMode('board')}
              aria-pressed={viewMode === 'board'}
              className={`min-h-[36px] inline-flex items-center gap-1.5 px-3 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                viewMode === 'board'
                  ? 'bg-white text-[#1E1B4B] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B1C30]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Board</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-pressed={viewMode === 'list'}
              className={`min-h-[36px] inline-flex items-center gap-1.5 px-3 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                viewMode === 'list'
                  ? 'bg-white text-[#1E1B4B] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B1C30]'
              }`}
            >
              <List className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Empty Filter Banner */}
      {filteredApps.length === 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center">
          <p className="text-base font-semibold text-[#0B1C30]">
            No applications match your current filters
          </p>
          <p className="mt-1 text-sm text-[#64748B]">
            Clear your search query or add a new target role to your pipeline.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setWorkModeFilter('All');
                }}
                className="h-11 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] text-sm font-semibold text-[#1E1B4B] transition-colors"
              >
                Reset Filters
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenQuickApply('submitted')}
              className="h-11 px-4 rounded-lg bg-[#1E1B4B] hover:bg-[#312E81] text-white text-sm font-semibold transition-colors"
            >
              Quick Apply
            </button>
          </div>
        </div>
      )}

      {/* BOARD VIEW: Segmented Column Trackers */}
      {filteredApps.length > 0 && viewMode === 'board' && (
        <>
          {/* Mobile Stage Tabs (thumb-friendly single column focus on compact screens) */}
          <div className="md:hidden grid grid-cols-4 gap-1.5 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
            {STAGES_ORDER.map((stageId) => {
              const meta = STAGE_META[stageId];
              const count = groupedByStage[stageId].length;
              const isActive = activeStageColumn === stageId;
              return (
                <button
                  key={stageId}
                  type="button"
                  onClick={() => setActiveStageColumn(stageId)}
                  className={`min-h-[44px] px-2 py-1.5 rounded-lg text-xs font-semibold transition-all flex flex-col items-center justify-center ${
                    isActive
                      ? 'bg-white text-[#1E1B4B] shadow-xs'
                      : 'text-[#64748B]'
                  }`}
                >
                  <span className="truncate max-w-full">{meta.shortLabel}</span>
                  <span className="text-[11px] font-bold tabular-nums text-[#4F46E5]">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile Single Active Stage Column */}
          <div className="md:hidden space-y-3">
            {groupedByStage[activeStageColumn].length === 0 ? (
              <div className="bg-white border border-dashed border-[#CBD5E1] rounded-2xl p-6 text-center">
                <p className="text-sm font-medium text-[#64748B]">
                  No roles in {STAGE_META[activeStageColumn].label}
                </p>
                <button
                  type="button"
                  onClick={() => onOpenQuickApply(activeStageColumn)}
                  className="mt-3 h-11 px-4 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] text-sm font-semibold"
                >
                  Add Role Here
                </button>
              </div>
            ) : (
              groupedByStage[activeStageColumn].map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onSelect={onSelectApp}
                  isSelected={selectedAppId === app.id}
                />
              ))
            )}
          </div>

          {/* Desktop & Tablet Segmented Column Trackers */}
          <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {STAGES_ORDER.map((stageId) => {
              const meta = STAGE_META[stageId];
              const items = groupedByStage[stageId];
              const isFocusedColumn = activeStageColumn === stageId;

              return (
                <div
                  key={stageId}
                  onClick={() => setActiveStageColumn(stageId)}
                  className="bg-[#F1F5F9]/60 rounded-2xl border border-[#E2E8F0] overflow-hidden"
                >
                  {/* Top Accent Rail: Electric Violet #4F46E5 on active column, neutral #E2E8F0 otherwise */}
                  <div
                    className={`h-0.5 w-full transition-colors ${
                      isFocusedColumn ? 'bg-[#4F46E5]' : 'bg-[#E2E8F0]'
                    }`}
                  />
                  <div className="p-3.5">
                    <div className="flex items-center justify-between gap-2 mb-3 px-0.5">
                      <h2 className="text-sm font-bold text-[#1E1B4B] truncate">
                        {meta.label}
                      </h2>
                      <span className="text-xs font-bold tabular-nums text-[#64748B]">
                        {items.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {items.length === 0 ? (
                        <div className="bg-white/70 border border-dashed border-[#CBD5E1] rounded-xl p-5 text-center">
                          <p className="text-xs text-[#64748B]">No roles in stage</p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenQuickApply(stageId);
                            }}
                            className="mt-2.5 text-xs font-semibold text-[#4F46E5] hover:underline"
                          >
                            + Add role
                          </button>
                        </div>
                      ) : (
                        items.map((app) => (
                          <ApplicationCard
                            key={app.id}
                            application={app}
                            onSelect={onSelectApp}
                            isSelected={selectedAppId === app.id}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* TABLE VIEW: High-Density Executive Ledger */}
      {filteredApps.length > 0 && viewMode === 'list' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                  <th className="py-3 px-4">Company & Role</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-right">Base Pay</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Next Event</th>
                  <th className="py-3 px-4 text-right">Quick Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-sm">
                {filteredApps.map((app) => {
                  const stageStyle = STAGE_META[app.stage];
                  return (
                    <tr
                      key={app.id}
                      onClick={() => onSelectApp(app)}
                      className="hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-bold text-white"
                            style={{ backgroundColor: app.brandHue }}
                            aria-hidden="true"
                          >
                            {app.initials}
                          </div>
                          <div>
                            <div className="font-semibold text-[#0B1C30]">{app.role}</div>
                            <div className="text-xs text-[#64748B]">{app.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#475569] whitespace-nowrap">
                        {app.location} · {app.workMode}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-[#1E1B4B] tabular-nums whitespace-nowrap">
                        {app.payLabel}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${stageStyle.badgeBg} ${stageStyle.badgeText}`}
                        >
                          {app.offer?.isSigned ? 'Offer Signed' : stageStyle.shortLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#64748B] tabular-nums whitespace-nowrap">
                        {app.nextEventTime}
                      </td>
                      <td
                        className="py-3 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          aria-label={`Change stage for ${app.company}`}
                          value={app.stage}
                          onChange={(e) =>
                            onMoveStage(app.id, e.target.value as ApplicationStage)
                          }
                          className="h-9 px-2.5 rounded-lg border border-[#CBD5E1] bg-white text-xs font-semibold text-[#1E1B4B] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
                        >
                          {STAGES_ORDER.map((s) => (
                            <option key={s} value={s}>
                              {STAGE_META[s].shortLabel}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
