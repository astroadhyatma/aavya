"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, Check, ChevronRight, Heart, Lock, Menu, MessageCircle, ShieldCheck, Sparkles, Target, Users, X } from "lucide-react";

type Audience = "School" | "College";

type Feature = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

const schoolFeatures: Feature[] = [
  { icon: <Heart />, title: "Student check-ins", text: "Simple daily check-ins that help students pause, reflect and choose a useful next step." },
  { icon: <BookOpen />, title: "Study wellbeing", text: "Practical tools for exam pressure, focus, routines, confidence and healthy study habits." },
  { icon: <ShieldCheck />, title: "Privacy-first", text: "Keep personal reflections separate from institution-level participation and programme insights." },
  { icon: <Users />, title: "School programmes", text: "Ready-to-run wellbeing pathways for different age groups, with educator-friendly delivery." },
];

const collegeFeatures: Feature[] = [
  { icon: <Heart />, title: "Student check-ins", text: "Give students a private space to reflect on academic pressure, adjustment and everyday wellbeing." },
  { icon: <Target />, title: "Academic & career pressure", text: "Focused tools for procrastination, workload, placements, interviews, uncertainty and routines." },
  { icon: <ShieldCheck />, title: "Privacy-first", text: "Personal journals and conversations stay separate from institution-level reporting." },
  { icon: <Users />, title: "College programmes", text: "Structured journeys and campaigns that colleges can offer alongside the student experience." },
];

const schoolPrograms = [
  ["Exam & Study Wellbeing", "Classes 6–12", "6 weeks"],
  ["Growing Through School", "Classes 6–8", "4 weeks"],
  ["Senior School Balance", "Classes 9–12", "6 weeks"],
];

const collegePrograms = [
  ["College Transition", "Year 1", "4 weeks"],
  ["Academic Pressure", "Year 1–4", "6 weeks"],
  ["Placement & Career Pressure", "Year 3–PG", "6 weeks"],
];

const exercises = [
  "Exam pressure reset",
  "Focus sprint",
  "Overthinking reset",
  "Calm your body",
];

export default function Page() {
  const [audience, setAudience] = useState<Audience>("School");
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [mood, setMood] = useState("");
  const [stress, setStress] = useState(5);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");

  const features = audience === "School" ? schoolFeatures : collegeFeatures;
  const programs = audience === "School" ? schoolPrograms : collegePrograms;

  const notify = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 2200);
  };

  const switchAudience = (next: Audience) => {
    setAudience(next);
    setMenuOpen(false);
    notify(`${next} experience selected`);
  };

  return (
    <main className="site">
      {toast && <div className="toast"><Check size={16} />{toast}</div>}

      <header className="nav">
        <button className="logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="AAVYA home">
          <span className="logo-mark">A</span>
          <span><strong>AAVYA</strong><small>student wellbeing</small></span>
        </button>

        <div className="audience-tabs" aria-label="Audience">
          <button className={audience === "School" ? "active" : ""} onClick={() => switchAudience("School")}>Schools</button>
          <button className={audience === "College" ? "active" : ""} onClick={() => switchAudience("College")}>Colleges</button>
        </div>

        <div className="nav-actions">
          <button className="nav-link" onClick={() => setDemoOpen(true)}><Users size={16} /> For institutions</button>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu"><Menu size={20} /></button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          <button onClick={() => { setMenuOpen(false); document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }); }}>How it works</button>
          <button onClick={() => { setMenuOpen(false); document.getElementById("programmes")?.scrollIntoView({ behavior: "smooth" }); }}>Programmes</button>
          <button onClick={() => { setMenuOpen(false); setDemoOpen(true); }}>Request a demo</button>
        </div>
      )}

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> BUILT FOR {audience.toUpperCase()}S</div>
          <h1>Student wellbeing that fits into <em>real student life.</em></h1>
          <p className="hero-text">AAVYA gives students a private, practical space for study pressure, emotions, routines and goals — while giving {audience.toLowerCase()}s a structured way to deliver wellbeing programmes.</p>
          <div className="hero-buttons">
            <button className="primary" onClick={() => document.getElementById("student-demo")?.scrollIntoView({ behavior: "smooth" })}>See the student experience <ArrowRight size={17} /></button>
            <button className="secondary" onClick={() => setDemoOpen(true)}>For {audience.toLowerCase()}s <ArrowRight size={16} /></button>
          </div>
          <div className="trust-row">
            <span><Lock size={14} /> Private student space</span>
            <span><ShieldCheck size={14} /> Privacy-first design</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="glow-card large-card"><span className="mini-label">TODAY</span><h3>How are you feeling?</h3><p>No judgement. Just a starting point.</p><div className="mood-row"><span>Good</span><span>Okay</span><span>Low</span></div></div>
          <div className="floating-card"><Target size={18} /><div><b>One small step</b><small>is enough for today.</small></div></div>
        </div>
      </section>

      <section className="audience-strip">
        <div><span className="eyebrow">ONE PRODUCT · TWO EXPERIENCES</span><h2>Designed around the student, not the dashboard.</h2></div>
        <div className="audience-copy"><button className={audience === "School" ? "selected" : ""} onClick={() => switchAudience("School")}>School students <ChevronRight size={16} /></button><button className={audience === "College" ? "selected" : ""} onClick={() => switchAudience("College")}>College students <ChevronRight size={16} /></button></div>
      </section>

      <section id="student-demo" className="demo-section">
        <div className="section-heading"><span className="eyebrow">THE STUDENT EXPERIENCE</span><h2>Useful in five minutes, not another thing to manage.</h2><p>Students can start with a quick check-in and move into a guided tool, journal or goal without needing to understand a complicated system.</p></div>
        <div className="demo-card">
          <div className="demo-top"><div><span className="mini-label">PRIVATE CHECK-IN</span><h3>How are you feeling right now?</h3><p>Choose what feels closest. You can change it later.</p></div><span className="private-pill"><Lock size={13} /> Private</span></div>
          <div className="moods">{["Good", "Okay", "Stressed", "Tired", "Low"].map((item) => <button key={item} className={mood === item ? "chosen" : ""} onClick={() => setMood(item)}>{item}</button>)}</div>
          <div className="stress-row"><div><b>Stress</b><small>How much pressure are you carrying?</small></div><strong>{stress}/10</strong></div>
          <input className="range" type="range" min="0" max="10" value={stress} onChange={(e) => setStress(Number(e.target.value))} />
          <div className="demo-actions"><button className="primary" onClick={() => notify(mood ? `Check-in saved: ${mood}` : "Choose a feeling first")}>Save check-in <ArrowRight size={16} /></button><button className="text-button" onClick={() => notify("Guided exercise opened")}>Try a guided exercise</button></div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-heading"><span className="eyebrow">WHY AAVYA</span><h2>Simple enough for students. Structured enough for institutions.</h2></div>
        <div className="feature-grid">{features.map((feature) => <article className="feature-card" key={feature.title}><div className="feature-icon">{feature.icon}</div><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div>
      </section>

      <section id="programmes" className="programmes-section">
        <div className="section-heading split"><div><span className="eyebrow">PROGRAMMES FOR {audience.toUpperCase()}S</span><h2>Ready-made pathways, adaptable to your community.</h2></div><button className="text-button" onClick={() => setDemoOpen(true)}>Talk about your institution <ArrowRight size={15} /></button></div>
        <div className="program-grid">{programs.map((program) => <article className="program-card" key={program[0]}><div className="program-top"><span>{audience.toUpperCase()}</span><BookOpen size={18} /></div><div className="program-meta"><span>{program[1]}</span><span>{program[2]}</span></div><h3>{program[0]}</h3><p>Short lessons, guided activities and reflection prompts designed around this stage.</p><button onClick={() => notify("Programme preview opened")}>Preview pathway <ArrowRight size={15} /></button></article>)}</div>
      </section>

      <section className="exercise-section">
        <div className="exercise-copy"><span className="eyebrow">PRACTICAL TOOLS</span><h2>From “I don't know what to do” to one clear next step.</h2><p>AAVYA keeps activities short and actionable so students can use them between classes, after a difficult day or before an important exam.</p><button className="primary" onClick={() => notify("Exercise library opened")}>Explore the tools <ArrowRight size={16} /></button></div>
        <div className="exercise-list">{exercises.map((item, index) => <button key={item} onClick={() => notify(`${item} opened`)}><span>0{index + 1}</span><b>{item}</b><ArrowRight size={16} /></button>)}</div>
      </section>

      <section className="business-cta">
        <div><span className="eyebrow">FOR {audience.toUpperCase()}S</span><h2>Give students a product they will actually use.</h2><p>Start with a focused programme. Expand with more journeys, workshops and institution-level insights as your needs grow.</p></div>
        <button className="primary" onClick={() => setDemoOpen(true)}>Request an institution demo <ArrowRight size={17} /></button>
      </section>

      <footer className="footer"><div className="footer-brand"><span className="logo-mark">A</span><div><strong>AAVYA</strong><small>student wellbeing</small></div></div><span>Private student space · Support tool, not a replacement for professional care</span></footer>

      {demoOpen && (
        <div className="modal-backdrop" onClick={() => setDemoOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setDemoOpen(false)} aria-label="Close"><X size={19} /></button>
            <div className="feature-icon"><Users size={20} /></div>
            <span className="eyebrow">FOR {audience.toUpperCase()}S</span>
            <h2>Let's build the right starting programme.</h2>
            <p>Tell us what you want to improve for students and AAVYA can be shaped around your age group, priorities and delivery model.</p>
            <label>Your institution message<input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. We want an exam wellbeing programme for Classes 9–12" /></label>
            <button className="primary full" onClick={() => { setDemoOpen(false); notify(message.trim() ? "Thanks — your demo request is ready" : "Demo request started"); }}>Continue <ArrowRight size={16} /></button>
          </div>
        </div>
      )}
    </main>
  );
}
