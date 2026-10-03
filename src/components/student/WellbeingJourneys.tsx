import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProgramModule, WellbeingProgram } from '../../types';
import { BookOpen, CheckCircle, Clock, ArrowRight, Sparkles, Check, X, Shield } from 'lucide-react';

export const WellbeingJourneys: React.FC = () => {
  const { programs, studentStage, completeProgramModule } = useApp();

  // Find the program assigned or matching current student stage
  const matchedProgram =
    programs.find((p) => p.targetStages.includes(studentStage)) || programs[0];

  const [activeModule, setActiveModule] = useState<ProgramModule | null>(null);
  const [reflectionResponse, setReflectionResponse] = useState<string>('');
  const [moduleSaved, setModuleSaved] = useState<boolean>(false);

  const handleOpenModule = (mod: ProgramModule) => {
    setActiveModule(mod);
    setReflectionResponse('');
    setModuleSaved(false);
  };

  const handleCompleteCurrent = () => {
    if (activeModule) {
      completeProgramModule(matchedProgram.id, activeModule.id);
      setModuleSaved(true);
      setTimeout(() => {
        setActiveModule(null);
      }, 1200);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-1">
            Personalized Curriculum Journey
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24]">
            {matchedProgram.title}
          </h2>
          <p className="text-sm text-[#5C6E66] mt-0.5">
            {matchedProgram.tagline}
          </p>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#E2E2DA] shadow-2xs self-start">
          <div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wide font-semibold block">
              Curriculum Progress
            </span>
            <span className="font-mono font-bold text-lg text-[#2D6A4F] tabular-nums">
              {matchedProgram.completionRate || 0}% Completed
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-[#2D6A4F]/20 flex items-center justify-center font-mono font-bold text-xs text-[#2D6A4F]">
            {matchedProgram.modules.filter((m) => m.isCompleted).length}/{matchedProgram.modules.length}
          </div>
        </div>
      </div>

      {/* Program Summary Card */}
      <div className="bg-[#F6FAF7] border border-[#CDE5D5] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#2D6A4F] uppercase tracking-wider">
            {matchedProgram.category} · {matchedProgram.durationWeeks} Weeks Track
          </span>
          <p className="text-xs text-[#3E5C4E] leading-relaxed max-w-2xl">
            {matchedProgram.description}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#2D6A4F] font-semibold whitespace-nowrap">
          <Shield className="w-4 h-4" />
          <span>Curated with Clinical Psychologists</span>
        </div>
      </div>

      {/* Modules Roadmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matchedProgram.modules.map((mod, idx) => (
          <div
            key={mod.id}
            onClick={() => handleOpenModule(mod)}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              mod.isCompleted
                ? 'border-emerald-200 bg-white hover:border-emerald-400'
                : 'border-[#E2E2DA] bg-[#FAFAF8] hover:bg-white hover:border-[#CAD7CF]'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-neutral-400">
                  Module {idx + 1}
                </span>
                <span className="text-neutral-300">·</span>
                <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                  <Clock className="w-3 h-3" />
                  <span>{mod.durationMinutes} mins</span>
                </div>
              </div>

              {mod.isCompleted ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" /> Completed
                </span>
              ) : (
                <span className="text-[11px] text-[#2D6A4F] font-medium flex items-center gap-1 hover:underline">
                  Start Module <ArrowRight className="w-3 h-3" />
                </span>
              )}
            </div>

            <h4 className="font-serif font-bold text-base text-[#192A24] mb-1">
              {mod.title}
            </h4>
            <p className="text-xs text-[#52665C] leading-relaxed line-clamp-2">
              {mod.description}
            </p>
          </div>
        ))}
      </div>

      {/* Interactive Module Viewer Modal */}
      {activeModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-[#D5D5CB] shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModule(null)}
              className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D6A4F]">
                <BookOpen className="w-4 h-4" />
                <span>Guided Lesson & Reflection</span>
              </div>

              <h3 className="text-xl font-serif font-bold text-[#192A24]">
                {activeModule.title}
              </h3>

              <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E7E7DE] text-xs text-[#3E4F47] leading-relaxed space-y-2">
                <p className="font-semibold text-[#192A24]">Context & Neurobiology:</p>
                <p>{activeModule.description}</p>
                <p>
                  Take 3 slow breaths before answering the prompt below. There is no right or wrong answer—only honest self-awareness.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#192A24]">
                  Reflective Exercise & Personal Application
                </label>
                <textarea
                  value={reflectionResponse}
                  onChange={(e) => setReflectionResponse(e.target.value)}
                  placeholder="How does this apply to your school week? What is one insight you want to remember?..."
                  rows={4}
                  className="w-full p-3 text-xs rounded-xl border border-[#D5D5CB] bg-white focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#EAEAE2]">
                {moduleSaved ? (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Module progress saved!
                  </span>
                ) : (
                  <span className="text-xs text-neutral-500">
                    Est. duration: {activeModule.durationMinutes} minutes
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModule(null)}
                    className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCompleteCurrent}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Complete & Check Off
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
