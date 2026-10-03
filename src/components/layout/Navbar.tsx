import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Sparkles, UserCheck, PhoneCall, Share2, LogOut, KeyRound } from 'lucide-react';
import { UserRole } from '../../types';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const {
    appLanguage,
    setAppLanguage,
    role,
    studentStage,
    setEmergencyModalOpen,
    setRoleModalOpen,
    setShareModalOpen,
    currentUser,
    logout,
    institution,
  } = useApp();

  const roleLabels: Record<UserRole, string> = {
    student: 'Student',
    parent: 'Parent',
    counsellor: 'Clinical Counsellor',
    teacher: 'Faculty / Advisor',
    institution_admin: 'Institution Admin',
    platform_admin: 'Platform Admin',
  };

  const stageLabels = {
    classes_1_5: 'Primary (Grades 1-5)',
    classes_6_8: 'Middle (Grades 6-8)',
    classes_9_12: 'Senior (Grades 9-12)',
    college: 'Collegiate Division',
    corporate: 'Corporate Workplace',
  };

  const isStudentView = role === 'student';
  const isInstitutionView = role === 'counsellor' || role === 'teacher' || role === 'institution_admin';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E7E7E0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setCurrentTab(isStudentView ? 'home' : 'overview')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-[#192A24] group-hover:text-[#2D6A4F] transition-colors">
              AAVYA
            </span>
            <span className="hidden md:inline-block text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-[#EAF2EC] text-[#2D6A4F]">
              {isStudentView ? 'Student Sanctuary' : isInstitutionView ? 'Institution Suite' : 'Portal'}
            </span>
          </button>
        </div>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-[#4A5D54]">
          {isStudentView && (
            <>
              <button
                onClick={() => setCurrentTab('home')}
                className={`transition-colors hover:text-[#192A24] cursor-pointer whitespace-nowrap ${
                  currentTab === 'home' ? 'text-[#2D6A4F] underline underline-offset-8 decoration-2' : ''
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setCurrentTab('exercises')}
                className={`transition-colors hover:text-[#192A24] cursor-pointer whitespace-nowrap ${
                  currentTab === 'exercises' ? 'text-[#2D6A4F] underline underline-offset-8 decoration-2' : ''
                }`}
              >
                Breathing & Resets
              </button>
              <button
                onClick={() => setCurrentTab('journal')}
                className={`transition-colors hover:text-[#192A24] cursor-pointer whitespace-nowrap ${
                  currentTab === 'journal' ? 'text-[#2D6A4F] underline underline-offset-8 decoration-2' : ''
                }`}
              >
                Private Journal
              </button>
              <button
                onClick={() => setCurrentTab('goals')}
                className={`transition-colors hover:text-[#192A24] cursor-pointer whitespace-nowrap ${
                  currentTab === 'goals' ? 'text-[#2D6A4F] underline underline-offset-8 decoration-2' : ''
                }`}
              >
                Goals
              </button>
              <button
                onClick={() => setCurrentTab('journeys')}
                className={`transition-colors hover:text-[#192A24] cursor-pointer whitespace-nowrap ${
                  currentTab === 'journeys' ? 'text-[#2D6A4F] underline underline-offset-8 decoration-2' : ''
                }`}
              >
                Curriculum Path
              </button>
              <button
                onClick={() => setCurrentTab('companion')}
                className={`flex items-center gap-1.5 transition-colors hover:text-[#192A24] cursor-pointer whitespace-nowrap ${
                  currentTab === 'companion' ? 'text-[#2D6A4F] underline underline-offset-8 decoration-2' : ''
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                Aavi AI
              </button>
            </>
          )}

          {isInstitutionView && (
            <>
              <button
                onClick={() => setCurrentTab('overview')}
                className={`transition-colors hover:text-[#192A24] cursor-pointer whitespace-nowrap ${
                  currentTab === 'overview' ? 'text-[#2D6A4F] underline underline-offset-8 decoration-2' : ''
                }`}
              >
                Cohort Insights
              </button>
              <button
                onClick={() => setCurrentTab('roster')}
                className={`transition-colors hover:text-[#192A24] cursor-pointer whitespace-nowrap ${
                  currentTab === 'roster' ? 'text-[#2D6A4F] underline underline-offset-8 decoration-2' : ''
                }`}
              >
                Roster
              </button>
              <button
                onClick={() => setCurrentTab('licenses')}
                className={`flex items-center gap-1 transition-colors hover:text-[#192A24] cursor-pointer whitespace-nowrap ${
                  currentTab === 'licenses' ? 'text-[#2D6A4F] underline underline-offset-8 decoration-2' : ''
                }`}
              >
                <KeyRound className="w-3 h-3 text-[#2D6A4F]" />
                Passcodes & Quotas
              </button>
              <button
                onClick={() => setCurrentTab('programs')}
                className={`transition-colors hover:text-[#192A24] cursor-pointer whitespace-nowrap ${
                  currentTab === 'programs' ? 'text-[#2D6A4F] underline underline-offset-8 decoration-2' : ''
                }`}
              >
                Curriculum
              </button>
              <button
                onClick={() => setCurrentTab('counsellor')}
                className={`transition-colors hover:text-[#192A24] cursor-pointer whitespace-nowrap ${
                  currentTab === 'counsellor' ? 'text-[#2D6A4F] underline underline-offset-8 decoration-2' : ''
                }`}
              >
                Counsellor Desk
              </button>
              <button
                onClick={() => setCurrentTab('privacy')}
                className={`flex items-center gap-1 transition-colors hover:text-[#192A24] cursor-pointer whitespace-nowrap ${
                  currentTab === 'privacy' ? 'text-[#2D6A4F] underline underline-offset-8 decoration-2' : ''
                }`}
              >
                <Shield className="w-3 h-3 text-[#2D6A4F]" />
                Safeguarding
              </button>
            </>
          )}

          {role === 'parent' && (
            <>
              <button
                onClick={() => setCurrentTab('parent_home')}
                className={`transition-colors hover:text-[#192A24] cursor-pointer whitespace-nowrap ${
                  currentTab === 'parent_home' ? 'text-[#2D6A4F] underline underline-offset-8 decoration-2' : ''
                }`}
              >
                Guardian Overview
              </button>
              <button
                onClick={() => setCurrentTab('parent_workshops')}
                className={`transition-colors hover:text-[#192A24] cursor-pointer whitespace-nowrap ${
                  currentTab === 'parent_workshops' ? 'text-[#2D6A4F] underline underline-offset-8 decoration-2' : ''
                }`}
              >
                Parent Webinars
              </button>
            </>
          )}

          {role === 'platform_admin' && (
            <>
              <button
                onClick={() => setCurrentTab('platform_tenants')}
                className={`transition-colors hover:text-[#192A24] cursor-pointer whitespace-nowrap ${
                  currentTab === 'platform_tenants' ? 'text-[#2D6A4F] underline underline-offset-8 decoration-2' : ''
                }`}
              >
                Tenants
              </button>
              <button
                onClick={() => setCurrentTab('platform_curriculum')}
                className={`transition-colors hover:text-[#192A24] cursor-pointer whitespace-nowrap ${
                  currentTab === 'platform_curriculum' ? 'text-[#2D6A4F] underline underline-offset-8 decoration-2' : ''
                }`}
              >
                Curriculum
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Global Language Toggle */}
          <div className="flex items-center p-0.5 bg-neutral-100 rounded-lg border border-[#D5D5CB] text-[11px] font-semibold">
            <button
              onClick={() => setAppLanguage('en')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                appLanguage === 'en' ? 'bg-[#2D6A4F] text-white shadow-2xs font-bold' : 'text-neutral-600 hover:text-black'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setAppLanguage('hi')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                appLanguage === 'hi' ? 'bg-[#2D6A4F] text-white shadow-2xs font-bold' : 'text-neutral-600 hover:text-black'
              }`}
              title="हिन्दी"
            >
              हिन्दी
            </button>
          </div>

          {/* PWA Install Button */}
          <PWAInstallButton variant="nav" />

          {/* Share School Button */}
          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#192A24] bg-white border border-[#D5D5CB] hover:bg-[#F2F2EC] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            title="Share platform link, WhatsApp message or offline package file with your school"
          >
            <Share2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span className="hidden sm:inline">Share with School</span>
          </button>

          {/* Emergency 24/7 Hotline button */}
          <button
            onClick={() => setEmergencyModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors whitespace-nowrap cursor-pointer"
            title="24/7 Tele-MANAS (14416) & Childline (1098)"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">24/7 Helpline</span>
          </button>

          {/* User Profile / Switcher button */}
          <button
            onClick={() => setRoleModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#192A24] bg-white border border-[#D5D5CE] rounded-lg shadow-2xs hover:bg-[#F2F2EC] transition-all cursor-pointer whitespace-nowrap"
            title="Switch Persona / Stage"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <div className="text-left hidden sm:block">
              <span className="font-bold text-[11px] block leading-tight">
                {currentUser?.name ? currentUser.name.split(' ')[0] : roleLabels[role]}
              </span>
              <span className="text-[10px] text-[#697A72] block leading-tight truncate max-w-[90px]">
                {isStudentView ? stageLabels[studentStage].split(' ')[0] : roleLabels[role]}
              </span>
            </div>
          </button>

          {/* Logout button */}
          {currentUser && (
            <button
              onClick={logout}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-neutral-600 hover:text-rose-600 rounded-lg hover:bg-rose-50 border border-[#D5D5CE] transition-colors cursor-pointer"
              title="खाते से बाहर निकलें (Sign Out of AAVYA)"
            >
              <LogOut className="w-3.5 h-3.5 text-neutral-500 hover:text-rose-600" />
              <span className="hidden sm:inline font-medium">लॉगआउट</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
