import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, ShieldCheck, Sparkles, Building, CreditCard, ChevronRight } from 'lucide-react';

export const SubscriptionBilling: React.FC = () => {
  const { institution } = useApp();

  const [activeTier, setActiveTier] = useState<string>(institution.subscriptionTier);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['addon-workshops']);

  const TIERS = [
    {
      name: 'Pilot Tier',
      audience: 'For campus trial cohorts',
      price: 'Free',
      period: '30-day evaluation',
      features: [
        'Up to 100 students onboarded',
        'Core breathing & grounding tools',
        'Daily check-ins & basic aggregate pulse',
        'Standard email support',
      ],
    },
    {
      name: 'Campus Core',
      audience: 'For mid-size schools',
      price: '₹180',
      period: 'per student / year',
      features: [
        'Full student & collegiate roster',
        'All 4 age-tier curriculum pathways',
        'Private encrypted journals & CBT tools',
        'Cohort aggregate analytics (k ≥ 5)',
        'Parent consent management portal',
      ],
    },
    {
      name: 'Comprehensive Campus Care',
      audience: 'For institutions seeking complete pastoral infrastructure',
      price: '₹320',
      period: 'per student / year',
      isCurrent: true,
      features: [
        'Everything in Campus Core',
        'Dedicated clinical psychologist referral desk',
        '4 quarterly onsite or webinar workshops',
        'Faculty Emotional First-Aid certification',
        'Priority 24/7 escalation hotline integration',
        'Quarterly Governors & Pastoral Board audit reports',
      ],
    },
    {
      name: 'Multi-Campus Enterprise',
      audience: 'For large educational trusts & collegiate universities',
      price: 'Custom',
      period: 'tailored SLA agreement',
      features: [
        'Multi-tenant federation across 5+ campuses',
        'Custom LMS & Single Sign-On (SSO) integration',
        'Dedicated Clinical Psychologist supervisor',
        'Bespoke curriculum authoring studio',
        'Corporate employee wellbeing extension module',
      ],
    },
  ];

  const ADDONS = [
    {
      id: 'addon-workshops',
      name: 'Onsite Student Resilience Workshops',
      price: '₹25,000 / session',
      desc: 'Conducted by licensed adolescent psychologists for exam batches (Classes 10 & 12).',
    },
    {
      id: 'addon-faculty',
      name: 'Faculty Emotional First-Aid Workshop',
      price: '₹18,000 / cohort',
      desc: 'Trains 40 educators to spot subtle withdrawal cues and de-escalate anxiety.',
    },
    {
      id: 'addon-counsellor-hours',
      name: 'Dedicated Tele-Counsellor Retainer (20 hrs/mo)',
      price: '₹40,000 / month',
      desc: 'Supplementary clinical intake hours for peak pre-board exam months.',
    },
  ];

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-1">
            B2B Contract & Institutional Subscriptions
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24]">
            Plan, Tiers & Implementation Services
          </h2>
          <p className="text-sm text-[#5C6E66]">
            Transparent per-student pricing for educational trusts, universities, and workplace pilots.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Active: {institution.subscriptionTier}
          </span>
        </div>
      </div>

      {/* Current Active Plan Overview */}
      <div className="bg-[#FAFBF9] border border-[#E0E0D6] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2D6A4F] uppercase tracking-wider">
            <Building className="w-4 h-4" />
            <span>Active Contract: {institution.name}</span>
          </div>
          <div className="font-serif text-lg font-bold text-[#192A24]">
            {institution.subscriptionTier} Tier · 1,240 Student Licenses
          </div>
          <p className="text-xs text-[#52665C]">
            Renewal Cadence: Annual · Next renewal scheduled for{' '}
            <strong className="text-[#192A24]">{institution.subscriptionRenewal}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="px-4 py-2 text-xs font-semibold text-[#192A24] bg-white border border-[#D5D5CB] hover:bg-[#F2F2EC] rounded-xl transition-all shadow-2xs cursor-pointer">
            Download Invoices
          </button>
          <button className="px-4 py-2 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs cursor-pointer">
            Manage Licenses
          </button>
        </div>
      </div>

      {/* Tier Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TIERS.map((tier) => {
          const isSelected = activeTier === tier.name;
          return (
            <div
              key={tier.name}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-[#2D6A4F] bg-white shadow-md ring-1 ring-[#2D6A4F]'
                  : 'border-[#E2E2DA] bg-[#FAFAF8] hover:bg-white'
              }`}
            >
              <div className="space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2D6A4F] block">
                  {tier.audience}
                </span>
                <h3 className="font-serif font-bold text-base text-[#192A24]">
                  {tier.name}
                </h3>
                <div className="pt-1 pb-2">
                  <span className="font-mono text-2xl font-extrabold text-[#192A24]">{tier.price}</span>
                  <span className="text-[11px] text-[#697B72] block">{tier.period}</span>
                </div>

                <ul className="space-y-2 pt-2 border-t border-[#EAEAE2] text-xs text-[#4A5D54]">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setActiveTier(tier.name)}
                className={`w-full py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2D6A4F] text-white'
                    : 'bg-white border border-[#D5D5CB] text-[#192A24] hover:bg-[#F2F2EC]'
                }`}
              >
                {isSelected ? 'Active Plan' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Implementation Services & Add-Ons */}
      <div className="bg-white rounded-2xl border border-[#E2E2DA] p-6 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-base text-[#192A24]">
          Pastoral Add-Ons & Implementation Services
        </h3>
        <p className="text-xs text-[#52665C]">
          Augment your digital platform with qualified psychologist-led campus workshops and faculty enablement.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {ADDONS.map((add) => {
            const isChecked = selectedAddons.includes(add.id);
            return (
              <div
                key={add.id}
                onClick={() => toggleAddon(add.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isChecked
                    ? 'border-[#2D6A4F] bg-[#F2F7F4]'
                    : 'border-[#E2E2DA] bg-[#FAFAF8] hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#192A24]">{add.name}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="accent-[#2D6A4F] cursor-pointer"
                    />
                  </div>
                  <span className="font-mono font-semibold text-xs text-[#2D6A4F] block mb-1">
                    {add.price}
                  </span>
                  <p className="text-[11px] text-[#52665C] leading-snug">{add.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
