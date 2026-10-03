import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyCheckInModal } from './DailyCheckInModal';
import {
  Sparkles,
  Flame,
  Wind,
  Heart,
  Brain,
  BookOpen,
  ArrowRight,
  Smile,
  ShieldCheck,
  CalendarCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface StudentHomeProps {
  onNavigate: (tab: string) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({ onNavigate }) => {
  const { currentStudent, studentStage, programs } = useApp();
  const [checkInOpen, setCheckInOpen] = useState(false);

  // Today check-in status
  const todayStr = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = currentStudent.checkInHistory.some((c) => c.date === todayStr);

  const matchedProgram =
    programs.find((p) => p.targetStages.includes(studentStage)) || programs[0];

  // Daily kindness challenge by stage
  const challengesByStage = {
    classes_1_5: {
      title: 'Kindness Superpower Challenge',
      desc: 'Smile at someone in your school bus or playground and say: "You did great today!"',
      reward: 'Earn 10 Kindness Stars ⭐',
    },
    classes_6_8: {
      title: 'Peer Empathy & Screen Pause',
      desc: 'Notice someone sitting quietly at recess and invite them to join, or take a 15-minute phone-free walk after homework.',
      reward: 'Level up Empathy Badge 🛡️',
    },
    classes_9_12: {
      title: 'Exam Cognitive Rest Challenge',
      desc: 'After 90 minutes of problem-solving, take a strict 10-minute break with zero social media. Look at distant trees or practice 3 box breath cycles.',
      reward: 'Protects hippocampus memory consolidation 🧠',
    },
    college: {
      title: 'Boundary & Self-Compassion Anchor',
      desc: 'Say a polite "no" to one non-essential commitment or social plan today to protect your 8 hours of sleep.',
      reward: 'Sustained cognitive resilience 🌿',
    },
    corporate: {
      title: 'Meeting Decompression Interval',
      desc: 'End your 1-on-1 meeting 5 minutes early to drink water and do a seated spinal twist.',
      reward: 'Reduces cortisol buildup ☕',
    },
  };

  const currentChallenge = challengesByStage[studentStage] || challengesByStage['classes_9_12'];

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E3F32] via-[#2D6A4F] to-[#1B4332] text-white p-6 sm:p-10 shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold uppercase tracking-wider text-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AAVYA Sanctuary · {currentStudent.classSection}</span>
            </span>

            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{currentStudent.activeStreak} Day Wellbeing Streak</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white">
            {studentStage === 'classes_1_5'
              ? `Hello, Little Star ${currentStudent.name.split(' ')[0]}!`
              : `Welcome to your safe space, ${currentStudent.name.split(' ')[0]}.`}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {studentStage === 'classes_1_5'
              ? 'Aavi the cloud friend is here with you! Let us take big gentle breaths, color our feelings, and spread kind smiles today.'
              : studentStage === 'classes_6_8'
              ? 'Your feelings are valid. You do not have to carry middle-school pressure or friendship worries alone. Let us take one conscious breath.'
              : studentStage === 'classes_9_12'
              ? 'Board exams and future goals matter, but your nervous system and peace matter more. High performance comes from grounded clarity.'
              : 'Honor your pace. University and early career journeys are marathons built on sustainable rest, self-compassion, and firm boundaries.'}
          </p>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCheckInOpen(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                hasCheckedInToday
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-white text-[#192A24] hover:bg-emerald-50'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-[#2D6A4F]" />
              <span>{hasCheckedInToday ? 'Update Today’s Check-in' : 'Log Daily Mood Pulse'}</span>
            </button>

            <button
              onClick={() => onNavigate('exercises')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-950/40 hover:bg-emerald-950/60 text-emerald-100 transition-colors cursor-pointer"
            >
              <Wind className="w-4 h-4" />
              <span>Quick 2-Min Reset</span>
            </button>
          </div>
        </div>

        {/* Mascot / Serenity Card Illustration */}
        <div className="hidden lg:block absolute right-8 bottom-0 w-64 h-64 rounded-full overflow-hidden border-4 border-white/20 shadow-xl opacity-90">
          <img
            src={
              studentStage === 'classes_1_5'
                ? '/src/assets/images/aavya_mascot_character_1791043816901.jpg'
                : '/src/assets/images/aavya_journal_serenity_1791043841082.jpg'
            }
            alt="Wellbeing visual"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Daily Kindness / Self-Care Challenge Banner */}
      <div className="bg-[#FAF8F5] border border-[#EBE3D3] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
              <Smile className="w-4 h-4" />
            </span>
            <span className="font-bold text-xs uppercase tracking-wider text-amber-900">
              {currentChallenge.title}
            </span>
          </div>
          <p className="text-xs text-[#524535] leading-relaxed max-w-xl">
            {currentChallenge.desc}
          </p>
        </div>
        <div className="text-xs font-semibold text-[#2D6A4F] bg-white px-3 py-1.5 rounded-xl border border-[#E2D8C6] shadow-2xs self-start md:self-auto">
          {currentChallenge.reward}
        </div>
      </div>

      {/* Quick Interactive Resets Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-[#192A24]">
            Instant Somatic & Cognitive Resets
          </h3>
          <span className="text-xs text-[#697B72]">Evidence-based micro-tools</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Breathing */}
          <div
            onClick={() => onNavigate('exercises')}
            className="p-5 rounded-2xl border border-[#E2E2DA] bg-white hover:border-[#2D6A4F] hover:shadow-xs transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2D6A4F] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#192A24]">
                Breathing Studio
              </h4>
              <p className="text-xs text-[#5C6E66] mt-1 leading-snug">
                Box breathing, 4-7-8 calm, and balloon breaths with audio.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#2D6A4F] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Breathe now <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Card 2: 5-4-3-2-1 Sensory */}
          <div
            onClick={() => onNavigate('exercises')}
            className="p-5 rounded-2xl border border-[#E2E2DA] bg-white hover:border-[#2D6A4F] hover:shadow-xs transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#192A24]">
                5-4-3-2-1 Grounding
              </h4>
              <p className="text-xs text-[#5C6E66] mt-1 leading-snug">
                Engage sight, touch, and sound to stop anxiety spirals in 3 mins.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#2D6A4F] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Anchor senses <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Card 3: Cognitive Thought Defuser */}
          <div
            onClick={() => onNavigate('exercises')}
            className="p-5 rounded-2xl border border-[#E2E2DA] bg-white hover:border-[#2D6A4F] hover:shadow-xs transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#192A24]">
                Stress & Thought Defuser
              </h4>
              <p className="text-xs text-[#5C6E66] mt-1 leading-snug">
                CBT cognitive reframer to challenge catastrophic exam thoughts.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#2D6A4F] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Reframe thought <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Card 4: Focus Soundscape */}
          <div
            onClick={() => onNavigate('exercises')}
            className="p-5 rounded-2xl border border-[#E2E2DA] bg-white hover:border-[#2D6A4F] hover:shadow-xs transition-all cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#192A24]">
                Focus Audio & Pomodoro
              </h4>
              <p className="text-xs text-[#5C6E66] mt-1 leading-snug">
                Procedural 432Hz theta & rain generator + timed study blocks.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#2D6A4F] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Enter flow <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Curriculum & Goals 2-column showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Curriculum Pathway */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E2DA] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2D6A4F]" />
              <h3 className="font-serif font-bold text-base text-[#192A24]">
                Active Wellbeing Pathway: {matchedProgram.title}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('journeys')}
              className="text-xs font-semibold text-[#2D6A4F] hover:underline"
            >
              View Full Path
            </button>
          </div>

          <p className="text-xs text-[#52665C]">
            {matchedProgram.tagline}
          </p>

          <div className="space-y-2.5">
            {matchedProgram.modules.slice(0, 3).map((mod, idx) => (
              <div
                key={mod.id}
                className="p-3.5 rounded-xl border border-[#E8E8DF] bg-[#FAFAF8] flex items-center justify-between gap-3 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-neutral-400">
                    0{idx + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-xs text-[#192A24] block">
                      {mod.title}
                    </span>
                    <span className="text-[11px] text-[#697B72]">
                      {mod.durationMinutes} min reflection
                    </span>
                  </div>
                </div>

                {mod.isCompleted ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Done
                  </span>
                ) : (
                  <button
                    onClick={() => onNavigate('journeys')}
                    className="px-3 py-1 text-xs font-medium text-[#2D6A4F] bg-white border border-[#CAD9D0] rounded-lg hover:bg-[#EAF3EE]"
                  >
                    Start
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Private Sanctuary Teaser */}
        <div className="bg-[#FAFBF9] rounded-2xl border border-[#E0E0D6] p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D6A4F]">
              <ShieldCheck className="w-4 h-4" />
              <span>Strict Privacy Shield</span>
            </div>
            <h4 className="font-serif font-bold text-base text-[#192A24]">
              Private Reflections & Journal
            </h4>
            <p className="text-xs text-[#52665C] leading-relaxed">
              Your entries are protected by client-side isolation. Teachers and school admins only receive anonymized cohort statistics (minimum group size n ≥ 5).
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onNavigate('journal')}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#22523D] rounded-xl transition-all shadow-xs cursor-pointer text-center"
            >
              Open My Private Journal
            </button>
            <button
              onClick={() => onNavigate('companion')}
              className="w-full py-2 px-4 text-xs font-semibold text-[#192A24] bg-white border border-[#D5D5CB] hover:bg-[#F2F2EC] rounded-xl transition-colors cursor-pointer text-center"
            >
              Talk with Aavi AI
            </button>
          </div>
        </div>
      </div>

      {/* Daily Check-In Modal */}
      <DailyCheckInModal isOpen={checkInOpen} onClose={() => setCheckInOpen(false)} />
    </div>
  );
};
