import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Building2, Globe2, BookOpen, Activity, Plus, CheckCircle, Database } from 'lucide-react';

export const PlatformAdminView: React.FC = () => {
  const { programs } = useApp();

  const [tenants, setTenants] = useState([
    {
      id: 'ten-heritage',
      name: 'The Heritage Academy & Collegiate Campus',
      type: 'K-12 School',
      studentsCount: 1240,
      tier: 'Comprehensive Campus Care',
      status: 'Active',
      region: 'Bengaluru, India',
    },
    {
      id: 'ten-stjudes',
      name: "St. Jude's University Campus",
      type: 'College / University',
      studentsCount: 2150,
      tier: 'Multi-Campus Enterprise',
      status: 'Active',
      region: 'Pune, India',
    },
    {
      id: 'ten-oakridge',
      name: 'Oakridge International IB School',
      type: 'Senior Secondary',
      studentsCount: 980,
      tier: 'Campus Core',
      status: 'Active',
      region: 'Hyderabad, India',
    },
    {
      id: 'ten-techcorp',
      name: 'Apex Innovations (Corporate Pilot)',
      type: 'Corporate Campus',
      studentsCount: 450,
      tier: 'Pilot Tier',
      status: 'Evaluating (Day 18)',
      region: 'Cyber City, Gurugram',
    },
  ]);

  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantType, setNewTenantType] = useState('K-12 School');
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim()) return;

    setTenants([
      ...tenants,
      {
        id: `ten-${Date.now()}`,
        name: newTenantName.trim(),
        type: newTenantType as any,
        studentsCount: 500,
        tier: 'Pilot Tier',
        status: 'Active Pilot',
        region: 'India / Global',
      },
    ]);

    setNewTenantName('');
    setIsAddTenantOpen(false);
  };

  const totalLearners = tenants.reduce((acc, t) => acc + t.studentsCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-1">
            Global Infrastructure & SaaS Control
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24]">
            AAVYA Platform Master Administration
          </h2>
          <p className="text-sm text-[#5C6E66]">
            Multi-tenant orchestration for schools, collegiate universities, and corporate wellbeing pilots.
          </p>
        </div>

        <button
          onClick={() => setIsAddTenantOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Campus Tenant</span>
        </button>
      </div>

      {/* Global Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-[#E2E2DA] bg-white shadow-2xs space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Active Learners</span>
          <div className="font-mono text-3xl font-extrabold text-[#192A24] tabular-nums">
            {totalLearners.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Across {tenants.length} provisioned institutions</span>
        </div>

        <div className="p-5 rounded-2xl border border-[#E2E2DA] bg-white shadow-2xs space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Curriculum Modules</span>
          <div className="font-mono text-3xl font-extrabold text-[#192A24] tabular-nums">
            27 Tracks
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Classes 1–12 + College + Corporate</span>
        </div>

        <div className="p-5 rounded-2xl border border-[#E2E2DA] bg-white shadow-2xs space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Pastoral Counsellors</span>
          <div className="font-mono text-3xl font-extrabold text-[#192A24] tabular-nums">
            24 Leads
          </div>
          <span className="text-[11px] text-[#55695E]">Active safeguarding credentials</span>
        </div>

        <div className="p-5 rounded-2xl border border-[#E2E2DA] bg-white shadow-2xs space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Data Isolation SLA</span>
          <div className="font-mono text-3xl font-extrabold text-[#2D6A4F] tabular-nums">
            100%
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Zero-leak cryptographic isolation</span>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-2xl border border-[#E2E2DA] shadow-xs space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#192A24]">
            Managed Institutional & Corporate Tenants
          </h3>
          <span className="text-xs text-neutral-500 font-mono">Multi-Tenant Federation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAEAE2] text-[#4A5D54] uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-2.5 px-3">Institution Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Learners</th>
                <th className="py-2.5 px-3">Subscription Tier</th>
                <th className="py-2.5 px-3">Region</th>
                <th className="py-2.5 px-3">Tenant Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EA]">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-[#FAFAF8]">
                  <td className="py-3 px-3 font-semibold text-[#192A24]">{t.name}</td>
                  <td className="py-3 px-3 text-neutral-600">{t.type}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-neutral-800 tabular-nums">
                    {t.studentsCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-medium text-[#2D6A4F]">{t.tier}</td>
                  <td className="py-3 px-3 text-neutral-500">{t.region}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Tenant Modal */}
      {isAddTenantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#D5D5CB] shadow-2xl p-6 relative space-y-4">
            <div>
              <span className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-wider block">
                Tenant Provisioning
              </span>
              <h3 className="text-xl font-serif font-bold text-[#192A24]">
                Deploy New Campus Workspace
              </h3>
            </div>

            <form onSubmit={handleAddTenant} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A5D54]">Institution / Company Name</label>
                <input
                  type="text"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  placeholder="E.g., Delhi Public School / Infosys Campus"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A5D54]">Institution Type</label>
                <select
                  value={newTenantType}
                  onChange={(e) => setNewTenantType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D5D5CB] bg-white text-[#192A24]"
                >
                  <option value="K-12 School">K-12 School</option>
                  <option value="Senior Secondary">Senior Secondary School</option>
                  <option value="College / University">College / University</option>
                  <option value="Corporate Campus">Corporate Campus</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAEAE2]">
                <button
                  type="button"
                  onClick={() => setIsAddTenantOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Provision Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
