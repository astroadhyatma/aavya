import React, { useState } from 'react';
import { AdminOverview } from './AdminOverview';
import { RosterManagement } from './RosterManagement';
import { ProgramAssignment } from './ProgramAssignment';
import { CampaignsWorkshops } from './CampaignsWorkshops';
import { CounsellorHub } from './CounsellorHub';
import { PrivacySafeguarding } from './PrivacySafeguarding';
import { SubscriptionBilling } from './SubscriptionBilling';
import { LicenseKeyManager } from './LicenseKeyManager';

interface InstitutionPlatformProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const InstitutionPlatform: React.FC<InstitutionPlatformProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-opacity duration-300">
      {/* Secondary Sub-Navigation for easy access */}
      <div className="mb-6 flex items-center gap-1.5 p-1 bg-[#EDEDE6] rounded-xl self-start overflow-x-auto max-w-full">
        <button
          onClick={() => setCurrentTab('overview')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            currentTab === 'overview'
              ? 'bg-white text-[#192A24] shadow-xs'
              : 'text-[#5C6E66] hover:text-[#192A24]'
          }`}
        >
          Overview & Insights
        </button>
        <button
          onClick={() => setCurrentTab('roster')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            currentTab === 'roster'
              ? 'bg-white text-[#192A24] shadow-xs'
              : 'text-[#5C6E66] hover:text-[#192A24]'
          }`}
        >
          Classes & Roster
        </button>
        <button
          onClick={() => setCurrentTab('licenses')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            currentTab === 'licenses'
              ? 'bg-white text-[#192A24] shadow-xs'
              : 'text-[#5C6E66] hover:text-[#192A24]'
          }`}
        >
          Passkeys & Quotas
        </button>
        <button
          onClick={() => setCurrentTab('programs')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            currentTab === 'programs'
              ? 'bg-white text-[#192A24] shadow-xs'
              : 'text-[#5C6E66] hover:text-[#192A24]'
          }`}
        >
          Curriculum Assignments
        </button>
        <button
          onClick={() => setCurrentTab('counsellor')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            currentTab === 'counsellor'
              ? 'bg-white text-[#192A24] shadow-xs'
              : 'text-[#5C6E66] hover:text-[#192A24]'
          }`}
        >
          Counsellor Hub
        </button>
        <button
          onClick={() => setCurrentTab('campaigns')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            currentTab === 'campaigns'
              ? 'bg-white text-[#192A24] shadow-xs'
              : 'text-[#5C6E66] hover:text-[#192A24]'
          }`}
        >
          Workshops & Drives
        </button>
        <button
          onClick={() => setCurrentTab('privacy')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            currentTab === 'privacy'
              ? 'bg-white text-[#192A24] shadow-xs'
              : 'text-[#5C6E66] hover:text-[#192A24]'
          }`}
        >
          Safeguarding Audit
        </button>
        <button
          onClick={() => setCurrentTab('billing')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            currentTab === 'billing'
              ? 'bg-white text-[#192A24] shadow-xs'
              : 'text-[#5C6E66] hover:text-[#192A24]'
          }`}
        >
          B2B Plan & Subscriptions
        </button>
      </div>

      {currentTab === 'overview' && <AdminOverview />}
      {currentTab === 'roster' && <RosterManagement />}
      {currentTab === 'licenses' && <LicenseKeyManager />}
      {currentTab === 'programs' && <ProgramAssignment />}
      {currentTab === 'counsellor' && <CounsellorHub />}
      {currentTab === 'campaigns' && <CampaignsWorkshops />}
      {currentTab === 'privacy' && <PrivacySafeguarding />}
      {currentTab === 'billing' && <SubscriptionBilling />}
    </div>
  );
};
