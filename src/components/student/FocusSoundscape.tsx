import React, { useState, useEffect } from 'react';
import { soundscape } from '../../utils/audioSynthesizer';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Headphones, Bell, Sparkles } from 'lucide-react';

export const FocusSoundscape: React.FC = () => {
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [focusDuration, setFocusDuration] = useState<number>(25 * 60); // 25 mins
  const [timeLeft, setTimeLeft] = useState<number>(focusDuration);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  const [activeSound, setActiveSound] = useState<'rain' | 'waves' | 'calm432' | 'whitenoise' | null>(null);
  const [volume, setVolume] = useState<number>(0.3);

  // Sync timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Toggle mode
            if (timerMode === 'focus') {
              setTimerMode('break');
              return 5 * 60;
            } else {
              setTimerMode('focus');
              return focusDuration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerMode, focusDuration]);

  // Audio control
  const toggleSound = (mode: 'rain' | 'waves' | 'calm432' | 'whitenoise') => {
    if (activeSound === mode) {
      soundscape.stop();
      setActiveSound(null);
    } else {
      soundscape.start(mode, volume);
      setActiveSound(mode);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundscape.setVolume(newVol);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(timerMode === 'focus' ? focusDuration : 5 * 60);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E2DA] p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-0.5">
            Cognitive Flow Architecture
          </span>
          <h3 className="text-xl font-serif font-bold text-[#192A24]">
            Focus Soundscape & Study Timer
          </h3>
        </div>
        <div className="flex items-center gap-1 p-1 bg-[#EDEDE6] rounded-xl self-start">
          <button
            onClick={() => {
              setFocusDuration(25 * 60);
              setTimeLeft(25 * 60);
              setTimerMode('focus');
              setTimerRunning(false);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-lg cursor-pointer ${
              focusDuration === 25 * 60 ? 'bg-white text-[#192A24] shadow-xs font-bold' : 'text-[#5C6E66]'
            }`}
          >
            25m Pomodoro
          </button>
          <button
            onClick={() => {
              setFocusDuration(45 * 60);
              setTimeLeft(45 * 60);
              setTimerMode('focus');
              setTimerRunning(false);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-lg cursor-pointer ${
              focusDuration === 45 * 60 ? 'bg-white text-[#192A24] shadow-xs font-bold' : 'text-[#5C6E66]'
            }`}
          >
            45m Deep Study
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Study Timer */}
        <div className="p-6 rounded-2xl bg-[#FBFBFA] border border-[#E7E7DE] flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 bg-[#EAF2ED] text-[#2D6A4F]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{timerMode === 'focus' ? 'Deep Study Interval' : 'Restorative Break'}</span>
          </div>

          <div className="font-mono text-5xl sm:text-6xl font-extrabold text-[#192A24] tracking-tight tabular-nums my-2">
            {formatTime(timeLeft)}
          </div>

          <p className="text-xs text-[#697B72] mb-5">
            {timerMode === 'focus'
              ? 'Mute notifications and commit to one single task.'
              : 'Step away from screens, stretch your neck, and hydrate.'}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{timerRunning ? 'Pause' : 'Start Focus'}</span>
            </button>
            <button
              onClick={resetTimer}
              className="p-2 text-neutral-500 hover:text-neutral-800 bg-[#EFEFE8] rounded-xl transition-colors cursor-pointer"
              title="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Ambient procedural sounds */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-[#2D6A4F]" />
              <span className="text-xs font-bold text-[#192A24]">Binaural & Nature Sound Generator</span>
            </div>
            {activeSound && (
              <span className="text-[11px] font-semibold text-[#2D6A4F] animate-pulse">
                Audio Active
              </span>
            )}
          </div>

          <p className="text-xs text-[#52665C]">
            Procedural auditory masks synthesized in your browser. Eliminates harsh campus ambient noise and stabilizes mental wandering.
          </p>

          {/* Sound options */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'calm432', label: '432Hz Theta Calm', desc: 'Harmonic sine wave' },
              { id: 'rain', label: 'Soft Raindrops', desc: 'Pink filtered rain' },
              { id: 'waves', label: 'Ocean Swells', desc: 'Rhythmic water surge' },
              { id: 'whitenoise', label: 'Pure White Mask', desc: 'Steady focus noise' },
            ].map((snd) => {
              const isPlaying = activeSound === snd.id;
              return (
                <button
                  key={snd.id}
                  onClick={() => toggleSound(snd.id as 'rain' | 'waves' | 'calm432' | 'whitenoise')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isPlaying
                      ? 'border-[#2D6A4F] bg-[#EBF4EE] ring-1 ring-[#2D6A4F]'
                      : 'border-[#E0E0D6] bg-[#FAFAF8] hover:bg-white'
                  }`}
                >
                  <span className="font-semibold text-xs text-[#192A24] block">{snd.label}</span>
                  <span className="text-[10px] text-[#697B72]">{snd.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Volume slider */}
          {activeSound && (
            <div className="pt-2 flex items-center gap-3 bg-[#FAFAF8] p-3 rounded-xl border border-[#E7E7DF]">
              <Volume2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full accent-[#2D6A4F] cursor-pointer"
              />
              <span className="text-xs font-mono text-neutral-500 w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
