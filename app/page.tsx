"use client";

import { useState } from "react";
import { ArrowRight, BarChart3, BookOpen, Brain, Check, ChevronRight, Heart, Home, LockKeyhole, Menu, MessageCircle, NotebookPen, Plus, School, ShieldCheck, Sparkles, Target, Users, X, GraduationCap } from "lucide-react";

type Audience = "School" | "College";
type Screen = "home" | "checkin" | "journal" | "exercises" | "goals" | "programs" | "progress" | "ai";

const schoolStages = ["Classes 1–5", "Classes 6–8", "Classes 9–10", "Classes 11–12"];
const collegeStages = ["Year 1", "Year 2", "Year 3", "Year 4", "PG"];
const exercises = [
  ["🎯", "Exam Pressure Reset", "Study stress", "6 min", "Turn pressure into one clear next action."],
  ["🧠", "Thought Check", "Overthinking", "5 min", "Separate facts, assumptions and predictions."],
  ["⚡", "Focus Sprint", "Focus", "8 min", "Build one realistic distraction-light study block."],
  ["🌿", "Calm Your Body", "Calm", "4 min", "A short breathing and grounding reset."],
  ["🌙", "Sleep Wind-down", "Recovery", "7 min", "Create a calmer evening routine."],
  ["🤝", "Support Map", "Connection", "7 min", "Identify safe people and useful places to reach."],
];

export default function Page() {
  const [audience, setAudience] = useState<Audience>("School");
  const [stage, setStage] = useState("Classes 9–10");
  const [screen, setScreen] = useState<Screen>("home");
  const [menu, setMenu] = useState(false);
  const [mood, setMood] = useState("");
  const [stress, setStress] = useState(5);
  const [journal, setJournal] = useState("");
  const [entries, setEntries] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [exercise, setExercise] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState("");
  const [institution, setInstitution] = useState(false);

  const stages = audience === "School" ? schoolStages : collegeStages;
  const notify = (text: string) => { setToast(text); window.setTimeout(() => setToast(""), 1800); };
  const go = (next: Screen) => { setScreen(next); setMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const switchAudience = (next: Audience) => { setAudience(next); setStage(next === "School" ? "Classes 9–10" : "Year 1"); go("home"); notify(`${next} experience selected`); };

  return <main className="app-shell">
    {toast && <div className="toast"><Check size={15}/>{toast}</div>}
    <header className="topbar">
      <button className="brand" onClick={() => go("home")}><span className="brandmark">A</span><span><b>AAVYA</b><small>private wellbeing for students</small></span></button>
      <div className="audience-switch">{(["School", "College"] as Audience[]).map(a => <button key={a} className={audience === a ? "active" : ""} onClick={() => switchAudience(a)}>{a}</button>)}</div>
      <div className="top-actions"><button className="institution-link" onClick={() => setInstitution(true)}><Users size={16}/> For institutions</button><button className="icon-button" onClick={() => setMenu(!menu)}><Menu size={19}/></button><span className="profile">A</span></div>
    </header>
    <div className="app-layout">
      <aside className={menu ? "sidebar open" : "sidebar"}>
        <div className="stage-card"><span>{audience === "School" ? <School/> : <GraduationCap/>}</span><div><b>{audience}</b><small>{stage}</small></div></div>
        <label className="side-label">YOUR EXPERIENCE</label>
        <div className="stage-picker">{stages.map(s => <button key={s} className={stage === s ? "selected" : ""} onClick={() => { setStage(s); notify(`${s} selected`); }}>{s}<ChevronRight size={14}/></button>)}</div>
        <nav className="side-nav">
          <Nav active={screen === "home"} icon={<Home/>} text="MySpace" go={() => go("home")}/>
          <Nav active={screen === "checkin"} icon={<Heart/>} text="Daily check-in" go={() => go("checkin")}/>
          <Nav active={screen === "journal"} icon={<NotebookPen/>} text="Private journal" go={() => go("journal")}/>
          <Nav active={screen === "exercises"} icon={<Sparkles/>} text="Exercises" go={() => go("exercises")}/>
          <Nav active={screen === "goals"} icon={<Target/>} text="My goals" go={() => go("goals")}/>
          <Nav active={screen === "programs"} icon={<BookOpen/>} text="Programs" go={() => go("programs")}/>
          <Nav active={screen === "progress"} icon={<BarChart3/>} text="My progress" go={() => go("progress")}/>
          <Nav active={screen === "ai"} icon={<MessageCircle/>} text="AAVYA companion" go={() => go("ai")}/>
        </nav>
        <div className="side-trust"><ShieldCheck size={15}/><span><b>Private by design</b><small>Personal entries stay separate from institution reporting.</small></span></div>
      </aside>
      <section className="content">
        <div className="mobile-bar"><b>{audience} · {stage}</b><button onClick={() => setMenu(true)}>Menu</button></div>
        {screen === "home" && <HomeScreen audience={audience} stage={stage} mood={mood} stress={stress} setMood={setMood} setStress={setStress} go={go}/>} 
        {screen === "checkin" && <Checkin mood={mood} stress={stress} setMood={setMood} setStress={setStress} save={() => { notify("Check-in saved privately"); go("home"); }}/>} 
        {screen === "journal" && <Journal value={journal} setValue={setJournal} entries={entries} save={() => { if (journal.trim()) { setEntries([journal.trim(), ...entries]); setJournal(""); notify("Journal saved privately"); } }}/>} 
        {screen === "exercises" && <Exercises active={exercise} setActive={setExercise} step={step} setStep={setStep} done={() => { setExercise(null); setStep(0); notify("Exercise completed"); }}/>} 
        {screen === "goals" && <Goals value={goal} setValue={setGoal} goals={goals} add={() => { if (goal.trim()) { setGoals([goal.trim(), ...goals]); setGoal(""); notify("Goal added"); } }}/>} 
        {screen === "programs" && <Programs audience={audience} notify={notify}/>} 
        {screen === "progress" && <Progress entries={entries.length} goals={goals.length}/>} 
        {screen === "ai" && <AI/>}
        <footer><span>© AAVYA</span><span>Private student space</span><span>Support tool, not a replacement for professional care</span></footer>
      </section>
    </div>
    {institution && <InstitutionModal audience={audience} close={() => setInstitution(false)}/>} 
  </main>;
}

function Nav({active,icon,text,go}:{active:boolean;icon:React.ReactNode;text:string;go:()=>void}) { return <button className={active ? "nav active" : "nav"} onClick={go}>{icon}<span>{text}</span></button>; }
function Header({eyebrow,title,sub}:{eyebrow:string;title:string;sub:string}) { return <div className="page-header"><span>{eyebrow}</span><h1>{title}</h1><p>{sub}</p></div>; }

function HomeScreen({audience,stage,mood,stress,setMood,setStress,go}:{audience:Audience;stage:string;mood:string;stress:number;setMood:(x:string)=>void;setStress:(x:number)=>void;go:(x:Screen)=>void}) {
  return <div className="page">
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow">{audience.toUpperCase()} · {stage.toUpperCase()}</span><h1>Your space to feel, reflect & move forward.</h1><p>AAVYA gives students private, practical tools for everyday stress, study pressure, emotions, routines and goals — at their own pace.</p><div className="hero-actions"><button className="primary" onClick={() => go("checkin")}>Start today&apos;s check-in <ArrowRight size={16}/></button><button className="ghost" onClick={() => go("exercises")}>Explore exercises</button></div><div className="trust"><span><LockKeyhole size={14}/> Private space</span><span><ShieldCheck size={14}/> Student-first</span><span><Sparkles size={14}/> Guided tools</span></div></div>
      <div className="hero-art"><div className="orb"><Sparkles size={29}/><b>Small steps.</b><span>Real progress.</span></div><div className="floating"><Heart size={15}/><span><b>How are you today?</b><small>No judgement. No score.</small></span></div></div>
    </section>
    <section className="check-card"><div><span className="eyebrow">QUICK CHECK-IN</span><h2>How are you feeling right now?</h2><p>This helps personalize the tools you see.</p></div><div className="moods">{["Good","Okay","Low","Stressed","Tired"].map(x => <button key={x} className={mood === x ? "chosen" : ""} onClick={() => setMood(x)}>{x}</button>)}</div><div className="stress"><span>Stress</span><input type="range" min="0" max="10" value={stress} onChange={e => setStress(+e.target.value)}/><b>{stress}/10</b></div><button className="link" onClick={() => go("checkin")}>Complete full check-in <ArrowRight size={14}/></button></section>
    <SectionTitle label="FOR THIS MOMENT" title="A useful next step" action="View all exercises" onClick={() => go("exercises")}/>
    <section className="recommend-grid"><button className="recommend" onClick={() => go("exercises")}><span className="rec-icon">🎯</span><div><small>RECOMMENDED</small><h3>{audience === "School" ? "Reset your study pressure" : "Reset your college pressure"}</h3><p>Take 6 minutes to name what is happening, find one controllable piece and choose your next action.</p><b>Start guided exercise <ArrowRight size={14}/></b></div></button><div className="quick-list"><Quick icon={<NotebookPen/>} title="Private journal" sub="Write it out" go={() => go("journal")}/><Quick icon={<Target/>} title="My goals" sub="Keep one thing moving" go={() => go("goals")}/><Quick icon={<MessageCircle/>} title="Talk to AAVYA" sub="Reflect or plan" go={() => go("ai")}/></div></section>
    <SectionTitle label="YOUR SPACE" title="Tools made for student life"/>
    <section className="tool-grid"><Tool icon={<Sparkles/>} title="Guided exercises" text="Short activities for stress, focus, confidence and calm." go={() => go("exercises")}/><Tool icon={<BookOpen/>} title="Programs" text="Stage-aware pathways for study pressure and transitions." go={() => go("programs")}/><Tool icon={<BarChart3/>} title="Your progress" text="Notice patterns and actions without turning wellbeing into a score." go={() => go("progress")}/></section>
    <section className="privacy"><LockKeyhole size={20}/><div><b>Your personal space is yours.</b><p>Journal entries and personal conversations are separate from institution-level reporting.</p></div><button onClick={() => go("journal")}>Open private space <ArrowRight size={14}/></button></section>
  </div>;
}
function SectionTitle({label,title,action,onClick}:{label:string;title:string;action?:string;onClick?:()=>void}) { return <div className="section-title"><div><span className="eyebrow">{label}</span><h2>{title}</h2></div>{action && <button onClick={onClick}>{action} <ArrowRight size={14}/></button>}</div>; }
function Quick({icon,title,sub,go}:{icon:React.ReactNode;title:string;sub:string;go:()=>void}) { return <button className="quick" onClick={go}><span>{icon}</span><div><b>{title}</b><small>{sub}</small></div><ChevronRight size={15}/></button>; }
function Tool({icon,title,text,go}:{icon:React.ReactNode;title:string;text:string;go:()=>void}) { return <button className="tool" onClick={go}><span>{icon}</span><h3>{title}</h3><p>{text}</p><b>Explore <ArrowRight size={13}/></b></button>; }

function Checkin({mood,stress,setMood,setStress,save}:{mood:string;stress:number;setMood:(x:string)=>void;setStress:(x:number)=>void;save:()=>void}) { const [energy,setEnergy]=useState("Medium"); const [need,setNeed]=useState(""); return <div className="page narrow"><Header eyebrow="DAILY CHECK-IN" title="A few questions. No judgement." sub="Your answers are for your private experience. You can skip anything."/><div className="form"><Field title="How are you feeling?" sub="Pick what fits right now."/><div className="options">{["Good","Okay","Low","Stressed","Frustrated","Tired"].map(x=><button className={mood === x ? "selected" : ""} onClick={() => setMood(x)} key={x}>{x}</button>)}</div><div className="metric"><div><b>Stress</b><strong>{stress}/10</strong></div><input type="range" min="0" max="10" value={stress} onChange={e => setStress(+e.target.value)}/></div><Field title="Energy" sub="How much energy do you have?"/><div className="pills">{["Low","Medium","High"].map(x=><button className={energy === x ? "selected" : ""} onClick={() => setEnergy(x)} key={x}>{x}</button>)}</div><Field title="What would help most?" sub="Choose what you need right now."/><div className="pills wrap">{["Calm","Focus","Plan","Reflect","Talk","Study help"].map(x=><button className={need === x ? "selected" : ""} onClick={() => setNeed(x)} key={x}>{x}</button>)}</div><div className="form-actions"><button className="ghost" onClick={save}>Skip</button><button className="primary" onClick={save}>Save check-in <ArrowRight size={15}/></button></div></div></div>; }
function Field({title,sub}:{title:string;sub:string}) { return <div className="field"><b>{title}</b><small>{sub}</small></div>; }

function Journal({value,setValue,entries,save}:{value:string;setValue:(x:string)=>void;entries:string[];save:()=>void}) { return <div className="page"><Header eyebrow="PRIVATE JOURNAL" title="A space to put things down." sub="Write honestly. Journal text stays in your private space and is not shown in institution-level reporting."/><div className="journal-layout"><div className="editor"><div className="editor-top"><span><LockKeyhole size={14}/> Private entry</span><span>{value.length} characters</span></div><textarea value={value} onChange={e => setValue(e.target.value)} placeholder="What is on your mind today? You can write about school, college, friendships, family, pressure or goals."/><div className="editor-bottom"><small>Try: “Right now I feel…”</small><button className="primary" onClick={save}>Save privately <Check size={15}/></button></div></div><div className="history"><div className="history-top"><b>Recent entries</b><small>{entries.length} saved</small></div>{entries.length ? entries.map((e,i)=><div className="entry" key={i}><small>Private entry</small><p>{e}</p></div>) : <div className="empty"><NotebookPen size={22}/><b>Your journal is empty.</b><span>Your first entry will appear here.</span></div>}</div></div></div>; }

function Exercises({active,setActive,step,setStep,done}:{active:number|null;setActive:(x:number|null)=>void;step:number;setStep:(x:number)=>void;done:()=>void}) { if(active !== null) { const e=exercises[active]; return <div className="page narrow"><button className="back" onClick={() => {setActive(null);setStep(0)}}}>← Back to exercises</button><div className="run"><div className="exercise-icon">{e[0]}</div><span className="eyebrow">GUIDED EXERCISE · {e[3]}</span><h1>{e[1]}</h1><p>{e[4]}</p><div className="progress"><i style={{width:`${((step+1)/3)*100}%`}}/></div><div className="run-step"><small>STEP {step+1} OF 3</small><h2>{step===0 ? "Name what is happening" : step===1 ? "Find one thing you can control" : "Choose your next tiny action"}</h2><p>{step===0 ? "A few honest words are enough." : step===1 ? "Focus on the part that is actually within your control." : "Make the action small enough to start today."}</p><textarea placeholder="Type a few words…"/><button className="primary" onClick={() => step < 2 ? setStep(step+1) : done()}>{step < 2 ? "Continue" : "Complete exercise"} <ArrowRight size={15}/></button></div></div></div>; } return <div className="page"><Header eyebrow="EXERCISES" title="Tools for real student moments." sub="Short guided activities for stress, focus, calm, routines and connection."/><div className="filters"><button className="active">All</button><button>Study</button><button>Stress</button><button>Focus</button><button>Calm</button></div><div className="exercise-grid">{exercises.map((e,i)=><button className="exercise-card" key={e[1]} onClick={() => {setActive(i);setStep(0)}}}><div className="exercise-top"><span>{e[0]}</span><small>{e[3]}</small></div><em>{e[2]}</em><h3>{e[1]}</h3><p>{e[4]}</p><footer>Start activity <ArrowRight size={14}/></footer></button>)}</div></div>; }

function Goals({value,setValue,goals,add}:{value:string;setValue:(x:string)=>void;goals:string[];add:()=>void}) { return <div className="page"><Header eyebrow="MY GOALS" title="Keep one meaningful thing moving." sub="Goals are personal. Start small enough to act on."/><div className="goal-add"><Target size={20}/><input value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="e.g. Finish two focused study blocks this week"/><button className="primary" onClick={add}><Plus size={15}/> Add</button></div><div className="goal-list">{goals.length ? goals.map((g,i)=><div className="goal-item" key={i}><span className="dot"/><div><small>ACTIVE GOAL</small><b>{g}</b><p>Next step: decide what you can do today.</p></div><ChevronRight size={16}/></div>) : <div className="empty"><Target size={24}/><b>No goals yet.</b><span>Choose one thing that matters and make the first step tiny.</span></div>}</div></div>; }

function Programs({audience,notify}:{audience:Audience;notify:(x:string)=>void}) { const data=audience === "School" ? [["Exam & Study Wellbeing","Classes 6–12","6 weeks","Study pressure, focus, routines and confidence."],["Growing Through School","Classes 6–8","4 weeks","Emotions, friendships, self-understanding and routines."],["Senior School Balance","Classes 9–12","6 weeks","Exams, expectations, habits and support."],["School Community Toolkit","Schools","Institution","Age-appropriate activities and educator resources."]] : [["College Transition","Year 1","4 weeks","Adjustment, belonging, routines and support."],["Academic Pressure","Year 1–4","6 weeks","Study load, procrastination, focus and sustainable routines."],["Placement & Career Pressure","Year 3–PG","6 weeks","Interviews, uncertainty, comparison and practical next steps."],["Campus Wellbeing Toolkit","Colleges","Institution","Workshops, campaigns and aggregate insights."]]; return <div className="page"><Header eyebrow={`${audience.toUpperCase()} PROGRAMS`} title="Structured support for the stage you are in." sub="Programs combine short lessons, activities and reflection prompts. Institutions can offer them alongside the private student experience."/><div className="program-grid">{data.map((p,i)=><article className="program-card" key={p[0]}><div className={`program-cover c${i}`}><span>{audience.toUpperCase()}</span><Sparkles size={20}/></div><div className="program-body"><div className="program-meta"><span>{p[1]}</span><span>{p[2]}</span></div><h3>{p[0]}</h3><p>{p[3]}</p><button onClick={() => notify("Program preview opened")}>Preview pathway <ArrowRight size={14}/></button></div></article>)}</div><div className="business-strip"><div><span className="eyebrow">FOR SCHOOLS & COLLEGES</span><h2>A student product that institutions can actually adopt.</h2><p>Annual subscriptions, program bundles and optional workshops can sit on top of the private student experience.</p></div><button className="primary" onClick={() => notify("Institution demo flow ready")}>Request a demo <ArrowRight size={15}/></button></div></div>; }

function Progress({entries,goals}:{entries:number;goals:number}) { const bars=[38,55,46,70,58,82,66]; return <div className="page"><Header eyebrow="MY PROGRESS" title="Notice patterns, not scores." sub="Progress focuses on actions and reflection. It is not a mental-health score or diagnosis."/><div className="stats"><Stat n="8" t="check-ins" s="last 30 days"/><Stat n={String(entries)} t="journal entries" s="saved privately"/><Stat n={String(goals)} t="goals" s="started"/><Stat n="6" t="exercises" s="completed"/></div><div className="progress-grid"><div className="chart"><div className="chart-head"><div><span className="eyebrow">ACTIVITY</span><h2>Your small steps</h2></div><small>Last 7 days</small></div><div className="bars">{bars.map((v,i)=><div key={i}><span style={{height:`${v}%`}}>{Math.round(v/10)}</span><small>{["M","T","W","T","F","S","S"][i]}</small></div>)}</div></div><div className="insight"><Sparkles size={20}/><span>PERSONAL INSIGHT</span><h3>Consistency matters more than intensity.</h3><p>Use this view to notice what helps you take action. If something feels difficult, make the next step smaller.</p></div></div></div>; }
function Stat({n,t,s}:{n:string;t:string;s:string}) { return <div className="stat"><strong>{n}</strong><b>{t}</b><small>{s}</small></div>; }

function AI() { const [messages,setMessages]=useState([{role:"ai",text:"Hi. I’m AAVYA. We can reflect, plan a small next step, or choose an exercise together."}]); const [input,setInput]=useState(""); const send=(preset?:string)=>{const q=(preset ?? input).trim();if(!q)return;setInput("");const a=q.toLowerCase().includes("exam")||q.toLowerCase().includes("study")?"Let’s make it smaller: choose one topic, one 20-minute block and a clear finish line.":q.toLowerCase().includes("stress")?"Pause for one slow breath. Then tell me the part of this situation you can actually influence today.":"Tell me what is happening in your own words. I can help you reflect and plan.";setMessages(m=>[...m,{role:"user",text:q},{role:"ai",text:a}]);};return <div className="page narrow"><Header eyebrow="AAVYA COMPANION" title="A private place to think out loud." sub="This prototype uses guided responses. A production AI companion needs a secure backend, safety layer and escalation design."/><div className="ai-card"><div className="ai-head"><span><Brain size={19}/></span><div><b>AAVYA companion</b><small>Reflect · plan · choose a tool</small></div><em>DEMO</em></div><div className="messages">{messages.map((m,i)=><div className={m.role === "user" ? "message user" : "message"} key={i}><span>{m.role === "user" ? "A" : "✦"}</span><p>{m.text}</p></div>)}</div><div className="suggestions"><button onClick={()=>send("I am stressed about exams")}>I’m stressed about exams</button><button onClick={()=>send("Help me plan my study")}>Help me plan</button><button onClick={()=>send("I keep overthinking")}>I keep overthinking</button></div><div className="ai-input"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key === "Enter" && send()} placeholder="Write what’s on your mind…"/><button onClick={()=>send()}><ArrowRight size={16}/></button></div><small className="ai-note">AAVYA is a wellbeing support tool, not emergency or professional medical care.</small></div></div>; }

function InstitutionModal({audience,close}:{audience:Audience;close:()=>void}) { return <div className="modal-backdrop" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={close}><X size={18}/></button><span className="eyebrow">FOR {audience.toUpperCase()}S</span><h2>Bring AAVYA to your student community.</h2><p>The B2B layer is designed around onboarding, programs, participation and aggregate insights — while keeping personal journals and private conversations out of institution reporting.</p><div className="modal-list"><span><Check size={14}/> Stage-specific student journeys</span><span><Check size={14}/> Structured programs & campaigns</span><span><Check size={14}/> Aggregate, not personal, reporting</span><span><Check size={14}/> Privacy boundaries by design</span></div><button className="primary" onClick={close}>Got it <ArrowRight size={15}/></button></div></div>; }
