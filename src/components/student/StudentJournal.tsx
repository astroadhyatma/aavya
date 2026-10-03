import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JOURNAL_PROMPTS_BY_STAGE } from '../../data/mockData';
import { Lock, Plus, Trash2, Download, Search, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';

export const StudentJournal: React.FC = () => {
  const { currentStudent, studentStage, addJournalEntry, deleteJournalEntry } = useApp();

  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [moodTag, setMoodTag] = useState<string>('Reflective');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const stagePrompts = JOURNAL_PROMPTS_BY_STAGE[studentStage] || JOURNAL_PROMPTS_BY_STAGE['classes_9_12'];

  const moodChoices = ['Reflective', 'Grounded', 'Anxious', 'Grateful', 'Fatigued', 'Optimistic', 'Frustrated'];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addJournalEntry({
      title: title.trim(),
      content: content.trim(),
      moodTag,
      promptUsed: selectedPrompt || undefined,
      tags: tags.length ? tags : ['Personal Reflection'],
    });

    setTitle('');
    setContent('');
    setMoodTag('Reflective');
    setSelectedPrompt('');
    setTags([]);
    setIsComposing(false);
  };

  const exportEntry = (entry: { title: string; content: string; createdAt: string; moodTag: string }) => {
    const text = `AAVYA PRIVATE JOURNAL ENTRY
Date: ${new Date(entry.createdAt).toLocaleDateString()}
Mood: ${entry.moodTag}
Title: ${entry.title}

${entry.content}

---------------------------------------
Stored securely with client-side isolation on AAVYA.`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-${entry.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredEntries = currentStudent.journalEntries.filter((entry) => {
    const q = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.content.toLowerCase().includes(q) ||
      entry.moodTag.toLowerCase().includes(q) ||
      entry.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Privacy Guarantee */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-1">
            Zero-Knowledge Reflection Sanctuary
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24]">
            My Private Journal
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-[#52665C] mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Strictly Private & Confidential. Teachers, counsellors, and school admins cannot view entries.</span>
          </div>
        </div>

        {!isComposing && (
          <button
            onClick={() => setIsComposing(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Reflection</span>
          </button>
        )}
      </div>

      {/* Composition Card */}
      {isComposing && (
        <form
          onSubmit={handleSaveEntry}
          className="bg-white rounded-2xl border border-[#DCDCD4] p-6 sm:p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#EAEAE2]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2D6A4F]">
              <BookOpen className="w-4 h-4" />
              <span>New Journal Entry</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#697B72] bg-[#F2F7F4] px-2.5 py-1 rounded-lg">
              <Lock className="w-3 h-3 text-[#2D6A4F]" />
              <span>Isolated from Institution Reports</span>
            </div>
          </div>

          {/* Stage Prompts Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#4A5D54] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Need inspiration? Pick an age-tailored reflection prompt:</span>
            </label>
            <select
              value={selectedPrompt}
              onChange={(e) => {
                setSelectedPrompt(e.target.value);
                if (!title) {
                  setTitle(e.target.value.slice(0, 45) + '...');
                }
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] text-[#192A24] focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
            >
              <option value="">-- Choose a guided prompt --</option>
              {stagePrompts.map((p, idx) => (
                <option key={idx} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#4A5D54]">Entry Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Today's quiet breakthrough / Finding calm in mock tests"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
              required
            />
          </div>

          {/* Mood selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#4A5D54]">Associated Emotional State</label>
            <div className="flex flex-wrap gap-1.5">
              {moodChoices.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMoodTag(m)}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                    moodTag === m
                      ? 'bg-[#2D6A4F] text-white font-medium'
                      : 'bg-[#F2F2EC] text-[#55695E] hover:bg-[#E5E5DE]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Journal Content Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#4A5D54]">
              Your Thoughts & Reflections (No filter needed, write freely)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What happened today? How did your chest, shoulders, and mind react? What do you need right now to feel rested and safe?..."
              rows={7}
              className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2D6A4F] leading-relaxed font-sans"
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#4A5D54]">Personal Tags</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag (e.g. Sleep, Mock Exams, Friendship)"
                className="text-xs px-3 py-1.5 rounded-lg border border-[#D5D5CB] bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#EFEFE8] hover:bg-[#E2E2D9] text-[#192A24]"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    onClick={() => handleRemoveTag(t)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#4A5D54] bg-[#F0F0EA] px-2 py-0.5 rounded cursor-pointer hover:bg-rose-50 hover:text-rose-700"
                    title="Click to remove"
                  >
                    #{t} ×
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EAEAE2]">
            <button
              type="button"
              onClick={() => setIsComposing(false)}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#22523D] rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Save Secure Entry
            </button>
          </div>
        </form>
      )}

      {/* Search and Entries Stream */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search previous reflections by keyword, tag, or mood..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#DCDCD4] bg-white focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
            />
          </div>
          <span className="text-xs text-[#697B72] whitespace-nowrap">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-[#DCDCD4] p-8 space-y-3">
            <BookOpen className="w-8 h-8 text-[#8FA397] mx-auto" />
            <h4 className="font-serif text-lg font-bold text-[#192A24]">
              No Journal Entries Yet
            </h4>
            <p className="text-xs text-[#5C6E66] max-w-sm mx-auto">
              Your journal is an unjudged space to empty heavy thoughts, celebrate micro-wins, and talk kindly to yourself.
            </p>
            <button
              onClick={() => setIsComposing(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#2D6A4F] rounded-xl hover:bg-[#23533E] transition-colors cursor-pointer"
            >
              Start First Entry
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl border border-[#E2E2DA] p-5 sm:p-6 shadow-2xs hover:border-[#CAD7CF] transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#192A24]">
                      {entry.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-[#697B72] mt-0.5">
                      <span>{new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-[#2D6A4F]">{entry.moodTag}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-800">
                        <Lock className="w-2.5 h-2.5" /> Private
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      onClick={() => exportEntry(entry)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
                      title="Download entry as text file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteJournalEntry(entry.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {entry.promptUsed && (
                  <div className="p-2.5 rounded-lg bg-[#F8FAF9] border border-[#E5ECE8] text-[11px] text-[#4A5D54] italic">
                    Prompt: "{entry.promptUsed}"
                  </div>
                )}

                <p className="text-xs sm:text-sm text-[#2D3A34] whitespace-pre-wrap leading-relaxed">
                  {entry.content}
                </p>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-2 text-[11px] text-[#697B72]">
                    {entry.tags.map((t) => (
                      <span key={t} className="text-[#3E5C4E] font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
