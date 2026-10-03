import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CompanionMessage } from '../../types';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Bot,
  ShieldAlert,
  PhoneCall,
  Minimize2,
  Languages,
} from 'lucide-react';

export const AaviFloatingChat: React.FC = () => {
  const { currentStudent, studentStage, setEmergencyModalOpen, role, masterSettings } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi' | 'hinglish'>('hi');
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getGreeting = (lang: 'en' | 'hi' | 'hinglish') => {
    const name = currentStudent.name.split(' ')[0];
    if (lang === 'hi') {
      return `नमस्ते ${name}! मैं आपकी दोस्त आवी (Aavi) हूँ 🌸 आज आपका मन कैसा महसूस कर रहा है?`;
    }
    if (lang === 'hinglish') {
      return `Hi ${name}! Main aapki wellness companion Aavi hoon. Aaj kaisa feel kar rahe ho?`;
    }
    return `Hi ${name}! I'm Aavi, your free wellbeing companion. How are you holding up right now?`;
  };

  const [messages, setMessages] = useState<CompanionMessage[]>([
    {
      id: 'init-msg',
      sender: 'aavi',
      text: getGreeting('hi'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Only show on student view
  if (role !== 'student') return null;

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLanguageChange = (newLang: 'en' | 'hi' | 'hinglish') => {
    setLanguage(newLang);
    setMessages((prev) => [
      ...prev,
      {
        id: `switch-${Date.now()}`,
        sender: 'aavi',
        text: getGreeting(newLang),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSend = async (customText?: string) => {
    const text = (customText || inputMsg).trim();
    if (!text || loading) return;

    const userMsg: CompanionMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setLoading(true);

    try {
      const response = await fetch('/api/companion/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          stage: studentStage,
          studentName: currentStudent.name.split(' ')[0],
          history: messages.slice(-4),
          language,
          customSystemPrompt: masterSettings?.customSystemPrompt,
          customQAs: masterSettings?.customQAs,
          customApiKey: masterSettings?.customApiKey,
          botTone: masterSettings?.botTone,
        }),
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();

      const aaviMsg: CompanionMessage = {
        id: `aavi-${Date.now()}`,
        sender: 'aavi',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        crisisDetected: data.crisisDetected,
      };

      setMessages((prev) => [...prev, aaviMsg]);
    } catch {
      const fallbackReply =
        language === 'hi'
          ? `मैं आपके साथ हूँ, ${currentStudent.name.split(' ')[0]}। एक धीमी और गहरी सांस लें। आप जो महसूस कर रहे हैं वह महत्वपूर्ण है। अभी आप अपने लिए कौन सा छोटा सा कदम उठा सकते हैं?`
          : `I'm right here with you, ${currentStudent.name.split(' ')[0]}. Take a slow, gentle breath. What you are feeling is completely valid. What is one small, kind step you can take for yourself right now?`;
      setMessages((prev) => [
        ...prev,
        {
          id: `aavi-fallback-${Date.now()}`,
          sender: 'aavi',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPromptsByLang = {
    hi: ['परीक्षा का तनाव है 📚', '2-मिनट सांस व्यायाम 🍃', 'नींद नहीं आ रही 🌙'],
    hinglish: ['Exam tension', '2-min breath reset', 'Cant sleep'],
    en: ['Exam anxiety 📚', '2-min breath reset 🍃', 'Trouble sleeping 🌙'],
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#1E3F32] hover:bg-[#2D6A4F] text-white p-3 sm:py-3 sm:px-4 rounded-full shadow-2xl border-2 border-emerald-400/30 flex items-center gap-2 group transition-all duration-300 hover:scale-105 cursor-pointer"
          title="Chat with Aavi (Free AI Wellness Companion)"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/20 bg-white/10 flex items-center justify-center">
            <img
              src="/src/assets/images/aavya_mascot_character_1791043816901.jpg"
              alt="Aavi Mascot"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <Bot className="w-4 h-4 text-emerald-300" />
          </div>
          <span className="text-xs font-bold pr-1 hidden sm:inline-block">
            {language === 'hi' ? 'आवी से बात करें' : 'Chat with Aavi'}
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[390px] h-[540px] bg-white rounded-3xl shadow-2xl border border-[#D5D5CB] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-[#1E3F32] to-[#2D6A4F] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-white shrink-0 flex items-center justify-center">
                <img
                  src="/src/assets/images/aavya_mascot_character_1791043816901.jpg"
                  alt="Aavi"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm leading-tight flex items-center gap-1.5">
                  <span>Aavi (आवी)</span>
                  <span className="text-[9px] bg-emerald-700/60 px-1.5 py-0.2 rounded-full text-emerald-200">
                    Free AI
                  </span>
                </h4>
                <span className="text-[10px] text-emerald-200 block">
                  100% Private · Safe Emotional Space
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Language Switcher Buttons */}
              <div className="flex items-center bg-black/20 rounded-lg p-0.5 text-[10px] mr-1">
                <button
                  onClick={() => handleLanguageChange('hi')}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${
                    language === 'hi' ? 'bg-white text-[#1E3F32] font-bold' : 'text-emerald-200 hover:text-white'
                  }`}
                  title="हिन्दी"
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => handleLanguageChange('hinglish')}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${
                    language === 'hinglish' ? 'bg-white text-[#1E3F32] font-bold' : 'text-emerald-200 hover:text-white'
                  }`}
                  title="Hinglish"
                >
                  Hing
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${
                    language === 'en' ? 'bg-white text-[#1E3F32] font-bold' : 'text-emerald-200 hover:text-white'
                  }`}
                  title="English"
                >
                  EN
                </button>
              </div>

              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setIsSpeaking(false);
                  setMessages([
                    {
                      id: `reset-${Date.now()}`,
                      sender: 'aavi',
                      text: language === 'hi' ? 'चैट साफ़ हो गई। जब भी ज़रूरत हो, मैं यहीं हूँ।' : `Chat cleared. Take a deep breath—I'm here whenever you need a mindful moment.`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ]);
                }}
                className="p-1 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
                title="चैट साफ़ करें"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setIsSpeaking(false);
                  setIsOpen(false);
                }}
                className="p-1 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
                title="चैट बंद करें"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFBF9]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#2D6A4F] text-white rounded-tr-xs'
                        : msg.crisisDetected
                        ? 'bg-rose-50 border border-rose-200 text-rose-950 rounded-tl-xs'
                        : 'bg-white border border-[#E5E5DC] text-[#192A24] rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div className="flex items-center justify-between gap-2 mt-1.5 text-[10px] text-neutral-400">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleSpeak(msg.text)}
                          className="hover:text-[#2D6A4F] cursor-pointer"
                          title="सुनें (Read aloud)"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl max-w-xs border border-neutral-200 text-xs text-neutral-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] animate-bounce delay-200" />
                <span className="text-[11px] ml-1">
                  {language === 'hi' ? 'आवी सोच रही है...' : 'Aavi is thinking...'}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-[#F5F6F2] border-t border-[#EAEAE2] flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-500 shrink-0 ml-1" />
            {quickPromptsByLang[language].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-2 py-0.5 rounded-full bg-white hover:bg-emerald-50 text-[#2D6A4F] border border-neutral-200 text-[10px] font-medium whitespace-nowrap cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-[#EAEAE2]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'आवी से बात करें...'
                    : language === 'hinglish'
                    ? 'Aavi se baat karein...'
                    : 'Chat with Aavi...'
                }
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
              />
              <button
                type="submit"
                disabled={!inputMsg.trim() || loading}
                className="p-2 rounded-xl bg-[#2D6A4F] hover:bg-[#23533E] disabled:opacity-40 text-white transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1 px-1">
              <span>🔒 100% प्राइवेट व सुरक्षित</span>
              <button
                onClick={() => setEmergencyModalOpen(true)}
                className="text-rose-600 hover:underline cursor-pointer font-medium"
              >
                हेल्पलाइन: 14416
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
