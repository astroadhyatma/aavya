import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, Download, ShieldCheck } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ isOpen, onClose }) => {
  const { institution } = useApp();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-neutral-300 shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          aria-label="Close export report"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
          <div>
            <span className="font-serif text-xl font-bold text-[#192A24]">
              AAVYA Institutional Wellbeing Summary
            </span>
            <span className="text-xs text-neutral-500 block">
              Official Anonymized Audit for Board of Governors & Pastoral Committee
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#192A24] bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="space-y-6 text-xs text-[#2D3A34] leading-relaxed">
          {/* Header metadata */}
          <div className="p-4 rounded-xl bg-[#FAFAF8] border border-neutral-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Institution</span>
              <span className="font-bold text-[#192A24] text-xs">{institution.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Total Enrolled</span>
              <span className="font-mono font-bold text-xs">{institution.totalStudents} Students</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Safeguarding Lead</span>
              <span className="font-bold text-xs">{institution.safeguardingLead.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Audit Period</span>
              <span className="font-mono font-bold text-xs">Term 1 · 2026</span>
            </div>
          </div>

          {/* Privacy statement */}
          <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px]">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700 mt-0.5" />
            <span>
              <strong>Privacy Assurance Statement:</strong> This report contains zero personally identifiable clinical data, student journal text, or private AI companion records. All figures adhere to k-anonymity (n ≥ 5) under India's Digital Personal Data Protection (DPDP) Act and global student privacy frameworks.
            </span>
          </div>

          {/* Summary Findings */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#192A24]">
              Executive Pastoral Summary
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-neutral-700">
              <li>
                <strong>Overall Resilience Index:</strong> 76.8/100, reflecting robust engagement with self-regulation tools (breathing studio and daily check-ins).
              </li>
              <li>
                <strong>Senior Wing Stress Spike:</strong> Classes 10 & 12 exhibit heightened test anxiety (44% reporting academic pressure as the primary stressor). Box breathing and CBT thought defuser sessions have been proactively scheduled.
              </li>
              <li>
                <strong>Sleep Deficit Alert:</strong> 28% of senior students average fewer than 6.5 hours of sleep on weekday nights. A campus-wide "Sleep Sanctuary Week" workshop has been scheduled for parents and pupils.
              </li>
              <li>
                <strong>Safeguarding & Counsellor Intake:</strong> 3 priority referrals handled this month, all with parent/guardian consent in line with institutional pastoral protocols.
              </li>
            </ul>
          </div>

          {/* Signoff block */}
          <div className="pt-6 border-t border-neutral-200 flex justify-between items-end text-[11px] text-neutral-500 font-mono">
            <div>
              <span>Generated on: {new Date().toLocaleDateString()}</span>
              <br />
              <span>AAVYA System Security Hash: #AAV-7402-AUDIT</span>
            </div>
            <div className="text-right">
              <span className="border-t border-neutral-400 pt-1 px-4 block">
                {institution.safeguardingLead.title}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-colors cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
