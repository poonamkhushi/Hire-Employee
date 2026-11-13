import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Mic, Pause, Play, RotateCcw, Square } from 'lucide-react';
import { COACH_PROMPTS } from '../data/initialCareerData';
import { CoachPrompt, CoachTake, PromptCategory } from '../types/career';

interface InterviewCoachViewProps {
  takes: CoachTake[];
  onSaveTake: (take: CoachTake) => void;
}

const CATEGORIES: ('All' | PromptCategory)[] = [
  'All',
  'Behavioral',
  'Product Sense',
  'System Design',
  'Executive',
];

const DEFAULT_WAVEFORM = [
  24, 34, 48, 42, 60, 72, 54, 38, 64, 78, 68, 46, 36, 56, 70, 62, 44, 32, 52, 74, 64, 48, 34, 58, 70, 52, 40, 28,
];

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export const InterviewCoachView: React.FC<InterviewCoachViewProps> = ({
  takes,
  onSaveTake,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'All' | PromptCategory>('All');
  const [selectedPromptId, setSelectedPromptId] = useState<string>(COACH_PROMPTS[0].id);

  // Recording / Rehearsal state
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [liveBars, setLiveBars] = useState<number[]>(DEFAULT_WAVEFORM);
  const [micMode, setMicMode] = useState<'ready' | 'live-mic' | 'timed-fallback'>('ready');
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | undefined>(undefined);

  // Playback state for active or selected take
  const [playingTakeId, setPlayingTakeId] = useState<string | null>(null);
  const [playProgress, setPlayProgress] = useState(0); // 0 to 1

  // Rubric & Notes
  const [checks, setChecks] = useState<[boolean, boolean, boolean, boolean]>([
    false,
    false,
    false,
    false,
  ]);
  const [notes, setNotes] = useState('');
  const [savedBanner, setSavedBanner] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const filteredPrompts = useMemo(() => {
    if (categoryFilter === 'All') return COACH_PROMPTS;
    return COACH_PROMPTS.filter((p) => p.category === categoryFilter);
  }, [categoryFilter]);

  const activePrompt: CoachPrompt = useMemo(() => {
    return (
      COACH_PROMPTS.find((p) => p.id === selectedPromptId) ??
      filteredPrompts[0] ??
      COACH_PROMPTS[0]
    );
  }, [selectedPromptId, filteredPrompts]);

  // Compute transparent readiness score from completed rubric criteria + pacing alignment
  const confidenceScore = useMemo(() => {
    const checkPoints = checks.filter(Boolean).length * 20; // 0..80
    let pacingPoints = 0;
    if (elapsedSec > 0) {
      const ratio = elapsedSec / activePrompt.targetDurationSec;
      if (ratio >= 0.5 && ratio <= 1.25) {
        pacingPoints = 20;
      } else if (ratio >= 0.25 && ratio <= 1.5) {
        pacingPoints = 12;
      } else {
        pacingPoints = 6;
      }
    }
    return Math.min(100, checkPoints + pacingPoints);
  }, [checks, elapsedSec, activePrompt.targetDurationSec]);

  // Timer during recording
  useEffect(() => {
    if (!isRecording) return;
    const timer = window.setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRecording]);

  // Fallback synthetic cadence wave animation when mic is unavailable
  useEffect(() => {
    if (!isRecording || micMode !== 'timed-fallback') return;
    const interval = window.setInterval(() => {
      setLiveBars((prev) =>
        prev.map((_, idx) => {
          const phase = Date.now() / 220 + idx * 0.45;
          return Math.round(28 + Math.abs(Math.sin(phase)) * 58);
        })
      );
    }, 120);
    return () => window.clearInterval(interval);
  }, [isRecording, micMode]);

  // Simulated / audio scrub playback
  useEffect(() => {
    if (!playingTakeId) return;
    const interval = window.setInterval(() => {
      setPlayProgress((prev) => {
        if (prev >= 1) {
          setPlayingTakeId(null);
          return 0;
        }
        return Math.min(1, prev + 0.04);
      });
    }, 150);
    return () => window.clearInterval(interval);
  }, [playingTakeId]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const stopRecording = () => {
    setIsRecording(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  const startRecording = async () => {
    setSavedBanner(false);
    setPlayingTakeId(null);
    setElapsedSec(0);
    setRecordedAudioUrl(undefined);

    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setMicMode('live-mic');
        setIsRecording(true);

        // Live AudioContext analyser for waveform bars
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const updateWave = () => {
            analyser.getByteFrequencyData(dataArray);
            const sampled: number[] = [];
            for (let i = 0; i < 28; i++) {
              const val = dataArray[i % dataArray.length] ?? 0;
              sampled.push(Math.max(18, Math.min(95, Math.round((val / 255) * 95))));
            }
            setLiveBars(sampled);
            rafRef.current = requestAnimationFrame(updateWave);
          };
          rafRef.current = requestAnimationFrame(updateWave);
        }

        // MediaRecorder for actual playback
        if (typeof MediaRecorder !== 'undefined') {
          const recorder = new MediaRecorder(stream);
          audioChunksRef.current = [];
          recorder.ondataavailable = (evt) => {
            if (evt.data.size > 0) audioChunksRef.current.push(evt.data);
          };
          recorder.onstop = () => {
            if (audioChunksRef.current.length > 0) {
              const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
              const url = URL.createObjectURL(blob);
              setRecordedAudioUrl(url);
            }
          };
          recorder.start();
          mediaRecorderRef.current = recorder;
        }
        return;
      } catch {
        // Fallback gracefully to timed rehearsal mode
      }
    }

    setMicMode('timed-fallback');
    setIsRecording(true);
  };

  const toggleCheck = (index: 0 | 1 | 2 | 3) => {
    setChecks((prev) => {
      const next = [...prev] as [boolean, boolean, boolean, boolean];
      next[index] = !next[index];
      return next;
    });
  };

  const handleResetRehearsal = () => {
    stopRecording();
    setElapsedSec(0);
    setLiveBars(DEFAULT_WAVEFORM);
    setMicMode('ready');
    setRecordedAudioUrl(undefined);
    setChecks([false, false, false, false]);
    setNotes('');
  };

  const handleSaveTake = () => {
    if (isRecording) stopRecording();
    const duration = Math.max(12, elapsedSec || 45);
    const newTake: CoachTake = {
      id: `take-${Date.now()}`,
      promptId: activePrompt.id,
      question: activePrompt.question,
      category: activePrompt.category,
      recordedAt: 'Just now',
      durationSec: duration,
      confidenceScore: Math.max(confidenceScore, checks.filter(Boolean).length * 20 + 15),
      completedChecks: [...checks] as [boolean, boolean, boolean, boolean],
      notes:
        notes.trim() ||
        `Completed ${checks.filter(Boolean).length}/4 structure criteria in ${formatDuration(duration)}.`,
      waveformBars: [...liveBars],
      audioUrl: recordedAudioUrl,
    };
    onSaveTake(newTake);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleTogglePlayTake = (take: CoachTake) => {
    if (playingTakeId === take.id) {
      setPlayingTakeId(null);
      audioElRef.current?.pause();
      return;
    }
    setPlayProgress(0);
    setPlayingTakeId(take.id);
    if (take.audioUrl) {
      if (audioElRef.current) {
        audioElRef.current.pause();
      }
      const audio = new Audio(take.audioUrl);
      audioElRef.current = audio;
      audio.onended = () => {
        setPlayingTakeId(null);
        setPlayProgress(0);
      };
      audio.play().catch(() => {});
    }
  };

  // SVG circular gauge math
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidenceScore / 100) * circumference;

  return (
    <section aria-labelledby="coach-heading" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1
            id="coach-heading"
            className="text-[28px] md:text-[36px] font-bold leading-tight tracking-tight text-[#0B1C30]"
          >
            Interview Coach
          </h1>
          <p className="mt-1.5 text-sm text-[#475569]">
            Structured response rehearsal, pacing waveform review, and STAR readiness scoring.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="group"
          aria-label="Filter interview prompts by category"
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl"
        >
          {CATEGORIES.map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategoryFilter(cat);
                  const firstMatch =
                    cat === 'All'
                      ? COACH_PROMPTS[0]
                      : COACH_PROMPTS.find((p) => p.category === cat);
                  if (firstMatch) setSelectedPromptId(firstMatch.id);
                }}
                className={`min-h-[38px] px-3 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-white text-[#1E1B4B] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0B1C30]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Prompt Selector + Audio Waveform Studio */}
        <div className="lg:col-span-7 space-y-5">
          {/* Prompt Picker */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] space-y-4">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="prompt-select" className="text-xs font-bold text-[#475569]">
                Active Rehearsal Prompt
              </label>
              <span className="text-xs font-semibold text-[#4F46E5] tabular-nums">
                Target {formatDuration(activePrompt.targetDurationSec)}
              </span>
            </div>

            <select
              id="prompt-select"
              value={activePrompt.id}
              onChange={(e) => {
                setSelectedPromptId(e.target.value);
                handleResetRehearsal();
              }}
              className="w-full h-12 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
            >
              {filteredPrompts.map((prompt) => (
                <option key={prompt.id} value={prompt.id}>
                  [{prompt.category}] {prompt.question.slice(0, 78)}...
                </option>
              ))}
            </select>

            <div className="pt-1">
              <h2 className="text-lg font-semibold text-[#0B1C30] leading-snug">
                {activePrompt.question}
              </h2>
              <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
                Focus: {activePrompt.contextHint}
              </p>
            </div>
          </div>

          {/* Audio Feedback Container (#4F46E5 wave bars over #EEF2FF) */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-[#1E1B4B]">
                  Audio Feedback & Pacing
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {isRecording
                    ? micMode === 'live-mic'
                      ? 'Microphone recording active'
                      : 'Timed rehearsal active (mic unavailable)'
                    : recordedAudioUrl
                    ? 'Take captured — ready for review or save'
                    : 'Press Record to capture timing and cadence'}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xl font-bold text-[#1E1B4B] tabular-nums">
                  {formatDuration(elapsedSec)}
                </span>
                <p className="text-[11px] font-medium text-[#64748B] tabular-nums">
                  / {formatDuration(activePrompt.targetDurationSec)} target
                </p>
              </div>
            </div>

            {/* Playback Wave Bars Container (#EEF2FF background, #4F46E5 bars) */}
            <div
              className="h-28 px-4 rounded-2xl bg-[#EEF2FF] flex items-center justify-between gap-1.5"
              aria-label="Audio waveform visualization"
            >
              {liveBars.map((heightPct, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-[#4F46E5] rounded-full transition-all duration-150"
                  style={{
                    height: `${Math.max(16, Math.min(92, heightPct))}%`,
                    opacity: isRecording ? 1 : 0.85,
                  }}
                />
              ))}
            </div>

            {/* Thumb-Zone Ergonomic Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex-1 h-12 px-5 rounded-lg bg-[#1E1B4B] hover:bg-[#312E81] active:scale-[0.99] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all"
                >
                  <Mic className="w-4 h-4" aria-hidden="true" />
                  <span>Record Coach Response</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex-1 h-12 px-5 rounded-lg bg-[#4F46E5] hover:bg-[#3323CC] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Square className="w-4 h-4 fill-current" aria-hidden="true" />
                  <span>Stop Recording</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleResetRehearsal}
                className="h-12 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] text-sm font-semibold text-[#1E1B4B] inline-flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Real-Time Confidence Score Dial & STAR Rubric */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] space-y-5">
            {/* Circular Progress Dial (#059669 over #E2E8F0) */}
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#059669"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-[#0B1C30] tabular-nums">
                    {confidenceScore}%
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#0B1C30]">
                  Response Readiness
                </h3>
                <p className="mt-1 text-xs text-[#64748B] leading-relaxed">
                  Calculated from STAR structure criteria checked ({checks.filter(Boolean).length}/4) and target pacing alignment.
                </p>
              </div>
            </div>

            {/* 20px Custom Checkboxes (#4F46E5 selected) */}
            <div className="space-y-2.5 pt-2 border-t border-[#F1F5F9]">
              <p className="text-xs font-bold text-[#475569]">
                Structure & Delivery Rubric
              </p>
              {activePrompt.rubricLabels.map((label, idx) => {
                const i = idx as 0 | 1 | 2 | 3;
                const checked = checks[i];
                return (
                  <button
                    key={label}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => toggleCheck(i)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white flex items-center gap-3 text-left transition-colors"
                  >
                    <span
                      className={`w-5 h-5 rounded-[4px] shrink-0 flex items-center justify-center border transition-colors ${
                        checked
                          ? 'bg-[#4F46E5] border-[#4F46E5] text-white'
                          : 'bg-white border-[#CBD5E1]'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        checked ? 'text-[#0B1C30]' : 'text-[#475569]'
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Coaching Notes */}
            <div>
              <label htmlFor="coach-notes" className="block text-xs font-bold text-[#475569] mb-1.5">
                Self-Critique & Refinement Notes
              </label>
              <textarea
                id="coach-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Note sharper metrics or transitions for your next take..."
                className="w-full p-3 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B1C30] focus:outline-none focus:border-2 focus:border-[#4F46E5]"
              />
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSaveTake}
                className="w-full h-12 rounded-lg bg-[#4F46E5] hover:bg-[#3323CC] text-white text-sm font-semibold transition-colors"
              >
                Save Rehearsal Take
              </button>
              {savedBanner && (
                <p className="text-center text-xs font-semibold text-[#059669]">
                  Rehearsal take saved to your session log.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Rehearsal Takes History */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#0B1C30]">
            Saved Rehearsal Takes ({takes.length})
          </h2>
          <span className="text-xs text-[#64748B]">Click play to review cadence</span>
        </div>

        <div className="divide-y divide-[#F1F5F9]">
          {takes.map((take) => {
            const isPlaying = playingTakeId === take.id;
            return (
              <div
                key={take.id}
                className="py-4 first:pt-1 last:pb-1 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => handleTogglePlayTake(take)}
                    aria-label={isPlaying ? 'Pause take playback' : 'Play take'}
                    className="w-11 h-11 rounded-full bg-[#EEF2FF] hover:bg-[#E2DFFF] text-[#4F46E5] flex items-center justify-center shrink-0 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#64748B]">
                      <span className="font-semibold text-[#4F46E5]">{take.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{take.recordedAt}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums font-medium text-[#0B1C30]">
                        {formatDuration(take.durationSec)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-[#0B1C30] line-clamp-1">
                      {take.question}
                    </p>
                    <p className="mt-1 text-xs text-[#475569]">{take.notes}</p>
                  </div>
                </div>

                {/* Mini Playback Waveform + Score */}
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                  <div className="h-9 w-36 px-2.5 rounded-lg bg-[#EEF2FF] flex items-center gap-0.5">
                    {take.waveformBars.slice(0, 20).map((bar, idx) => {
                      const barPct = idx / 20;
                      const activeBar = !isPlaying || barPct <= playProgress;
                      return (
                        <span
                          key={idx}
                          className="flex-1 rounded-full bg-[#4F46E5] transition-opacity"
                          style={{
                            height: `${Math.max(20, bar)}%`,
                            opacity: activeBar ? 1 : 0.35,
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="text-right min-w-[54px]">
                    <span className="text-sm font-bold text-[#059669] tabular-nums">
                      {take.confidenceScore}%
                    </span>
                    <p className="text-[11px] text-[#64748B]">Ready</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
