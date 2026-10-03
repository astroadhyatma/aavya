import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Lock,
  Unlock,
  KeyRound,
  Bot,
  Settings,
  Sparkles,
  Users,
  School,
  Trash2,
  RefreshCw,
  Plus,
  Check,
  Copy,
  X,
  Send,
  Eye,
  EyeOff,
  AlertTriangle,
  Share2,
  FileText,
  Sliders,
  CheckCircle,
} from 'lucide-react';

export const MasterControlPanel: React.FC = () => {
  const {
    masterModalOpen,
    setMasterModalOpen,
    isMasterUnlocked,
    unlockMaster,
    lockMaster,
    masterSettings,
    updateMasterSettings,
    allStudents,
    schoolLicenses,
    resetStudentPasscode,
    resetSchoolKey,
    deleteSchoolLicense,
    deleteStudent,
    createSchoolLicense,
    addCustomQA,
    deleteCustomQA,
    appLanguage,
  } = useApp();

  const isHi = appLanguage === 'hi';

  const [activeTab, setActiveTab] = useState<'bot' | 'accounts' | 'schools' | 'share'>('bot');
  const [passInput, setPassInput] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Bot test state
  const [testQuestion, setTestQuestion] = useState('कल मेरा बोर्ड एग्जाम है और मुझे बहुत डर लग रहा है');
  const [testLanguage, setTestLanguage] = useState<'hi' | 'hinglish' | 'en'>('hi');
  const [testResult, setTestResult] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [testModelUsed, setTestModelUsed] = useState('');

  // New Custom QA form
  const [newTrigger, setNewTrigger] = useState('');
  const [newReplyEn, setNewReplyEn] = useState('');
  const [newReplyHi, setNewReplyHi] = useState('');
  const [showAddQAModal, setShowAddQAModal] = useState(false);

  // New School Form
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolKey, setNewSchoolKey] = useState('');
  const [newSchoolSeats, setNewSchoolSeats] = useState(100);

  // Student password reset modal
  const [editingStudent, setEditingStudent] = useState<{ id: string; name: string; currentCode: string; currentPin: string } | null>(null);
  const [newCodeInput, setNewCodeInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');

  // Copied toast state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockMaster(passInput);
    if (success) {
      setUnlockError('');
      setPassInput('');
    } else {
      setUnlockError(isHi ? 'मास्टर सीक्रेट की गलत है! केवल मुख्य व्यवस्थापक (Owner) ही प्रवेश कर सकते हैं।' : 'Invalid Master Secret Key! Only the Platform Owner can access backend controls.');
    }
  };

  const handleTestBot = async () => {
    if (!testQuestion.trim() || testLoading) return;
    setTestLoading(true);
    setTestResult('');
    setTestModelUsed('');

    try {
      const res = await fetch('/api/companion/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testQuestion,
          language: testLanguage,
          studentName: 'Rohan',
          stage: 'classes_9_12',
          customSystemPrompt: masterSettings.customSystemPrompt,
          customQAs: masterSettings.customQAs,
          customApiKey: masterSettings.customApiKey,
          botTone: masterSettings.botTone,
        }),
      });

      const data = await res.json();
      setTestResult(data.reply || 'No response returned');
      setTestModelUsed(data.modelUsed || 'default');
    } catch (err: any) {
      setTestResult(`Error: ${err?.message || 'Failed to connect to chat API'}`);
    } finally {
      setTestLoading(false);
    }
  };

  const handleSaveStudentCredentials = () => {
    if (!editingStudent || !newCodeInput.trim()) return;
    resetStudentPasscode(editingStudent.id, newCodeInput.trim(), newPinInput.trim() || undefined);
    setEditingStudent(null);
    setNewCodeInput('');
    setNewPinInput('');
  };

  if (!masterModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full border border-neutral-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-[#192A24] text-white px-5 sm:px-7 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-white">
                  AAVYA Backend Master Gateway
                </h3>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Master Owner Only
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {isHi
                  ? 'स्कूल वालों या छात्रों को यह पासवर्ड व कंट्रोल नहीं दिखेगा—केवल आपके लिए सुरक्षित बैकएंड।'
                  : 'Restricted backend: Hidden from schools, principals, and students. Only you have access.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setMasterModalOpen(false)}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOCKED SCREEN */}
        {!isMasterUnlocked ? (
          <div className="p-6 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4 shadow-sm">
              <KeyRound className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold font-serif text-[#192A24] mb-1">
              {isHi ? 'मास्टर ऑथराइजेशन आवश्यक है' : 'Master Authorization Required'}
            </h4>
            <p className="text-xs text-neutral-500 mb-6">
              {isHi
                ? 'स्कूल वालों को कोई बैकएंड पासवर्ड या मास्टर सेटिंग्स नहीं दिखती हैं। अपने मास्टर सीक्रेट की दर्ज करें:'
                : 'School authorities and students cannot see this panel. Please enter your secret Master Key:'}
            </p>

            <form onSubmit={handleUnlock} className="w-full space-y-4">
              <div className="relative text-left">
                <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Master Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passInput}
                    onChange={(e) => setPassInput(e.target.value)}
                    placeholder="Enter Master Secret Key"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] pr-10 font-mono"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {unlockError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-left flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{unlockError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#2D6A4F] text-white font-bold text-sm hover:bg-[#1E4D38] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>{isHi ? 'मास्टर पैनल अनलॉक करें' : 'Unlock Master Panel'}</span>
              </button>

              {/* Master Key Hint Chip for the platform owner */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setPassInput('AAVYA-MASTER-OWNER')}
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg px-2.5 py-1 font-mono transition-colors"
                >
                  Quick Autofill Key: <span className="font-bold">AAVYA-MASTER-OWNER</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* UNLOCKED MASTER DASHBOARD */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Master Navigation Bar */}
            <div className="bg-[#FAF8F5] border-b border-neutral-200 px-5 sm:px-7 py-2.5 flex items-center justify-between gap-4 overflow-x-auto shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setActiveTab('bot')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'bot'
                      ? 'bg-[#2D6A4F] text-white shadow-sm'
                      : 'text-neutral-600 hover:bg-neutral-200/60'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  <span>{isHi ? '1. चैटबॉट AI नियंत्रण' : '1. Chatbot AI Controls'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('accounts')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'accounts'
                      ? 'bg-[#2D6A4F] text-white shadow-sm'
                      : 'text-neutral-600 hover:bg-neutral-200/60'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>{isHi ? '2. आईडी व पासवर्ड नियंत्रण' : '2. IDs & Passwords'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('schools')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'schools'
                      ? 'bg-[#2D6A4F] text-white shadow-sm'
                      : 'text-neutral-600 hover:bg-neutral-200/60'
                  }`}
                >
                  <School className="w-4 h-4" />
                  <span>{isHi ? '3. स्कूल लाइसेंस' : '3. School Licenses'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('share')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'share'
                      ? 'bg-[#2D6A4F] text-white shadow-sm'
                      : 'text-neutral-600 hover:bg-neutral-200/60'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isHi ? '4. स्कूल शेयरिंग गाइड' : '4. Share with Schools'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={lockMaster}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isHi ? 'मास्टर लॉक करें' : 'Lock Gateway'}</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">

              {/* ============================================================== */}
              {/* TAB 1: CHATBOT AI & PROMPT CONTROL */}
              {/* ============================================================== */}
              {activeTab === 'bot' && (
                <div className="space-y-6">
                  {/* Top Notice */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#192A24] flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-sm">
                        {isHi ? 'चैटबॉट अब हर सवाल का अलग और सटीक जवाब देता है!' : 'Multi-Model AI Active: Questions answered specifically!'}
                      </h5>
                      <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                        {isHi
                          ? 'अब आवी (Aavi) एक ही उत्तर बार-बार नहीं दोहराएगा। बैकएंड में Google Gemini (3.1-Flash-Lite, Flash-Latest, 3.8-Flash) कैस्केड एक्टिव है, साथ ही इंटेलिजेंट क्वेश्चन एनालाइजर भी काम कर रहा है। नीचे से आप इसका प्रॉम्ट, टोन और कस्टम नियम बदल सकते हैं।'
                          : 'Aavi now responds dynamically according to the student’s exact question. A multi-model cascade with smart NLP analysis prevents static responses. Adjust prompt, tone, and custom rules below.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bot Tone & Personality Controls */}
                    <div className="space-y-4 bg-[#FAF8F5] p-5 rounded-2xl border border-neutral-200">
                      <h4 className="font-serif font-bold text-sm text-[#192A24] flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-[#2D6A4F]" />
                        <span>{isHi ? 'चैटबॉट की शैली (Tone Selector)' : 'Chatbot Response Style'}</span>
                      </h4>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'compassionate', label: '💚 Compassionate', desc: 'Empathy, listening, gentle questions' },
                          { id: 'coaching', label: '🎯 Coach & Action', desc: 'Practical tips, micro-steps, motivation' },
                          { id: 'exam_calm', label: '🧘 Exam Stress Focus', desc: 'Exam anxiety relief, breathing resets' },
                          { id: 'playful', label: '✨ Warm & Playful', desc: 'Cheerful, uplifting, emoji-friendly' },
                        ].map((tone) => (
                          <button
                            key={tone.id}
                            type="button"
                            onClick={() => updateMasterSettings({ botTone: tone.id as any })}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              masterSettings.botTone === tone.id
                                ? 'bg-white border-[#2D6A4F] shadow-sm ring-1 ring-[#2D6A4F]'
                                : 'bg-white/60 border-neutral-200 hover:bg-white'
                            }`}
                          >
                            <span className="font-bold text-xs text-[#192A24] block">{tone.label}</span>
                            <span className="text-[10px] text-neutral-500 block mt-0.5">{tone.desc}</span>
                          </button>
                        ))}
                      </div>

                      {/* Custom Prompt Override */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          {isHi ? 'कस्टम सिस्टम प्रॉम्ट (System Instructions)' : 'Custom System Prompt Override'}
                        </label>
                        <textarea
                          rows={4}
                          value={masterSettings.customSystemPrompt}
                          onChange={(e) => updateMasterSettings({ customSystemPrompt: e.target.value })}
                          placeholder="E.g. Always emphasize that exams are temporary. Never give medical diagnoses. Ask the student how their breathing feels..."
                          className="w-full p-3 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white"
                        />
                        <p className="text-[10px] text-neutral-500 mt-1">
                          {isHi
                            ? 'खाली छोड़ने पर AAVYA का डिफॉल्ट मनोवैज्ञानिक वेलबीइंग प्रॉम्ट उपयोग होगा।'
                            : 'Leave blank to use AAVYA’s default clinical wellbeing prompt.'}
                        </p>
                      </div>

                      {/* Optional Custom API Key */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Custom Gemini API Key ({isHi ? 'वैकल्पिक' : 'Optional Override'})
                        </label>
                        <input
                          type="password"
                          value={masterSettings.customApiKey || ''}
                          onChange={(e) => updateMasterSettings({ customApiKey: e.target.value })}
                          placeholder="AI Studio API Key (optional)"
                          className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white"
                        />
                        <p className="text-[10px] text-neutral-500 mt-1">
                          {isHi
                            ? 'अगर आप अपनी निजी API Key लगाना चाहते हैं तो यहाँ दर्ज करें (स्कूल को नहीं दिखेगा)।'
                            : 'If you want to plug in your own personal Gemini API key directly from UI.'}
                        </p>
                      </div>
                    </div>

                    {/* LIVE CHATBOT SIMULATOR & TESTER */}
                    <div className="space-y-4 bg-[#FAF8F5] p-5 rounded-2xl border border-neutral-200 flex flex-col">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-sm text-[#192A24] flex items-center gap-2">
                          <Bot className="w-4 h-4 text-[#2D6A4F]" />
                          <span>{isHi ? 'लाइव चैटबॉट सिम्युलेटर (Test Here)' : 'Live Chatbot Simulator'}</span>
                        </h4>
                        <div className="flex items-center gap-1 text-[11px]">
                          {(['hi', 'hinglish', 'en'] as const).map((l) => (
                            <button
                              key={l}
                              type="button"
                              onClick={() => setTestLanguage(l)}
                              className={`px-2 py-0.5 rounded-md font-bold uppercase transition-colors cursor-pointer ${
                                testLanguage === l
                                  ? 'bg-[#2D6A4F] text-white'
                                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                              }`}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-neutral-700">
                          {isHi ? 'छात्र का सवाल टाइप करें:' : 'Test Student Message:'}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={testQuestion}
                            onChange={(e) => setTestQuestion(e.target.value)}
                            placeholder="Type any question to test..."
                            className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                          />
                          <button
                            type="button"
                            onClick={handleTestBot}
                            disabled={testLoading}
                            className="px-4 py-2 bg-[#2D6A4F] text-white text-xs font-bold rounded-xl hover:bg-[#1E4D38] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {testLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            <span>{isHi ? 'टेस्ट करें' : 'Test'}</span>
                          </button>
                        </div>

                        {/* Quick Prompt chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {[
                            'मुझे रात को नींद नहीं आ रही',
                            'Physics me 12 marks aaye hain',
                            'Mujhe koi samajhta nahi',
                            'Tell me a mindful joke',
                          ].map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => setTestQuestion(chip)}
                              className="text-[10px] bg-white border border-neutral-300 hover:border-[#2D6A4F] px-2 py-1 rounded-lg text-neutral-600 hover:text-[#2D6A4F] transition-colors cursor-pointer"
                            >
                              "{chip}"
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Result Box */}
                      <div className="flex-1 min-h-[140px] p-3.5 rounded-xl bg-white border border-neutral-200 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 border-b border-neutral-100 pb-1">
                            <span>Live Response from Chatbot</span>
                            {testModelUsed && (
                              <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                                Model: {testModelUsed}
                              </span>
                            )}
                          </div>
                          {testLoading ? (
                            <div className="flex items-center gap-2 text-xs text-neutral-500 py-4">
                              <RefreshCw className="w-4 h-4 animate-spin text-[#2D6A4F]" />
                              <span>{isHi ? 'चैटबॉट सोच रहा है...' : 'Generating dynamic answer...'}</span>
                            </div>
                          ) : testResult ? (
                            <p className="text-xs text-neutral-800 leading-relaxed whitespace-pre-line">
                              {testResult}
                            </p>
                          ) : (
                            <p className="text-xs text-neutral-400 italic py-4">
                              {isHi ? 'ऊपर सवाल लिखें और "टेस्ट करें" पर क्लिक करें।' : 'Click Test above to preview live chatbot reply.'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CUSTOM TRIGGER RULES (IF STUDENT ASKS X, REPLY Y) */}
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-neutral-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#192A24] flex items-center gap-2">
                          <Settings className="w-4 h-4 text-[#2D6A4F]" />
                          <span>{isHi ? 'कस्टम ऑटो-रिप्लाई नियम (Custom Trigger Rules)' : 'Custom Q&A Auto-Triggers'}</span>
                        </h4>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {isHi
                            ? 'अगर छात्र किसी विशेष शब्द (जैसे "फीस", "काउंसलर रूम", "प्रिंसिपल") के बारे में पूछे, तो यह तयशुदा उत्तर तुरंत दिया जाएगा:'
                            : 'If a student types a specific trigger word, the bot delivers this tailored answer immediately:'}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAddQAModal(true)}
                        className="px-3 py-1.5 bg-[#2D6A4F] text-white text-xs font-bold rounded-xl hover:bg-[#1E4D38] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isHi ? 'नया नियम जोड़ें' : 'Add Trigger Rule'}</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-neutral-200 text-neutral-500 font-bold uppercase text-[10px] tracking-wider">
                            <th className="py-2 px-3">Trigger Word</th>
                            <th className="py-2 px-3">English Response</th>
                            <th className="py-2 px-3">Hindi Response</th>
                            <th className="py-2 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                          {masterSettings.customQAs.map((qa) => (
                            <tr key={qa.id} className="hover:bg-white transition-colors">
                              <td className="py-2.5 px-3 font-mono font-bold text-emerald-800 bg-emerald-50/50 rounded-lg">
                                "{qa.trigger}"
                              </td>
                              <td className="py-2.5 px-3 text-neutral-700 max-w-xs truncate">{qa.replyEn}</td>
                              <td className="py-2.5 px-3 text-neutral-700 max-w-xs truncate">{qa.replyHi}</td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => deleteCustomQA(qa.id)}
                                  className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Delete Rule"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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

              {/* ============================================================== */}
              {/* TAB 2: ACCOUNTS, PASSWORDS & ID MANAGEMENT */}
              {/* ============================================================== */}
              {activeTab === 'accounts' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-[#192A24] flex items-start gap-3">
                    <KeyRound className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-sm">
                        {isHi ? 'गोपनीय क्रेडेंशियल नियंत्रण (Private Passwords & IDs)' : 'Private Password & ID Control'}
                      </h5>
                      <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                        {isHi
                          ? 'स्कूल के शिक्षकों या प्रिंसिपलों को छात्रों के निजी पासवर्ड नहीं दिखते (POCSO व स्टूडेंट प्राइवेसी नियम के तहत)। लेकिन आप (Master Owner) यहाँ से किसी भी छात्र का पासकोड या PIN बदल सकते हैं या हटा सकते हैं।'
                          : 'As per safeguarding privacy, school teachers cannot see student passcodes. Only you have full root authority to view, reset passcodes, or remove accounts.'}
                      </p>
                    </div>
                  </div>

                  {/* Registered Students Table */}
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-neutral-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm text-[#192A24] flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#2D6A4F]" />
                        <span>Registered Students ({allStudents.length})</span>
                      </h4>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-neutral-200 text-neutral-500 font-bold uppercase text-[10px] tracking-wider">
                            <th className="py-2 px-3">Student Name</th>
                            <th className="py-2 px-3">School / Section</th>
                            <th className="py-2 px-3">Student Passcode</th>
                            <th className="py-2 px-3">Password PIN</th>
                            <th className="py-2 px-3">Wellbeing Score</th>
                            <th className="py-2 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                          {allStudents.map((stu) => (
                            <tr key={stu.id} className="hover:bg-white transition-colors">
                              <td className="py-2.5 px-3">
                                <span className="font-bold text-neutral-900 block">{stu.name}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">Roll: {stu.rollNumber} · {stu.email}</span>
                              </td>
                              <td className="py-2.5 px-3 text-neutral-700">
                                <span className="block font-medium">{stu.institutionName}</span>
                                <span className="text-[10px] text-neutral-500">Sec: {stu.classSection}</span>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                                  {stu.studentPasscode || stu.anonymousId}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-neutral-600">
                                {stu.passwordPin ? (
                                  <span className="px-2 py-0.5 rounded bg-neutral-200 text-neutral-800 font-bold">
                                    {stu.passwordPin}
                                  </span>
                                ) : (
                                  <span className="text-neutral-400 italic">None</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 font-bold text-emerald-700">
                                {stu.wellbeingScore} / 100
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => {
                                      setEditingStudent({
                                        id: stu.id,
                                        name: stu.name,
                                        currentCode: stu.studentPasscode || stu.anonymousId,
                                        currentPin: stu.passwordPin || '',
                                      });
                                      setNewCodeInput(stu.studentPasscode || stu.anonymousId);
                                      setNewPinInput(stu.passwordPin || '');
                                    }}
                                    className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                                  >
                                    Reset Password
                                  </button>
                                  <button
                                    onClick={() => deleteStudent(stu.id)}
                                    className="p-1 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Delete Student Account"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* School Staff Accounts Reference */}
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-neutral-200 space-y-3">
                    <h4 className="font-serif font-bold text-sm text-[#192A24] flex items-center gap-2">
                      <School className="w-4 h-4 text-[#2D6A4F]" />
                      <span>School Staff & Counsellor Logins (Institution Level)</span>
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {isHi
                        ? 'स्कूल के स्टाफ सदस्य इन क्रेडेंशियल्स से लॉग इन कर सकते हैं। वे केवल अपना संस्थागत डैशबोर्ड देख सकते हैं:'
                        : 'School personnel login with their official role and work emails:'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { role: 'Counsellor', name: 'Dr. Priya Nair', email: 'counsellor@heritage.edu.in', badge: 'Lead Counsellor' },
                        { role: 'Principal', name: 'Dr. Sunita Kulkarni', email: 'principal@heritage.edu.in', badge: 'Institution Head' },
                        { role: 'Teacher', name: 'Mr. Rajesh Sharma', email: 'teacher@heritage.edu.in', badge: 'Faculty Advisor' },
                      ].map((st) => (
                        <div key={st.email} className="p-3 bg-white rounded-xl border border-neutral-200 text-xs">
                          <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {st.role}
                          </span>
                          <p className="font-bold text-neutral-900 mt-2">{st.name}</p>
                          <p className="text-neutral-500 font-mono text-[11px]">{st.email}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 3: SCHOOL LICENSES & SEATS */}
              {/* ============================================================== */}
              {activeTab === 'schools' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#192A24]">
                        {isHi ? 'पंजीकृत स्कूल व सीट कोटा' : 'Registered Schools & Seat Licenses'}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {isHi
                          ? 'हर स्कूल को एक यूनीक स्कूल लाइसेंस की मिलती है। आप यहाँ से नए स्कूल जोड़ सकते हैं या सीटें बढ़ा सकते हैं।'
                          : 'Each school gets a unique School License Key. Manage seat allocations and capacity here.'}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAddSchool(true)}
                      className="px-3.5 py-2 bg-[#2D6A4F] text-white text-xs font-bold rounded-xl hover:bg-[#1E4D38] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isHi ? 'नया स्कूल जोड़ें' : 'Create School License'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {schoolLicenses.map((lic) => (
                      <div key={lic.id} className="p-5 bg-[#FAF8F5] rounded-2xl border border-neutral-200 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {lic.tierName}
                            </span>
                            <h5 className="font-bold text-sm text-[#192A24] mt-1.5">{lic.schoolName}</h5>
                            <p className="text-xs text-neutral-500">{lic.contactEmail}</p>
                          </div>
                          <button
                            onClick={() => deleteSchoolLicense(lic.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete License"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-neutral-400 font-bold uppercase block">School Access Key</span>
                            <span className="font-mono font-bold text-sm text-[#2D6A4F]">{lic.key}</span>
                          </div>
                          <button
                            onClick={() => handleCopy(lic.key, lic.id)}
                            className="px-2.5 py-1 text-xs text-neutral-600 hover:text-[#2D6A4F] bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1 font-medium cursor-pointer"
                          >
                            {copiedText === lic.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedText === lic.id ? 'Copied' : 'Copy Key'}</span>
                          </button>
                        </div>

                        {/* Seat Progress */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-neutral-500">Occupied Seats:</span>
                            <span className="font-bold text-neutral-800">{lic.usedSeats} / {lic.maxSeats}</span>
                          </div>
                          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2D6A4F] rounded-full transition-all"
                              style={{ width: `${Math.min(100, (lic.usedSeats / lic.maxSeats) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 4: HOW TO SHARE WITH SCHOOLS (BEST WAY) */}
              {/* ============================================================== */}
              {activeTab === 'share' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#192A24]">
                      {isHi ? 'स्कूलों के साथ शेयर करने का सबसे बेस्ट तरीका' : 'Best Ways to Share & Deploy AAVYA with Schools'}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {isHi
                        ? 'स्कूलों को कैसे शेयर करें और उन्हें कैसे समझाएं? नीचे दिए गए 4 सबसे पेशेवर और आसान तरीके अपनाएं:'
                        : 'Four battle-tested ways to pitch, onboard, and share AAVYA with school principals, teachers, and students.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Method 1: Direct School Portal Link */}
                    <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-3 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                        1
                      </div>
                      <h5 className="font-bold text-sm text-[#192A24]">
                        {isHi ? 'तरीका 1: स्कूल का डायरेक्ट लिंक (Direct Link)' : 'Method 1: Direct School Portal Link'}
                      </h5>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {isHi
                          ? 'स्कूल को बस अपनी लाइव ऐप का लिंक भेजें। छात्र सीधे "Register / Login" पर जाकर अपने स्कूल कोड से जुड़ सकते हैं।'
                          : 'Share your live URL directly with the school administration. Students self-register using the School Key or enter their passcodes.'}
                      </p>
                      <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs font-mono">
                        <span className="truncate text-neutral-700">{typeof window !== 'undefined' ? window.location.origin : 'https://aavya.school'}</span>
                        <button
                          onClick={() => handleCopy(window.location.origin, 'portal-url')}
                          className="px-2.5 py-1 bg-white hover:bg-neutral-100 rounded-lg border text-neutral-700 shrink-0 font-sans text-xs font-semibold cursor-pointer"
                        >
                          {copiedText === 'portal-url' ? 'Copied!' : 'Copy Link'}
                        </button>
                      </div>
                    </div>

                    {/* Method 2: WhatsApp Pitch for Principal */}
                    <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-3 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                        2
                      </div>
                      <h5 className="font-bold text-sm text-[#192A24]">
                        {isHi ? 'तरीका 2: व्हाट्सएप / ईमेल पिच संदेश' : 'Method 2: Ready WhatsApp/Email Pitch'}
                      </h5>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {isHi
                          ? 'स्कूल प्रिंसिपल या ट्रस्टी को भेजने के लिए तैयार संदेश। इसमें POCSO सुरक्षा और वेलबीइंग की पूरी जानकारी है।'
                          : 'Ready-to-send pitch template emphasizing POCSO compliance, exam stress relief, and anonymous student mental health.'}
                      </p>
                      <button
                        onClick={() => {
                          const pitch = `Respected Principal / Management,\n\nWe are proud to introduce AAVYA—a specialized, POCSO-compliant student mental wellbeing & personal growth platform.\n\nKey features for your school:\n• 24/7 Empathetic AI Companion (Aavi) for board exam stress & emotional grounding (English & Hindi).\n• 100% Student Privacy: Private passcodes with zero public exposure.\n• Institutional Aggregate Analytics for school counsellors without violating student confidentiality.\n• 24/7 Tele-MANAS (14416) certified helpline safety escalations.\n\nExperience the live platform here:\n${window.location.origin}\nSchool Key: HERITAGE-CARE-2026\n\nWarm regards,\nAAVYA Platform Team`;
                          handleCopy(pitch, 'pitch-text');
                        }}
                        className="w-full py-2 bg-[#2D6A4F] text-white rounded-xl text-xs font-bold hover:bg-[#1E4D38] transition-colors cursor-pointer"
                      >
                        {copiedText === 'pitch-text' ? 'Copied Pitch to Clipboard!' : 'Copy WhatsApp / Email Pitch Template'}
                      </button>
                    </div>

                    {/* Method 3: Printable Cards */}
                    <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-3 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                        3
                      </div>
                      <h5 className="font-bold text-sm text-[#192A24]">
                        {isHi ? 'तरीका 3: प्रिंटेबल स्टूडेंट वाउचर कार्ड' : 'Method 3: Printable Student Voucher Cards'}
                      </h5>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {isHi
                          ? 'कक्षा में छात्रों को बांटने के लिए A4 प्रिंटेबल शीट जिसमें पासकोड, स्कूल कोड और टेली-मानस हेल्पलाइन छपी होती है।'
                          : 'Print wallet-sized physical cards for classroom distribution so students can log in from home without sharing mobile numbers.'}
                      </p>
                      <button
                        onClick={() => window.print()}
                        className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Print Passcode Sheet (Ctrl + P)
                      </button>
                    </div>

                    {/* Method 4: Offline HTML Bundle */}
                    <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-3 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                        4
                      </div>
                      <h5 className="font-bold text-sm text-[#192A24]">
                        {isHi ? 'तरीका 4: 100% ऑफलाइन सिंगल-फाइल बंडल' : 'Method 4: Offline Single-File HTML App'}
                      </h5>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {isHi
                          ? 'अगर स्कूल की कंप्यूटर लैब में इंटरनेट नहीं है, तो सिंगल .html फाइल पेनड्राइव में डालकर बिना इंटरनेट के चला सकते हैं।'
                          : 'Works completely offline without any internet connection. Includes Box Breathing, 5-4-3-2-1 Grounding, and helpline directory.'}
                      </p>
                      <button
                        onClick={() => {
                          const htmlBlob = new Blob([`<!DOCTYPE html><html><head><meta charset="utf-8"><title>AAVYA Offline Wellbeing</title></head><body style="font-family:sans-serif;padding:30px;text-align:center;"><h1>AAVYA Offline Wellbeing Companion</h1><p>Emergency Tele-MANAS Helpline: 14416 (24/7 Free)</p><p>Box Breathing: Inhale 4s - Hold 4s - Exhale 4s - Hold 4s</p></body></html>`], { type: 'text/html' });
                          const url = URL.createObjectURL(htmlBlob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'AAVYA-Offline-App.html';
                          a.click();
                        }}
                        className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Download Standalone Offline HTML File
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RESET STUDENT CREDENTIALS MODAL */}
        {editingStudent && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-neutral-200 shadow-xl animate-in fade-in zoom-in-95">
              <h4 className="font-serif font-bold text-base text-[#192A24]">
                Reset Credentials for {editingStudent.name}
              </h4>
              <p className="text-xs text-neutral-500">
                Update the passcode or PIN for this student. They will use this to sign in.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Student Passcode (Code)
                  </label>
                  <input
                    type="text"
                    value={newCodeInput}
                    onChange={(e) => setNewCodeInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Password / PIN (Optional)
                  </label>
                  <input
                    type="text"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder="e.g. 1234 or leave blank"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="flex-1 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveStudentCredentials}
                  className="flex-1 py-2 rounded-xl bg-[#2D6A4F] hover:bg-[#1E4D38] text-xs font-bold text-white transition-colors shadow-sm"
                >
                  Save New Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD CUSTOM QA TRIGGER MODAL */}
        {showAddQAModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-neutral-200 shadow-xl animate-in fade-in zoom-in-95">
              <h4 className="font-serif font-bold text-base text-[#192A24]">
                {isHi ? 'नया ऑटो-ट्रिगर नियम जोड़ें' : 'Add Custom Q&A Trigger'}
              </h4>
              <p className="text-xs text-neutral-500">
                {isHi
                  ? 'जब भी कोई छात्र इस ट्रिगर शब्द को अपनी चैट में लिखेगा, बॉट यह जवाब देगा।'
                  : 'Whenever a student mentions this trigger word, Aavi will respond with these exact answers.'}
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Trigger Word / Phrase</label>
                  <input
                    type="text"
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value)}
                    placeholder="e.g. fees, principal room, sports day, depression"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">English Answer</label>
                  <textarea
                    rows={2}
                    value={newReplyEn}
                    onChange={(e) => setNewReplyEn(e.target.value)}
                    placeholder="Answer in English..."
                    className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Hindi Answer (हिंदी उत्तर)</label>
                  <textarea
                    rows={2}
                    value={newReplyHi}
                    onChange={(e) => setNewReplyHi(e.target.value)}
                    placeholder="हिंदी में उत्तर..."
                    className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddQAModal(false)}
                  className="flex-1 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newTrigger.trim() || (!newReplyEn.trim() && !newReplyHi.trim())) return;
                    addCustomQA({
                      trigger: newTrigger.trim(),
                      replyEn: newReplyEn.trim() || newReplyHi.trim(),
                      replyHi: newReplyHi.trim() || newReplyEn.trim(),
                      enabled: true,
                    });
                    setNewTrigger('');
                    setNewReplyEn('');
                    setNewReplyHi('');
                    setShowAddQAModal(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#2D6A4F] hover:bg-[#1E4D38] text-xs font-bold text-white transition-colors shadow-sm"
                >
                  Save Trigger Rule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD SCHOOL MODAL */}
        {showAddSchool && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-neutral-200 shadow-xl animate-in fade-in zoom-in-95">
              <h4 className="font-serif font-bold text-base text-[#192A24]">
                Create New School License
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">School Name</label>
                  <input
                    type="text"
                    value={newSchoolName}
                    onChange={(e) => setNewSchoolName(e.target.value)}
                    placeholder="e.g. St. Xavier's High School"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Custom School Key (Optional)</label>
                  <input
                    type="text"
                    value={newSchoolKey}
                    onChange={(e) => setNewSchoolKey(e.target.value)}
                    placeholder="e.g. XAVIER-CARE-2026"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Max Student Seats</label>
                  <input
                    type="number"
                    value={newSchoolSeats}
                    onChange={(e) => setNewSchoolSeats(Number(e.target.value))}
                    min={10}
                    max={10000}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSchool(false)}
                  className="flex-1 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newSchoolName.trim()) return;
                    createSchoolLicense({
                      schoolName: newSchoolName.trim(),
                      key: newSchoolKey.trim() || undefined,
                      maxSeats: newSchoolSeats || 100,
                    });
                    setNewSchoolName('');
                    setNewSchoolKey('');
                    setShowAddSchool(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#2D6A4F] hover:bg-[#1E4D38] text-xs font-bold text-white transition-colors shadow-sm"
                >
                  Create License
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
