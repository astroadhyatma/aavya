import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CompanionMessage } from '../../types';
import {
  Send,
  Sparkles,
  ShieldAlert,
  RotateCcw,
  Lock,
  PhoneCall,
  Heart,
  Bot,
  Volume2,
  VolumeX,
  Languages,
} from 'lucide-react';

export const AaviCompanion: React.FC = () => {
  const { currentStudent, studentStage, setEmergencyModalOpen, masterSettings } = useApp();

  const [language, setLanguage] = useState<'en' | 'hi' | 'hinglish'>('hi');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const getGreeting = (lang: 'en' | 'hi' | 'hinglish') => {
    const firstName = currentStudent.name.split(' ')[0];
    if (lang === 'hi') {
      if (studentStage === 'classes_1_5') {
        return `नमस्ते ${firstName}! मैं आपकी दोस्त आवी (Aavi) हूँ 🌟 क्या आज आप खुश हैं, या उदास, या मेरे साथ एक शांत गुब्बारे जैसी सांस लेना चाहते हैं?`;
      } else if (studentStage === 'classes_6_8') {
        return `नमस्ते ${firstName}! स्कूल, होमवर्क और दोस्तों के बीच कई बार बहुत सारी भावनाएं आती हैं। मैं आपकी बात सुनने और मन को हल्का करने के लिए यहाँ हूँ। आज मन में क्या चल रहा है?`;
      } else if (studentStage === 'classes_9_12') {
        return `नमस्ते ${firstName}। बोर्ड परीक्षा, रिवीजन और भविष्य की चिंता के बीच ओवरथिंकिंग होना स्वाभाविक है। मैं आपके लिए एक सुरक्षित और शांत साथी हूँ। अभी आपके मन को क्या शांति दे सकता है?`;
      }
      return `नमस्ते ${firstName}। कॉलेज और करियर के बीच खुद के लिए थोड़ा वक्त निकालना जरूरी है। आज आपकी मानसिक ऊर्जा और स्वास्थ्य कैसा है?`;
    }

    if (lang === 'hinglish') {
      if (studentStage === 'classes_1_5') {
        return `Hi ${firstName}! Main aapki dost Aavi hoon 🌟 Aaj kaisa feel kar rahe ho? Chalo mere saath ek cute balloon breath lein!`;
      }
      return `Hey ${firstName}! School aur exams ka pressure kabhi-kabhi bohot heavy feel hota hai. Main yahan hoon aapki baat sunne ke liye. Aaj kya chal raha hai mind me?`;
    }

    if (studentStage === 'classes_1_5') {
      return `Hi ${firstName}! I am Aavi, your friendly companion! 🌟 Are you feeling happy, sleepy, or like you need a big calm breath today?`;
    } else if (studentStage === 'classes_6_8') {
      return `Hey ${firstName}! School, friends, and homework can bring a lot of different feelings. I'm here if you want to vent, celebrate something cool, or do a quick reset. What's on your mind?`;
    } else if (studentStage === 'classes_9_12') {
      return `Welcome, ${firstName}. Between board exams, revision, and deadlines, it's easy to get stuck in overthinking. I'm here as a grounded sounding board. What would feel helpful right now?`;
    }
    return `Hello ${firstName}. University and work life often demands balancing independence, career ambiguity, and rest. How is your nervous system holding up today?`;
  };

  const [messages, setMessages] = useState<CompanionMessage[]>([
    {
      id: 'msg-init',
      sender: 'aavi',
      text: getGreeting('hi'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleLanguageChange = (newLang: 'en' | 'hi' | 'hinglish') => {
    setLanguage(newLang);
    const greeting = getGreeting(newLang);
    setMessages((prev) => [
      ...prev,
      {
        id: `lang-switch-${Date.now()}`,
        sender: 'aavi',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const quickPrompts = {
    hi: [
      'परीक्षा का बहुत तनाव हो रहा है 📚',
      'मेरे साथ 2-मिनट की गहरी शांत सांस लो 🍃',
      'मन में बहुत ज्यादा नकारात्मक विचार आ रहे हैं 🌧️',
      'नींद नहीं आ रही, दिमाग शांत कैसे करूँ? 🌙',
      'आत्मविश्वास कैसे बढ़ाऊं? 🌟',
    ],
    hinglish: [
      'Exams ka bohot zyada pressure lag raha hai',
      'Quick 2-minute breathing reset karwao',
      'Overthinking stop nahi ho rahi',
      'Neend aane me problem ho rahi hai',
      'Har baat par tension ho rahi hai',
    ],
    en: [
      'Panic spiral before my mock exam',
      'Help me reframe an anxious thought',
      'Trouble shutting down my brain to sleep',
      'Guide me through a 2-minute breath reset',
      'Feeling guilty whenever I take a rest break',
    ],
  };

  const currentPrompts = quickPrompts[language];

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

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: CompanionMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
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

      if (!response.ok) {
        throw new Error('Chat API network error');
      }

      const data = await response.json();

      const aaviMsg: CompanionMessage = {
        id: `aavi-${Date.now()}`,
        sender: 'aavi',
        text: data.reply || (language === 'hi' ? 'मैं आपकी बात ध्यान से सुन रही हूँ। अभी आपके शरीर में कैसा महसूस हो रहा है?' : "I'm listening with care. What does your body feel like right now?"),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        crisisDetected: data.crisisDetected,
      };

      setMessages((prev) => [...prev, aaviMsg]);
    } catch {
      const fallbackText =
        language === 'hi'
          ? `अपनी बात साझा करने के लिए धन्यवाद, ${currentStudent.name.split(' ')[0]}। अभी एक धीमी और गहरी सांस लें। जब विचार बहुत भारी लगें, तो याद रखें कि हर पल को एक-एक सांस करके संभाला जा सकता है। मैं आपके साथ हूँ।`
          : language === 'hinglish'
          ? `Thank you share karne ke liye, ${currentStudent.name.split(' ')[0]}। Ek deep calm breath lo. Step by step sab manageable ho jayega. Main hamesha aapke saath hoon.`
          : `Thank you for sharing that with me, ${currentStudent.name.split(' ')[0]}. Take a slow, grounding breath right now. When thoughts get loud, remember that you are capable of taking this moment one breath at a time. What would feel most supportive right now?`;

      const fallbackMsg: CompanionMessage = {
        id: `aavi-${Date.now()}`,
        sender: 'aavi',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'aavi',
        text: language === 'hi' ? 'चैट को आपकी गोपनीयता के लिए रीसेट कर दिया गया है। जब भी आप चाहें, मैं यहीं हूँ।' : `Chat cleared for privacy. I'm right here whenever you want to check in or pause.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D6A4F] block mb-0.5">
            Empathetic Wellbeing Sounding Board · भावनात्मक कल्याण साथी
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24] flex items-center gap-2">
            <span>Aavi AI Companion (आवी)</span>
            <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              प्राइवेट व सुरक्षित
            </span>
          </h2>
        </div>

        {/* Language Switcher & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Toggle */}
          <div className="inline-flex items-center p-1 bg-neutral-100 rounded-xl text-xs font-medium border border-neutral-200">
            <Languages className="w-3.5 h-3.5 text-neutral-500 ml-1 mr-1.5" />
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                language === 'hi'
                  ? 'bg-white text-[#2D6A4F] font-bold shadow-2xs'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => handleLanguageChange('hinglish')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                language === 'hinglish'
                  ? 'bg-white text-[#2D6A4F] font-bold shadow-2xs'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Hinglish
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-[#2D6A4F] font-bold shadow-2xs'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              English
            </button>
          </div>

          <button
            onClick={handleClearChat}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-neutral-500 hover:text-neutral-800 bg-white border border-[#E0E0D6] rounded-xl hover:bg-[#F5F5EE] transition-colors cursor-pointer"
            title="चैट साफ़ करें"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Mandatory Safeguarding / Clinical Boundary Banner */}
      <div className="bg-[#FAF8F5] border border-[#EBE3D5] p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#6A5A43]">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-950 block">
              सुरक्षा एवं नैतिक सीमा (Ethical Safeguarding & Clinical Boundary)
            </span>
            <span>
              आवी केवल एक भावनात्मक एवं शैक्षिक मार्गदर्शक है। यह डॉक्टरों या पेशेवर मनोवैज्ञानिकों का विकल्प नहीं है। गंभीर संकट में कृपया नीचे दिए 24/7 हेल्पलाइन पर तुरंत संपर्क करें।
            </span>
          </div>
        </div>
        <button
          onClick={() => setEmergencyModalOpen(true)}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg font-medium transition-colors cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Tele-MANAS (14416)</span>
        </button>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-[#E0E0D6] shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {!isUser ? (
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-emerald-200 bg-[#E8F3EC] flex items-center justify-center">
                    <img
                      src="/src/assets/images/aavya_mascot_character_1791043816901.jpg"
                      alt="Aavi Mascot"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <Bot className="w-4 h-4 text-[#2D6A4F]" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#192A24] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {currentStudent.name.charAt(0)}
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed relative group ${
                    isUser
                      ? 'bg-[#2D6A4F] text-white rounded-tr-xs'
                      : msg.crisisDetected
                      ? 'bg-rose-50 border border-rose-200 text-rose-950 rounded-tl-xs'
                      : 'bg-[#F6FAF7] border border-[#E4EFE8] text-[#192A24] rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5">
                    <span
                      className={`text-[10px] font-mono ${
                        isUser ? 'text-emerald-100' : 'text-neutral-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>

                    {!isUser && (
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="text-neutral-400 hover:text-[#2D6A4F] p-1 rounded transition-colors cursor-pointer"
                        title="सुनें (Read Aloud)"
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 mr-auto max-w-[80%] items-center">
              <div className="w-8 h-8 rounded-full bg-[#E8F3EC] flex items-center justify-center text-[#2D6A4F]">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3 bg-[#F6FAF7] border border-[#E4EFE8] rounded-2xl rounded-tl-xs text-xs text-[#52665C] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-ping" />
                <span>
                  {language === 'hi'
                    ? 'आवी आपकी बात समझ रही है...'
                    : language === 'hinglish'
                    ? 'Aavi soch rahi hai...'
                    : 'Aavi is reflecting gently...'}
                </span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-2 sm:px-4 bg-[#FAFBF9] border-t border-[#EAEAE2] flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-[#6B7E74] font-medium shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="hidden sm:inline">सुझाव:</span>
          </span>
          {currentPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 text-[#2D6A4F] border border-[#D5EAD9] transition-all shrink-0 cursor-pointer whitespace-nowrap text-xs font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#EAEAE2]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'आवी से कुछ भी पूछें या अपने मन की बात लिखें...'
                  : language === 'hinglish'
                  ? 'Aavi se kuch bhi share karein...'
                  : 'Message Aavi privately (thoughts, feelings, questions)...'
              }
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#23533E] disabled:opacity-40 text-white font-medium text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">भेजें</span>
            </button>
          </form>
          <div className="mt-1.5 text-[10px] text-neutral-400 flex items-center justify-between px-1">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#2D6A4F]" />
              आपकी चैट पूरी तरह सुरक्षित है और स्कूल रिपोर्ट में नहीं जाती।
            </span>
            <span className="hidden sm:inline font-mono">भाषा: {language.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
