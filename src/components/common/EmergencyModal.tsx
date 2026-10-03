import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EMERGENCY_CONTACTS } from '../../data/mockData';
import { X, PhoneCall, ShieldAlert, Heart, Wind, CheckCircle2 } from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const { emergencyModalOpen, setEmergencyModalOpen } = useApp();
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  if (!emergencyModalOpen) return null;

  const startQuickBreath = () => {
    setBreathingActive(true);
    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 12;
      if (count < 4) setBreathPhase('Inhale');
      else if (count < 8) setBreathPhase('Hold');
      else setBreathPhase('Exhale');
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setBreathingActive(false);
    }, 16000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-rose-200 shadow-2xl p-6 relative">
        <button
          onClick={() => {
            setBreathingActive(false);
            setEmergencyModalOpen(false);
          }}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label="Close emergency modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-rose-700 mb-2">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span className="text-xs font-semibold tracking-wider uppercase">
            Immediate Pastoral & Mental Health Support
          </span>
        </div>

        <h2 className="text-2xl font-serif font-bold text-[#192A24] mb-2">
          You Are Not Alone
        </h2>
        <p className="text-sm text-[#5C6E66] mb-5 leading-relaxed">
          If you are experiencing overwhelming panic, emotional distress, or feeling unsafe, please reach out directly to professional support. These services are confidential, free, and available 24/7.
        </p>

        {/* Quick Grounding Breath Banner */}
        <div className="mb-5 p-4 rounded-xl bg-[#F0F7F3] border border-[#CDE3D5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-[#2D6A4F] text-white">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#192A24] block">
                {breathingActive ? `Breathe with us: ${breathPhase}...` : 'Feeling your heart race?'}
              </span>
              <span className="text-[11px] text-[#4F685B]">
                {breathingActive ? 'Follow the gentle cycle for 15 seconds' : 'Take a guided 15-second vagus nerve calming breath'}
              </span>
            </div>
          </div>
          <button
            onClick={startQuickBreath}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              breathingActive
                ? 'bg-[#2D6A4F] text-white animate-pulse'
                : 'bg-white border border-[#B3D1BE] text-[#2D6A4F] hover:bg-[#E3EFE7]'
            }`}
          >
            {breathingActive ? breathPhase : 'Start 15s Breath'}
          </button>
        </div>

        {/* Directory List */}
        <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
          {EMERGENCY_CONTACTS.map((contact, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-neutral-200 bg-[#FAFAFA] hover:bg-white hover:border-neutral-300 transition-all flex items-start justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#192A24]">{contact.name}</span>
                  <span className="text-[10px] text-neutral-500 font-medium px-1.5 py-0.5 rounded bg-neutral-100">
                    {contact.type}
                  </span>
                </div>
                <p className="text-xs text-[#52665C] leading-snug">{contact.description}</p>
              </div>
              <a
                href={`tel:${contact.number.split('/')[0].trim()}`}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{contact.number.split('/')[0].trim()}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Clinical Boundary Disclaimer */}
        <div className="mt-5 pt-3 border-t border-neutral-200 flex items-start gap-2 text-[11px] text-neutral-500">
          <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>
            AAVYA is an educational emotional wellbeing tool and does not provide clinical psychiatric emergency treatment or diagnoses. In an acute crisis, always contact local emergency responders (112) or the nearest hospital.
          </span>
        </div>
      </div>
    </div>
  );
};
