import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, HeartHandshake, Calendar, Video, CheckCircle2, BookOpen, Clock } from 'lucide-react';

export const ParentView: React.FC = () => {
  const { allStudents, campaigns, rsvpCampaign } = useApp();

  // Pick child profile (Anaya Verma - Grade 4-A or Kabir Mehta)
  const child = allStudents[0] || allStudents[1];
  const [consentGranted, setConsentGranted] = useState(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-1">
            Parent & Guardian Pastoral Bridge
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24]">
            Family Wellbeing Sanctuary
          </h2>
          <p className="text-sm text-[#5C6E66]">
            Partnering with The Heritage Academy to nurture your child's emotional growth and mental balance.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Linked Child: {child.name} ({child.classSection})
          </span>
        </div>
      </div>

      {/* Child Wellness Snapshot Card */}
      <div className="bg-white rounded-2xl border border-[#E2E2DA] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAEAE2]">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#192A24]">
              {child.name} · Wellbeing Overview
            </h3>
            <span className="text-xs text-neutral-500">
              Grade {child.gradeNumber} · Roll No {child.rollNumber}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#2D6A4F] bg-[#F2F7F4] px-3 py-1.5 rounded-xl border border-[#D5E6DC]">
            <HeartHandshake className="w-4 h-4" />
            <span>Active Wellbeing Streak: {child.activeStreak} Days</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E8DF] space-y-1">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Enrolled Curriculum</span>
            <span className="font-bold text-xs text-[#192A24]">
              {child.stage === 'classes_1_5' ? 'Little Sunbeams (Socio-Emotional)' : 'Peer Confidence & Resilience'}
            </span>
            <span className="text-[11px] text-[#55695E] block">4-week pastoral foundation</span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E8DF] space-y-1">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Habits Practiced</span>
            <span className="font-bold text-xs text-[#192A24]">
              {child.goals.filter((g) => g.isCompletedToday).length} of {child.goals.length} Goals Today
            </span>
            <span className="text-[11px] text-[#55695E] block">Balloon breath & bedtime calm</span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E8DF] space-y-1">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Parental Consent</span>
            <span className="font-bold text-xs text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified & Active
            </span>
            <span className="text-[11px] text-[#55695E] block">Annual pastoral authorization</span>
          </div>
        </div>

        <div className="p-3 bg-[#FBFBFA] border border-[#EAEAE2] rounded-xl text-xs text-[#52665C] flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
          <span>
            <strong>Parent Safeguarding Boundary:</strong> To foster authentic emotional expression and self-trust, your child’s private reflective journal entries and private AI companion chats are kept confidential. Parents receive macro habit overviews and invitations to school webinars.
          </span>
        </div>
      </div>

      {/* Upcoming Parent Webinars & Masterclasses */}
      <div className="bg-white rounded-2xl border border-[#E2E2DA] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#192A24]">
            Upcoming Parent Workshops & Expert Panels
          </h3>
          <span className="text-xs text-neutral-500">Organized by Campus Pastoral Care</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.slice(0, 2).map((camp) => (
            <div
              key={camp.id}
              className="p-5 rounded-2xl border border-[#EAEAE2] bg-[#FAFAF8] hover:bg-white transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#2D6A4F] tracking-wide">
                  {camp.type} · Parent Session
                </span>
                <h4 className="font-serif font-bold text-sm text-[#192A24]">
                  {camp.title}
                </h4>
                <p className="text-xs text-[#52665C] leading-relaxed">
                  {camp.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#EAEAE2] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  <span>{camp.date.split('·')[0]}</span>
                </div>
                <button
                  onClick={() => rsvpCampaign(camp.id)}
                  className="px-3 py-1 text-xs font-semibold text-[#2D6A4F] bg-[#EAF3EE] hover:bg-[#D5E9DC] rounded-lg transition-colors cursor-pointer"
                >
                  Reserve Parent Seat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Home Wellbeing Toolkit */}
      <div className="bg-[#FAFBF9] rounded-2xl border border-[#E0E0D6] p-6 space-y-3">
        <h3 className="font-serif font-bold text-base text-[#192A24]">
          Clinical Guidance: Supporting Youth Stress at Home
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#3E5047]">
          <div className="p-3.5 rounded-xl bg-white border border-[#E5ECE8] space-y-1">
            <span className="font-bold text-[#192A24] block">1. The 10-Minute Quiet Window</span>
            <p>Avoid asking about homework or grades immediately upon school return. Give your child 10 minutes of unconditional rest.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-[#E5ECE8] space-y-1">
            <span className="font-bold text-[#192A24] block">2. Name It to Tame It</span>
            <p>If your child seems irritable or withdrawn, reflect their emotion gently: "It seems like a lot happened today. I’m here if you want to talk."</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-[#E5ECE8] space-y-1">
            <span className="font-bold text-[#192A24] block">3. Consistent Sleep Sanctum</span>
            <p>Charge mobile devices outside bedrooms 45 minutes prior to bedtime to protect deep restorative REM cycles.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
