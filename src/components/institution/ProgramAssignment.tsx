import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WellbeingProgram } from '../../types';
import { BookOpen, Check, Plus, Users, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

export const ProgramAssignment: React.FC = () => {
  const { programs, institution, assignProgramToClass } = useApp();

  const [selectedProgram, setSelectedProgram] = useState<WellbeingProgram>(programs[0]);
  const [sectionToAssign, setSectionToAssign] = useState<string>('10-B');
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);

  const allSections = Array.from(
    new Set(institution.departments.flatMap((d) => d.sections))
  );

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    assignProgramToClass(selectedProgram.id, sectionToAssign);
    setAssignSuccess(`Assigned "${selectedProgram.title}" to Section ${sectionToAssign}!`);
    setTimeout(() => setAssignSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-1">
            Curriculum Deployment Engine
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24]">
            Wellbeing Programs & Assignments
          </h2>
          <p className="text-sm text-[#5C6E66]">
            Deploy age-appropriate, evidence-based socio-emotional and cognitive resilience tracks across classes.
          </p>
        </div>
      </div>

      {assignSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{assignSuccess}</span>
        </div>
      )}

      {/* Program Assignment Quick Action */}
      <div className="p-5 rounded-2xl bg-[#F6FAF7] border border-[#CBE5D4] shadow-xs">
        <form onSubmit={handleAssign} className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 w-full md:w-auto">
            <span className="text-xs font-bold text-[#2D6A4F] uppercase tracking-wider block">
              Quick Assignment
            </span>
            <p className="text-xs text-[#3E5C4E]">
              Assign selected curriculum track to an active class section.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <select
              value={selectedProgram.id}
              onChange={(e) => {
                const prog = programs.find((p) => p.id === e.target.value);
                if (prog) setSelectedProgram(prog);
              }}
              className="text-xs p-2.5 rounded-xl border border-[#B3D6BF] bg-white text-[#192A24] focus:outline-none"
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title.split(':')[0]} ({p.targetStages[0].replace('classes_', 'Grades ')})
                </option>
              ))}
            </select>

            <select
              value={sectionToAssign}
              onChange={(e) => setSectionToAssign(e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-[#B3D6BF] bg-white text-[#192A24] focus:outline-none"
            >
              {allSections.map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-4 py-2.5 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#22523D] rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>

      {/* Programs Catalog Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {programs.map((prog) => (
          <div
            key={prog.id}
            className="p-6 rounded-2xl border border-[#E2E2DA] bg-white shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[#2D6A4F] px-2 py-0.5 rounded bg-[#EAF2ED]">
                  {prog.category} · {prog.durationWeeks} Weeks
                </span>
                <span className="text-xs font-mono font-bold text-neutral-500">
                  {prog.modulesCount} Modules
                </span>
              </div>

              <h3 className="font-serif font-bold text-base text-[#192A24]">
                {prog.title}
              </h3>
              <p className="text-xs text-[#52665C] leading-relaxed">
                {prog.description}
              </p>
            </div>

            {/* Assigned Classes */}
            <div className="space-y-3 pt-3 border-t border-[#EAEAE2]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#4A5D54]">Currently Deployed To:</span>
                <span className="font-mono text-[11px] text-[#2D6A4F]">
                  {prog.assignedToClasses?.length ? prog.assignedToClasses.join(', ') : 'Not yet assigned'}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Cohort Completion:</span>
                  <span className="font-mono font-bold tabular-nums">{prog.completionRate || 0}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EDEDE6] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#2D6A4F]"
                    style={{ width: `${prog.completionRate || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
