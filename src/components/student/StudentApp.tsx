import React, { useState } from 'react';
import { StudentHome } from './StudentHome';
import { BreathingStudio } from './BreathingStudio';
import { GroundingExercise } from './GroundingExercise';
import { FocusSoundscape } from './FocusSoundscape';
import { CognitiveReframer } from './CognitiveReframer';
import { StudentJournal } from './StudentJournal';
import { StudentGoals } from './StudentGoals';
import { WellbeingJourneys } from './WellbeingJourneys';
import { AaviCompanion } from './AaviCompanion';

interface StudentAppProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const StudentApp: React.FC<StudentAppProps> = ({ currentTab, setCurrentTab }) => {
  const [exerciseSubTab, setExerciseSubTab] = useState<'breathing' | 'grounding' | 'focus' | 'reframe'>('breathing');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-opacity duration-300">
      {currentTab === 'home' && <StudentHome onNavigate={setCurrentTab} />}

      {currentTab === 'exercises' && (
        <div className="space-y-6">
          {/* Sub-tab navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-[#EDEDE6] rounded-xl self-start overflow-x-auto max-w-full">
            <button
              onClick={() => setExerciseSubTab('breathing')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                exerciseSubTab === 'breathing'
                  ? 'bg-white text-[#192A24] shadow-xs'
                  : 'text-[#5C6E66] hover:text-[#192A24]'
              }`}
            >
              Breathing Studio
            </button>
            <button
              onClick={() => setExerciseSubTab('grounding')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                exerciseSubTab === 'grounding'
                  ? 'bg-white text-[#192A24] shadow-xs'
                  : 'text-[#5C6E66] hover:text-[#192A24]'
              }`}
            >
              5-4-3-2-1 Sensory Reset
            </button>
            <button
              onClick={() => setExerciseSubTab('focus')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                exerciseSubTab === 'focus'
                  ? 'bg-white text-[#192A24] shadow-xs'
                  : 'text-[#5C6E66] hover:text-[#192A24]'
              }`}
            >
              Focus Audio & Pomodoro
            </button>
            <button
              onClick={() => setExerciseSubTab('reframe')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                exerciseSubTab === 'reframe'
                  ? 'bg-white text-[#192A24] shadow-xs'
                  : 'text-[#5C6E66] hover:text-[#192A24]'
              }`}
            >
              CBT Thought Defuser
            </button>
          </div>

          {exerciseSubTab === 'breathing' && <BreathingStudio />}
          {exerciseSubTab === 'grounding' && <GroundingExercise />}
          {exerciseSubTab === 'focus' && <FocusSoundscape />}
          {exerciseSubTab === 'reframe' && <CognitiveReframer />}
        </div>
      )}

      {currentTab === 'journal' && <StudentJournal />}
      {currentTab === 'goals' && <StudentGoals />}
      {currentTab === 'journeys' && <WellbeingJourneys />}
      {currentTab === 'companion' && <AaviCompanion />}
    </div>
  );
};
