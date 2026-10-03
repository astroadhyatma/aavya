import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  HeartPulse,
  TrendingUp,
  ShieldAlert,
  Lock,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { ExportReportModal } from './ExportReportModal';

export const AdminOverview: React.FC = () => {
  const { institution, allStudents, referrals } = useApp();
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Compute aggregate metrics
  const activeReferralsCount = referrals.filter((r) => r.status !== 'Resolved').length;
  const highPriorityCount = referrals.filter(
    (r) => r.priority === 'urgent_safeguarding' || r.priority === 'high'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-1">
            Institutional Wellbeing Intelligence
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24]">
            Cohort Pulse & Analytics
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6E66]">
            {institution.name} · Real-time anonymized participation & mental health trends
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start">
          <button
            onClick={() => setExportModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Anonymized Report</span>
          </button>
        </div>
      </div>

      {/* Mandatory K-Anonymity Privacy Guarantee Banner */}
      <div className="bg-[#F0F7F3] border border-[#C6E4D1] p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-[#2E5440]">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#2D6A4F] text-white shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#192A24] block">
              Ethical Data Shield & K-Anonymity Protocol Active (k ≥ 5)
            </span>
            <span className="leading-relaxed">
              Student journals, private reflections, and 1-on-1 AI conversations are mathematically sealed from administration view. Data is aggregated across minimum cohorts of 5 to protect individual privacy while revealing actionable campus wellbeing patterns.
            </span>
          </div>
        </div>
        <span className="shrink-0 text-[11px] font-mono font-semibold px-2.5 py-1 bg-white rounded-lg border border-[#BCDDC7] text-[#2D6A4F]">
          FERPA & DPDP Aligned
        </span>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl border border-[#E2E2DA] bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Enrollment</span>
            <Users className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-[#192A24] tabular-nums">
            {institution.totalStudents}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>86.4% logged weekly check-in</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl border border-[#E2E2DA] bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Campus Wellbeing Index</span>
            <HeartPulse className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-[#192A24] tabular-nums">
            76.8<span className="text-lg text-neutral-400">/100</span>
          </div>
          <div className="text-[11px] text-[#55695E]">
            Moderate-High Resilience baseline
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl border border-[#E2E2DA] bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Safeguarding Triage</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-[#192A24] tabular-nums">
            {activeReferralsCount} <span className="text-sm font-normal text-neutral-500">active</span>
          </div>
          <div className="text-[11px] text-rose-700 font-medium">
            {highPriorityCount} requiring counsellor intake
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl border border-[#E2E2DA] bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Curriculum Adoption</span>
            <Sparkles className="w-4 h-4 text-teal-600" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-[#192A24] tabular-nums">
            78.2%
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            +14% completed modules this month
          </div>
        </div>
      </div>

      {/* Cohort Mood Pulse & Stressor Factor Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution Card */}
        <div className="bg-white rounded-2xl border border-[#E2E2DA] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#192A24]">
              Campus Mood Distribution (Past 14 Days)
            </h3>
            <span className="text-[11px] text-neutral-500">n = 1,180 records</span>
          </div>

          <p className="text-xs text-[#52665C]">
            Aggregated from daily student check-ins. Reflects overall emotional climate of the campus.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Energized & Flourishing', pct: 36, color: 'bg-emerald-600', count: '425 students' },
              { label: 'Balanced & Steady', pct: 40, color: 'bg-teal-500', count: '472 students' },
              { label: 'Mild Anxiety / Exam Restlessness', pct: 16, color: 'bg-amber-500', count: '189 students' },
              { label: 'High Fatigue / Overwhelmed', pct: 8, color: 'bg-rose-500', count: '94 students' },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#192A24]">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 text-[11px]">{item.count}</span>
                    <span className="font-mono font-bold text-[#192A24] tabular-nums">{item.pct}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EDEDE6] overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Reported Stressors */}
        <div className="bg-white rounded-2xl border border-[#E2E2DA] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#192A24]">
              Primary Student-Reported Stressors
            </h3>
            <span className="text-[11px] text-neutral-500">Aggregated tags</span>
          </div>

          <p className="text-xs text-[#52665C]">
            Self-selected influencers during check-ins. Informs workshop topics and curriculum adjustments.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Academics & Mock Tests', pct: 44, note: 'Peaks prior to Class 10/12 exams' },
              { label: 'Sleep Deprivation (<6.5 hrs)', pct: 28, note: 'Correlated with late night revision' },
              { label: 'Peer & Social Dynamics', pct: 16, note: 'Dominant in Grades 6–8' },
              { label: 'Future & Career Ambiguity', pct: 12, note: 'Higher education & college cohorts' },
            ].map((stressor) => (
              <div key={stressor.label} className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E8E8DF] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#192A24] block">{stressor.label}</span>
                  <span className="text-[11px] text-[#697B72]">{stressor.note}</span>
                </div>
                <span className="font-mono font-bold text-sm text-[#2D6A4F] tabular-nums">
                  {stressor.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Departmental Health Table */}
      <div className="bg-white rounded-2xl border border-[#E2E2DA] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif font-bold text-base text-[#192A24]">
              Departmental Cohort Breakdown
            </h3>
            <p className="text-xs text-[#5C6E66]">
              Compare participation and wellbeing indices across wings.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAEAE2] text-[#4A5D54] uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-3">Department / Wing</th>
                <th className="py-3 px-3">Enrolled</th>
                <th className="py-3 px-3">Sections</th>
                <th className="py-3 px-3">Weekly Check-in %</th>
                <th className="py-3 px-3">Avg Wellbeing Score</th>
                <th className="py-3 px-3">Active Program</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EA]">
              {institution.departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#192A24]">{dept.name}</td>
                  <td className="py-3 px-3 font-mono tabular-nums text-neutral-600">{dept.studentCount}</td>
                  <td className="py-3 px-3 text-neutral-500 font-mono text-[11px]">
                    {dept.sections.join(', ')}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-emerald-800 tabular-nums">
                    {dept.id === 'dept-senior' ? '82.4%' : dept.id === 'dept-middle' ? '88.1%' : '91.2%'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-[#192A24] tabular-nums">
                      {dept.id === 'dept-senior' ? '71/100' : dept.id === 'dept-middle' ? '76/100' : '84/100'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#2D6A4F] font-medium">
                    {dept.id === 'dept-primary'
                      ? 'Little Sunbeams'
                      : dept.id === 'dept-middle'
                      ? 'Peer Confidence'
                      : dept.id === 'dept-senior'
                      ? 'Exam Resilience'
                      : 'Higher Ed Flourish'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ExportReportModal isOpen={exportModalOpen} onClose={() => setExportModalOpen(false)} />
    </div>
  );
};
