import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { soundscape } from '../../utils/audioSynthesizer';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Wind } from 'lucide-react';

export const BreathingStudio: React.FC = () => {
  const { studentStage } = useApp();

  type BreathMode = 'box' | '478' | 'vagus' | 'balloon';

  const [mode, setMode] = useState<BreathMode>(
    studentStage === 'classes_1_5' ? 'balloon' : 'box'
  );
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [phaseTimeLeft, setPhaseTimeLeft] = useState<number>(4);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [soundMode, setSoundMode] = useState<'rain' | 'waves' | 'calm432'>('calm432');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Configuration timings in seconds
  const CONFIGS: Record<BreathMode, {
    name: string;
    description: string;
    inhale: number;
    hold1: number;
    exhale: number;
    hold2: number;
    recommendedFor: string;
  }> = {
    box: {
      name: 'Box Breathing (4-4-4-4)',
      description: 'Used by high-performers to balance the sympathetic and parasympathetic nervous system.',
      inhale: 4,
      hold1: 4,
      exhale: 4,
      hold2: 4,
      recommendedFor: 'Pre-exam jitters, competitive events, test focus.',
    },
    '478': {
      name: '4-7-8 Deep Calm Breath',
      description: 'Developed by Dr. Andrew Weil to activate deep parasympathetic deceleration.',
      inhale: 4,
      hold1: 7,
      exhale: 8,
      hold2: 0,
      recommendedFor: 'Insomnia, sudden panic, evening decompression.',
    },
    vagus: {
      name: '4-2-6 Vagus Nerve Calmer',
      description: 'Extended exhalation stimulates the vagus nerve to slow down an elevated heart rate.',
      inhale: 4,
      hold1: 2,
      exhale: 6,
      hold2: 1,
      recommendedFor: 'Presentations, public speaking, conflict cool-down.',
    },
    balloon: {
      name: 'Gentle Balloon Breath',
      description: 'Imagine blowing a warm, colorful balloon in your tummy and watching it float gently.',
      inhale: 3,
      hold1: 2,
      exhale: 4,
      hold2: 1,
      recommendedFor: 'Classes 1–5, bedtime stories, playground resets.',
    },
  };

  const currentConfig = CONFIGS[mode];

  // Soundscape toggling
  useEffect(() => {
    if (soundEnabled && isActive) {
      soundscape.start(soundMode, 0.2);
    } else {
      soundscape.stop();
    }
    return () => {
      soundscape.stop();
    };
  }, [soundEnabled, soundMode, isActive]);

  // Breathing loop
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setPhaseTimeLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Transition phase
        if (phase === 'Inhale') {
          if (currentConfig.hold1 > 0) {
            setPhase('Hold');
            return currentConfig.hold1;
          } else {
            setPhase('Exhale');
            return currentConfig.exhale;
          }
        } else if (phase === 'Hold') {
          setPhase('Exhale');
          return currentConfig.exhale;
        } else if (phase === 'Exhale') {
          if (currentConfig.hold2 > 0) {
            setPhase('Rest');
            return currentConfig.hold2;
          } else {
            setCycleCount((c) => c + 1);
            setPhase('Inhale');
            return currentConfig.inhale;
          }
        } else {
          // From Rest to Inhale
          setCycleCount((c) => c + 1);
          setPhase('Inhale');
          return currentConfig.inhale;
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, currentConfig]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('Inhale');
    setPhaseTimeLeft(currentConfig.inhale);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('Inhale');
    setPhaseTimeLeft(currentConfig.inhale);
    setCycleCount(0);
    soundscape.stop();
    setSoundEnabled(false);
  };

  // Compute visual circle scale based on phase
  let circleScale = 'scale-100';
  let circleColor = 'border-[#2D6A4F] bg-[#2D6A4F]/10 text-[#2D6A4F]';

  if (phase === 'Inhale') {
    circleScale = 'scale-125';
    circleColor = 'border-[#2D6A4F] bg-[#2D6A4F]/15 text-[#2D6A4F]';
  } else if (phase === 'Hold') {
    circleScale = 'scale-125';
    circleColor = 'border-teal-600 bg-teal-50 text-teal-800';
  } else if (phase === 'Exhale') {
    circleScale = 'scale-90';
    circleColor = 'border-amber-600 bg-amber-50 text-amber-800';
  } else if (phase === 'Rest') {
    circleScale = 'scale-90';
    circleColor = 'border-slate-400 bg-slate-100 text-slate-700';
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-1">
            Neuro-Somatic Breath Trainer
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24]">
            Interactive Breathing Studio
          </h2>
          <p className="text-sm text-[#5C6E66]">
            Scientific respiratory pacing to regulate pulse rate, lower cortisol, and bring mental clarity.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#EDEDE6] rounded-xl self-start overflow-x-auto max-w-full">
          {(['box', '478', 'vagus', 'balloon'] as BreathMode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                handleReset();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                mode === m ? 'bg-white text-[#192A24] shadow-xs font-bold' : 'text-[#5C6E66] hover:text-[#192A24]'
              }`}
            >
              {CONFIGS[m].name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Breathing Experience Card */}
      <div className="bg-white rounded-2xl border border-[#E4E4DC] p-6 sm:p-10 shadow-xs flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-radial from-[#F5FAF7] via-transparent to-transparent pointer-events-none" />

        <div className="mb-6 z-10 max-w-md">
          <h3 className="font-serif text-lg font-bold text-[#192A24] mb-1">
            {currentConfig.name}
          </h3>
          <p className="text-xs text-[#52665C] leading-relaxed">
            {currentConfig.description}
          </p>
        </div>

        {/* Visual Animated Breathing Sphere */}
        <div className="relative my-8 flex items-center justify-center z-10">
          {/* Animated concentric rings */}
          <div
            className={`w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 transition-all duration-1000 flex flex-col items-center justify-center shadow-lg ${circleScale} ${circleColor}`}
          >
            <Wind className="w-6 h-6 mb-1 opacity-70 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase mb-1">
              {isActive ? phase : 'Ready to start'}
            </span>
            <span className="font-mono text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums">
              {isActive ? `${phaseTimeLeft}s` : `${currentConfig.inhale}s`}
            </span>
            <span className="text-[11px] opacity-75 mt-1">
              {phase === 'Inhale'
                ? 'Fill lungs deeply'
                : phase === 'Hold'
                ? 'Gently suspend breath'
                : phase === 'Exhale'
                ? 'Slow, quiet release'
                : 'Rest in stillness'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 z-10 mb-6">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#22523D] rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Begin Session</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-[#192A24] bg-[#F0F0E8] hover:bg-[#E3E3D9] rounded-xl transition-all cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-2.5 text-neutral-500 hover:text-neutral-800 bg-[#F5F5EE] hover:bg-[#EAEAE0] rounded-xl transition-colors cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Soundscape ambience toggle */}
          <div className="flex items-center gap-1.5 pl-3 border-l border-[#E2E2D8]">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-[#2D6A4F] text-white shadow-2xs'
                  : 'bg-[#F2F2EB] text-[#55695E] hover:bg-[#E5E5DC]'
              }`}
              title="Ambient Sound Synthesizer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'Sound On' : 'Nature Tone'}</span>
            </button>

            {soundEnabled && (
              <select
                value={soundMode}
                onChange={(e) => setSoundMode(e.target.value as 'rain' | 'waves' | 'calm432')}
                className="text-xs py-1.5 px-2 rounded-lg border border-[#D5D5CB] bg-white text-[#192A24] focus:outline-none"
              >
                <option value="calm432">432Hz Calm Sine</option>
                <option value="rain">Soft Rain</option>
                <option value="waves">Ocean Swell</option>
              </select>
            )}
          </div>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-6 text-xs text-[#52665C] pt-4 border-t border-[#EAEAE2] z-10">
          <div>
            <span>Completed Cycles: </span>
            <span className="font-mono font-bold text-[#192A24] text-sm tabular-nums">
              {cycleCount}
            </span>
          </div>
          <span aria-hidden="true" className="text-neutral-300">·</span>
          <div>
            <span>Recommended: </span>
            <span className="font-medium text-[#2D6A4F]">{currentConfig.recommendedFor}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
