import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CampaignWorkshop } from '../../types';
import { Calendar, Users, Plus, CheckCircle, Video, Award, Clock, X } from 'lucide-react';

export const CampaignsWorkshops: React.FC = () => {
  const { campaigns, createCampaign, rsvpCampaign } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CampaignWorkshop['type']>('workshop');
  const [date, setDate] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [facilitator, setFacilitator] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) return;

    createCampaign({
      title: title.trim(),
      type,
      date: date.trim(),
      targetAudience: targetAudience.trim() || 'All Campus',
      facilitator: facilitator.trim() || 'Pastoral Care Team',
      status: 'upcoming',
      description: description.trim() || 'Interactive campus wellbeing session.',
    });

    setTitle('');
    setDate('');
    setTargetAudience('');
    setFacilitator('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-1">
            Campus Pastoral Events & Engagement
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24]">
            Campaigns, Webinars & Workshops
          </h2>
          <p className="text-sm text-[#5C6E66]">
            Coordinate school-wide mental health drives, parent webinars, and teacher sensitization programs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event / Campaign</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="p-6 rounded-2xl border border-[#E2E2DA] bg-white shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-[#EAF2ED] text-[#2D6A4F]">
                  {camp.type} · {camp.status}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
                  <Users className="w-3.5 h-3.5" />
                  <span className="tabular-nums font-semibold">{camp.rsvpsCount} RSVPs</span>
                </div>
              </div>

              <h3 className="font-serif font-bold text-base text-[#192A24]">
                {camp.title}
              </h3>
              <p className="text-xs text-[#52665C] leading-relaxed">
                {camp.description}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#EAEAE2] text-xs">
              <div className="flex items-center gap-2 text-neutral-600">
                <Calendar className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span className="font-medium text-[#192A24]">{camp.date}</span>
              </div>
              <div className="text-[11px] text-neutral-500">
                <span>Audience: </span>
                <span className="font-medium text-neutral-700">{camp.targetAudience}</span>
                <span aria-hidden="true" className="mx-1">·</span>
                <span>Lead: {camp.facilitator}</span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => rsvpCampaign(camp.id)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#2D6A4F] bg-[#EAF3EE] hover:bg-[#D5E9DC] rounded-lg transition-colors cursor-pointer"
                >
                  + Add Participant RSVP
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#E0E0D6] shadow-2xl p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-wider block">
                  Pastoral Planning
                </span>
                <h3 className="text-xl font-serif font-bold text-[#192A24]">
                  Create Campaign or Workshop
                </h3>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A5D54]">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Sleep Sanctuary Week / Faculty Emotional First-Aid"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A5D54]">Event Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as CampaignWorkshop['type'])}
                    className="w-full text-xs p-2 rounded-xl border border-[#D5D5CB] bg-white text-[#192A24]"
                  >
                    <option value="workshop">Interactive Workshop</option>
                    <option value="campaign">Campus Campaign</option>
                    <option value="webinar">Online Webinar</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A5D54]">Date & Timing</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="2026-10-22 · 4:00 PM"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A5D54]">Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Classes 10 & 12 + Parents"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A5D54]">Facilitator</label>
                  <input
                    type="text"
                    value={facilitator}
                    onChange={(e) => setFacilitator(e.target.value)}
                    placeholder="Dr. Priya Nair / Guest Speaker"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A5D54]">Description & Learning Outcomes</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline key takeaways and pastoral goals..."
                  rows={3}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAEAE2]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Publish to Campus Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
