import React, { useState } from 'react';
import { Sparkles, Brain, Check, RefreshCw, BookmarkCheck } from 'lucide-react';

export const CognitiveReframer: React.FC = () => {
  const [thought, setThought] = useState<string>('');
  const [selectedDistortion, setSelectedDistortion] = useState<string>('Catastrophizing');
  const [friendAdvice, setFriendAdvice] = useState<string>('');
  const [balancedThought, setBalancedThought] = useState<string>('');
  const [savedReframes, setSavedReframes] = useState<{ original: string; distortion: string; reframe: string }[]>([
    {
      original: 'If I mess up this mock presentation, everyone will think I am incompetent.',
      distortion: 'Mind Reading & Catastrophizing',
      reframe: 'People are primarily focused on their own presentations. An imperfect slide is normal learning, not a character judgment.',
    },
  ]);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const DISTORTIONS = [
    { name: 'Catastrophizing', description: 'Assuming the worst imaginable outcome will inevitably happen.' },
    { name: 'All-or-Nothing', description: 'Viewing situations in black-and-white extremes (perfection or failure).' },
    { name: 'Mind Reading', description: 'Believing you know for sure that people are judging you negatively.' },
    { name: 'Emotional Reasoning', description: 'Assuming that because you feel panicked, the danger must be real.' },
    { name: 'Overgeneralization', description: 'Treating a single setback as a never-ending pattern of defeat.' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought || !balancedThought) return;

    setSavedReframes([
      {
        original: thought,
        distortion: selectedDistortion,
        reframe: balancedThought,
      },
      ...savedReframes,
    ]);

    setThought('');
    setFriendAdvice('');
    setBalancedThought('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E2DA] p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-0.5">
          Cognitive Restructuring Toolkit
        </span>
        <h3 className="text-xl font-serif font-bold text-[#192A24]">
          Stress & Anxiety Thought Defuser
        </h3>
        <p className="text-xs text-[#52665C] mt-1">
          When high-stakes exams, social worry, or imposter syndrome strike, use this guided Cognitive Behavioral Therapy (CBT) workflow to reframe automatic catastrophic thoughts into grounded, actionable truth.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Step 1: Automatic Thought */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#192A24] flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-[#2D6A4F] text-white text-[10px] flex items-center justify-center font-mono">1</span>
            <span>What is the anxious or harsh thought spinning in your head?</span>
          </label>
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="E.g., I cannot understand this calculus theorem, so I will fail the finals and disappoint everyone..."
            rows={2}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCDCD4] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
          />
        </div>

        {/* Step 2: Spot the Cognitive Distortion */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#192A24] flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-[#2D6A4F] text-white text-[10px] flex items-center justify-center font-mono">2</span>
            <span>Which cognitive distortion is at play here?</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DISTORTIONS.map((d) => (
              <button
                key={d.name}
                type="button"
                onClick={() => setSelectedDistortion(d.name)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedDistortion === d.name
                    ? 'border-[#2D6A4F] bg-[#EBF4EE] font-semibold text-[#192A24]'
                    : 'border-[#E0E0D6] bg-[#FAFAF8] text-[#55695E] hover:bg-white'
                }`}
              >
                <span className="text-xs block">{d.name}</span>
                <span className="text-[10px] text-[#697B72] block line-clamp-1">{d.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Best Friend Test */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#192A24] flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-[#2D6A4F] text-white text-[10px] flex items-center justify-center font-mono">3</span>
            <span>The Compassion Pivot: What would you tell your best friend if they were in your shoes?</span>
          </label>
          <input
            type="text"
            value={friendAdvice}
            onChange={(e) => setFriendAdvice(e.target.value)}
            placeholder="E.g., I'd remind them they've mastered hard topics before and one tough homework is normal."
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCDCD4] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
          />
        </div>

        {/* Step 4: Grounded Reframe */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#192A24] flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-[#2D6A4F] text-white text-[10px] flex items-center justify-center font-mono">4</span>
            <span>Now write your balanced, grounded reframe</span>
          </label>
          <textarea
            value={balancedThought}
            onChange={(e) => setBalancedThought(e.target.value)}
            placeholder="E.g., This is difficult right now, but struggling with a problem is the literal definition of learning. I will take a 5-min walk, ask my teacher tomorrow, and take it one step at a time."
            rows={2}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#2D6A4F]/60 bg-[#F4F9F5] focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Reframe saved to personal wisdom vault!
            </span>
          )}
          <button
            type="submit"
            disabled={!thought || !balancedThought}
            className="ml-auto flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#2D6A4F] hover:bg-[#23533E] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Anchor This Reframe</span>
          </button>
        </div>
      </form>

      {/* Saved Reframes List */}
      {savedReframes.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#EAEAE2] space-y-3">
          <span className="text-xs font-bold text-[#4A5D54] uppercase tracking-wider block">
            Saved Psychological Reframes
          </span>
          <div className="space-y-2.5">
            {savedReframes.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-[#E0E0D6] bg-[#FAFAF8] space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="font-semibold text-rose-700">Distortion: {item.distortion}</span>
                  <span className="font-mono text-[10px]">Private Vault</span>
                </div>
                <div className="text-xs text-neutral-500 line-through">
                  "{item.original}"
                </div>
                <div className="text-xs font-medium text-[#192A24] bg-white p-2.5 rounded-lg border border-[#EAEAE2]">
                  🌿 Reframe: {item.reframe}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
