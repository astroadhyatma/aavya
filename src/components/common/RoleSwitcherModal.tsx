import React from 'react';
import { useApp } from '../../context/AppContext';
import { AgeStage, UserRole } from '../../types';
import {
  X,
  GraduationCap,
  HeartHandshake,
  Stethoscope,
  BookOpenCheck,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const RoleSwitcherModal: React.FC = () => {
  const {
    role,
    studentStage,
    setStudentStage,
    roleModalOpen,
    setRoleModalOpen,
    loginAsStaff,
    logout,
  } = useApp();

  if (!roleModalOpen) return null;

  const rolesList: {
    key: UserRole;
    title: string;
    description: string;
    icon: React.ElementType;
    privacyScope: string;
    defaultEmail: string;
  }[] = [
    {
      key: 'student',
      title: 'Student / Individual Learner',
      description: 'Experience age-stage onboarding, private reflection journals, daily check-ins, breathing resets, and Aavi AI companion.',
      icon: GraduationCap,
      privacyScope: 'Full personal data access. Journals & private reflections are 100% inaccessible to teachers or administrators.',
      defaultEmail: 'rohan.sen@heritage.edu.in',
    },
    {
      key: 'counsellor',
      title: 'Clinical Counsellor / Psychologist',
      description: 'Review student self-referrals, manage confidential clinical consultation notes, and coordinate pastoral safety care.',
      icon: Stethoscope,
      privacyScope: 'Access to triage queue and confidential counsellor session records. Cannot browse private student journals without consent.',
      defaultEmail: 'priya.nair@heritage.edu.in',
    },
    {
      key: 'teacher',
      title: 'Class Advisor / Teacher',
      description: 'View classroom wellbeing participation, notice silent changes in pupil behavior, and initiate pastoral referral requests.',
      icon: BookOpenCheck,
      privacyScope: 'Restricted to assigned section attendance and cohort-level participation. Zero access to individual student private reflections.',
      defaultEmail: 'rajesh.sharma@heritage.edu.in',
    },
    {
      key: 'institution_admin',
      title: 'School / College Administrator',
      description: 'Oversee school departments, manage student roster, assign wellbeing curriculum programs, and inspect aggregate trends.',
      icon: Building2,
      privacyScope: 'Anonymized cohort analytics only (k-anonymity n ≥ 5). Cannot view private student entries, mood details, or 1-on-1 AI logs.',
      defaultEmail: 'principal@heritage.edu.in',
    },
    {
      key: 'parent',
      title: 'Parent / Guardian Portal',
      description: 'Manage parental consent for minors (Classes 1-8), access age-appropriate home wellbeing guides, and view school webinars.',
      icon: HeartHandshake,
      privacyScope: 'Consent verification and youth wellbeing workshops. Student private journal entries remain protected.',
      defaultEmail: 'anita.sen@yahoo.com',
    },
    {
      key: 'platform_admin',
      title: 'AAVYA Platform Super Admin',
      description: 'Manage multiple school/college tenants, master curriculum libraries, and multi-campus enterprise subscriptions.',
      icon: ShieldCheck,
      privacyScope: 'Tenant orchestration and system compliance. Zero access to end-user personal psychological records.',
      defaultEmail: 'admin@aavya.health',
    },
  ];

  const stagesList: {
    key: AgeStage;
    label: string;
    cohort: string;
    studentName: string;
    focus: string;
  }[] = [
    {
      key: 'classes_1_5',
      label: 'Classes 1–5 (Primary)',
      cohort: 'Ages 6–10',
      studentName: 'Anaya Verma (Grade 4-A)',
      focus: 'Playful mascot, gentle balloon breathing, big emotion naming, kindness habits.',
    },
    {
      key: 'classes_6_8',
      label: 'Classes 6–8 (Middle School)',
      cohort: 'Ages 11–14',
      studentName: 'Kabir Mehta (Grade 7-B)',
      focus: 'Peer relations, self-esteem, healthy screen boundaries, 4-7-8 breath.',
    },
    {
      key: 'classes_9_12',
      label: 'Classes 9–12 (Senior / High School)',
      cohort: 'Ages 15–18',
      studentName: 'Rohan Sen (Grade 11-Sci)',
      focus: 'Exam anxiety, cognitive reframing, sleep protection, study focus timers.',
    },
    {
      key: 'college',
      label: 'College & University',
      cohort: 'Higher Education',
      studentName: 'Tara Deshmukh (UG-Year 2)',
      focus: 'Independence, campus transitions, imposter syndrome, career clarity, somatic resets.',
    },
  ];

  const handleRoleSelect = (r: typeof rolesList[0]) => {
    if (r.key === 'student') {
      if (currentUser) setRoleModalOpen(false);
    } else {
      loginAsStaff(r.key, r.defaultEmail);
      setRoleModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#E2E2DA] shadow-xl p-6 relative">
        <button
          onClick={() => setRoleModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Close role switcher"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-1">
            Privacy-Separated Multi-Role Ecosystem
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24]">
            Switch Role or Student Stage
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6E66] mt-1">
            Evaluate distinct permissions, clinical barriers, and age-tailored tools across every stakeholder in the school.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="space-y-3 mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#4A5D54]">
            Select Persona
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rolesList.map((r) => {
              const Icon = r.icon;
              const isSelected = role === r.key;
              return (
                <div
                  key={r.key}
                  onClick={() => handleRoleSelect(r)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#2D6A4F] bg-[#F2F7F4] shadow-xs'
                      : 'border-[#E7E7DF] bg-[#FAFAF8] hover:border-[#CCD5CF] hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-2 rounded-xl ${
                          isSelected ? 'bg-[#2D6A4F] text-white' : 'bg-white border border-[#E0E0D8] text-[#2D6A4F]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-sm text-[#192A24]">{r.title}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-[#2D6A4F]" />}
                  </div>
                  <p className="text-xs text-[#52665C] mb-2 leading-relaxed">{r.description}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#3E5C4E] font-medium pt-2 border-t border-[#E5EAE7]">
                    <Lock className="w-3 h-3 text-[#2D6A4F] shrink-0" />
                    <span className="truncate">{r.privacyScope}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* If student role is active, display stage switchers */}
        {role === 'student' && (
          <div className="pt-4 border-t border-[#EAEAE2]">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#4A5D54]">
                Student Stage & Age Cohort
              </label>
              <span className="text-xs text-[#6A7B73]">
                Changes UI language, mascot, exercises & programs
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {stagesList.map((st) => {
                const isSelected = studentStage === st.key;
                return (
                  <button
                    key={st.key}
                    onClick={() => {
                      setStudentStage(st.key);
                      setRoleModalOpen(false);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#2D6A4F] bg-[#EAF3EE] font-medium ring-1 ring-[#2D6A4F]'
                        : 'border-[#E4E4DC] bg-white hover:border-[#CAD7CF]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#192A24]">{st.label}</span>
                    </div>
                    <span className="text-[11px] text-[#2D6A4F] font-semibold block mt-0.5">
                      {st.studentName.split(' ')[0]} ({st.cohort})
                    </span>
                    <p className="text-[11px] text-[#5A6C63] mt-1 line-clamp-2 leading-snug">
                      {st.focus}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#EAEAE2] flex items-center justify-between">
          <button
            onClick={() => {
              logout();
              setRoleModalOpen(false);
            }}
            className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer border border-rose-200"
          >
            खाते से बाहर निकलें (Sign Out to Login Portal)
          </button>
          <button
            onClick={() => setRoleModalOpen(false)}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#2D6A4F] rounded-xl hover:bg-[#23533E] transition-colors cursor-pointer"
          >
            Apply & View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
