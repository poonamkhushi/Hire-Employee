import React, { useMemo, useState } from 'react';
import { CalendarPlus, ChevronRight } from 'lucide-react';
import { JobApplication } from '../types/career';

interface ScheduleViewProps {
  applications: JobApplication[];
  onSelectApp: (app: JobApplication) => void;
  onOpenLogInterview: () => void;
}

const NOVEMBER_DAYS = [
  { key: 'All', dow: 'All', day: 'Week' },
  { key: 'Nov 13', dow: 'Thu', day: '13' },
  { key: 'Nov 14', dow: 'Fri', day: '14' },
  { key: 'Nov 15', dow: 'Sat', day: '15' },
  { key: 'Nov 18', dow: 'Tue', day: '18' },
  { key: 'Nov 22', dow: 'Sat', day: '22' },
  { key: 'Nov 25', dow: 'Tue', day: '25' },
];

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  applications,
  onSelectApp,
  onOpenLogInterview,
}) => {
  const [selectedDay, setSelectedDay] = useState('All');

  const events = useMemo(() => {
    const items: {
      id: string;
      app: JobApplication;
      title: string;
      dateLabel: string;
      timeLabel: string;
      subtext: string;
      kind: 'interview' | 'deadline';
    }[] = [];

    for (const app of applications) {
      if (app.stage === 'archived') continue;

      for (const log of app.interviewLogs) {
        if (log.outcome === 'Upcoming') {
          items.push({
            id: log.id,
            app,
            title: log.roundTitle,
            dateLabel: log.dateLabel,
            timeLabel: `${log.timeLabel} · ${log.durationMinutes} min`,
            subtext: `With ${log.interviewer}`,
            kind: 'interview',
          });
        }
      }

      if (app.stage === 'offer' && app.offer) {
        items.push({
          id: `deadline-${app.id}`,
          app,
          title: `${app.company} Offer Decision Deadline`,
          dateLabel: app.offer.deadlineLabel,
          timeLabel: '5:00 PM',
          subtext: `${app.payLabel} · ${app.role}`,
          kind: 'deadline',
        });
      }
    }

    return items.sort((a, b) => a.dateLabel.localeCompare(b.dateLabel));
  }, [applications]);

  const visibleEvents = useMemo(() => {
    if (selectedDay === 'All') return events;
    return events.filter((e) => e.dateLabel === selectedDay);
  }, [events, selectedDay]);

  return (
    <section aria-labelledby="schedule-heading" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1
            id="schedule-heading"
            className="text-[28px] md:text-[36px] font-bold leading-tight tracking-tight text-[#0B1C30]"
          >
            Interview Schedule
          </h1>
          <p className="mt-1.5 text-sm text-[#475569] tabular-nums">
            <span className="font-semibold text-[#0B1C30]">{events.length}</span> upcoming rounds &amp; offer decision milestones
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenLogInterview}
          className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#3323CC] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 self-start md:self-auto"
        >
          <CalendarPlus className="w-4 h-4" aria-hidden="true" />
          <span>Log Interview</span>
        </button>
      </div>

      {/* Horizontal Date Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {NOVEMBER_DAYS.map((d) => {
          const active = selectedDay === d.key;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setSelectedDay(d.key)}
              className={`min-h-[48px] min-w-[64px] px-3.5 py-2 rounded-xl border text-center transition-all shrink-0 ${
                active
                  ? 'bg-[#1E1B4B] border-[#1E1B4B] text-white'
                  : 'bg-white border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1]'
              }`}
            >
              <span className="block text-[11px] font-medium opacity-80">{d.dow}</span>
              <span className="block text-sm font-bold tabular-nums">{d.day}</span>
            </button>
          );
        })}
      </div>

      {/* Upcoming Timeline List */}
      {visibleEvents.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center">
          <p className="text-base font-semibold text-[#0B1C30]">
            No milestones scheduled for {selectedDay}
          </p>
          <p className="mt-1 text-sm text-[#64748B]">
            Switch to All dates or log a new interview round to keep your calendar current.
          </p>
          <button
            type="button"
            onClick={() => setSelectedDay('All')}
            className="mt-4 h-11 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] text-sm font-semibold text-[#1E1B4B]"
          >
            Show All Upcoming
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl divide-y divide-[#F1F5F9] overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          {visibleEvents.map((evt) => (
            <button
              key={evt.id}
              type="button"
              onClick={() => onSelectApp(evt.app)}
              className="w-full text-left px-5 py-4 hover:bg-[#F8FAFC] transition-colors flex items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="min-w-[64px] pt-0.5">
                  <p className="text-sm font-bold text-[#1E1B4B] tabular-nums">
                    {evt.dateLabel}
                  </p>
                  <p className="text-xs text-[#64748B] tabular-nums mt-0.5">
                    {evt.timeLabel.split('·')[0]}
                  </p>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        evt.kind === 'deadline'
                          ? 'bg-[#ECFDF5] text-[#059669]'
                          : 'bg-[#FFFBEB] text-[#D97706]'
                      }`}
                    >
                      {evt.kind === 'deadline' ? 'Offer Deadline' : 'Interview'}
                    </span>
                    <span className="text-xs font-semibold text-[#475569]">
                      {evt.app.company}
                    </span>
                  </div>
                  <p className="mt-1 text-base font-semibold text-[#0B1C30] truncate">
                    {evt.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[#64748B] truncate">{evt.subtext}</p>
                </div>
              </div>

              <ChevronRight
                className="w-5 h-5 text-[#94A3B8] group-hover:text-[#4F46E5] group-hover:translate-x-0.5 transition-all shrink-0"
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
