import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { StudentApp } from './components/student/StudentApp';
import { InstitutionPlatform } from './components/institution/InstitutionPlatform';
import { ParentView } from './components/parent/ParentView';
import { PlatformAdminView } from './components/platform/PlatformAdminView';
import { RoleSwitcherModal } from './components/common/RoleSwitcherModal';
import { EmergencyModal } from './components/common/EmergencyModal';
import { ShareSchoolModal } from './components/common/ShareSchoolModal';
import { AaviFloatingChat } from './components/common/AaviFloatingChat';
import { LoginPortal } from './components/auth/LoginPortal';
import { PhoneCall, Share2, LogOut } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentUser,
    role,
    setRoleModalOpen,
    setEmergencyModalOpen,
    setShareModalOpen,
    logout,
  } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('home');

  // Reset tab when role changes
  useEffect(() => {
    if (role === 'student') {
      setCurrentTab('home');
    } else if (role === 'parent') {
      setCurrentTab('parent_home');
    } else if (role === 'platform_admin') {
      setCurrentTab('platform_tenants');
    } else {
      setCurrentTab('overview');
    }
  }, [role]);

  // If user is not logged in, enforce the Login & Activation Screen ("sabka login maange")
  if (!currentUser) {
    return <LoginPortal />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#192A24] font-sans antialiased selection:bg-[#2D6A4F] selection:text-white">
      {/* Top Navigation */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {role === 'student' && (
          <StudentApp currentTab={currentTab} setCurrentTab={setCurrentTab} />
        )}

        {(role === 'counsellor' || role === 'teacher' || role === 'institution_admin') && (
          <InstitutionPlatform currentTab={currentTab} setCurrentTab={setCurrentTab} />
        )}

        {role === 'parent' && <ParentView />}

        {role === 'platform_admin' && <PlatformAdminView />}
      </main>

      {/* Free Floating AI Wellness Chatbot ("Aavi") for Students */}
      <AaviFloatingChat />

      {/* Persistent Quick Demo Bar for Evaluator Convenience */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-[#192A24]/95 text-white backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 text-xs max-w-xl w-auto">
        <div className="flex items-center gap-1.5 font-medium truncate max-w-[140px] sm:max-w-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-neutral-300 hidden sm:inline">Active:</span>
          <span className="font-bold text-white truncate">{currentUser.name}</span>
          <span className="text-emerald-300 text-[10px] hidden sm:inline">({currentUser.role})</span>
        </div>

        <span aria-hidden="true" className="text-neutral-500">·</span>

        <button
          onClick={() => setShareModalOpen(true)}
          className="text-amber-300 hover:text-amber-200 transition-colors cursor-pointer font-semibold flex items-center gap-1 whitespace-nowrap"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share School</span>
        </button>

        <span aria-hidden="true" className="text-neutral-500">·</span>

        <button
          onClick={() => setRoleModalOpen(true)}
          className="text-emerald-300 hover:text-white underline underline-offset-2 transition-colors cursor-pointer font-semibold whitespace-nowrap"
        >
          Switch Persona
        </button>

        <span aria-hidden="true" className="text-neutral-500">·</span>

        <button
          onClick={logout}
          className="text-neutral-300 hover:text-rose-300 transition-colors cursor-pointer font-semibold flex items-center gap-1 whitespace-nowrap"
          title="Log out and return to login portal"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>लॉगआउट</span>
        </button>

        <span aria-hidden="true" className="text-neutral-500 hidden sm:inline">·</span>

        <button
          onClick={() => setEmergencyModalOpen(true)}
          className="text-rose-300 hover:text-rose-200 transition-colors cursor-pointer items-center gap-1 whitespace-nowrap hidden sm:flex"
        >
          <PhoneCall className="w-3 h-3 text-rose-400" />
          <span>24/7 Helpline</span>
        </button>
      </div>

      {/* Quiet Institutional Footer */}
      <footer className="w-full bg-[#F4F4EE] border-t border-[#E5E5DC] py-6 px-4 sm:px-8 text-xs text-[#5C6E66]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-[#192A24]">AAVYA</span>
            <span aria-hidden="true">·</span>
            <span>B2B Digital Mental Wellbeing Platform</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#697B72]">
            <span>DPDP Act (India) Compliant</span>
            <span aria-hidden="true">·</span>
            <span>FERPA Safeguarding Aligned</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Knowledge Reflections</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setEmergencyModalOpen(true)}
              className="text-rose-700 font-semibold hover:underline cursor-pointer"
            >
              Tele-MANAS (14416) / Childline (1098)
            </button>
          </div>

          <div className="text-[11px] text-[#809188]">
            © {new Date().getFullYear()} AAVYA Health Technologies. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <RoleSwitcherModal />
      <EmergencyModal />
      <ShareSchoolModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
