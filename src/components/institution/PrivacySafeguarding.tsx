import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const PrivacySafeguarding: React.FC = () => {
  const { institution } = useApp();

  const auditEvents = [
    {
      timestamp: '2026-10-02 08:30 AM',
      actor: 'System Automation',
      event: 'K-Anonymity Aggregation Check',
      status: 'Enforced (n = 1240)',
      details: 'Aggregated Class 10-A check-ins with identity masking hash.',
    },
    {
      timestamp: '2026-10-01 11:15 AM',
      actor: 'Dr. Priya Nair (Lead Counsellor)',
      event: 'Clinical Case Access: STU-S1104',
      status: 'Authorized',
      details: 'Opened referral following teacher pastoral notification.',
    },
    {
      timestamp: '2026-09-30 04:00 PM',
      actor: 'Principal Dr. Sunita Kulkarni',
      event: 'Cohort Report Export',
      status: 'Anonymized PDF Generated',
      details: 'Zero individual pupil journals or chat transcripts exposed.',
    },
    {
      timestamp: '2026-09-28 09:20 AM',
      actor: 'System Gateway',
      event: 'Parent Consent Verification Batch',
      status: 'Verified (312 records)',
      details: 'Parental signatures validated for Classes 1–8 socio-emotional programs.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-1">
            Data Governance & Legal Compliance
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24]">
            Privacy & Safeguarding Architecture
          </h2>
          <p className="text-sm text-[#5C6E66]">
            Architectural proof of strict separation between learner private spaces and administrative reports.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            DPDP Act & FERPA Verified
          </span>
        </div>
      </div>

      {/* 3 Pillars of AAVYA Privacy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-[#E2E2DA] bg-white shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#2D6A4F] flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h4 className="font-serif font-bold text-sm text-[#192A24]">
            Zero-Knowledge Reflections
          </h4>
          <p className="text-xs text-[#52665C] leading-relaxed">
            Student journals, goal entries, and 1-on-1 AI companion interactions are client-isolated. Neither principals, teachers, nor parents can browse student raw entries.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-[#E2E2DA] bg-white shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
            <EyeOff className="w-4 h-4" />
          </div>
          <h4 className="font-serif font-bold text-sm text-[#192A24]">
            K-Anonymity (k ≥ 5) Aggregation
          </h4>
          <p className="text-xs text-[#52665C] leading-relaxed">
            Institutional dashboards only display mood trends and stress factors when at least 5 learners share a cohort, preventing deductive re-identification of vulnerable pupils.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-[#E2E2DA] bg-white shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="font-serif font-bold text-sm text-[#192A24]">
            Ethical AI Boundary
          </h4>
          <p className="text-xs text-[#52665C] leading-relaxed">
            AI is explicitly bounded as an emotional sounding board and educational wellbeing tool. Immediate triage triggers direct pupils to qualified hotlines (Tele-MANAS, Childline, Campus Suite).
          </p>
        </div>
      </div>

      {/* Privacy Separation Visual Diagram */}
      <div className="bg-[#FAFBF9] rounded-2xl border border-[#E0E0D6] p-6 space-y-4">
        <h3 className="font-serif font-bold text-base text-[#192A24]">
          Two-Sided Architectural Segregation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white border border-[#CAD9CF] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2D6A4F]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Student / Individual Safe Space</span>
            </div>
            <ul className="text-xs text-[#3E5047] space-y-1.5 list-disc pl-4">
              <li>Private encrypted journal & CBT thought reframes</li>
              <li>Daily mood self-check with personal trend charts</li>
              <li>1-on-1 private companion reflections with Aavi</li>
              <li>Interactive breathing & sensory grounding tools</li>
            </ul>
            <div className="text-[11px] font-mono text-emerald-800 bg-[#F0F7F3] p-2 rounded-lg mt-2">
              🔒 Encrypted at client layer · Zero admin inspection
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#DCDCD4] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#192A24]">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>Institutional / Administration Platform</span>
            </div>
            <ul className="text-xs text-[#4A5D54] space-y-1.5 list-disc pl-4">
              <li>Anonymized cohort percentages (Academics, Sleep deficit)</li>
              <li>Class & section curriculum assignment tracking</li>
              <li>Opt-in consent approved pastoral referrals</li>
              <li>School-wide webinars and workshop RSVP counts</li>
            </ul>
            <div className="text-[11px] font-mono text-neutral-600 bg-[#F2F2EC] p-2 rounded-lg mt-2">
              📊 Aggregate statistical reporting only (k ≥ 5)
            </div>
          </div>
        </div>
      </div>

      {/* Safeguarding Audit Trail */}
      <div className="bg-white rounded-2xl border border-[#E2E2DA] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-[#192A24]">
              Institutional Safeguarding & Compliance Audit Trail
            </h3>
            <p className="text-xs text-[#5C6E66]">
              Immutable log of data aggregation and clinical referral access events.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAEAE2] text-[#4A5D54] uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor / Authority</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Compliance Status</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EA] font-mono">
              {auditEvents.map((evt, idx) => (
                <tr key={idx} className="hover:bg-[#FAFAF8]">
                  <td className="py-3 px-3 text-neutral-500 text-[11px]">{evt.timestamp}</td>
                  <td className="py-3 px-3 font-sans font-medium text-[#192A24]">{evt.actor}</td>
                  <td className="py-3 px-3 font-sans text-neutral-700">{evt.event}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {evt.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-neutral-500 text-xs">{evt.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
