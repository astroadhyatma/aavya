import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgeStage, StudentProfile } from '../../types';
import {
  Users,
  UserPlus,
  Upload,
  Search,
  CheckCircle,
  Clock,
  ShieldCheck,
  X,
  Sparkles,
  Trash2,
  KeyRound,
} from 'lucide-react';

export const RosterManagement: React.FC = () => {
  const { allStudents, institution, addNewStudent, deleteStudent } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkSuccess, setIsBulkSuccess] = useState(false);

  // New student form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gradeNumber, setGradeNumber] = useState<string>('10');
  const [classSection, setClassSection] = useState<string>('10-A');
  const [rollNumber, setRollNumber] = useState<string>('12');
  const [stage, setStage] = useState<AgeStage>('classes_9_12');
  const [parentConsent, setParentConsent] = useState<'Approved' | 'Pending' | 'Self-Consented'>('Approved');
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [customPasscode, setCustomPasscode] = useState('');
  const [passwordPin, setPasswordPin] = useState('');

  // Extract all sections from institution departments
  const allSections = Array.from(
    new Set(institution.departments.flatMap((d) => d.sections))
  );

  const filteredStudents = allStudents.filter((stu) => {
    const matchesSearch =
      stu.name.toLowerCase().includes(search.toLowerCase()) ||
      stu.anonymousId.toLowerCase().includes(search.toLowerCase()) ||
      stu.email.toLowerCase().includes(search.toLowerCase());

    const matchesStage = selectedStage === 'all' || stu.stage === selectedStage;
    const matchesSection = selectedSection === 'all' || stu.classSection === selectedSection;

    return matchesSearch && matchesStage && matchesSection;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addNewStudent({
      name: name.trim(),
      email: email.trim(),
      gradeNumber,
      classSection,
      rollNumber,
      stage,
      parentConsent,
      parentName: parentName.trim() || undefined,
      parentEmail: parentEmail.trim() || undefined,
      customPasscode: customPasscode.trim() || undefined,
      passwordPin: passwordPin.trim(),
    });

    // Reset
    setName('');
    setEmail('');
    setCustomPasscode('');
    setPasswordPin('1234');
    setIsAddModalOpen(false);
  };

  const handleSimulateCSV = () => {
    // Add 3 sample students in one go
    addNewStudent({
      name: 'Aditya Nair',
      email: 'aditya.n@heritage.edu.in',
      gradeNumber: 10,
      classSection: '10-A',
      rollNumber: '31',
      stage: 'classes_9_12',
      parentConsent: 'Approved',
      parentName: 'Gopal Nair',
      parentEmail: 'gopal.nair@gmail.com',
    });
    addNewStudent({
      name: 'Dia Sengupta',
      email: 'dia.s@heritage.edu.in',
      gradeNumber: 4,
      classSection: '4-B',
      rollNumber: '14',
      stage: 'classes_1_5',
      parentConsent: 'Approved',
      parentName: 'Rina Sengupta',
      parentEmail: 'rina.sengupta@gmail.com',
    });
    addNewStudent({
      name: 'Arjun Mathur',
      email: 'arjun.m@heritage.edu.in',
      gradeNumber: 'UG-Year1',
      classSection: 'UG-Year1',
      rollNumber: 'CS-102',
      stage: 'college',
      parentConsent: 'Self-Consented',
    });

    setIsBulkSuccess(true);
    setTimeout(() => setIsBulkSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-1">
            Student Lifecycle & Safeguarding Register
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24]">
            Roster & Cohort Management
          </h2>
          <p className="text-sm text-[#5C6E66]">
            Manage student onboarding, stage classification, parent consent, and assigned curriculum pathways.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start">
          <button
            onClick={handleSimulateCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#192A24] bg-white border border-[#D5D5CB] hover:bg-[#F2F2EC] rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Simulate CSV Bulk Onboard</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {isBulkSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          <span>Batch onboarded 3 students successfully across Primary, High School, and College divisions!</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E2DA] shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, or anonymous ID (e.g. STU-S1104)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Stage filter */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="text-xs p-2 rounded-xl border border-[#D5D5CB] bg-white text-[#192A24] focus:outline-none cursor-pointer"
          >
            <option value="all">All Age Stages</option>
            <option value="classes_1_5">Classes 1–5 (Primary)</option>
            <option value="classes_6_8">Classes 6–8 (Middle)</option>
            <option value="classes_9_12">Classes 9–12 (Senior)</option>
            <option value="college">College / University</option>
          </select>

          {/* Section filter */}
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="text-xs p-2 rounded-xl border border-[#D5D5CB] bg-white text-[#192A24] focus:outline-none cursor-pointer"
          >
            <option value="all">All Sections</option>
            {allSections.map((sec) => (
              <option key={sec} value={sec}>
                Section {sec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-[#E2E2DA] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#EAEAE2] text-[#4A5D54] uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">Student & Roll</th>
                <th className="py-3 px-4">Anonymous ID</th>
                <th className="py-3 px-4">Stage / Grade</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">Parent Consent</th>
                <th className="py-3 px-4">Wellbeing Score</th>
                <th className="py-3 px-4">Active Streak</th>
                <th className="py-3 px-4">Assigned Path</th>
                <th className="py-3 px-4 text-right">Credentials & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EA]">
              {filteredStudents.map((stu) => {
                const stageLabel =
                  stu.stage === 'classes_1_5'
                    ? 'Classes 1–5'
                    : stu.stage === 'classes_6_8'
                    ? 'Classes 6–8'
                    : stu.stage === 'classes_9_12'
                    ? 'Classes 9–12'
                    : 'College';

                return (
                  <tr key={stu.id} className="hover:bg-[#FBFBFA] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#192A24]">{stu.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        Roll: {stu.rollNumber} · {stu.email}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-neutral-600">
                      {stu.anonymousId}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-[#192A24]">{stageLabel}</span>
                      <span className="text-[11px] text-neutral-400 block font-mono">Grade {stu.gradeNumber}</span>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-[#2D6A4F]">
                      {stu.classSection}
                    </td>

                    <td className="py-3 px-4">
                      {stu.parentConsent === 'Approved' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Consented
                        </span>
                      ) : stu.parentConsent === 'Self-Consented' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3 text-teal-600" />
                          Self (Adult)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-sm tabular-nums text-[#192A24]">
                        {stu.wellbeingScore}
                      </span>
                      <span className="text-[11px] text-neutral-400">/100</span>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-[#192A24] tabular-nums">
                      {stu.activeStreak} days
                    </td>

                    <td className="py-3 px-4 text-[#2D6A4F] font-medium">
                      {stu.stage === 'classes_1_5'
                        ? 'Little Sunbeams'
                        : stu.stage === 'classes_6_8'
                        ? 'Peer Confidence'
                        : stu.stage === 'classes_9_12'
                        ? 'Exam Resilience'
                        : 'Higher Ed Flourish'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-mono text-[10px] bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded text-neutral-700 whitespace-nowrap">
                          PIN: {stu.passwordPin}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete student "${stu.name}" (${stu.anonymousId})? This will permanently remove their account and release their seat.`)) {
                              deleteStudent(stu.id);
                            }
                          }}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Student ID"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#E0E0D6] shadow-2xl p-6 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-wider block">
                  Student Enrollment
                </span>
                <h3 className="text-xl font-serif font-bold text-[#192A24]">
                  Add Student to Roster
                </h3>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A5D54]">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Ishaan Deshpande"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A5D54]">Institutional Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ishaan.d@heritage.edu.in"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A5D54]">Age Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as AgeStage)}
                    className="w-full text-xs p-2 rounded-xl border border-[#D5D5CB] bg-white text-[#192A24]"
                  >
                    <option value="classes_1_5">Classes 1–5 (Primary)</option>
                    <option value="classes_6_8">Classes 6–8 (Middle)</option>
                    <option value="classes_9_12">Classes 9–12 (Senior)</option>
                    <option value="college">College / University</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A5D54]">Class Section</label>
                  <input
                    type="text"
                    value={classSection}
                    onChange={(e) => setClassSection(e.target.value)}
                    placeholder="10-A"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A5D54]">Grade Number</label>
                  <input
                    type="text"
                    value={gradeNumber}
                    onChange={(e) => setGradeNumber(e.target.value)}
                    placeholder="10"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A5D54]">Roll Number</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="25"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A5D54]">Parent Consent Status</label>
                <select
                  value={parentConsent}
                  onChange={(e) => setParentConsent(e.target.value as 'Approved' | 'Pending' | 'Self-Consented')}
                  className="w-full text-xs p-2 rounded-xl border border-[#D5D5CB] bg-white text-[#192A24]"
                >
                  <option value="Approved">Parent Approved (Signed Form)</option>
                  <option value="Pending">Consent Request Pending</option>
                  <option value="Self-Consented">Self-Consented (Adult 18+)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#EAEAE2]">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A5D54]">Custom Login ID (Optional)</label>
                  <input
                    type="text"
                    value={customPasscode}
                    onChange={(e) => setCustomPasscode(e.target.value)}
                    placeholder="E.g., AAVYA-HER-S105"
                    className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl border border-[#D5D5CB] bg-[#FAFAF8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A5D54]">Password / PIN</label>
                  <input
                    type="text"
                    value={passwordPin}
                    onChange={(e) => setPasswordPin(e.target.value)}
                    placeholder="Enter private PIN"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#D5D5CB] bg-[#FAFAF8]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EAEAE2]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
