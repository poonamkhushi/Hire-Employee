import { useEffect, useMemo, useState } from 'react';
import { ApplicationDetailDrawer } from './components/ApplicationDetailDrawer';
import { ApplicationsBoard } from './components/ApplicationsBoard';
import { InterviewCoachView } from './components/InterviewCoachView';
import { LogInterviewModal } from './components/LogInterviewModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfferComparisonView } from './components/OfferComparisonView';
import { QuickApplyModal } from './components/QuickApplyModal';
import { ScheduleView } from './components/ScheduleView';
import { TopBar } from './components/TopBar';
import { INITIAL_APPLICATIONS, INITIAL_COACH_TAKES } from './data/initialCareerData';
import {
  ApplicationStage,
  CoachTake,
  InterviewRoundLog,
  JobApplication,
  NavTab,
} from './types/career';

const APPS_STORAGE_KEY = 'cadence_applications_v1';
const TAKES_STORAGE_KEY = 'cadence_coach_takes_v1';

function loadInitialApplications(): JobApplication[] {
  try {
    const raw = localStorage.getItem(APPS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore storage read issues
  }
  return INITIAL_APPLICATIONS;
}

function loadInitialTakes(): CoachTake[] {
  try {
    const raw = localStorage.getItem(TAKES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore storage read issues
  }
  return INITIAL_COACH_TAKES;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('applications');
  const [applications, setApplications] = useState<JobApplication[]>(loadInitialApplications);
  const [coachTakes, setCoachTakes] = useState<CoachTake[]>(loadInitialTakes);

  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [quickApplyOpen, setQuickApplyOpen] = useState(false);
  const [quickApplyStage, setQuickApplyStage] = useState<ApplicationStage>('submitted');
  const [logInterviewOpen, setLogInterviewOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(applications));
    } catch {
      // Ignore storage write quota errors
    }
  }, [applications]);

  useEffect(() => {
    try {
      // Exclude ephemeral object URLs when serializing
      const serializable = coachTakes.map(({ audioUrl: _omit, ...rest }) => rest);
      localStorage.setItem(TAKES_STORAGE_KEY, JSON.stringify(serializable));
    } catch {
      // Ignore storage write quota errors
    }
  }, [coachTakes]);

  const selectedApplication = useMemo(
    () => applications.find((a) => a.id === selectedAppId) ?? null,
    [applications, selectedAppId]
  );

  const handleOpenQuickApply = (defaultStage: ApplicationStage = 'submitted') => {
    setQuickApplyStage(defaultStage);
    setQuickApplyOpen(true);
  };

  const handleAddApplication = (newApp: Omit<JobApplication, 'id'>) => {
    const created: JobApplication = {
      ...newApp,
      id: `app-${Date.now()}`,
    };
    setApplications((prev) => [created, ...prev]);
    setActiveTab('applications');
  };

  const handleMoveStage = (appId: string, nextStage: ApplicationStage) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const needsDefaultOffer = nextStage === 'offer' && !app.offer;
        return {
          ...app,
          stage: nextStage,
          nextEventTime:
            nextStage === 'archived'
              ? 'Archived'
              : nextStage === 'offer'
              ? `Deadline ${app.offer?.deadlineLabel ?? 'Nov 30'}`
              : app.nextEventTime,
          offer: needsDefaultOffer
            ? {
                baseSalary: app.payBand,
                annualEquity: Math.round(app.payBand * 0.45),
                signOnBonus: 25000,
                targetBonusPct: 15,
                ptoDays: 20,
                learningStipend: 2500,
                deadlineLabel: 'Nov 30',
                isPreferred: false,
                isSigned: false,
              }
            : app.offer,
        };
      })
    );
  };

  const handleUpdateNotes = (appId: string, notes: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, notes } : app))
    );
  };

  const handleAddInterviewLog = (appId: string, log: Omit<InterviewRoundLog, 'id'>) => {
    const newLog: InterviewRoundLog = {
      ...log,
      id: `log-${Date.now()}`,
    };
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const shouldAdvanceToInterview = app.stage === 'submitted';
        return {
          ...app,
          stage: shouldAdvanceToInterview ? 'interview' : app.stage,
          nextEventLabel: log.roundTitle,
          nextEventTime: `${log.dateLabel} · ${log.timeLabel}`,
          interviewLogs: [newLog, ...app.interviewLogs],
        };
      })
    );
  };

  const handleDeleteApp = (appId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    if (selectedAppId === appId) setSelectedAppId(null);
  };

  const handleSetPreferredOffer = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (!app.offer) return app;
        return {
          ...app,
          offer: {
            ...app.offer,
            isPreferred: app.id === appId ? !app.offer.isPreferred : false,
          },
        };
      })
    );
  };

  const handleToggleSignOffer = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId || !app.offer) return app;
        return {
          ...app,
          offer: {
            ...app.offer,
            isSigned: !app.offer.isSigned,
            isPreferred: !app.offer.isSigned ? true : app.offer.isPreferred,
          },
        };
      })
    );
  };

  const handleSaveCoachTake = (take: CoachTake) => {
    setCoachTakes((prev) => [take, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0B1C30]">
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenQuickApply={() => handleOpenQuickApply('submitted')}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-24 md:pb-12">
        {activeTab === 'applications' && (
          <ApplicationsBoard
            applications={applications}
            selectedAppId={selectedAppId}
            onSelectApp={(app) => setSelectedAppId(app.id)}
            onOpenQuickApply={handleOpenQuickApply}
            onOpenLogInterview={() => setLogInterviewOpen(true)}
            onMoveStage={handleMoveStage}
          />
        )}

        {activeTab === 'coach' && (
          <InterviewCoachView
            takes={coachTakes}
            onSaveTake={handleSaveCoachTake}
          />
        )}

        {activeTab === 'offers' && (
          <OfferComparisonView
            applications={applications}
            onSetPreferredOffer={handleSetPreferredOffer}
            onToggleSignOffer={handleToggleSignOffer}
            onSelectApp={(app) => setSelectedAppId(app.id)}
            onGoToApplications={() => setActiveTab('applications')}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleView
            applications={applications}
            onSelectApp={(app) => setSelectedAppId(app.id)}
            onOpenLogInterview={() => setLogInterviewOpen(true)}
          />
        )}
      </main>

      <MobileBottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      <ApplicationDetailDrawer
        application={selectedApplication}
        onClose={() => setSelectedAppId(null)}
        onMoveStage={handleMoveStage}
        onUpdateNotes={handleUpdateNotes}
        onAddInterviewLog={handleAddInterviewLog}
        onDeleteApp={handleDeleteApp}
        onJumpToOffers={() => setActiveTab('offers')}
      />

      <QuickApplyModal
        isOpen={quickApplyOpen}
        defaultStage={quickApplyStage}
        onClose={() => setQuickApplyOpen(false)}
        onAddApplication={handleAddApplication}
      />

      <LogInterviewModal
        isOpen={logInterviewOpen}
        applications={applications}
        onClose={() => setLogInterviewOpen(false)}
        onLogInterview={handleAddInterviewLog}
      />
    </div>
  );
}
