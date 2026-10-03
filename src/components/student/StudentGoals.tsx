import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WellbeingGoal } from '../../types';
import { Plus, Check, Flame, Trophy, Moon, Brain, Footprints, BookOpen, Smartphone, Users } from 'lucide-react';

export const StudentGoals: React.FC = () => {
  const { currentStudent, toggleGoalCompleted, addGoal } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [category, setCategory] = useState<WellbeingGoal['category']>('mindfulness');
  const [targetDays, setTargetDays] = useState<number>(5);

  const categoryIcons: Record<WellbeingGoal['category'], { icon: React.ElementType; color: string; label: string }> = {
    sleep: { icon: Moon, color: 'text-indigo-600 bg-indigo-50', label: 'Sleep & Rest' },
    mindfulness: { icon: Brain, color: 'text-emerald-600 bg-emerald-50', label: 'Mindfulness' },
    movement: { icon: Footprints, color: 'text-amber-600 bg-amber-50', label: 'Movement & Outdoor' },
    academics: { icon: BookOpen, color: 'text-sky-600 bg-sky-50', label: 'Mindful Study' },
    social: { icon: Users, color: 'text-teal-600 bg-teal-50', label: 'Kindness & Social' },
    digital_balance: { icon: Smartphone, color: 'text-rose-600 bg-rose-50', label: 'Digital Boundaries' },
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    addGoal({
      title: goalTitle.trim(),
      category,
      targetDaysPerWeek: targetDays,
    });

    setGoalTitle('');
    setIsAdding(false);
  };

  const totalStreakSum = currentStudent.goals.reduce((acc, g) => acc + g.currentStreak, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-1">
            Habit Architecture & Resilience
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24]">
            Personal Wellbeing Goals
          </h2>
          <p className="text-sm text-[#5C6E66]">
            Small daily practices that build a lasting psychological immune system.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="font-mono tabular-nums">{totalStreakSum} Day Streak Momentum</span>
          </div>

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Goal</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Goal Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateGoal}
          className="bg-white rounded-2xl border border-[#DCDCD4] p-5 sm:p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-[#192A24] text-base">New Wellbeing Practice</h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-neutral-500 hover:text-neutral-800"
            >
              Close
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#4A5D54]">Goal Description</label>
            <input
              type="text"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="E.g., 10-minute evening walk without audio / 7.5 hours uninterrupted sleep"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5D54]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WellbeingGoal['category'])}
                className="w-full text-xs p-2 rounded-xl border border-[#D5D5CB] bg-white text-[#192A24] focus:outline-none"
              >
                <option value="mindfulness">Mindfulness & Breathing</option>
                <option value="sleep">Sleep Hygiene</option>
                <option value="movement">Physical Movement & Nature</option>
                <option value="academics">Deep Study Blocks</option>
                <option value="social">Peer Empathy & Kindness</option>
                <option value="digital_balance">Digital Detox</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5D54]">Target Cadence</label>
              <select
                value={targetDays}
                onChange={(e) => setTargetDays(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-xl border border-[#D5D5CB] bg-white text-[#192A24] focus:outline-none"
              >
                <option value={3}>3 days / week</option>
                <option value={4}>4 days / week</option>
                <option value={5}>5 days / week (Recommended)</option>
                <option value={6}>6 days / week</option>
                <option value={7}>Daily (7 days / week)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Save Goal
            </button>
          </div>
        </form>
      )}

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentStudent.goals.map((g) => {
          const catInfo = categoryIcons[g.category] || categoryIcons.mindfulness;
          const Icon = catInfo.icon;
          const pct = Math.min(100, Math.round((g.completedDays / g.targetDaysPerWeek) * 100));

          return (
            <div
              key={g.id}
              className={`p-5 rounded-2xl border transition-all ${
                g.isCompletedToday
                  ? 'border-emerald-300 bg-[#F4FAF6] shadow-xs'
                  : 'border-[#E2E2DA] bg-white hover:border-[#CAD7CF]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${catInfo.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold tracking-wide uppercase text-neutral-500 block">
                      {catInfo.label}
                    </span>
                    <h4 className="font-semibold text-sm text-[#192A24] leading-snug">
                      {g.title}
                    </h4>
                  </div>
                </div>

                {/* Checkbox Button */}
                <button
                  onClick={() => toggleGoalCompleted(g.id)}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                    g.isCompletedToday
                      ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white shadow-2xs'
                      : 'border-neutral-300 hover:border-[#2D6A4F] bg-white'
                  }`}
                  title={g.isCompletedToday ? 'Mark incomplete' : 'Mark done for today'}
                >
                  {g.isCompletedToday && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
              </div>

              {/* Progress and Streaks */}
              <div className="space-y-1.5 pt-2 border-t border-[#EAEAE2]">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <span>Weekly Progress:</span>
                    <span className="font-mono font-bold text-[#192A24] tabular-nums">
                      {g.completedDays} / {g.targetDaysPerWeek} days
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-700 font-semibold font-mono text-xs tabular-nums">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{g.currentStreak} day streak</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-[#EDEDE6] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct >= 100 ? 'bg-emerald-600' : 'bg-[#2D6A4F]'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
