import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Share2, Copy, Check, Download, MessageSquare, Mail, FileText, Sparkles, Printer, School } from 'lucide-react';

export const ShareSchoolModal: React.FC = () => {
  const { shareModalOpen, setShareModalOpen, institution, schoolLicenses } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);

  if (!shareModalOpen) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-tx4lzn66i62jg3526wpz2o-250779690416.asia-southeast1.run.app';
  const defaultKey = schoolLicenses[0]?.key || 'HERITAGE-PILOT-50';
  const currentSchool = schoolLicenses[0]?.schoolName || institution.name;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `नमस्ते! 🙏\n\nहमारे स्कूल/कॉलेज के लिए *AAVYA (आव्या)* डिजिटल मेंटल वेलबीइंग और पर्सनल ग्रोथ प्लेटफॉर्म शुरू किया गया है।\n\n✨ *मुख्य विशेषताएं*:\n• विद्यार्थियों के लिए आयु-अनुसार शांत ऐप (Classes 1-5, 6-8, 9-12 एवं College)\n• 100% प्राइवेट व सुरक्षित डायरी (Zero-Knowledge Reflections)\n• तनाव मुक्ति, बॉक्स ब्रीदिंग एवं सेंसरी ग्राउंडिंग टूल्स\n• मुफ्त Aavi AI साथी (हिन्दी और English दोनों में)\n• टेली-मानस (14416) व राष्ट्रीय हेल्पलाइन एक क्लिक पर\n• स्कूल एडमिन के लिए समेकित वेलबीइंग रिपोर्ट (गोपनीयता सुरक्षित)\n\n🔗 *सीधे मोबाइल/कंप्यूटर में खोलें*:\n${appUrl}\n\n🔑 *स्कूल लाइसेंस की (School Key)*: ${defaultKey}\n(अपने नाम से सीट सुरक्षित करने के लिए 'नया पंजीकरण' चुनें)`
  );

  const emailSubject = encodeURIComponent(`AAVYA Mental Wellbeing Platform Pilot for ${currentSchool}`);
  const emailBody = encodeURIComponent(
    `Respected Principal / Management,\n\nWe would like to introduce AAVYA—a specialized digital mental wellbeing platform for our students.\n\nStudents can access guided breathing, private reflection journals, and an empathetic AI companion (available in Hindi and English) without any data leakage.\n\nYou can access the live portal here:\n${appUrl}\n\nSchool Pilot Key: ${defaultKey}\n\nWarm regards,\nPastoral Care Coordinator`
  );

  // Generate and download a standalone complete offline HTML application
  const handleDownloadStandaloneFile = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AAVYA - Offline Mental Wellbeing Sanctuary</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #FAFAF7; color: #192A24; margin: 0; padding: 24px 16px; line-height: 1.6; }
    .container { max-width: 860px; margin: 0 auto; background: white; padding: 32px 24px; border-radius: 24px; box-shadow: 0 8px 30px rgba(0,0,0,0.06); border: 1px solid #E5E5DE; }
    header { text-align: center; margin-bottom: 28px; }
    .badge { display: inline-block; background: #E8F4EC; color: #2D6A4F; padding: 4px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }
    h1 { color: #192A24; font-size: 32px; margin: 4px 0 8px 0; font-family: serif; }
    .key-box { background: #F0F7F3; border: 2px dashed #2D6A4F; padding: 20px; border-radius: 16px; text-align: center; margin: 20px 0; }
    .key-text { font-family: monospace; font-size: 24px; font-weight: bold; color: #1E3F32; letter-spacing: 2px; }
    .btn { display: inline-block; background: #2D6A4F; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 12px; cursor: pointer; border: none; }
    .btn:hover { background: #23533E; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin: 24px 0; }
    .tool-card { background: #FAFAF8; border: 1px solid #EAEAE2; border-radius: 16px; padding: 20px; }
    .tool-card h3 { margin-top: 0; color: #192A24; font-size: 18px; }
    .breath-circle { width: 140px; height: 140px; border: 6px solid #2D6A4F; border-radius: 50%; margin: 20px auto; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: all 1s ease; background: #E8F4EC; }
    .breath-circle.expand { transform: scale(1.25); background: #CDE8D5; }
    .breath-circle.contract { transform: scale(0.85); background: #E8F4EC; }
    .phase-text { font-size: 16px; font-weight: bold; color: #2D6A4F; margin-top: 8px; }
    textarea, input[type="text"] { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid #D5D5CB; font-size: 13px; font-family: inherit; margin: 6px 0; }
    .entry-item { background: white; border: 1px solid #EAEAE2; border-radius: 10px; padding: 12px; margin-top: 8px; font-size: 13px; }
    .sos-banner { background: #FFF1F2; border: 1px solid #FECDD3; border-radius: 14px; padding: 16px; margin-top: 24px; color: #9F1239; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <span class="badge">AAVYA Offline Standalone School Edition</span>
      <h1>AAVYA (आव्या) - डिजिटल मेंटल वेलबीइंग</h1>
      <p style="color: #5C6E66; font-size: 14px; margin: 0;">इंटरनेट के बिना भी काम करने वाला पर्सनल वेलबीइंग टूल</p>
    </header>

    <div class="key-box">
      <div style="font-size: 13px; color: #426150;">स्कूल एक्टिवेशन कोड (School License Key):</div>
      <div class="key-text">${defaultKey}</div>
      <p style="font-size: 12px; color: #52665C; margin: 6px 0 0 0;">अधिकृत संस्थान: ${currentSchool}</p>
      <a href="${appUrl}" target="_blank" class="btn">लाइव ऑनलाइन पोर्टल खोलें</a>
    </div>

    <!-- Interactive Offline Tool 1: Box Breathing -->
    <div class="tool-card" style="text-align: center;">
      <h3>🍃 1. बॉक्स ब्रीदिंग - तनाव मुक्ति अभ्यास (Box Breathing)</h3>
      <p style="font-size: 13px; color: #52665C;">4 सेकंड अंदर सांस लें · 4 सेकंड रोकें · 4 सेकंड बाहर छोड़ें · 4 सेकंड शांत रहें</p>
      <div id="orb" class="breath-circle">
        <span id="countdown" style="font-size: 32px; font-weight: bold; color: #192A24;">4</span>
        <span id="phaseLabel" class="phase-text">सांस अंदर लें...</span>
      </div>
      <button class="btn" id="breathBtn" onclick="toggleBreath()">शुरू करें (Start Breath)</button>
    </div>

    <div class="card-grid">
      <!-- Interactive Tool 2: 5-4-3-2-1 Sensory Grounding -->
      <div class="tool-card">
        <h3>👁️ 2. 5-4-3-2-1 सेंसरी ग्राउंडिंग</h3>
        <p style="font-size: 12px; color: #52665C;">मन अशांत हो तो अपने आसपास की चीजों पर ध्यान दें:</p>
        <div style="font-size: 12px;">
          <div><strong>5 चीजें जो आप देख सकते हैं:</strong></div>
          <input type="text" id="g5" placeholder="उदा. खिड़की, मेज, पौधा, दीवार, पेन" />
          <div style="margin-top: 6px;"><strong>4 चीजें जो आप छू सकते हैं:</strong></div>
          <input type="text" id="g4" placeholder="उदा. कपड़े, फोन, कुर्सी, फर्श" />
          <div style="margin-top: 6px;"><strong>3 आवाजें जो आप सुन सकते हैं:</strong></div>
          <input type="text" id="g3" placeholder="उदा. पंखे की आवाज, चिड़िया, सांस" />
        </div>
        <button class="btn" style="padding: 6px 12px; font-size: 12px;" onclick="alert('बहुत अच्छा! आपका तंत्रिका तंत्र शांत हो रहा है 🌟')">सेव करें</button>
      </div>

      <!-- Interactive Tool 3: Private Offline Journal -->
      <div class="tool-card">
        <h3>🔒 3. निजी डायरी (Offline Private Journal)</h3>
        <p style="font-size: 12px; color: #52665C;">यह डायरी सिर्फ आपके कंप्यूटर में सुरक्षित रहती है:</p>
        <input type="text" id="jTitle" placeholder="शीर्षक (उदा. आज का विचार)" />
        <textarea id="jContent" rows="3" placeholder="मन में जो भी चल रहा है खुलकर लिखें..."></textarea>
        <button class="btn" style="padding: 6px 12px; font-size: 12px;" onclick="saveJournal()">डायरी में जोड़ें</button>
        <div id="journalList" style="margin-top: 10px;"></div>
      </div>
    </div>

    <!-- 24/7 National Emergency Helplines -->
    <div class="sos-banner">
      <h3 style="margin: 0 0 6px 0; font-size: 16px;">📞 आपातकालीन 24/7 फ्री हेल्पलाइन नंबर</h3>
      <p style="font-size: 13px; margin: 0 0 8px 0;">यदि आप या कोई साथी अत्यधिक तनाव, चिंता या संकट में हैं:</p>
      <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; font-weight: bold;">
        <span>• Tele-MANAS (मानसिक स्वास्थ्य): 14416</span>
        <span>• राष्ट्रीय चाइल्डलाइन: 1098</span>
        <span>• वंद्रेवाला फाउंडेशन: +91 9999 666 555</span>
        <span>• राष्ट्रीय आपातकाल: 112</span>
      </div>
    </div>
  </div>

  <script>
    // Breathing logic
    let timer = null;
    let sec = 4;
    let p = 0;
    const phases = [
      { text: 'सांस अंदर लें (Inhale)...', expand: true },
      { text: 'रोक कर रखें (Hold)...', expand: true },
      { text: 'धीरे से छोड़ें (Exhale)...', expand: false },
      { text: 'शांत विश्राम (Rest)...', expand: false }
    ];

    function toggleBreath() {
      const btn = document.getElementById('breathBtn');
      const orb = document.getElementById('orb');
      const count = document.getElementById('countdown');
      const label = document.getElementById('phaseLabel');

      if (timer) {
        clearInterval(timer);
        timer = null;
        btn.innerText = 'शुरू करें (Start Breath)';
        label.innerText = 'सांस अंदर लें...';
        count.innerText = '4';
        orb.className = 'breath-circle';
      } else {
        btn.innerText = 'रोकें (Pause)';
        sec = 4;
        p = 0;
        orb.className = 'breath-circle expand';
        label.innerText = phases[0].text;
        count.innerText = sec;

        timer = setInterval(() => {
          sec--;
          if (sec <= 0) {
            p = (p + 1) % 4;
            sec = 4;
            label.innerText = phases[p].text;
            orb.className = phases[p].expand ? 'breath-circle expand' : 'breath-circle contract';
          }
          count.innerText = sec;
        }, 1000);
      }
    }

    // Journal logic
    function loadJournal() {
      try {
        const raw = localStorage.getItem('aavya_offline_journal');
        const list = raw ? JSON.parse(raw) : [];
        const container = document.getElementById('journalList');
        if (list.length === 0) {
          container.innerHTML = '<div style="font-size: 11px; color: #888;">कोई एंट्री नहीं है।</div>';
          return;
        }
        container.innerHTML = list.map((item, idx) =>
          '<div class="entry-item"><strong>' + item.title + '</strong> <span style="font-size: 10px; color: #777;">(' + item.date + ')</span><br/>' + item.content + '</div>'
        ).join('');
      } catch (e) {}
    }

    function saveJournal() {
      const t = document.getElementById('jTitle').value.trim();
      const c = document.getElementById('jContent').value.trim();
      if (!t || !c) { alert('कृपया शीर्षक और सामग्री दोनों लिखें।'); return; }
      try {
        const raw = localStorage.getItem('aavya_offline_journal');
        const list = raw ? JSON.parse(raw) : [];
        list.unshift({ title: t, content: c, date: new Date().toLocaleDateString() });
        localStorage.setItem('aavya_offline_journal', JSON.stringify(list));
        document.getElementById('jTitle').value = '';
        document.getElementById('jContent').value = '';
        loadJournal();
        alert('डायरी सफलतापूर्वक सुरक्षित कर ली गई!');
      } catch (e) {}
    }

    loadJournal();
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AAVYA-School-Offline-Sanctuary.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download Printable Voucher Cards for students
  const handlePrintCards = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('कृपया पॉपअप विंडो की अनुमति दें (Please allow popups to print).');
      return;
    }

    const cardsHtml = `<!DOCTYPE html>
<html>
<head>
  <title>AAVYA - Student Wellbeing Access Cards</title>
  <style>
    body { font-family: sans-serif; margin: 20px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .card { border: 2px dashed #2D6A4F; border-radius: 12px; padding: 16px; background: #FAFBF9; page-break-inside: avoid; }
    h2 { margin: 0 0 4px 0; font-size: 18px; color: #192A24; font-family: serif; }
    .school { font-size: 12px; color: #2D6A4F; font-weight: bold; }
    .code-box { background: white; border: 1px solid #D5D5CB; border-radius: 8px; padding: 8px; font-family: monospace; font-size: 14px; font-weight: bold; margin: 8px 0; text-align: center; }
    .helpline { font-size: 10px; color: #9F1239; margin-top: 8px; border-top: 1px solid #E5E5DE; padding-top: 4px; }
  </style>
</head>
<body>
  <div style="text-align: center; margin-bottom: 20px;">
    <h1>AAVYA · Student Wellbeing Passcode Cards</h1>
    <p>Distribute these cards to students for private, secure onboarding.</p>
  </div>
  <div class="grid">
    ${[1, 2, 3, 4, 5, 6, 7, 8].map((i) => `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2>AAVYA (आव्या)</h2>
          <span style="font-size: 10px; background: #E8F4EC; color: #2D6A4F; padding: 2px 8px; border-radius: 6px; font-weight: bold;">STUDENT PASS</span>
        </div>
        <div class="school">${currentSchool}</div>
        <div style="font-size: 11px; margin-top: 6px;">School License Key:</div>
        <div class="code-box">${defaultKey}</div>
        <div style="font-size: 11px;">URL: <strong>${appUrl}</strong></div>
        <div class="helpline">24/7 Helpline: Tele-MANAS (14416) · Childline (1098) · 100% Private</div>
      </div>
    `).join('')}
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

    printWindow.document.write(cardsHtml);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[#E0E0D6] shadow-2xl p-6 sm:p-8 relative space-y-6">
        <button
          onClick={() => setShareModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2D6A4F] block mb-1">
            School Pilot Distribution & Sharing · स्कूल में शेयर करें
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#192A24]">
            Share AAVYA with Schools & Students
          </h2>
          <p className="text-xs text-[#5C6E66]">
            सीधे व्हाट्सएप पर भेजें, लिंक कॉपी करें, या ऑफलाइन फाइल डाउनलोड करके पेनड्राइव/ईमेल से साझा करें।
          </p>
        </div>

        {/* Live Link Box */}
        <div className="p-4 bg-[#FAFAF8] rounded-2xl border border-[#E2E2DA] space-y-2">
          <label className="text-xs font-semibold text-[#192A24]">लाइव वेब ऐप लिंक (Live App Link)</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-[#D5D5CB] bg-white text-neutral-600 truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#697B72]">
            <span>
              स्कूल लाइसेंस कोड: <strong className="text-[#192A24] font-mono">{defaultKey}</strong>
            </span>
            <span className="text-emerald-700 font-medium">Pilot Active</span>
          </div>
        </div>

        {/* 1-Click WhatsApp & Email Share */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-3 text-emerald-950 font-semibold text-xs"
          >
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="block">व्हाट्सएप पर शेयर करें</span>
              <span className="text-[11px] font-normal text-emerald-800">स्कूल मैसेज तैयार है</span>
            </div>
          </a>

          <a
            href={`mailto:?subject=${emailSubject}&body=${emailBody}`}
            className="p-4 rounded-2xl border border-sky-200 bg-sky-50 hover:bg-sky-100 transition-colors flex items-center gap-3 text-sky-950 font-semibold text-xs"
          >
            <div className="p-2.5 bg-sky-600 text-white rounded-xl shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="block">प्रिंसिपल को ईमेल भेजें</span>
              <span className="text-[11px] font-normal text-sky-800">Formal Proposal</span>
            </div>
          </a>
        </div>

        {/* Download Standalone File Kit & Printable Cards */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl border-2 border-dashed border-[#2D6A4F]/40 bg-[#F6FAF7] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2D6A4F]" />
                <span className="text-xs font-bold text-[#192A24]">
                  ऑफलाइन स्टैंडअलोन फाइल डाउनलोड करें (.html File)
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 font-semibold px-2 py-0.5 rounded bg-emerald-100">
                100% Offline
              </span>
            </div>

            <p className="text-xs text-[#52665C] leading-relaxed">
              एक सिंगल फाइल डाउनलोड करें जिसे आप किसी भी छात्र या शिक्षक को व्हाट्सएप या पेनड्राइव पर सीधे भेज सकते हैं। यह बिना इंटरनेट के भी ब्रीदिंग और डायरी चलाता है!
            </p>

            <button
              onClick={handleDownloadStandaloneFile}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>डाउनलोड करें AAVYA Offline App (.html)</span>
            </button>
          </div>

          {/* Printable Voucher Cards */}
          <div className="p-4 rounded-2xl border border-[#E0E0D6] bg-white flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#192A24] block">
                छात्र पासकोड कार्ड प्रिंट करें (Print Voucher Cards)
              </span>
              <span className="text-[11px] text-[#697B72]">
                क्लास में बांटने के लिए 8 कार्ड्स का A4 प्रिंटेबल शीट
              </span>
            </div>
            <button
              onClick={handlePrintCards}
              className="px-3.5 py-2 text-xs font-semibold text-[#192A24] bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Printer className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>प्रिंट कार्ड्स</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
