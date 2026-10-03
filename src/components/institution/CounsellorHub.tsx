import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CounsellorReferral, AgeStage } from '../../types';
import {
  Stethoscope,
  ShieldAlert,
  Clock,
  CheckCircle,
  Calendar,
  Lock,
  Plus,
  AlertTriangle,
  X,
  FileText,
} from 'lucide-react';

export const CounsellorHub: React.FC = () => {
  const { referrals, role, updateReferralStatus, createReferral, allStudents } = useApp();

  const [selectedReferral, setSelectedReferral] = useState<CounsellorReferral | null>(null);
  const [newNote, setNewNote] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isNewReferralOpen, setIsNewReferralOpen] = useState(false);

  // New referral form state
  const [studentId, setStudentId] = useState(allStudents[0]?.id || '');
  const [reasonCategory, setReasonCategory] = useState<CounsellorReferral['reasonCategory']>('Academic Anxiety');
  const [priority, setPriority] = useState<CounsellorReferral['priority']>('medium');
  const [initialNote, setInitialNote] = useState('');

  const isCounsellor = role === 'counsellor';

  const handleUpdateStatus = (id: string, newStatus: CounsellorReferral['status']) => {
    updateReferralStatus(id, newStatus, newNote.trim() || undefined, scheduledTime.trim() || undefined);
    setNewNote('');
    setScheduledTime('');
    setSelectedReferral(null);
  };

  const handleCreateReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = allStudents.find((s) => s.id === studentId);
    if (!student) return;

    createReferral({
      studentId: student.id,
      studentRealName: student.name,
      classSection: student.classSection,
      ageStage: student.stage,
      priority,
      source: isCounsellor ? 'Student Self-Referral' : 'Teacher Observation',
      reasonCategory,
      note: initialNote.trim() || 'Referral initiated for pastoral care follow-up.',
    });

    setInitialNote('');
    setIsNewReferralOpen(false);
  };

  const priorityStyles = {
    urgent_safeguarding: 'bg-rose-100 border-rose-300 text-rose-900 font-bold',
    high: 'bg-orange-100 border-orange-300 text-orange-900 font-semibold',
    medium: 'bg-amber-50 border-amber-200 text-amber-800',
    low: 'bg-slate-100 border-slate-200 text-slate-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-1">
            Clinical Safeguarding & Pastoral Desk
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24] flex items-center gap-2">
            <span>Counsellor Case Hub</span>
            {isCounsellor ? (
              <span className="text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Dr. Priya Nair (Lead Counsellor)
              </span>
            ) : (
              <span className="text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-300">
                Restricted Admin View
              </span>
            )}
          </h2>
          <p className="text-sm text-[#5C6E66]">
            Confidential intake, safe escalation pathways, and appointment coordination for students in need.
          </p>
        </div>

        <button
          onClick={() => setIsNewReferralOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Initiate Pastoral Referral</span>
        </button>
      </div>

      {/* RBAC privacy indicator */}
      {!isCounsellor && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
          <Lock className="w-4 h-4 shrink-0 text-amber-700" />
          <span>
            <strong>Role-Based Access Control Notice:</strong> You are viewing this queue as <em>{role}</em>. Detailed psychological notes and counselling intake transcripts are accessible strictly by authorized clinical personnel. Switch to the <strong>Counsellor role</strong> to manage full clinical case records.
          </span>
        </div>
      )}

      {/* Referrals Queue List */}
      <div className="space-y-3">
        {referrals.map((ref) => (
          <div
            key={ref.id}
            className="p-5 rounded-2xl border border-[#E2E2DA] bg-white shadow-xs hover:border-[#CAD7CF] transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-[10px] uppercase px-2 py-0.5 rounded-md border ${
                    priorityStyles[ref.priority]
                  }`}
                >
                  {ref.priority.replace('_', ' ')}
                </span>
                <span className="font-mono text-xs font-bold text-[#192A24]">
                  {ref.studentAnonymousCode}
                </span>
                {isCounsellor && ref.studentRealName && (
                  <span className="font-medium text-xs text-[#2D6A4F]">
                    ({ref.studentRealName})
                  </span>
                )}
                <span className="text-neutral-300">·</span>
                <span className="text-xs text-neutral-600 font-medium">
                  Section {ref.classSection}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-medium ${
                    ref.status === 'Resolved'
                      ? 'bg-emerald-50 text-emerald-800'
                      : ref.status === 'In Consultation'
                      ? 'bg-teal-50 text-teal-800'
                      : ref.status === 'Scheduled'
                      ? 'bg-sky-50 text-sky-800'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {ref.status}
                </span>
                <span className="text-neutral-400 font-mono text-[11px]">{ref.createdAt}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-600">
              <div>
                <span className="text-neutral-400">Category: </span>
                <span className="font-semibold text-[#192A24]">{ref.reasonCategory}</span>
              </div>
              <div>
                <span className="text-neutral-400">Referral Origin: </span>
                <span className="font-medium text-neutral-800">{ref.source}</span>
              </div>
            </div>

            {ref.scheduledTime && (
              <div className="p-2.5 rounded-xl bg-[#F0F7F3] border border-[#CDE3D5] text-xs text-[#23533E] flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Scheduled Session: <strong>{ref.scheduledTime}</strong></span>
              </div>
            )}

            {/* Confidential Case Notes (Only visible to Counsellor) */}
            {isCounsellor ? (
              <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#EAEAE2] space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Confidential Clinical Notes ({ref.confidentialNotes.length})
                </span>
                {ref.confidentialNotes.map((n, idx) => (
                  <p key={idx} className="text-[#3A4A41] leading-relaxed italic">
                    "{n}"
                  </p>
                ))}
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-neutral-50 text-[11px] text-neutral-400 flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>Confidential notes hidden (Clinical Privilege Enforced)</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0F0EA]">
              <button
                onClick={() => setSelectedReferral(ref)}
                className="px-3 py-1.5 text-xs font-semibold text-[#2D6A4F] bg-[#EAF3EE] hover:bg-[#D8ECE0] rounded-lg transition-colors cursor-pointer"
              >
                Update Case & Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Update Status Modal */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#D5D5CB] shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setSelectedReferral(null)}
              className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-wider block">
                Case Management
              </span>
              <h3 className="text-xl font-serif font-bold text-[#192A24]">
                Update Case {selectedReferral.studentAnonymousCode}
              </h3>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5D54]">Schedule Consultation (Optional)</label>
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="Tomorrow, 2:30 PM · Counselling Suite Room 204"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A5D54]">Add Case / Session Note</label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Document intake observations, breathing exercise taught, or guardian communication..."
                rows={3}
                className="w-full p-2.5 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-[#4A5D54]">Set Workflow Status</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Pending Review', 'Scheduled', 'In Consultation', 'Resolved'] as CounsellorReferral['status'][]).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedReferral.id, st)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedReferral.status === st
                          ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
                          : 'bg-[#FAFAF8] text-[#55695E] border-[#E0E0D6] hover:bg-white'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Referral Modal */}
      {isNewReferralOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#D5D5CB] shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setIsNewReferralOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleCreateReferralSubmit} className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-wider block">
                  Pastoral Triage
                </span>
                <h3 className="text-xl font-serif font-bold text-[#192A24]">
                  Initiate Safe Referral
                </h3>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A5D54]">Target Student</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D5D5CB] bg-white text-[#192A24]"
                >
                  {allStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.classSection} · Roll {s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A5D54]">Reason Category</label>
                  <select
                    value={reasonCategory}
                    onChange={(e) => setReasonCategory(e.target.value as CounsellorReferral['reasonCategory'])}
                    className="w-full text-xs p-2 rounded-xl border border-[#D5D5CB] bg-white text-[#192A24]"
                  >
                    <option value="Academic Anxiety">Academic Anxiety</option>
                    <option value="Social Withdrawal">Social Withdrawal</option>
                    <option value="Grief & Loss">Grief & Loss</option>
                    <option value="Sleep Disturbance">Sleep Disturbance</option>
                    <option value="Family Stress">Family Stress</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A5D54]">Urgency Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as CounsellorReferral['priority'])}
                    className="w-full text-xs p-2 rounded-xl border border-[#D5D5CB] bg-white text-[#192A24]"
                  >
                    <option value="low">Low Priority (Routine check-in)</option>
                    <option value="medium">Medium Priority (Notable withdrawal)</option>
                    <option value="high">High Priority (Acute distress)</option>
                    <option value="urgent_safeguarding">Urgent Safeguarding (Immediate safety)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A5D54]">Pastoral Observation Details</label>
                <textarea
                  value={initialNote}
                  onChange={(e) => setInitialNote(e.target.value)}
                  placeholder="Detail behavioral changes, fatigue signs, or student comments..."
                  rows={3}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAEAE2]">
                <button
                  type="button"
                  onClick={() => setIsNewReferralOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Submit for Counsellor Triage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
