import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Lock, Check } from 'lucide-react';

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({ isOpen, onClose }) => {
  const { studentStage, addMoodCheckIn, currentStudent } = useApp();

  const [selectedScore, setSelectedScore] = useState<number>(4);
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [privateNote, setPrivateNote] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  // Age-stage tailored mood representations
  const moodOptionsByStage = {
    classes_1_5: [
      { score: 5, label: 'Super Happy!', icon: '🌟', color: 'border-amber-300 bg-amber-50 text-amber-900' },
      { score: 4, label: 'Calm & Cozy', icon: '🧸', color: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
      { score: 3, label: 'A Bit Grumpy', icon: '🌧️', color: 'border-blue-300 bg-blue-50 text-blue-900' },
      { score: 2, label: 'Angry Storm', icon: '⚡', color: 'border-orange-300 bg-orange-50 text-orange-900' },
      { score: 1, label: 'Tired Turtle', icon: '🐢', color: 'border-slate-300 bg-slate-50 text-slate-900' },
    ],
    classes_6_8: [
      { score: 5, label: 'Energized & Great', icon: '🔥', color: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
      { score: 4, label: 'Good & Steady', icon: '✨', color: 'border-teal-300 bg-teal-50 text-teal-900' },
      { score: 3, label: 'A Bit Anxious', icon: '💭', color: 'border-amber-300 bg-amber-50 text-amber-900' },
      { score: 2, label: 'Overwhelmed', icon: '🌪️', color: 'border-orange-300 bg-orange-50 text-orange-900' },
      { score: 1, label: 'Really Down', icon: '🌧️', color: 'border-blue-300 bg-blue-50 text-blue-900' },
    ],
    classes_9_12: [
      { score: 5, label: 'Flourishing & Focused', icon: '🌱', color: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
      { score: 4, label: 'Balanced & Steady', icon: '🌿', color: 'border-teal-300 bg-teal-50 text-teal-900' },
      { score: 3, label: 'Mildly Restless / Overthinking', icon: '⚡', color: 'border-amber-300 bg-amber-50 text-amber-900' },
      { score: 2, label: 'Exhausted / Low Motivation', icon: '🌫️', color: 'border-orange-300 bg-orange-50 text-orange-900' },
      { score: 1, label: 'High Anxiety / Overwhelmed', icon: '🌊', color: 'border-rose-300 bg-rose-50 text-rose-900' },
    ],
    college: [
      { score: 5, label: 'Optimal & Grounded', icon: '☀️', color: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
      { score: 4, label: 'Functional & Productive', icon: '🍃', color: 'border-teal-300 bg-teal-50 text-teal-900' },
      { score: 3, label: 'Cognitive Fatigue / Stress', icon: '🔋', color: 'border-amber-300 bg-amber-50 text-amber-900' },
      { score: 2, label: 'Imposter Thoughts / Low', icon: '🍂', color: 'border-orange-300 bg-orange-50 text-orange-900' },
      { score: 1, label: 'Severe Burnout / Acute Distress', icon: '⚠️', color: 'border-rose-300 bg-rose-50 text-rose-900' },
    ],
    corporate: [
      { score: 5, label: 'In Flow & Energized', icon: '🎯', color: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
      { score: 4, label: 'Balanced & Engaged', icon: '☕', color: 'border-teal-300 bg-teal-50 text-teal-900' },
      { score: 3, label: 'Meeting Fatigue', icon: '⏳', color: 'border-amber-300 bg-amber-50 text-amber-900' },
      { score: 2, label: 'Depleted', icon: '📉', color: 'border-orange-300 bg-orange-50 text-orange-900' },
      { score: 1, label: 'High Burnout Risk', icon: '🛑', color: 'border-rose-300 bg-rose-50 text-rose-900' },
    ],
  };

  const currentOptions = moodOptionsByStage[studentStage] || moodOptionsByStage['classes_9_12'];

  const factorOptionsByStage = {
    classes_1_5: ['Playtime', 'Homework', 'Art / Music', 'Good Sleep', 'Friend Words', 'Tummy Ache'],
    classes_6_8: ['School Tests', 'Sports & Practice', 'Friendships', 'Screen Time', 'Family Time', 'Sleep Quality'],
    classes_9_12: ['Competitive Prep', 'Mock Exams', 'Sleep Debt', 'Peer Comparison', 'Family Expectations', 'Screen Overload'],
    college: ['Internship / Placement', 'Coursework Deadlines', 'Roommate Dynamics', 'Sleep Schedule', 'Physical Movement', 'Financial Stress'],
    corporate: ['Deliverables', 'Executive Meetings', 'Work-Life Balance', 'Rest & Sleep', 'Team Collaboration'],
  };

  const currentFactors = factorOptionsByStage[studentStage] || factorOptionsByStage['classes_9_12'];

  const toggleFactor = (factor: string) => {
    if (selectedFactors.includes(factor)) {
      setSelectedFactors(selectedFactors.filter((f) => f !== factor));
    } else {
      setSelectedFactors([...selectedFactors, factor]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = currentOptions.find((o) => o.score === selectedScore) || currentOptions[0];

    addMoodCheckIn({
      moodScore: selectedScore,
      moodLabel: chosen.label,
      energyLevel,
      sleepHours,
      factors: selectedFactors,
      note: privateNote.trim() || undefined,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-[#E0E0D8] shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label="Close check-in"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#192A24]">
              Check-in Logged!
            </h3>
            <p className="text-sm text-[#5C6E66]">
              Your streak has been updated. Thank you for honoring your feelings today.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2D6A4F] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Daily Wellbeing Pulse · {currentStudent.name.split(' ')[0]}</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#192A24]">
                How does your heart and mind feel right now?
              </h2>
              <div className="flex items-center gap-1 text-[11px] text-[#697B72] mt-0.5">
                <Lock className="w-3 h-3 text-[#2D6A4F]" />
                <span>100% Private. Neither school teachers nor admins see individual check-ins.</span>
              </div>
            </div>

            {/* Mood selector cards */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#4A5D54]">
                1. Select your general mood state
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {currentOptions.map((opt) => {
                  const isSelected = selectedScore === opt.score;
                  return (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => setSelectedScore(opt.score)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? `${opt.color} ring-2 ring-[#2D6A4F] font-bold shadow-xs scale-102`
                          : 'border-neutral-200 bg-[#FAFAFA] hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <span className="text-2xl mb-1">{opt.icon}</span>
                      <span className="text-[11px] leading-tight text-center line-clamp-2">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Energy Slider */}
            <div className="space-y-1.5 bg-[#FAFAF8] p-3.5 rounded-xl border border-[#E7E7DF]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#4A5D54]">2. Energy & Vitality Level</span>
                <span className="font-mono font-bold text-[#2D6A4F]">{energyLevel} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full accent-[#2D6A4F] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>Low / Drained</span>
                <span>Moderate</span>
                <span>High / Energized</span>
              </div>
            </div>

            {/* Sleep Hours Slider */}
            <div className="space-y-1.5 bg-[#FAFAF8] p-3.5 rounded-xl border border-[#E7E7DF]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#4A5D54]">3. Sleep Duration Last Night</span>
                <span className="font-mono font-bold text-[#2D6A4F]">{sleepHours} hours</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full accent-[#2D6A4F] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>Restless / Short</span>
                <span>7-8 hrs optimal</span>
                <span>Deep & Long</span>
              </div>
            </div>

            {/* What is influencing this? */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#4A5D54]">
                4. What's influencing how you feel today? (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {currentFactors.map((factor) => {
                  const active = selectedFactors.includes(factor);
                  return (
                    <button
                      key={factor}
                      type="button"
                      onClick={() => toggleFactor(factor)}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#2D6A4F] text-white font-medium shadow-2xs'
                          : 'bg-[#F2F2EC] text-[#4A5D54] hover:bg-[#E5E5DE]'
                      }`}
                    >
                      {factor}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional private one-liner */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5D54]">
                5. Private note to yourself (Encrypted)
              </label>
              <input
                type="text"
                placeholder="E.g., Felt proud of finishing my assignment..."
                value={privateNote}
                onChange={(e) => setPrivateNote(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCDCD4] bg-white focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                maxLength={180}
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-[#2D6A4F] rounded-lg hover:bg-[#22523D] transition-colors shadow-xs cursor-pointer"
              >
                Save Daily Check-in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
