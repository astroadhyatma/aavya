import React, { useState } from 'react';
import { Eye, Hand, Ear, Sparkles, Smile, Check, ArrowRight, RotateCcw } from 'lucide-react';

export const GroundingExercise: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [items, setItems] = useState<Record<number, string[]>>({
    0: ['', '', '', '', ''],
    1: ['', '', '', ''],
    2: ['', '', ''],
    3: ['', ''],
    4: [''],
  });
  const [completed, setCompleted] = useState<boolean>(false);

  const STEPS = [
    {
      count: 5,
      prompt: 'Name 5 things you can SEE around you right now',
      subtext: 'Notice colors, shapes, light reflections, or textures in your space.',
      icon: Eye,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      placeholders: [
        'A wooden table grain',
        'Sunlight on the wall',
        'Blue fountain pen',
        'Tree leaves outside',
        'My notebook cover',
      ],
    },
    {
      count: 4,
      prompt: 'Name 4 things you can physically TOUCH or FEEL',
      subtext: 'Feel your feet grounded on the floor, clothing against skin, cool air.',
      icon: Hand,
      color: 'bg-teal-50 border-teal-200 text-teal-800',
      placeholders: [
        'Smooth cotton sleeves',
        'Solid floor beneath shoes',
        'Cool glass of water',
        'The keys on my desk',
      ],
    },
    {
      count: 3,
      prompt: 'Name 3 distinct sounds you can HEAR',
      subtext: 'Listen beyond the obvious: distant birds, whirring fan, gentle footsteps.',
      icon: Ear,
      color: 'bg-sky-50 border-sky-200 text-sky-800',
      placeholders: [
        'Distant traffic murmur',
        'Air conditioner hum',
        'Rustle of book pages',
      ],
    },
    {
      count: 2,
      prompt: 'Name 2 things you can SMELL (or favorite comforting scents)',
      subtext: 'Fresh morning tea, pencil shavings, petrichor (rain on earth).',
      icon: Sparkles,
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      placeholders: [
        'Cardamom morning chai',
        'Freshly printed paper',
      ],
    },
    {
      count: 1,
      prompt: 'Name 1 thing you can TASTE or one true kindness about yourself',
      subtext: 'A clean sip of water, or a quiet reminder: "I am doing my best."',
      icon: Smile,
      color: 'bg-rose-50 border-rose-200 text-rose-800',
      placeholders: [
        'I am resilient, and this difficult feeling will pass.',
      ],
    },
  ];

  const currentStepData = STEPS[currentStep];

  const handleInputChange = (index: number, val: string) => {
    setItems((prev) => {
      const stepItems = [...prev[currentStep]];
      stepItems[index] = val;
      return { ...prev, [currentStep]: stepItems };
    });
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCompleted(false);
    setItems({
      0: ['', '', '', '', ''],
      1: ['', '', '', ''],
      2: ['', '', ''],
      3: ['', ''],
      4: [''],
    });
  };

  const Icon = currentStepData.icon;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E2DA] p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-0.5">
            Sensory De-Escalation
          </span>
          <h3 className="text-xl font-serif font-bold text-[#192A24]">
            5-4-3-2-1 Grounding Technique
          </h3>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 self-start cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart</span>
        </button>
      </div>

      {completed ? (
        <div className="py-10 text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <Check className="w-7 h-7" />
          </div>
          <h4 className="text-xl font-serif font-bold text-[#192A24]">
            You Are Anchored in the Present
          </h4>
          <p className="text-xs text-[#52665C] leading-relaxed">
            Take a deep, grateful breath. Notice how your body feels right now compared to when you started. You brought your mind back into your safe physical environment.
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#2D6A4F] rounded-xl hover:bg-[#214E3A] transition-colors cursor-pointer"
          >
            Practice Again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress track */}
          <div className="flex items-center gap-2">
            {STEPS.map((step, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  idx === currentStep
                    ? 'bg-[#2D6A4F]'
                    : idx < currentStep
                    ? 'bg-[#8FBAA2]'
                    : 'bg-[#EDEDE6]'
                }`}
              />
            ))}
          </div>

          {/* Current Step Banner */}
          <div className={`p-4 rounded-xl border ${currentStepData.color} flex items-start gap-3`}>
            <div className="p-2 rounded-lg bg-white/70 shadow-2xs shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-extrabold">{currentStepData.count}</span>
                <span className="text-xs font-bold">{currentStepData.prompt}</span>
              </div>
              <p className="text-xs opacity-85 mt-0.5">{currentStepData.subtext}</p>
            </div>
          </div>

          {/* Inputs for this step */}
          <div className="space-y-2.5">
            {items[currentStep].map((val, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-mono text-xs text-neutral-400 w-5 text-right font-medium">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  placeholder={`E.g., ${currentStepData.placeholders[idx] || 'Notice something...'}`}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#DCDCD4] bg-white focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                />
              </div>
            ))}
          </div>

          {/* Next / Complete button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#697B72]">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#2D6A4F] hover:bg-[#22523D] rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span>{currentStep === STEPS.length - 1 ? 'Complete Grounding' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
