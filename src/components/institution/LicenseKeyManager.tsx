import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  KeyRound,
  ShieldCheck,
  Plus,
  Printer,
  CheckCircle,
  Copy,
  Users,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export const LicenseKeyManager: React.FC = () => {
  const { schoolLicenses, generateStudentPasscodes, institution } = useApp();

  const [activeSchoolKey, setActiveSchoolKey] = useState<string>('HERITAGE-PILOT-50');
  const [sectionForNewKeys, setSectionForNewKeys] = useState<string>('10-A');
  const [batchCount, setBatchCount] = useState<number>(10);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isPrintView, setIsPrintView] = useState<boolean>(false);

  const license = schoolLicenses.find((l) => l.key === activeSchoolKey) || schoolLicenses[0];
  const seatsRemaining = Math.max(0, license.maxSeats - license.usedSeats);
  const utilizationPct = Math.round((license.usedSeats / license.maxSeats) * 100);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateStudentPasscodes(license.key, batchCount, sectionForNewKeys);
  };

  const handlePrintSlips = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-1">
            Access Control & Quota Governance
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24]">
            School License & Student Passcodes
          </h2>
          <p className="text-sm text-[#5C6E66]">
            Strict seat allocation ensures only authorized students in your school can register and access the platform.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => setIsPrintView(!isPrintView)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#192A24] bg-white border border-[#D5D5CB] hover:bg-[#F2F2EC] rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>{isPrintView ? 'Close Print View' : 'Printable Student Slips'}</span>
          </button>
        </div>
      </div>

      {/* Quota Gauge Card */}
      <div className="bg-white rounded-2xl border border-[#E2E2DA] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAEAE2]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#2D6A4F] bg-[#EAF2ED] px-2.5 py-0.5 rounded-md">
                {license.key}
              </span>
              <span className="text-xs font-semibold text-[#192A24]">{license.schoolName}</span>
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Tier: {license.tierName} · Valid until {license.expiryDate}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-neutral-500 block">License Seat Utilization</span>
            <span className="font-mono text-xl font-extrabold text-[#192A24] tabular-nums">
              {license.usedSeats} / {license.maxSeats} Seats Claimed
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[#3E5C4E]">{utilizationPct}% Filled</span>
            <span className={seatsRemaining > 0 ? 'text-emerald-700' : 'text-rose-700'}>
              {seatsRemaining} Seats Remaining
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#EDEDE6] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                utilizationPct >= 100
                  ? 'bg-rose-600'
                  : utilizationPct > 80
                  ? 'bg-amber-500'
                  : 'bg-[#2D6A4F]'
              }`}
              style={{ width: `${Math.min(100, utilizationPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Printable Slips View */}
      {isPrintView ? (
        <div className="p-6 bg-white border border-[#D5D5CB] rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#192A24]">
                Printable Student Access Cards ({license.schoolName})
              </h3>
              <p className="text-xs text-neutral-500">
                Cut and distribute these slips to students in class. Each code activates 1 student account.
              </p>
            </div>
            <button
              onClick={handlePrintSlips}
              className="px-4 py-2 text-xs font-bold text-white bg-[#2D6A4F] rounded-xl hover:bg-[#23533E] flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slips Now</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 print:grid-cols-3">
            {license.issuedKeys.map((k) => (
              <div
                key={k.code}
                className="p-3.5 border-2 border-dashed border-neutral-300 rounded-xl bg-[#FAFAF8] space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-semibold uppercase">
                  <span>AAVYA Learner Pass</span>
                  <span>Sec {k.section}</span>
                </div>
                <div className="font-mono font-bold text-sm text-[#192A24] bg-white p-1.5 rounded border border-neutral-200 text-center tracking-wider">
                  {k.code}
                </div>
                <p className="text-[10px] text-neutral-500 text-center">
                  Go to AAVYA app → Tap Student Passkey → Enter this code.
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Standard Key Management Table */
        <div className="space-y-4">
          {/* Quick Generate Bar */}
          <form
            onSubmit={handleGenerate}
            className="p-4 rounded-2xl bg-[#F6FAF7] border border-[#CCE4D4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          >
            <div>
              <span className="font-bold text-[#192A24] block">Generate Additional Student Passkeys</span>
              <span className="text-[#3E5C4E]">Issue unique codes for a specific class section.</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sectionForNewKeys}
                onChange={(e) => setSectionForNewKeys(e.target.value)}
                className="p-2 rounded-xl border border-[#B8DBC2] bg-white text-[#192A24]"
              >
                {['4-A', '4-B', '7-A', '7-B', '10-A', '10-B', '11-Sci', '12-Sci', 'UG-Year1', 'UG-Year2'].map((sec) => (
                  <option key={sec} value={sec}>
                    Section {sec}
                  </option>
                ))}
              </select>

              <select
                value={batchCount}
                onChange={(e) => setBatchCount(Number(e.target.value))}
                className="p-2 rounded-xl border border-[#B8DBC2] bg-white text-[#192A24]"
              >
                <option value={5}>5 Keys</option>
                <option value={10}>10 Keys</option>
                <option value={25}>25 Keys</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
              >
                Generate Keys
              </button>
            </div>
          </form>

          {/* Keys Table */}
          <div className="bg-white rounded-2xl border border-[#E2E2DA] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAFAF8] border-b border-[#EAEAE2] text-[#4A5D54] uppercase tracking-wider font-semibold text-[11px]">
                    <th className="py-3 px-4">Passcode String</th>
                    <th className="py-3 px-4">Class Section</th>
                    <th className="py-3 px-4">Activation Status</th>
                    <th className="py-3 px-4">Assigned Student</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0EA] font-mono">
                  {license.issuedKeys.map((k) => (
                    <tr key={k.code} className="hover:bg-[#FAFAF8] transition-colors">
                      <td className="py-3 px-4 font-bold text-[#192A24] tracking-wide">
                        {k.code}
                      </td>
                      <td className="py-3 px-4 text-neutral-600">
                        {k.section}
                      </td>
                      <td className="py-3 px-4">
                        {k.status === 'claimed' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-sans">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Claimed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded font-sans">
                            Available / Unused
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-sans font-medium text-[#192A24]">
                        {k.studentName || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleCopy(k.code)}
                          className="px-2.5 py-1 text-[11px] font-sans font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#192A24] cursor-pointer inline-flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedCode === k.code ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
