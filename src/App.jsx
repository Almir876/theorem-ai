import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { curriculumCatalog, getDefaultSelection, loadLevelContent } from "./content/index.js";
import { auth } from "./firebase.js";
import theoremLogo from "./assets/theorem-logo.svg";
import streakIcon from "./assets/streak-icon.svg";
import xpIcon from "./assets/xp-icon.svg";
import masteredIcon from "./assets/mastered-icon.svg";
import { logoutUser } from "./auth/login.js";
import {
  loadUserProgress,
  markLessonCompleted,
  recordUserStreakActivity,
  saveUserProgress,
  updateUserXP,
} from "./services/progressService.js";

// Lesson content is loaded from `src/content/*` (curriculum + level).

const ACHIEVEMENTS_DEF = [
  { id:"first_lesson", icon:"target", title:"First Steps",   desc:"Complete your first lesson" },
  { id:"streak_3",     icon:"streak", title:"On Fire",       desc:"Maintain a 3-day streak" },
  { id:"perfect",      icon:"sparkle", title:"Perfectionist", desc:"Score 100% on a lesson" },
  { id:"speed",        icon:"xp", title:"Speed Solver",  desc:"Answer correctly in under 5s" },
  { id:"streak_7",     icon:"star", title:"Week Warrior",  desc:"Maintain a 7-day streak" },
  { id:"master",       icon:"trophy", title:"Topic Master",  desc:"Master your first topic" },
];

// ════════════════════════════════════════════════════════════════
//  SHARED HELPERS & COMPONENTS
// ════════════════════════════════════════════════════════════════

const ACC = "#4F8CFF";
const DAY_MS = 86_400_000;

function prettyLabel(s) {
  return typeof s === "string" ? s.replace(/_/g, " ") : s;
}

function FireGlyph({ size = 24, className, style }) {
  return <img src={streakIcon} alt="" aria-hidden="true" className={className} width={size} height={size} style={{ ...style, display:"block" }} />;
}

function XPGlyph({ size = 24, className, style }) {
  return <img src={xpIcon} alt="" aria-hidden="true" className={className} width={size} height={size} style={{ ...style, display:"block" }} />;
}

function MasteredGlyph({ size = 24, className, style }) {
  return <img src={masteredIcon} alt="" aria-hidden="true" className={className} width={size} height={size} style={{ ...style, display:"block" }} />;
}

function AppIcon({ name, size=18, color="currentColor", stroke=2, style }) {
  const p = { fill:"none", stroke:color, strokeWidth:stroke, strokeLinecap:"round", strokeLinejoin:"round" };
  switch (name) {
    case "xp": return <XPGlyph size={size} style={style} />;
    case "streak": return <FireGlyph size={size} style={style} />;
    case "trophy": return <MasteredGlyph size={size} style={style} />;
    case "target": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><circle {...p} cx="12" cy="12" r="8" /><circle {...p} cx="12" cy="12" r="4" /><circle {...p} cx="12" cy="12" r="1.5" /></svg>;
    case "sparkle": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z" /><path {...p} d="M5 15l.8 1.8L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-1.2z" /><path {...p} d="M19 14l.6 1.4L21 16l-1.4.6L19 18l-.6-1.4L17 16l1.4-.6z" /></svg>;
    case "star": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M12 3l2.7 5.5L21 9.3l-4.5 4.4L17.6 21 12 18l-5.6 3 1.1-7.3L3 9.3l6.3-.8z" /></svg>;
    case "check": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M5 12l4 4L19 6" /></svg>;
    case "lock": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><rect {...p} x="5" y="10" width="14" height="10" rx="2" /><path {...p} d="M8 10V8a4 4 0 0 1 8 0v2" /></svg>;
    case "play": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M8 5v14l11-7z" /></svg>;
    case "close": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M6 6l12 12M18 6L6 18" /></svg>;
    case "back": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M15 18l-6-6 6-6" /></svg>;
    case "settings": return <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true"><path fill={color} fillRule="evenodd" clipRule="evenodd" d="M7 3.75h10L22 12l-5 8.25H7L2 12 7 3.75ZM12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /></svg>;
    case "graduation": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M3 9l9-4 9 4-9 4z" /><path {...p} d="M7 11v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4" /></svg>;
    case "celebrate": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M5 20l8-8" /><path {...p} d="M13 12l5-2-3-3-2 5z" /><path {...p} d="M16 4v2M20 8h-2M18.5 5.5l-1.4 1.4" /></svg>;
    case "telescope": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M3 7l12-4 2 6-12 4z" /><path {...p} d="M10 11l-2 8M14 10l2 9M4 20h14" /></svg>;
    case "info": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><circle {...p} cx="12" cy="12" r="9" /><path {...p} d="M12 10v6M12 7h.01" /></svg>;
    case "book": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M4 5a2 2 0 0 1 2-2h12v17H6a2 2 0 0 0-2 2z" /><path {...p} d="M6 3v17" /></svg>;
    case "success": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><circle {...p} cx="12" cy="12" r="9" /><path {...p} d="M8 12l3 3 5-6" /></svg>;
    case "error": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><circle {...p} cx="12" cy="12" r="9" /><path {...p} d="M9 9l6 6M15 9l-6 6" /></svg>;
    default: return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><circle {...p} cx="12" cy="12" r="8" /></svg>;
  }
}

function isLocked(skillId, skills, skillMeta) {
  const sm = (skillMeta || []).find(s => s.id === skillId);
  if (!sm) return true;
  return sm.prereqs.some(p => !skills[p]?.mastered);
}

function XPBar({ current, max }) {
  const pct = Math.min((current / Math.max(max, 1)) * 100, 100);
  return (
    <div style={{ background:"#1A1A1A", borderRadius:999, height:7, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#4F8CFF,#7BAAFF)", borderRadius:999, transition:"width .8s cubic-bezier(.34,1.56,.64,1)", boxShadow:"0 0 6px rgba(79,140,255,.2)" }}/>
    </div>
  );
}

function StreakFlame({ streak }) {
  const hot = streak > 0;
  return (
    <span className={`streak-fire ${hot ? "hot" : "cold"}`}>
      <FireGlyph className="streak-flame-icon" size={38} />
    </span>
  );
}

function resolveSkillGlyphType(skill) {
  const key = `${skill?.id || ""} ${skill?.title || ""}`.toLowerCase();
  if (/trig|angle/.test(key)) return "trig";
  if (/integr|area|volume|circumference|perimeter/.test(key)) return "area";
  if (/different|derivative/.test(key)) return "slope";
  if (/probab|stat|sample|population|data/.test(key)) return "stats";
  if (/percent|ratio|proportion|fraction|decimal|rational/.test(key)) return "fraction";
  if (/equation|algebra|function|linear|quadratic|coordinate|exponent|log/.test(key)) return "graph";
  if (/sequence|series|binomial/.test(key)) return "sequence";
  if (/geometry|polygon|scale|drawing/.test(key)) return "geometry";
  return "spark";
}

function SkillGlyph({ skill, size = 24, color = ACC }) {
  const t = resolveSkillGlyphType(skill);
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ color }} aria-hidden="true">
      {t === "trig" && (
        <>
          <path {...p} d="M4 18h16" />
          <path {...p} d="M6 18l5-8 7 8" />
          <path {...p} d="M14 8c1.5.6 2.5 1.8 3 3.3" />
        </>
      )}
      {t === "area" && (
        <>
          <path {...p} d="M4 18h16" />
          <path {...p} d="M4 18c2.8-6 5.8-8 10-8 2.2 0 4 .6 6 2" />
          <path d="M4 18c2.8-6 5.8-8 10-8 2.2 0 4 .6 6 2v6H4z" fill="currentColor" opacity=".2" />
        </>
      )}
      {t === "slope" && (
        <>
          <path {...p} d="M4 18h16M6 6v12" />
          <path {...p} d="M7 15l9-7" />
          <path {...p} d="M14.8 8.2l1.8-.6-.6 1.8" />
        </>
      )}
      {t === "stats" && (
        <>
          <path {...p} d="M4 18h16" />
          <rect x="6" y="12" width="2.4" height="6" rx="1" fill="currentColor" opacity=".35" />
          <rect x="10.8" y="9" width="2.4" height="9" rx="1" fill="currentColor" opacity=".55" />
          <rect x="15.6" y="6.5" width="2.4" height="11.5" rx="1" fill="currentColor" opacity=".8" />
        </>
      )}
      {t === "fraction" && (
        <>
          <circle {...p} cx="12" cy="12" r="7.5" />
          <path d="M12 12V4.5a7.5 7.5 0 0 1 6.5 3.8L12 12Z" fill="currentColor" opacity=".26" />
          <path {...p} d="M12 12l6.5-3.7" />
        </>
      )}
      {t === "graph" && (
        <>
          <path {...p} d="M4 18h16M6 6v12" />
          <path {...p} d="M7 15c2.4-4.4 6.1-7.2 10-8" />
          <circle cx="16.7" cy="7.2" r="1.1" fill="currentColor" />
        </>
      )}
      {t === "sequence" && (
        <>
          <circle {...p} cx="6" cy="16" r="1.6" />
          <circle {...p} cx="11" cy="12" r="1.6" />
          <circle {...p} cx="16" cy="8" r="1.6" />
          <path {...p} d="M7.4 15l2.3-1.8M12.4 11l2.3-1.8" />
        </>
      )}
      {t === "geometry" && (
        <>
          <path {...p} d="M12 4l7 4v8l-7 4-7-4V8z" />
          <path {...p} d="M12 4v8l7 4" />
          <path {...p} d="M12 12l-7 4" />
        </>
      )}
      {t === "spark" && (
        <>
          <path {...p} d="M12 4l2 4.5L18 10l-4 1.5L12 16l-2-4.5L6 10l4-1.5z" />
          <path {...p} d="M5.5 16.5l.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8z" />
        </>
      )}
    </svg>
  );
}

// ════════════════════════════════════════════════════════════════
//  SPLASH SCREEN  (replaces "Loading account…")
// ════════════════════════════════════════════════════════════════

function SplashScreen() {
  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#0B0B0B", padding:"0 24px" }}>
      <img
        src={theoremLogo}
        alt="Theorem"
        className="splash-logo"
        style={{ width:"min(170px, 72vw)", height:"auto", display:"block" }}
      />
      <p style={{ color:"#4A4A4A", fontSize:13, marginTop:20, letterSpacing:0.2 }}>Solving for…</p>
      <div className="splash-progress" aria-hidden="true">
        <div className="splash-progress-bar" />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SKELETON LOADER  (replaces "Loading curriculum…")
// ════════════════════════════════════════════════════════════════

function SkeletonBlock({ w="100%", h=16, style={} }) {
  return <div className="skeleton" style={{ width:w, height:h, borderRadius:h/2+2, ...style }}/>;
}

function SkeletonLoader() {
  return (
    <div style={{ padding:"52px 24px 0", display:"flex", flexDirection:"column", gap:18, animation:"fadeIn .3s ease" }}>
      {/* Header */}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        <SkeletonBlock w="55%" h={12}/>
        <SkeletonBlock w="75%" h={22}/>
      </div>
      {/* Badges row */}
      <div style={{ display:"flex", gap:8 }}>
        <SkeletonBlock w={72} h={28} style={{ borderRadius:14 }}/>
        <SkeletonBlock w={90} h={28} style={{ borderRadius:14 }}/>
      </div>
      {/* Daily goal card */}
      <div style={{ background:"#111", border:"1px solid #181818", borderRadius:20, padding:18, display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <SkeletonBlock w="30%" h={13}/>
          <SkeletonBlock w="18%" h={13}/>
        </div>
        <SkeletonBlock w="100%" h={7} style={{ borderRadius:999 }}/>
        <div style={{ display:"flex", justifyContent:"space-between", gap:6 }}>
          {[0,1,2,3,4,5,6].map(i=><SkeletonBlock key={i} w={29} h={29} style={{ borderRadius:9, flexShrink:0 }}/>)}
        </div>
      </div>
      {/* Continue card */}
      <SkeletonBlock w="100%" h={96} style={{ borderRadius:20 }}/>
      {/* Stat cards */}
      <div style={{ display:"flex", gap:10 }}>
        <SkeletonBlock w="33%" h={78} style={{ borderRadius:16 }}/>
        <SkeletonBlock w="33%" h={78} style={{ borderRadius:16 }}/>
        <SkeletonBlock w="33%" h={78} style={{ borderRadius:16 }}/>
      </div>
    </div>
  );
}

function NavBar({ active, go }) {
  const tabs = [
    { id:"home",     label:"Home",
      d:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|M9 22V12h6v10" },
    { id:"tree",     label:"Learn",
      d:"M12 3a2 2 0 100 4 2 2 0 000-4|M5 19a2 2 0 100 4 2 2 0 000-4|M19 19a2 2 0 100 4 2 2 0 000-4|M12 7v5|M12 12l-7 6|M12 12l7 6" },
    { id:"test",     label:"Test",
      d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2|M9 5a2 2 0 002 2h2a2 2 0 002-2|M9 12h6|M9 16h4" },
    { id:"progress", label:"Stats",
      d:"M22 12h-4l-3 9L9 3l-3 9H2" },
  ];
  return (
    <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"rgba(12,12,12,.97)", backdropFilter:"blur(12px)", borderTop:"1px solid #1A1A1A", display:"flex", zIndex:200, paddingBottom:"env(safe-area-inset-bottom)", boxSizing:"border-box" }}>
      {tabs.map(t => {
        const on = active === t.id;
        const paths = t.d.split("|");
        return (
          <button key={t.id} onClick={() => go(t.id)} className={`nav-tab${on?" active":""}`} style={{ flex:1, background:"none", border:"none", cursor:"pointer", padding:"10px 0 14px", display:"flex", flexDirection:"column", alignItems:"center", gap:3, color: on ? ACC : "#3A3A3A" }}>
            <svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={on?2.4:1.7} strokeLinecap="round" strokeLinejoin="round">
              {paths.map((p,i) => <path key={i} d={p}/>)}
            </svg>
            <span style={{ fontSize:10, fontWeight: on?700:500, letterSpacing:.3, transition:"color .2s" }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  ONBOARDING
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
//  SIGNUP PAGE (shown after onboarding)
// ════════════════════════════════════════════════════════════════

function SignupPage({ onDone, prefill }) {
  const [mode, setMode] = useState("signup"); // "signup" | "login"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) { setErr("Please fill in all fields."); return; }
    setLoading(true); setErr("");
    try {
      const { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } = await import("firebase/auth");
      const auth = getAuth();
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onDone();
    } catch (e) {
      setErr(e.message?.replace("Firebase: ","")?.replace(/\(auth.*\)/,"")?.trim() || "Something went wrong.");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true); setErr("");
    try {
      const { GoogleAuthProvider, signInWithPopup, getAuth } = await import("firebase/auth");
      const auth = getAuth();
      await signInWithPopup(auth, new GoogleAuthProvider());
      onDone();
    } catch (e) {
      setErr(e.message?.replace("Firebase: ","")?.replace(/\(auth.*\)/,"")?.trim() || "Google sign-in failed.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", padding:"52px 28px 40px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
      <div>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontSize:44, lineHeight:1, marginBottom:8 }}>∑</div>
          <h1 style={{ fontSize:26, fontWeight:800, margin:"0 0 4px", letterSpacing:-0.8 }}>Almost there!</h1>
          <p style={{ color:"#6B7280", fontSize:13, margin:0 }}>
            {mode === "signup" ? "Create your account to save your progress." : "Welcome back! Sign in to continue."}
          </p>
        </div>

        {/* Saved choices summary */}
        {prefill && (
          <div style={{ background:"#0D1A2E", border:"1px solid #1B3460", borderRadius:14, padding:"12px 16px", marginBottom:24, display:"flex", gap:12, alignItems:"center" }}>
            <AppIcon name="check" size={16} color={ACC} />
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:ACC }}>Your selections are saved</div>
              <div style={{ fontSize:11, color:"#6B7280", marginTop:1 }}>{prefill.curriculumLabel} · {prefill.levelLabel}</div>
            </div>
          </div>
        )}

        {/* Google button */}
        <button onClick={handleGoogle} disabled={loading} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:12, background:"#FFF", border:"none", borderRadius:14, padding:"14px 18px", fontSize:15, fontWeight:600, cursor:loading?"not-allowed":"pointer", color:"#111", fontFamily:"inherit", marginBottom:16, boxShadow:"0 2px 12px rgba(0,0,0,.18)", transition:"all .2s", opacity:loading?.7:1 }}>
          <svg width={20} height={20} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <div style={{ flex:1, height:1, background:"#1E1E1E" }}/>
          <span style={{ color:"#3A3A3A", fontSize:12 }}>or</span>
          <div style={{ flex:1, height:1, background:"#1E1E1E" }}/>
        </div>

        {/* Email/password */}
        <input
          type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width:"100%", background:"#151515", border:"1.5px solid #222", borderRadius:12, padding:"14px 16px", color:"#FFF", fontSize:15, fontFamily:"inherit", outline:"none", marginBottom:10, display:"block" }}
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key==="Enter" && handleSubmit()}
          style={{ width:"100%", background:"#151515", border:"1.5px solid #222", borderRadius:12, padding:"14px 16px", color:"#FFF", fontSize:15, fontFamily:"inherit", outline:"none", marginBottom:4, display:"block" }}
        />

        {err && <p style={{ color:"#F87171", fontSize:12, margin:"8px 0 0", lineHeight:1.5 }}>{err}</p>}
      </div>

      <div style={{ marginTop:24 }}>
        <button onClick={handleSubmit} disabled={loading} style={{ width:"100%", background:loading?"#1A1A1A":"linear-gradient(135deg,#4F8CFF,#2563EB)", color:loading?"#444":"#FFF", border:"none", borderRadius:16, padding:18, fontSize:16, fontWeight:700, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit", boxShadow:loading?"none":"0 8px 28px rgba(79,140,255,.3)", transition:"all .2s", marginBottom:14 }}>
          {loading ? "Please wait…" : mode==="signup" ? "Create Account →" : "Sign In →"}
        </button>
        <p style={{ textAlign:"center", color:"#6B7280", fontSize:13, margin:0 }}>
          {mode==="signup" ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => { setMode(m => m==="signup"?"login":"signup"); setErr(""); }} style={{ color:ACC, fontWeight:700, cursor:"pointer" }}>
            {mode==="signup" ? "Sign in" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
}

function Onboarding({ onDone }) {
  // Steps: 0=welcome, 1=name, 2=curriculum, 3=level, 4=goal
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const MAX_NAME_LENGTH = 12;

  // Load saved choices from localStorage
  const saved = (() => { try { return JSON.parse(localStorage.getItem("theorem_choices") || "{}"); } catch { return {}; } })();
  const [curriculumId, setCurriculumId] = useState(saved.curriculumId || null);
  const [levelId, setLevelId] = useState(saved.levelId || null);
  const [goal, setGoal] = useState(saved.dailyGoal || 50);
  const [showSignup, setShowSignup] = useState(false);

  const TOTAL_STEPS = 4; // last onboarding question (goal)
  const ok = [true, name.trim().length>=2, !!curriculumId, !!levelId, true][step] ?? true;

  const curriculumList = Object.values(curriculumCatalog);
  const levels = curriculumId ? (curriculumCatalog[curriculumId]?.levels || []) : [];
  const goals = [
    {v:20,l:"Casual",s:"~5 min"},{v:50,l:"Regular",s:"~10 min"},
    {v:100,l:"Serious",s:"~20 min"},{v:200,l:"Intense",s:"~40 min"},
  ];
  const welcomeFeatures = [
    {
      title: "Structured skill trees",
      desc: "Follow a clear progression from fundamentals to mastery.",
      icon: "circle:12,5,2|circle:6,19,2|circle:18,19,2|path:M12 7v6|path:M12 13H6|path:M12 13h6",
    },
    {
      title: "Short interactive lessons",
      desc: "High-focus sessions designed for consistent daily progress.",
      icon: "path:M8 5v14l11-7z",
    },
    {
      title: "Streaks and XP",
      desc: "Build momentum with measurable goals and daily rewards.",
      icon: "path:M13 2L4 14h6l-1 8 9-12h-6z",
    },
    {
      title: "AI explanations",
      desc: "Get guided, step-by-step support whenever you get stuck.",
      icon: "path:M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-4 4v-4H6a2 2 0 0 1-2-2z|path:M8 9h8|path:M8 12h5",
    },
  ];

  const renderFeatureIcon = (spec) => {
    const parts = spec.split("|");
    return (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        {parts.map((part, idx) => {
          const [tag, value] = part.split(":");
          return tag === "circle"
            ? <circle key={idx} cx={value.split(",")[0]} cy={value.split(",")[1]} r={value.split(",")[2]} />
            : <path key={idx} d={value} />;
        })}
      </svg>
    );
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      // Save choices to localStorage whenever they change
      const choices = { curriculumId, levelId, dailyGoal: goal };
      try { localStorage.setItem("theorem_choices", JSON.stringify(choices)); } catch { /* Ignore private mode storage errors. */ }
      setStep(s => s + 1);
    } else {
      // step === 4 (goal step), go to signup
      const choices = { curriculumId, levelId, dailyGoal: goal };
      try { localStorage.setItem("theorem_choices", JSON.stringify(choices)); } catch { /* Ignore private mode storage errors. */ }
      setShowSignup(true);
    }
  };

  if (showSignup) {
    const curriculumLabel = curriculumCatalog[curriculumId]?.title || curriculumId;
    const levelLabel = (curriculumCatalog[curriculumId]?.levels || []).find(l => l.id === levelId)?.title || levelId;
    return (
      <SignupPage
        prefill={{ curriculumLabel: prettyLabel(curriculumLabel), levelLabel: prettyLabel(levelLabel) }}
        onDone={() => onDone({ curriculumId, levelId, dailyGoal: goal, displayName: name.trim() })}
      />
    );
  }

  return (
    <div style={{ minHeight:"100vh", padding:"56px 24px 40px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <div style={{ fontSize:50, lineHeight:1 }}>∑</div>
        <h1 style={{ fontSize:28, fontWeight:800, margin:"8px 0 4px", letterSpacing:-1 }}>Theorem</h1>
        <p style={{ color:"#6B7280", fontSize:13 }}>Master Mathematics. One lesson at a time.</p>
      </div>
      <div style={{ flex:1 }}>
        {step===0 && (
          <div style={{ animation:"fadeIn .35s ease" }}>
            <h2 style={{ fontSize:24, fontWeight:800, marginBottom:8, letterSpacing:-.4 }}>Welcome to your math studio</h2>
            <p style={{ color:"#9CA3AF", lineHeight:1.7, marginBottom:20 }}>A premium learning flow built for steady progress, sharper intuition, and consistent results.</p>
            <div style={{ background:"linear-gradient(145deg,#131313,#0E0E0E)", border:"1px solid #222", borderRadius:18, padding:16, marginBottom:12, boxShadow:"inset 0 1px 0 rgba(255,255,255,.05), 0 16px 30px rgba(0,0,0,.24)" }}>
              {welcomeFeatures.map((item, idx) => (
                <div key={item.title} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 4px", borderBottom: idx < welcomeFeatures.length - 1 ? "1px solid #1D1D1D" : "none" }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:"#0E1B2E", color:ACC, display:"grid", placeItems:"center", flexShrink:0, border:"1px solid #1C365F" }}>
                    {renderFeatureIcon(item.icon)}
                  </div>
                  <div>
                    <div style={{ color:"#E5E7EB", fontWeight:700, fontSize:14 }}>{item.title}</div>
                    <div style={{ color:"#6B7280", fontSize:12, lineHeight:1.5, marginTop:2 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {step===1 && (
          <div style={{ animation:"fadeIn .35s ease" }}>
            <h2 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>What's your name?</h2>
            <p style={{ color:"#9CA3AF", fontSize:13, marginBottom:18 }}>We'll use this to personalise your experience.</p>
            <input
              autoFocus
              type="text"
              placeholder="Your first name"
              value={name}
              maxLength={MAX_NAME_LENGTH}
              onChange={e => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
              onKeyDown={e => e.key==="Enter" && name.trim().length>=2 && handleNext()}
              style={{ width:"100%", background:"#151515", border:`1.5px solid ${name.trim().length>=2?ACC:"#222"}`, borderRadius:14, padding:"16px 18px", color:"#FFF", fontSize:17, fontFamily:"inherit", outline:"none", display:"block", transition:"border-color .2s" }}
            />
            {name.trim().length > 0 && name.trim().length < 2 && (
              <p style={{ color:"#F87171", fontSize:12, marginTop:8 }}>Please enter at least 2 characters.</p>
            )}
          </div>
        )}
        {step===2 && (
          <div style={{ animation:"fadeIn .35s ease" }}>
            <h2 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Pick your curriculum</h2>
            <p style={{ color:"#9CA3AF", fontSize:13, marginBottom:18 }}>We'll tailor your skill tree to match.</p>
            {curriculumList.map(c => (
              <button
                key={c.id}
                onClick={() => { setCurriculumId(c.id); setLevelId(null); }}
                style={{
                  width:"100%", display:"block", marginBottom:9,
                  background: curriculumId===c.id ? "#0D1A2E" : "#151515",
                  border:`1.5px solid ${curriculumId===c.id ? ACC : "#1E1E1E"}`,
                  borderRadius:14, padding:"15px 18px", textAlign:"left",
                  cursor:"pointer", color: curriculumId===c.id ? ACC : "#FFF",
                  fontWeight:600, fontSize:15, fontFamily:"inherit", transition:"all .2s"
                }}
              >
                {prettyLabel(c.title)}
              </button>
            ))}
          </div>
        )}
        {step===3 && (
          <div style={{ animation:"fadeIn .35s ease" }}>
            <h2 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Your current level?</h2>
            <p style={{ color:"#9CA3AF", fontSize:13, marginBottom:18 }}>Start right where you belong.</p>
            {levels.map(l => (
              <button
                key={l.id}
                onClick={() => setLevelId(l.id)}
                style={{
                  width:"100%", display:"block", marginBottom:9,
                  background: levelId===l.id ? "#0D1A2E" : "#151515",
                  border:`1.5px solid ${levelId===l.id ? ACC : "#1E1E1E"}`,
                  borderRadius:14, padding:"14px 18px", textAlign:"left",
                  cursor:"pointer", fontFamily:"inherit", transition:"all .2s"
                }}
              >
                <div style={{ color: levelId===l.id ? ACC : "#FFF", fontWeight:700, fontSize:15, marginBottom:2 }}>{prettyLabel(l.title)}</div>
              </button>
            ))}
          </div>
        )}
        {step===4 && (
          <div style={{ animation:"fadeIn .35s ease" }}>
            <h2 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Daily XP goal</h2>
            <p style={{ color:"#9CA3AF", fontSize:13, marginBottom:18 }}>How much time do you want to invest daily?</p>
            {goals.map(({v,l,s}) => (
              <button key={v} onClick={() => setGoal(v)} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:9, background:goal===v?"#0D1A2E":"#151515", border:`1.5px solid ${goal===v?ACC:"#1E1E1E"}`, borderRadius:14, padding:"14px 18px", cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}>
                <div>
                  <div style={{ color:goal===v?ACC:"#FFF", fontWeight:700, fontSize:15 }}>{l}</div>
                  <div style={{ color:"#6B7280", fontSize:12 }}>{s}/day</div>
                </div>
                <div style={{ color:ACC, fontWeight:800, fontSize:17 }}>{v} XP</div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:18 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ width:i===step?22:6, height:6, borderRadius:999, background:i===step?ACC:"#222", transition:"all .3s" }}/>
          ))}
        </div>
        <button onClick={handleNext} disabled={!ok}
          style={{ width:"100%", background:ok?"linear-gradient(135deg,#4F8CFF,#2563EB)":"#1A1A1A", color:ok?"#FFF":"#444", border:"none", borderRadius:16, padding:18, fontSize:16, fontWeight:700, cursor:ok?"pointer":"not-allowed", fontFamily:"inherit", boxShadow:ok?"0 8px 28px rgba(79,140,255,.3)":"none", transition:"all .2s" }}>
          {step===4 ? "Create Account →" : "Continue"}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  HOME SCREEN
// ════════════════════════════════════════════════════════════════

function Home({ ud, skills, startLesson, skillMeta, allLessons, userName, onOpenSettings }) {
  const totalXP = ud.xp + Object.values(skills).reduce((s,k) => s+(k.xp||0), 0);
  const dayXP   = Math.min(ud.xp % (ud.dailyGoal || 50) + 30, ud.dailyGoal);
  const days    = ["M","T","W","T","F","S","S"];
  const doneDays = buildWeeklyStreakDays(ud.streak, ud.lastStreakDate);
  const activeSkill = (skillMeta || []).find(s => !skills[s.id]?.mastered && !isLocked(s.id, skills, skillMeta));
  const masteredCount = (skillMeta || []).filter(s => skills[s.id]?.mastered).length;
  const displayName = userName || "Learner";

  const now = Date.now();
  const dueForReview = (skillMeta || []).filter(s => {
    const sk = skills[s.id];
    return sk?.mastered && sk.reviewDue && sk.reviewDue <= now;
  }).map(s => {
    const daysOverdue = Math.floor((now - skills[s.id].reviewDue) / 86_400_000);
    return { ...s, daysOverdue };
  });

  const recs = (skillMeta || [])
    .filter(s => !isLocked(s.id, skills, skillMeta) && !skills[s.id]?.mastered)
    .slice(0, 3)
    .map(s => ({ title:s.title, skillId:s.id, time:"5 min", xp:s.xpReward/5|0 }));

  return (
    <div className="screen-enter" style={{ overflowY:"auto", height:"100vh", paddingBottom:80 }}>
      <div style={{ padding:"52px 24px 0" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:14 }}>
          <div>
            <p style={{ color:"#6B7280", fontSize:11, letterSpacing:.8, margin:0 }}>
            {new Date().toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"}).toUpperCase()}
            </p>
            <h1 style={{ fontSize:23, fontWeight:800, margin:"4px 0 0", letterSpacing:-.5 }}>
              Welcome back, {displayName}
            </h1>
          </div>
          <button
            onClick={onOpenSettings}
            className="interactive-press"
            aria-label="Open settings"
          style={{
            minWidth:38,
            height:38,
            borderRadius:0,
            border:"none",
            background:"transparent",
            color:"#9CA3AF",
            cursor:"pointer",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
              flexShrink:0,
            }}
          >
            <AppIcon name="settings" size={19} color="#9CA3AF" />
          </button>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginTop:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, background:"#1E1A10", border:"1px solid #3D2E00", borderRadius:20, padding:"5px 11px" }}>
            <AppIcon name="streak" size={24} color="#F59E0B" />
            <span style={{ color:"#F59E0B", fontWeight:700, fontSize:13 }}>{ud.streak}d</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5, background:"#0D1A2E", border:"1px solid #1B3460", borderRadius:20, padding:"5px 11px" }}>
            <AppIcon name="xp" size={20} color={ACC} />
            <span style={{ color:ACC, fontWeight:700, fontSize:13 }}>{totalXP} XP</span>
          </div>
        </div>
      </div>

      <div style={{ padding:"18px 24px 0", display:"flex", flexDirection:"column", gap:14 }}>
        {/* Daily Goal */}
        <div className="glass-card" style={{ background:"#111317", borderRadius:20, padding:18 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:9 }}>
            <span style={{ fontWeight:700, fontSize:14 }}>Daily Goal</span>
            <span style={{ color:ACC, fontWeight:700, fontSize:12 }}>{Math.min(dayXP,ud.dailyGoal)} / {ud.dailyGoal} XP</span>
          </div>
          <XPBar current={Math.min(dayXP,ud.dailyGoal)} max={ud.dailyGoal}/>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:13 }}>
            {days.map((d,i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <div style={{ width:29, height:29, borderRadius:9, background:doneDays[i]?"#0D1A2E":"#1A1A1A", border:`1.5px solid ${doneDays[i]?ACC:"#252525"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:ACC }}>
                  {doneDays[i] ? <AppIcon name="check" size={12} color={ACC} /> : null}
                </div>
                <span style={{ fontSize:9, color:"#444" }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Learning */}
        {activeSkill ? (
          <div className="tap-card glass-card elevated-card interactive-press continue-card" onClick={() => startLesson(activeSkill.id)} style={{ borderRadius:20, padding:20, cursor:"pointer", position:"relative", overflow:"hidden" }}>
            <div className="continue-ambient" />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <span style={{ fontSize:10, color:ACC, fontWeight:700, letterSpacing:1 }}>CONTINUE LEARNING</span>
                <h3 style={{ fontSize:19, fontWeight:800, margin:"5px 0 3px", letterSpacing:-.3 }}>{prettyLabel(activeSkill.title)}</h3>
                <p style={{ color:"#9CA3AF", fontSize:12, margin:0 }}>
                  {allLessons?.[activeSkill.id]?.length || 0} questions · Tap to start
                </p>
              </div>
              <div className="play-orb" style={{ borderRadius:12, width:46, height:46, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <AppIcon name="play" size={19} color="#E0E7FF" />
              </div>
            </div>
            <div style={{ marginTop:12 }}>
              <XPBar current={skills[activeSkill.id]?.progress||0} max={allLessons?.[activeSkill.id]?.length||1}/>
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ background:"linear-gradient(135deg,rgba(6, 24, 12, .88),rgba(4, 18, 10, .78))", borderRadius:20, padding:20, border:"1px solid #166534", textAlign:"center" }}>
            <div style={{ marginBottom:8, display:"flex", justifyContent:"center" }}><AppIcon name="graduation" size={32} color="#4ADE80" /></div>
            <h3 style={{ fontSize:17, fontWeight:800, color:"#4ADE80", margin:"0 0 4px" }}>All topics mastered!</h3>
            <p style={{ color:"#6B7280", fontSize:13, margin:0 }}>You've completed the entire skill tree.</p>
          </div>
        )}

        {/* Summary cards */}
        <div style={{ display:"flex", gap:10, alignItems:"stretch" }}>
          <div className="glass-card stat-tile" style={{ background:"#111317", flex:1, borderRadius:16, padding:14, textAlign:"center", minHeight:138, display:"grid", gridTemplateRows:"52px 20px 16px", rowGap:3, alignContent:"center", justifyItems:"center" }}>
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center" }}><MasteredGlyph size={34} /></div>
            <div style={{ fontWeight:800, fontSize:20, color:"#10B981", lineHeight:1 }}>{masteredCount}</div>
            <div style={{ color:"#6B7280", fontSize:11 }}>Mastered</div>
          </div>
          <div className="glass-card stat-tile" style={{ background:"#111317", flex:1, borderRadius:16, padding:14, textAlign:"center", minHeight:138, display:"grid", gridTemplateRows:"52px 20px 16px", rowGap:3, alignContent:"center", justifyItems:"center" }}>
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center" }}><StreakFlame streak={ud.streak} /></div>
            <div style={{ fontWeight:800, fontSize:20, color:"#F59E0B", lineHeight:1 }}>{ud.streak}</div>
            <div style={{ color:"#6B7280", fontSize:11 }}>Day Streak</div>
          </div>
          <div className="glass-card stat-tile" style={{ background:"#111317", flex:1, borderRadius:16, padding:14, textAlign:"center", minHeight:138, display:"grid", gridTemplateRows:"52px 20px 16px", rowGap:3, alignContent:"center", justifyItems:"center" }}>
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center" }}><AppIcon name="xp" size={34} color={ACC} /></div>
            <div style={{ fontWeight:800, fontSize:20, color:ACC, lineHeight:1 }}>{totalXP}</div>
            <div style={{ color:"#6B7280", fontSize:11 }}>Total XP</div>
          </div>
        </div>

        {/* Due for Review */}
        {dueForReview.length > 0 && (
          <div>
            <h2 style={{ fontSize:15, fontWeight:700, margin:"0 0 10px" }}>Due for Review</h2>
            <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:4 }}>
              {dueForReview.map(s => (
                <div key={s.id} onClick={() => startLesson(s.id)} className="tap-card glass-card interactive-press" style={{ background:"linear-gradient(145deg, rgba(34, 11, 18, .86), rgba(19, 7, 10, .82))", border:"1px solid rgba(248, 113, 113, .45)", borderRadius:15, padding:14, minWidth:140, cursor:"pointer", flexShrink:0 }}>
                  <div style={{ marginBottom:7, display:"flex", alignItems:"center" }}>
                    <SkillGlyph skill={s} size={24} color={ACC} />
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, lineHeight:1.4, marginBottom:7, color:"#FFF" }}>{prettyLabel(s.title)}</div>
                  <div style={{ fontSize:11, color:"#F87171", fontWeight:600 }}>
                    {s.daysOverdue === 0 ? "Due today" : `Overdue ${s.daysOverdue}d`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended */}
        {recs.length > 0 && (
          <div>
            <h2 style={{ fontSize:15, fontWeight:700, margin:"0 0 10px" }}>Recommended</h2>
            <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:4 }}>
              {recs.map((r,i) => (
                <div key={i} onClick={() => startLesson(r.skillId)} className="tap-card glass-card interactive-press" style={{ borderRadius:15, padding:14, minWidth:140, cursor:"pointer", flexShrink:0 }}>
                  <div style={{ marginBottom:7, display:"flex", alignItems:"center" }}>
                    <SkillGlyph skill={{ id:r.skillId, title:r.title }} size={24} color={ACC} />
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, lineHeight:1.4, marginBottom:7 }}>{prettyLabel(r.title)}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:11, color:"#6B7280" }}>{r.time}</span>
                    <span style={{ fontSize:11, color:ACC, fontWeight:700 }}>+{r.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SKILL TREE SCREEN
// ════════════════════════════════════════════════════════════════

function SkillTree({ skills, startLesson, startDeepDive, skillMeta, allLessons, deepDive }) {
  const [modal, setModal] = useState(null);

  return (
    <div className="screen-enter" style={{ overflowY:"auto", height:"100vh", paddingBottom:80 }}>
      <div className="glass-card" style={{ margin:"52px 24px 16px", borderRadius:20, padding:"16px 18px" }}>
        <h1 style={{ fontSize:26, fontWeight:800, margin:"0 0 2px" }}>Skill Tree</h1>
        <p style={{ color:"#6B7280", fontSize:13, margin:0 }}>Unlock topics by mastering prerequisites</p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"0 24px 20px" }}>
        {(skillMeta || []).map((skill, i) => {
          const locked   = isLocked(skill.id, skills, skillMeta);
          const mastered = skills[skill.id]?.mastered;
          const active   = !locked && !mastered;
          const progress = skills[skill.id]?.progress || 0;
          const total    = allLessons?.[skill.id]?.length || 1;
          const isLeft   = i % 2 === 0;

          return (
            <div key={skill.id} style={{ display:"flex", flexDirection:"column", alignItems:"center", width:"100%", animation:"fadeIn .3s ease both", animationDelay:`${i*0.06}s` }}>
              {i > 0 && (
                <div style={{ width:2, height:28, background: mastered?ACC:"#1E1E1E", transition:"background .3s" }}/>
              )}
              <div style={{ display:"flex", alignItems:"center", width:"100%", justifyContent:isLeft?"flex-start":"flex-end", gap:14 }}>
                {!isLeft && (
                  <div style={{ flex:1, textAlign:"right", animation:"slideIn .3s ease both", animationDelay:`${i*0.06+0.05}s` }}>
                    <div style={{ fontSize:14, fontWeight:700, color:locked?"#2A2A2A":"#FFF" }}>{prettyLabel(skill.title)}</div>
                    <div style={{ fontSize:11, color:locked?"#1E1E1E":"#6B7280", marginTop:2 }}>
                      {mastered ? "Mastered" : active ? `${progress}/${total} done` : locked ? "Locked" : "Available"} · {skill.xpReward} XP
                    </div>
                  </div>
                )}
                <button onClick={() => !locked && setModal(skill)} className="skill-node" style={{
                  width:68, height:68, borderRadius:"50%", flexShrink:0,
                  border:`3px solid ${mastered ? "#7BAAFF" : active ? ACC : "rgba(148, 163, 184, .26)"}`,
                  background:mastered || active ? "linear-gradient(145deg, rgba(13, 26, 46, .92), rgba(7, 18, 38, .88))" : "rgba(8, 11, 19, .74)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  cursor:locked?"not-allowed":"pointer",
                  boxShadow:active ? "0 0 20px rgba(79,140,255,.45),0 0 40px rgba(79,140,255,.15)" : mastered ? "0 0 16px rgba(79,140,255,.2)" : "none",
                  position:"relative", fontFamily:"inherit",
                }}>
                  {locked
                    ? <AppIcon name="lock" size={18} color="#2A2A2A" />
                    : <SkillGlyph skill={skill} size={24} color={mastered||active?ACC:"#64748B"} />
                  }
                  {mastered && (
                    <div style={{ position:"absolute", bottom:-4, right:-4, background:"#0B0B0B", borderRadius:"50%", width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", border:"1.5px solid #4F8CFF" }}>
                      <MasteredGlyph size={11} />
                    </div>
                  )}
                </button>
                {isLeft && (
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:locked?"#2A2A2A":"#FFF" }}>{prettyLabel(skill.title)}</div>
                    <div style={{ fontSize:11, color:locked?"#1E1E1E":"#6B7280", marginTop:2 }}>
                      {mastered ? "Mastered" : active ? `${progress}/${total} done` : locked ? "Locked" : "Available"} · {skill.xpReward} XP
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.8)", backdropFilter:"blur(4px)", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center", animation:"fadeIn .18s ease" }}>
          <div onClick={e => e.stopPropagation()} className="glass-card" style={{ background:"linear-gradient(150deg, rgba(17, 21, 34, .94), rgba(8, 12, 24, .92))", border:"1px solid rgba(148, 163, 184, .24)", borderRadius:"24px 24px 0 0", padding:"26px 24px 40px", width:"100%", maxWidth:430, animation:"slideUp .28s cubic-bezier(.34,1.56,.64,1)" }}>
            {/* Pull handle */}
            <div style={{ width:36, height:4, borderRadius:999, background:"#2A2A2A", margin:"0 auto 20px" }}/>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
              <div className="glass-card" style={{ width:50, height:50, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", color:ACC }}>
                <SkillGlyph skill={modal} size={24} color={ACC} />
              </div>
              <div>
                <h2 style={{ fontSize:19, fontWeight:800, margin:"0 0 2px" }}>{prettyLabel(modal.title)}</h2>
                <div style={{ color:"#6B7280", fontSize:12 }}>+{modal.xpReward} XP on completion</div>
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ color:"#9CA3AF", fontSize:12 }}>Lesson progress</span>
                <span style={{ color:ACC, fontSize:12, fontWeight:700 }}>{skills[modal.id]?.progress||0} / {allLessons?.[modal.id]?.length||0}</span>
              </div>
              <XPBar current={skills[modal.id]?.progress||0} max={allLessons?.[modal.id]?.length||1}/>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:18 }}>
              {allLessons?.[modal.id]?.filter(q => q.type==="explanation").map(q => (
                <div key={q.id} className="glass-card" style={{ borderRadius:8, padding:"4px 10px", fontSize:12, color:"#9CA3AF" }}>{prettyLabel(q.title)}</div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => { setModal(null); startLesson(modal.id); }} style={{ width:"100%", background:"linear-gradient(135deg,#4F8CFF,#2563EB)", color:"#FFF", border:"none", borderRadius:16, padding:17, fontSize:16, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 8px 28px rgba(79,140,255,.3)", marginBottom: skills[modal.id]?.mastered && deepDive?.[modal.id]?.length ? 10 : 0 }}>
              {skills[modal.id]?.mastered ? "Review Lesson →" : skills[modal.id]?.progress > 0 ? "Continue →" : "Start Lesson →"}
            </button>
            {skills[modal.id]?.mastered && deepDive?.[modal.id]?.length > 0 && (
              <button className="btn-primary interactive-press" onClick={() => { setModal(null); startDeepDive(modal.id); }} style={{ width:"100%", background:"rgba(11, 24, 48, .75)", border:"1.5px solid #1D4ED8", borderRadius:16, padding:15, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", color:"#60A5FA", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <AppIcon name="sparkle" size={14} color="#60A5FA" /> Deep Dive ({deepDive[modal.id].length} challenges)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  LESSON ENGINE  (adaptive difficulty queue + reflection)
// ════════════════════════════════════════════════════════════════

/**
 * Build the initial question queue from a flat question array.
 * Order: explanation first, then difficulty-1 questions, then difficulty-2, then difficulty-3+, then reflections.
 */
function buildInitialQueue(questions) {
  const explanations  = questions.filter(q => q.type === "explanation");
  const reflections   = questions.filter(q => q.type === "reflection");
  const tier1         = questions.filter(q => q.type !== "explanation" && q.type !== "reflection" && (q.difficulty||1) === 1);
  const tier2         = questions.filter(q => q.type !== "explanation" && q.type !== "reflection" && (q.difficulty||1) === 2);
  const tier3         = questions.filter(q => q.type !== "explanation" && q.type !== "reflection" && (q.difficulty||1) >= 3);
  return [...explanations, ...tier1, ...tier2, ...tier3, ...reflections];
}

function LessonEngine({ skillId, questions: questionsProp, onComplete, onExit, allLessons, isDeepDive }) {
  const baseQs = questionsProp || allLessons?.[skillId] || [];

  // Adaptive queue — mutable ref so insertions don't cause re-renders
  const queueRef = useRef(buildInitialQueue(baseQs));
  const [queueIdx,      setQueueIdx]      = useState(0);
  const [sel,           setSel]           = useState(null);
  const [fill,          setFill]          = useState("");
  const [sub,           setSub]           = useState(false);
  const [correct,       setCorrect]       = useState(null);
  const [xp,            setXp]            = useState(0);
  const [xpFloat,       setXpFloat]       = useState(false);
  const [shake,         setShake]         = useState(false);
  const [aiText,        setAiText]        = useState("");
  const [aiLoad,        setAiLoad]        = useState(false);
  const [done,          setDone]          = useState(false);
  const [mistakes,      setMistakes]      = useState(0);
  const [correctInARow, setCorrectInARow] = useState(0);
  const [currentTier,   setCurrentTier]   = useState(1);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount,  setCorrectCount]  = useState(0);
  const qStart = useRef(Date.now());

  const queue = queueRef.current;
  const q     = queue[queueIdx];

  if (!q) return null;

  const totalQuestions = queue.length;
  const progressPct    = (queueIdx / Math.max(totalQuestions, 1)) * 100;

  const fetchAI = async (question, wrong) => {
    setAiLoad(true); setAiText("");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:500,
          system:"You are an encouraging math tutor. Give a concise step-by-step explanation in 3 numbered steps using simple language. End with one short motivating line.",
          messages:[{ role:"user", content:`Question: "${question.question}"\nStudent's answer: "${wrong}"\nCorrect answer: "${question.type==="multiple_choice"?question.options[question.answer]:question.answer}"\n\nExplain how to get the correct answer.`}]
        })
      });
      const d = await r.json();
      setAiText(d.content?.map(b=>b.text||"").join("")||question.explanation||"Review the hint and try again!");
    } catch {
      setAiText(question.explanation||"Check your working carefully!");
    }
    setAiLoad(false);
  };

  const submit = () => {
    if (q.type === "explanation") { advance(); return; }
    if (q.type === "reflection")  { advance(true); return; }

    const elapsed = (Date.now() - qStart.current) / 1000;
    let ok = false, wrong = "";
    if (q.type === "multiple_choice" || q.type === "application") {
      ok    = sel === q.answer;
      wrong = (q.options && q.options[sel]) || "no answer";
    }
    if (q.type === "fill_blank") {
      ok    = fill.trim().toLowerCase() === String(q.answer).trim().toLowerCase();
      wrong = fill || "blank";
    }

    setSub(true); setCorrect(ok);
    setAnsweredCount(c => c + 1);

    if (ok) {
      const gained = (elapsed < 5 ? 15 : 10) + (q.difficulty || 1) * 5;
      setXp(x => x + gained);
      setXpFloat(true);
      setTimeout(() => setXpFloat(false), 1500);
      setCorrectCount(c => c + 1);

      // Adaptive: advance tier after 2 correct in a row
      const newCiR = correctInARow + 1;
      setCorrectInARow(newCiR);
      if (newCiR >= 2 && currentTier < 3) {
        const nextTier = currentTier + 1;
        setCurrentTier(nextTier);
        // Inject one harder question from the remaining queue if not already scheduled
        const nextTierQs = baseQs.filter(bq =>
          (bq.difficulty || 1) === nextTier &&
          !queue.slice(queueIdx + 1).some(existing => existing.id === bq.id)
        );
        if (nextTierQs.length > 0) {
          queue.splice(queueIdx + 1, 0, nextTierQs[0]);
        }
      }
    } else {
      setMistakes(m => m + 1);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setCorrectInARow(0);
      fetchAI(q, wrong);

      // Adaptive: insert a remedial difficulty-1 question after the current one
      const remedial = baseQs.find(bq =>
        (bq.difficulty || 1) === 1 &&
        bq.type !== "explanation" &&
        bq.type !== "reflection" &&
        bq.id !== q.id &&
        !queue.slice(0, queueIdx + 1).some(existing => existing.id === bq.id)
      );
      if (remedial) {
        queue.splice(queueIdx + 1, 0, { ...remedial, id: remedial.id + "_retry" });
      }
    }
  };

  const advance = (isReflection = false) => {
    if (isReflection) {
      setXp(x => x + 10); // fixed XP for reflection
    }
    if (queueIdx + 1 >= queue.length) { setDone(true); return; }
    setQueueIdx(i => i + 1);
    setSel(null); setFill(""); setSub(false); setCorrect(null);
    setAiText(""); setAiLoad(false);
    qStart.current = Date.now();
  };

  const canSubmit =
    q.type === "explanation" ||
    (q.type === "reflection" && fill.trim().length > 0) ||
    sel !== null ||
    (fill !== "" && q.type !== "reflection");

  const practiceTotal = queue.filter(qq => qq.type !== "explanation" && qq.type !== "reflection").length;

  if (done) return (
    <LessonDone
      xp={xp}
      mistakes={mistakes}
      total={practiceTotal}
      isDeepDive={isDeepDive}
      onContinue={() => onComplete(xp, queue.length, correctCount, answeredCount)}
    />
  );

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:"var(--bg-base)", overflow:"hidden" }}>
      {/* Top */}
      <div style={{ padding:"50px 24px 12px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <button onClick={onExit} style={{ background:"none", border:"none", color:"#555", cursor:"pointer", padding:4, fontFamily:"inherit", lineHeight:1, display:"flex", alignItems:"center", justifyContent:"center" }}><AppIcon name="close" size={20} color="#555" /></button>
        <div style={{ flex:1 }}>
          <div style={{ background:"rgba(10, 14, 25, .9)", borderRadius:999, height:7, overflow:"hidden", border:"1px solid rgba(148, 163, 184, .18)" }}>
            <div style={{ height:"100%", width:`${progressPct}%`, background:"linear-gradient(90deg,#4F8CFF,#7BAAFF)", borderRadius:999, transition:"width .5s ease", boxShadow:"0 0 8px rgba(79,140,255,.5)" }}/>
          </div>
        </div>
        <span style={{ color:ACC, fontWeight:700, fontSize:12, minWidth:52, textAlign:"right" }}>+{xp} XP</span>
      </div>

      {xpFloat && (
        <div style={{ position:"absolute", top:90, right:22, color:ACC, fontWeight:800, fontSize:19, animation:"floatUp 1.4s ease forwards", zIndex:10, pointerEvents:"none" }}>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}>+{(q.difficulty||1)*5+10} <AppIcon name="xp" size={16} color={ACC} /></span>
        </div>
      )}

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", padding:"4px 24px 14px", animation:shake?"shake .5s ease":"none" }}>
        {q.type === "explanation"
          ? <ExplCard q={q}/>
          : q.type === "reflection"
          ? <ReflectionCard q={q} text={fill} setText={setFill}/>
          : <QCard q={q} sel={sel} setSel={setSel} fill={fill} setFill={setFill} submitted={sub} correct={correct}/>
        }
        {aiLoad && (
          <div className="glass-card" style={{ marginTop:14, border:"1px solid #1B3460", borderRadius:16, padding:16 }}>
            <div style={{ color:"#6B7280", fontSize:13, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ animation:"pulse 1s infinite" }}>●</span> Generating explanation…
            </div>
          </div>
        )}
        {aiText && !aiLoad && (
          <div className="glass-card" style={{ marginTop:14, border:"1px solid #1B3460", borderRadius:16, padding:16, animation:"slideUp .3s ease" }}>
            <span className="glass-card" style={{ background:"linear-gradient(145deg, rgba(13, 26, 46, .75), rgba(7, 17, 36, .64))", borderRadius:7, padding:"3px 8px", fontSize:10, color:ACC, fontWeight:700, display:"inline-flex", alignItems:"center", gap:6 }}><AppIcon name="sparkle" size={11} color={ACC} /> AI EXPLANATION</span>
            <p style={{ color:"#D1D5DB", fontSize:14, lineHeight:1.8, margin:"10px 0 0", whiteSpace:"pre-wrap" }}>{aiText}</p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding:"8px 24px 28px", flexShrink:0 }}>
        {!sub ? (
          <button className="btn-primary" onClick={submit} disabled={!canSubmit} style={{ width:"100%", background:canSubmit?"linear-gradient(135deg,#4F8CFF,#2563EB)":"#1A1A1A", color:canSubmit?"#FFF":"#444", border:"none", borderRadius:16, padding:18, fontSize:16, fontWeight:700, cursor:canSubmit?"pointer":"not-allowed", fontFamily:"inherit", boxShadow:canSubmit?"0 8px 28px rgba(79,140,255,.28)":"none", transition:"all .2s" }}>
            {q.type === "explanation" ? "Got it →" : q.type === "reflection" ? "Submit Reflection →" : "Check Answer"}
          </button>
        ) : (
          <div>
            {q.type !== "reflection" && (
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, padding:"11px 14px", background:correct?"#0A1A0A":"#1A0A0A", border:`1px solid ${correct?"#166534":"#7F1D1D"}`, borderRadius:12 }}>
                <span style={{ display:"inline-flex" }}>{correct?<AppIcon name="success" size={17} color="#4ADE80" />:<AppIcon name="error" size={17} color="#F87171" />}</span>
                <span style={{ fontWeight:700, color:correct?"#4ADE80":"#F87171", fontSize:14 }}>
                  {correct ? "Correct!" : (q.type === "multiple_choice" || q.type === "application") ? `Answer: ${q.options?.[q.answer]}` : `Answer: ${q.answer}`}
                </span>
              </div>
            )}
            <button className="btn-primary" onClick={() => advance(q.type === "reflection")} style={{ width:"100%", background:"linear-gradient(135deg,#4F8CFF,#2563EB)", color:"#FFF", border:"none", borderRadius:16, padding:18, fontSize:16, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 8px 28px rgba(79,140,255,.28)" }}>
              {queueIdx + 1 >= queue.length ? "Finish" : "Next →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ReflectionCard({ q, text, setText }) {
  return (
    <div>
      <div style={{ marginBottom:14 }}>
        <span style={{ fontSize:10, color:"#60A5FA", fontWeight:700, letterSpacing:1 }}>REFLECTION</span>
        <h2 style={{ fontSize:19, fontWeight:800, margin:"6px 0 0", letterSpacing:-.3 }}>Explain It In Your Own Words</h2>
      </div>
      <div className="glass-card" style={{ background:"linear-gradient(145deg, rgba(11, 24, 48, .86), rgba(8, 17, 35, .82))", borderRadius:16, padding:18, border:"1px solid #1E3A8A", marginBottom:14 }}>
        <p style={{ color:"#93C5FD", lineHeight:1.85, fontSize:14.5, margin:0 }}>{q.prompt}</p>
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type your explanation here…"
        rows={5}
        style={{ width:"100%", background:"rgba(10, 14, 25, .75)", border:"1.5px solid #1E3A8A", borderRadius:14, padding:16, color:"#FFF", fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box", resize:"vertical", lineHeight:1.7 }}
      />
      <p style={{ color:"#6B7280", fontSize:12, marginTop:8 }}>No right or wrong — just your own understanding. +10 XP for completing.</p>
    </div>
  );
}

function ExplCard({ q }) {
  return (
    <div>
      <div style={{ marginBottom:14 }}>
        <span style={{ fontSize:10, color:ACC, fontWeight:700, letterSpacing:1 }}>CONCEPT</span>
        <h2 style={{ fontSize:20, fontWeight:800, margin:"5px 0 0", letterSpacing:-.3 }}>{prettyLabel(q.title)}</h2>
      </div>
      <div className="glass-card" style={{ borderRadius:16, padding:18 }}>
        <p style={{ color:"#D1D5DB", lineHeight:1.85, fontSize:14.5, whiteSpace:"pre-wrap", margin:0 }}>{q.content}</p>
      </div>
      {q.example && (
        <div className="glass-card" style={{ marginTop:12, background:"linear-gradient(145deg, rgba(11, 24, 48, .85), rgba(8, 20, 42, .8))", borderRadius:14, padding:16, border:"1px solid #1B3460" }}>
          <span style={{ fontSize:10, color:ACC, fontWeight:700, letterSpacing:1, display:"block", marginBottom:7 }}>EXAMPLE</span>
          <p style={{ color:"#93C5FD", fontFamily:"monospace", fontSize:14, margin:0, lineHeight:1.75, whiteSpace:"pre-wrap" }}>{q.example}</p>
        </div>
      )}
    </div>
  );
}

function QCard({ q, sel, setSel, fill, setFill, submitted, correct }) {
  const diffColors = { 1:"#4ADE80", 2:ACC, 3:"#F59E0B", 4:"#60A5FA" };
  const diffLabels = { 1:"BEGINNER", 2:"INTERMEDIATE", 3:"ADVANCED", 4:"CHALLENGE" };
  const isChoiceType = q.type === "multiple_choice" || q.type === "application";
  return (
    <div>
      <span style={{ fontSize:10, color:diffColors[q.difficulty||1]||ACC, fontWeight:700, letterSpacing:1, display:"block", marginBottom:9 }}>{diffLabels[q.difficulty||1] || "QUESTION"}</span>
      <h2 style={{ fontSize:18, fontWeight:800, marginBottom:20, lineHeight:1.5, letterSpacing:-.3 }}>{q.question}</h2>
      {isChoiceType && (
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {(q.options || []).map((opt,i) => {
            let bg="rgba(13, 18, 32, .72)", bd="rgba(148, 163, 184, .24)", col="#FFF";
            if (submitted){
              if (i===q.answer){ bg="#0A1A0A"; bd="#166534"; col="#4ADE80"; }
              else if (i===sel&&!correct){ bg="#1A0A0A"; bd="#7F1D1D"; col="#F87171"; }
            } else if (sel===i){ bg="#0D1A2E"; bd=ACC; col=ACC; }
            return (
              <button key={i} onClick={()=>!submitted&&setSel(i)} className="interactive-press" style={{ background:bg, border:`1.5px solid ${bd}`, borderRadius:13, padding:"14px 16px", textAlign:"left", cursor:submitted?"default":"pointer", color:col, fontWeight:600, fontSize:15, transition:"all .18s", fontFamily:"inherit", backdropFilter:"blur(10px)" }}>
                <span style={{ color:"#555", marginRight:10, fontSize:12 }}>{String.fromCharCode(65+i)}.</span>{opt}
              </button>
            );
          })}
        </div>
      )}
      {q.type === "fill_blank" && (
        <div>
          <input type="text" value={fill} onChange={e=>!submitted&&setFill(e.target.value)} placeholder="Your answer…"
            style={{ width:"100%", background:"#151515", border:`1.5px solid ${submitted?(correct?"#166534":"#7F1D1D"):fill?ACC:"#1E1E1E"}`, borderRadius:14, padding:"17px", color:"#FFF", fontSize:18, fontWeight:700, fontFamily:"inherit", outline:"none", boxSizing:"border-box", textAlign:"center", transition:"border .2s" }}
          />
          {q.hint && !submitted && (
            <p style={{ color:"#6B7280", fontSize:12, marginTop:9, textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}><AppIcon name="info" size={12} color="#6B7280" /> {q.hint}</p>
          )}
        </div>
      )}
    </div>
  );
}

function LessonDone({ xp, mistakes, total, isDeepDive, onContinue }) {
  const acc = total>0 ? Math.round(((total-mistakes)/total)*100) : 100;
  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"40px 28px", textAlign:"center", background:"var(--bg-base)" }}>
      <div style={{ animation:"popIn .5s cubic-bezier(.34,1.56,.64,1)" }}>
        <div style={{ marginBottom:12, display:"flex", justifyContent:"center" }}>{isDeepDive ? <AppIcon name="telescope" size={66} color={ACC} /> : <AppIcon name="celebrate" size={66} color={ACC} />}</div>
        <h1 style={{ fontSize:28, fontWeight:800, marginBottom:6 }}>{isDeepDive ? "Deep Dive Complete!" : "Lesson Complete!"}</h1>
        <p style={{ color:"#9CA3AF", fontSize:14, marginBottom:28 }}>{isDeepDive ? "Excellent challenge — real mastery takes depth!" : "Keep going — you're building real skills."}</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:32 }}>
          {[
            {icon:"xp",l:"XP Earned",v:`+${xp}`,c:ACC},
            {icon:"target",l:"Accuracy",v:`${acc}%`,c:acc===100?"#4ADE80":"#F59E0B"},
            {icon:"error",l:"Mistakes",v:mistakes,c:mistakes===0?"#4ADE80":"#F87171"},
          ].map(s=>(
            <div key={s.l} className="glass-card" style={{ borderRadius:16, padding:"13px 14px", minWidth:76 }}>
              <div style={{ marginBottom:4, display:"flex", justifyContent:"center" }}><AppIcon name={s.icon} size={20} color={s.c} /></div>
              <div style={{ fontWeight:800, fontSize:16, color:s.c }}>{s.v}</div>
              <div style={{ color:"#6B7280", fontSize:10, marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <button onClick={onContinue} style={{ background:"linear-gradient(135deg,#4F8CFF,#2563EB)", color:"#FFF", border:"none", borderRadius:16, padding:"17px 44px", fontSize:16, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 8px 28px rgba(79,140,255,.32)" }}>
          Continue →
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  TEST MODE
// ════════════════════════════════════════════════════════════════

function TestMode({ skills, skillMeta, allLessons, onActivityChange }) {
  const [active,setActive]=useState(null);
  const [qi,setQi]=useState(0);
  const [ans,setAns]=useState({});
  const [sel,setSel]=useState(null);
  const [fill,setFill]=useState("");
  const [done,setDone]=useState(false);
  const [timeLeft,setTime]=useState(0);
  const timer=useRef(null);

  // inform parent when we're actively answering a test question
  useEffect(() => {
    if (onActivityChange) {
      onActivityChange(!!(active && !done));
    }
  }, [active, done, onActivityChange]);

  const tests = (skillMeta || []).map(s => ({
    ...s,
    questions:(allLessons?.[s.id]||[]).filter(q=>q.type!=="explanation"&&q.type!=="reflection"),
    unlocked: !isLocked(s.id, skills, skillMeta) || skills[s.id]?.mastered,
    time:Math.max(((allLessons?.[s.id]||[]).filter(q=>q.type!=="explanation"&&q.type!=="reflection").length)*45,60),
  })).filter(t=>t.questions.length>0);

  useEffect(()=>{
    if(active&&timeLeft>0&&!done){ timer.current=setTimeout(()=>setTime(t=>t-1),1000); }
    else if(active&&timeLeft===0&&!done){ setDone(true); }
    return ()=>clearTimeout(timer.current);
  },[active,timeLeft,done]);

  const startTest=(t)=>{ setActive(t); setTime(t.time); setQi(0); setAns({}); setSel(null); setFill(""); setDone(false); };

  if(done&&active){
    const qs=active.questions;
    const correct=qs.filter((q,i)=>{
      if(q.type==="multiple_choice") return ans[i]===q.answer;
      return String(ans[i]||"").trim()===String(q.answer).trim();
    }).length;
    const pct=qs.length>0?Math.round((correct/qs.length)*100):0;
    const weak=qs.filter((q,i)=>{
      if(q.type==="multiple_choice") return ans[i]!==q.answer;
      return String(ans[i]||"").trim()!==String(q.answer).trim();
    });
    return (
      <div style={{ overflowY:"auto", height:"100vh", padding:"56px 24px calc(80px + env(safe-area-inset-bottom))", background:"var(--bg-base)" }}>
        <h1 style={{ fontSize:25, fontWeight:800, marginBottom:3 }}>Results</h1>
        <p style={{ color:"#6B7280", fontSize:13, marginBottom:18 }}>{prettyLabel(active.title)}</p>
        <div className="glass-card elevated-card" style={{ borderRadius:20, padding:22, textAlign:"center", marginBottom:14 }}>
          <div style={{ fontSize:58, fontWeight:800, color:pct>=70?"#4ADE80":"#F87171" }}>{pct}%</div>
          <p style={{ color:"#9CA3AF", margin:"5px 0 0" }}>{correct} / {qs.length} correct</p>
        </div>
        {weak.length>0&&(
          <div className="glass-card" style={{ background:"linear-gradient(145deg, rgba(11, 24, 48, .82), rgba(8, 20, 42, .76))", border:"1px solid #1B3460", borderRadius:16, padding:16, marginBottom:14 }}>
            <div style={{ color:ACC, fontWeight:700, fontSize:12, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}><AppIcon name="book" size={12} color={ACC} /> Review these questions:</div>
            {weak.slice(0,4).map((q,i)=>(
              <p key={i} style={{ color:"#93C5FD", fontSize:13, margin:"0 0 5px" }}>• {q.question.slice(0,65)}…</p>
            ))}
          </div>
        )}
        <button onClick={()=>setActive(null)} className="btn-primary" style={{ width:"100%", background:ACC, color:"#FFF", border:"none", borderRadius:16, padding:17, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Back to Tests</button>
      </div>
    );
  }

  if(active){
    const qs=active.questions;
    const q=qs[qi];
    if(!q){ setDone(true); return null; }
    const mins=Math.floor(timeLeft/60), secs=timeLeft%60;
    return (
      <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:"var(--bg-base)", overflow:"hidden" }}>
        <div style={{ padding:"50px 24px 12px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <span style={{ color:"#9CA3AF", fontWeight:700, fontSize:13 }}>{qi+1} / {qs.length}</span>
          <div className="glass-card" style={{ borderRadius:10, padding:"5px 14px", border:"1px solid rgba(148, 163, 184, .22)" }}>
            <span style={{ fontFamily:"monospace", fontWeight:800, fontSize:18, color:timeLeft<30?"#F87171":ACC }}>{mins}:{String(secs).padStart(2,"0")}</span>
          </div>
          <button onClick={()=>setDone(true)} style={{ background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>End</button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"4px 24px" }}>
          <QCard q={q} sel={sel} setSel={setSel} fill={fill} setFill={setFill} submitted={false} correct={null}/>
        </div>
        <div style={{ padding:"8px 24px calc(28px + env(safe-area-inset-bottom))", flexShrink:0, position:"sticky", bottom:0, background:"var(--bg-base)" }}>
          <button onClick={()=>{
            const v=q.type==="multiple_choice"?sel:fill;
            setAns(a=>({...a,[qi]:v}));
            setSel(null); setFill("");
            if(qi+1>=qs.length) setDone(true); else setQi(i=>i+1);
          }} className="btn-primary" disabled={sel===null&&fill===""} style={{ width:"100%", background:(sel!==null||fill)?"linear-gradient(135deg,#4F8CFF,#2563EB)":"#1A1A1A", color:(sel!==null||fill)?"#FFF":"#444", border:"none", borderRadius:16, padding:18, fontSize:16, fontWeight:700, cursor:(sel!==null||fill)?"pointer":"not-allowed", fontFamily:"inherit" }}>
            {qi+1>=qs.length?"Submit →":"Next →"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-enter" style={{ overflowY:"auto", height:"100vh", padding:"52px 24px calc(80px + env(safe-area-inset-bottom))" }}>
      <h1 style={{ fontSize:26, fontWeight:800, margin:"0 0 4px" }}>Test Mode</h1>
      <p style={{ color:"#6B7280", fontSize:13, margin:"0 0 20px" }}>Challenge yourself on any topic.</p>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {tests.map(t=>(
          <div key={t.id} className="glass-card" style={{ borderRadius:18, padding:18, opacity:t.unlocked?1:.45 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <div className="glass-card" style={{ width:40, height:40, background:"linear-gradient(145deg, rgba(11, 24, 48, .86), rgba(8, 20, 42, .82))", border:"1px solid #1B3460", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", color:ACC, flexShrink:0 }}>
                <SkillGlyph skill={t} size={20} color={ACC} />
              </div>
              <div>
                <h3 style={{ margin:0, fontSize:16, fontWeight:700 }}>{prettyLabel(t.title)}</h3>
                <p style={{ margin:"2px 0 0", color:"#6B7280", fontSize:12 }}>{t.questions.length} questions · {Math.floor(t.time/60)} min</p>
              </div>
            </div>
            <button onClick={()=>t.unlocked&&startTest(t)} className="interactive-press" disabled={!t.unlocked} style={{ width:"100%", background:t.unlocked?"rgba(13,26,46,.68)":"rgba(15,15,15,.55)", border:`1px solid ${t.unlocked?"#1B3460":"#1A1A1A"}`, borderRadius:12, padding:"11px", color:t.unlocked?ACC:"#333", fontWeight:700, fontSize:14, cursor:t.unlocked?"pointer":"not-allowed", fontFamily:"inherit" }}>
              {t.unlocked ? "Start Test →" : "Complete prerequisites first"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  STATS / PROGRESS
// ════════════════════════════════════════════════════════════════

function Stats({ ud, skills, skillMeta, allLessons }) {
  const totalXP  = ud.xp + Object.values(skills).reduce((s,k)=>s+(k.xp||0),0);
  const mastered = (skillMeta || []).filter(s=>skills[s.id]?.mastered).length;
  const weekXP   = [20,45,80,30,60,75,Math.min(totalXP%90+10,90)];
  const days     = ["M","T","W","T","F","S","S"];
  const mx       = Math.max(...weekXP,1);

  const achievements = ACHIEVEMENTS_DEF.map(a=>({
    ...a,
    earned:(a.id==="first_lesson"&&Object.values(skills).some(s=>s.progress>0))
        ||(a.id==="streak_3"&&ud.streak>=3)
        ||(a.id==="master"&&mastered>0)
        ||(a.id==="streak_7"&&ud.streak>=7),
  }));

  return (
    <div className="screen-enter" style={{ overflowY:"auto", height:"100vh", padding:"52px 24px 80px" }}>
      <h1 style={{ fontSize:26, fontWeight:800, margin:"0 0 4px" }}>Progress</h1>
      <p style={{ color:"#6B7280", fontSize:13, margin:"0 0 18px" }}>Your math journey so far.</p>

      {/* Stats row */}
      <div style={{ display:"flex", gap:9, marginBottom:14 }}>
        {[{l:"Total XP",v:totalXP,i:"xp",c:ACC},{l:"Streak",v:`${ud.streak}d`,i:"streak",c:"#F59E0B"},{l:"Mastered",v:mastered,i:"trophy",c:"#10B981"}].map(s=>(
          <div key={s.l} className="glass-card stat-tile" style={{ flex:1, borderRadius:16, padding:"12px 9px", textAlign:"center" }}>
            <div style={{ marginBottom:3, display:"flex", justifyContent:"center" }}><AppIcon name={s.i} size={19} color={s.c} /></div>
            <div style={{ fontWeight:800, fontSize:18, color:s.c }}>{s.v}</div>
            <div style={{ color:"#6B7280", fontSize:10, marginTop:2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="glass-card elevated-card" style={{ borderRadius:20, padding:18, marginBottom:13 }}>
        <h3 style={{ margin:"0 0 13px", fontSize:14, fontWeight:700 }}>Weekly XP</h3>
        <div style={{ display:"flex", alignItems:"flex-end", gap:7, height:70 }}>
          {weekXP.map((v,i)=>(
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <div style={{ width:"100%", borderRadius:6, background:i===6?"linear-gradient(180deg,#4F8CFF,#2563EB)":"rgba(148, 163, 184, .16)", height:`${(v/mx)*100}%`, minHeight:4, boxShadow:i===6?"0 0 10px rgba(79,140,255,.4)":"none" }}/>
              <span style={{ fontSize:9, color:"#444" }}>{days[i]}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:8, color:ACC, fontWeight:700, fontSize:12 }}>
          This week: {weekXP.reduce((a,b)=>a+b,0)} XP
        </div>
      </div>

      {/* Topic mastery */}
      <div className="glass-card" style={{ borderRadius:20, padding:18, marginBottom:13 }}>
        <h3 style={{ margin:"0 0 13px", fontSize:14, fontWeight:700 }}>Topic Mastery</h3>
        {(skillMeta || []).map(s=>{
          const locked=isLocked(s.id, skills, skillMeta);
          const m=skills[s.id]?.mastered;
          const prog=skills[s.id]?.progress||0;
          const total=allLessons?.[s.id]?.length||1;
          const pct=m?100:Math.round((prog/total)*100);
          const col=m?"#4ADE80":locked?"#1A1A1A":ACC;
          return (
            <div key={s.id} style={{ marginBottom:11 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:13, color:locked?"#444":"#D1D5DB", display:"flex", alignItems:"center", gap:6 }}>
                  <SkillGlyph skill={s} size={14} color={locked?"#444":"#93C5FD"} />{prettyLabel(s.title)}
                </span>
                <span style={{ fontSize:12, fontWeight:700, color:locked?"#333":col }}>
                  {locked ? "Locked" : m ? "100%" : `${pct}%`}
                </span>
              </div>
              <div style={{ background:"rgba(148, 163, 184, .16)", borderRadius:999, height:5 }}>
                <div style={{ width:`${pct}%`, height:"100%", background:locked?"rgba(148, 163, 184, .16)":`linear-gradient(90deg,${col}88,${col})`, borderRadius:999, boxShadow:pct>0&&!locked?`0 0 6px ${col}44`:"none" }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div className="glass-card" style={{ borderRadius:20, padding:18 }}>
        <h3 style={{ margin:"0 0 13px", fontSize:14, fontWeight:700 }}>Achievements</h3>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {achievements.map(a=>(
            <div key={a.id} className="glass-card" style={{ background:a.earned?"linear-gradient(145deg, rgba(11, 24, 48, .82), rgba(8, 20, 42, .76))":"rgba(15, 15, 15, .55)", border:`1px solid ${a.earned?"#1B3460":"#1A1A1A"}`, borderRadius:13, padding:"9px 12px", display:"flex", alignItems:"center", gap:8, opacity:a.earned?1:.3 }}>
              <span style={{ display:"inline-flex", opacity:a.earned?1:.7 }}><AppIcon name={a.icon} size={17} color={a.earned?ACC:"#555"} /></span>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:a.earned?"#FFF":"#333" }}>{a.title}</div>
                <div style={{ fontSize:10, color:"#555" }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ ud, userName, setUd, setUserName, onLogout, onBack, onResetProgress }) {
  const [draftName, setDraftName] = useState(userName || "Learner");
  const [nameSaved, setNameSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const goals = [
    { v:20, l:"Casual", s:"~5 min/day" },
    { v:50, l:"Regular", s:"~10 min/day" },
    { v:100, l:"Serious", s:"~20 min/day" },
    { v:200, l:"Intense", s:"~40 min/day" },
  ];
  const displayName = userName || "Learner";
  const trimmedName = draftName.trim();
  const nameValid = trimmedName.length >= 2 && trimmedName.length <= 12;
  const nameChanged = trimmedName.length > 0 && trimmedName !== displayName;
  const curriculumList = Object.values(curriculumCatalog);
  const levels = curriculumCatalog[ud.curriculumId]?.levels || [];

  useEffect(() => {
    setDraftName(displayName);
  }, [displayName]);

  const handleSaveName = () => {
    if (!nameValid) return;
    setUserName(trimmedName);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 1500);
  };

  const handleCurriculumChange = (nextCurriculumId) => {
    setResetDone(false);
    setUd((prev) => {
      const nextLevels = curriculumCatalog[nextCurriculumId]?.levels || [];
      const canKeepCurrentLevel = nextLevels.some((lvl) => lvl.id === prev.levelId);
      return {
        ...prev,
        curriculumId: nextCurriculumId,
        levelId: canKeepCurrentLevel ? prev.levelId : (nextLevels[0]?.id || prev.levelId),
      };
    });
  };

  const handleLevelChange = (nextLevelId) => {
    setResetDone(false);
    setUd((prev) => ({ ...prev, levelId: nextLevelId }));
  };

  const handleGoalChange = (nextGoal) => {
    setResetDone(false);
    setUd((prev) => ({ ...prev, dailyGoal: nextGoal }));
  };

  const handleReset = () => {
    onResetProgress();
    setConfirmReset(false);
    setResetDone(true);
  };

  return (
    <div className="screen-enter" style={{ overflowY:"auto", height:"100vh", padding:"52px 24px 80px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
        <button
          onClick={onBack}
          className="interactive-press"
          aria-label="Close settings"
          style={{
            width:34,
            height:34,
            borderRadius:0,
            border:"none",
            background:"transparent",
            color:"#9CA3AF",
            cursor:"pointer",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            flexShrink:0,
          }}
        >
          <span aria-hidden="true" style={{ color:"#9CA3AF", fontSize:22, lineHeight:1, fontWeight:500 }}>
            ×
          </span>
        </button>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, margin:0, letterSpacing:-.5 }}>Settings</h1>
          <p style={{ color:"#6B7280", fontSize:12, marginTop:2 }}>Manage your account and learning preferences</p>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div className="glass-card" style={{ borderRadius:18, padding:16 }}>
          <h2 style={{ fontSize:14, fontWeight:700, margin:"0 0 12px" }}>Profile</h2>
          <input
            type="text"
            value={draftName}
            maxLength={12}
            placeholder="Your name"
            onChange={(e) => {
              setNameSaved(false);
              setDraftName(e.target.value.slice(0, 12));
            }}
            onKeyDown={(e) => e.key === "Enter" && nameValid && nameChanged && handleSaveName()}
            style={{ width:"100%", background:"#151515", border:`1.5px solid ${nameChanged && nameValid ? ACC : "#222"}`, borderRadius:12, padding:"13px 14px", color:"#FFF", fontSize:15, fontFamily:"inherit", outline:"none", marginBottom:9 }}
          />
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
            <span style={{ color:nameSaved ? "#4ADE80" : "#6B7280", fontSize:12 }}>
              {nameSaved ? "Name saved" : trimmedName.length > 0 && trimmedName.length < 2 ? "Minimum 2 characters" : "Max 12 characters"}
            </span>
            <button
              onClick={handleSaveName}
              disabled={!nameValid || !nameChanged}
              className="interactive-press"
              style={{ border:"none", borderRadius:10, padding:"9px 12px", fontFamily:"inherit", fontWeight:700, fontSize:12, background:nameValid && nameChanged ? ACC : "#1A1A1A", color:nameValid && nameChanged ? "#FFF" : "#444", cursor:nameValid && nameChanged ? "pointer" : "not-allowed" }}
            >
              Save Name
            </button>
          </div>
        </div>

        <div className="glass-card" style={{ borderRadius:18, padding:16 }}>
          <h2 style={{ fontSize:14, fontWeight:700, margin:"0 0 12px" }}>Learning</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {goals.map((g) => (
              <button
                key={g.v}
                onClick={() => handleGoalChange(g.v)}
                className="interactive-press"
                style={{
                  borderRadius:12,
                  border:`1.5px solid ${ud.dailyGoal === g.v ? ACC : "#232323"}`,
                  background: ud.dailyGoal === g.v ? "#0D1A2E" : "#141414",
                  color: ud.dailyGoal === g.v ? ACC : "#D1D5DB",
                  padding:"10px 12px",
                  textAlign:"left",
                  cursor:"pointer",
                  fontFamily:"inherit",
                }}
              >
                <div style={{ fontSize:13, fontWeight:700 }}>{g.l}</div>
                <div style={{ fontSize:11, color:"#6B7280", marginTop:2 }}>{g.s}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ borderRadius:18, padding:16 }}>
          <h2 style={{ fontSize:14, fontWeight:700, margin:"0 0 12px" }}>Curriculum</h2>
          <p style={{ color:"#6B7280", fontSize:12, margin:"0 0 8px" }}>Program</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
            {curriculumList.map((curriculum) => (
              <button
                key={curriculum.id}
                onClick={() => handleCurriculumChange(curriculum.id)}
                className="interactive-press"
                style={{
                  width:"100%",
                  textAlign:"left",
                  padding:"11px 12px",
                  borderRadius:12,
                  border:`1.5px solid ${ud.curriculumId === curriculum.id ? ACC : "#232323"}`,
                  background: ud.curriculumId === curriculum.id ? "#0D1A2E" : "#141414",
                  color: ud.curriculumId === curriculum.id ? ACC : "#D1D5DB",
                  fontSize:13,
                  fontWeight:700,
                  cursor:"pointer",
                  fontFamily:"inherit",
                }}
              >
                {prettyLabel(curriculum.title)}
              </button>
            ))}
          </div>
          <p style={{ color:"#6B7280", fontSize:12, margin:"0 0 8px" }}>Level</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleLevelChange(level.id)}
                className="interactive-press"
                style={{
                  width:"100%",
                  textAlign:"left",
                  padding:"11px 12px",
                  borderRadius:12,
                  border:`1.5px solid ${ud.levelId === level.id ? ACC : "#232323"}`,
                  background: ud.levelId === level.id ? "#0D1A2E" : "#141414",
                  color: ud.levelId === level.id ? ACC : "#D1D5DB",
                  fontSize:13,
                  fontWeight:700,
                  cursor:"pointer",
                  fontFamily:"inherit",
                }}
              >
                {prettyLabel(level.title)}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ borderRadius:18, padding:16 }}>
          <h2 style={{ fontSize:14, fontWeight:700, margin:"0 0 12px" }}>Account</h2>
          <button
            onClick={onLogout}
            className="interactive-press"
            style={{ width:"100%", borderRadius:12, border:"1.5px solid #2A2A2A", background:"#161616", color:"#D1D5DB", fontFamily:"inherit", fontWeight:700, fontSize:13, cursor:"pointer", padding:"12px 14px", textAlign:"center" }}
          >
            Logout
          </button>
        </div>

        <div className="glass-card" style={{ borderRadius:18, padding:16, border:"1px solid rgba(220, 38, 38, .45)", background:"linear-gradient(145deg, rgba(45, 14, 14, .55), rgba(22, 8, 8, .52))" }}>
          <h2 style={{ fontSize:14, fontWeight:700, margin:"0 0 6px", color:"#FCA5A5" }}>Danger Zone</h2>
          <p style={{ color:"#FCA5A5", fontSize:12, lineHeight:1.6, marginBottom:10 }}>
            Reset all progress data for this account while keeping your login and preferences.
          </p>
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="interactive-press"
              style={{ width:"100%", borderRadius:12, border:"1.5px solid #B91C1C", background:"#7F1D1D", color:"#FFF", fontFamily:"inherit", fontWeight:700, fontSize:13, cursor:"pointer", padding:"12px 14px" }}
            >
              Reset All Progress
            </button>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <p style={{ color:"#FECACA", fontSize:12, margin:0 }}>
                This cannot be undone. Your XP, streak, and lesson progress will be removed.
              </p>
              <div style={{ display:"flex", gap:8 }}>
                <button
                  onClick={handleReset}
                  className="interactive-press"
                  style={{ flex:1, borderRadius:10, border:"1.5px solid #DC2626", background:"#B91C1C", color:"#FFF", fontFamily:"inherit", fontWeight:700, fontSize:12, cursor:"pointer", padding:"10px 12px" }}
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="interactive-press"
                  style={{ flex:1, borderRadius:10, border:"1.5px solid #3A3A3A", background:"#1A1A1A", color:"#D1D5DB", fontFamily:"inherit", fontWeight:700, fontSize:12, cursor:"pointer", padding:"10px 12px" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {resetDone && (
            <p style={{ color:"#86EFAC", fontSize:12, margin:"10px 0 0" }}>Progress reset successfully.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  APP ROOT
// ════════════════════════════════════════════════════════════════

function buildDefaultSkills(skillMeta, allLessons) {
  const base = Object.fromEntries((skillMeta || []).map(s => [s.id, {
    progress:0, mastered:false, xp:0,
    lastPracticed:null, reviewInterval:1, reviewDue:null,
  }]));
  for (const s of (skillMeta || [])) {
    const total = allLessons?.[s.id]?.length || 0;
    const cur   = base[s.id];
    base[s.id]  = { ...cur, mastered: total > 0 ? cur.progress >= total : cur.mastered };
  }
  return base;
}

/** Calculate the next review due date using a simple doubling schedule (capped at 21 days). */
function calcReviewDue(accuracy, currentInterval) {
  const newInterval = accuracy >= 0.8 ? Math.min(currentInterval * 2, 21) : 1;
  return { interval: newInterval, due: Date.now() + newInterval * DAY_MS };
}

function levelKey(curriculumId, levelId) {
  return `${curriculumId}/${levelId}`;
}

function formatLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKeyAsUTC(dateKey) {
  if (typeof dateKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return null;
  }
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function diffDateKeys(fromDateKey, toDateKey) {
  const from = parseDateKeyAsUTC(fromDateKey);
  const to = parseDateKeyAsUTC(toDateKey);
  if (from == null || to == null) return null;
  return Math.round((to - from) / DAY_MS);
}

function resolveStreakAfterActivity(currentStreak, lastStreakDate, activityDateKey) {
  const nextDateKey =
    parseDateKeyAsUTC(activityDateKey) == null
      ? formatLocalDateKey()
      : activityDateKey;
  const previousDateKey =
    parseDateKeyAsUTC(lastStreakDate) == null ? null : lastStreakDate;
  const safeStreak = Math.max(0, Number(currentStreak) || 0);

  if (!previousDateKey) {
    return { streak: 1, lastStreakDate: nextDateKey };
  }

  const dayDiff = diffDateKeys(previousDateKey, nextDateKey);
  if (dayDiff === 0) {
    return { streak: Math.max(1, safeStreak), lastStreakDate: previousDateKey };
  }
  if (dayDiff === 1) {
    return { streak: Math.max(1, safeStreak) + 1, lastStreakDate: nextDateKey };
  }
  if (typeof dayDiff === "number" && dayDiff > 1) {
    return { streak: 1, lastStreakDate: nextDateKey };
  }

  return { streak: Math.max(1, safeStreak), lastStreakDate: previousDateKey };
}

function buildWeeklyStreakDays(streak, lastStreakDate) {
  const doneDays = [false, false, false, false, false, false, false];
  const currentStreak = Math.max(0, Math.floor(Number(streak) || 0));
  if (currentStreak === 0) return doneDays;

  const anchorDateKey =
    parseDateKeyAsUTC(lastStreakDate) == null
      ? formatLocalDateKey()
      : lastStreakDate;
  const anchorUTC = parseDateKeyAsUTC(anchorDateKey);
  if (anchorUTC == null) return doneDays;

  for (let i = 0; i < Math.min(currentStreak, 7); i += 1) {
    const dayUTC = anchorUTC - i * DAY_MS;
    const mondayFirstIndex = (new Date(dayUTC).getUTCDay() + 6) % 7;
    doneDays[mondayFirstIndex] = true;
  }

  return doneDays;
}

function progressCacheKey(userId) {
  return `theorem_progress_cache_${userId}`;
}

function readProgressCache(userId) {
  try {
    const raw = localStorage.getItem(progressCacheKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeProgressCache(userId, progress) {
  try {
    localStorage.setItem(progressCacheKey(userId), JSON.stringify(progress));
  } catch {
    // Ignore cache write errors (private mode/quota).
  }
}

function getCompletedLessons(skillsByLevel) {
  const completed = [];
  for (const [lvlKey, lvlSkills] of Object.entries(skillsByLevel || {})) {
    for (const [skillId, skillState] of Object.entries(lvlSkills || {})) {
      if (skillState?.mastered) completed.push(`${lvlKey}:${skillId}`);
    }
  }
  return completed;
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  :root {
    --bg-base: #070b14;
    --bg-2: #0a1222;
    --surface-glass: linear-gradient(145deg, rgba(18, 24, 40, .82), rgba(10, 14, 24, .72));
    --surface-elevated: linear-gradient(145deg, rgba(17, 23, 41, .9), rgba(8, 12, 24, .82));
    --surface-border: rgba(148, 163, 184, .24);
    --surface-border-strong: rgba(148, 163, 184, .38);
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --glow-blue: rgba(79, 140, 255, .18);
    --glow-blue-soft: rgba(59, 130, 246, .12);
    --ease-spring: cubic-bezier(.34,1.56,.64,1);
  }
  * { box-sizing:border-box; margin:0; padding:0; }
  body {
    background: #000;
    color: var(--text-main);
  }
  ::-webkit-scrollbar { width:0; }
  #root, #root > div { width:100%; }

  /* ── Core animations ── */
  @keyframes fadeIn    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeInFast{ from{opacity:0;transform:translateY(6px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes slideUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn   { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
  @keyframes popIn     { from{opacity:0;transform:scale(.82)} to{opacity:1;transform:scale(1)} }
  @keyframes popInSoft { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
  @keyframes floatUp   { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-55px) scale(1.3)} }
  @keyframes shake     { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-9px)} 40%{transform:translateX(9px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
  @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.3} }
  @keyframes splashProgress { 0%{transform:translateX(-105%)} 100%{transform:translateX(320%)} }
  @keyframes shimmer     { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes tabSlide    { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes navPop      { 0%{transform:scale(1)} 50%{transform:scale(1.22)} 100%{transform:scale(1)} }
  @keyframes screenIn    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes heroGlow   { 0%,100%{opacity:.35} 50%{opacity:.65} }
  @keyframes mascotFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  @keyframes flamePulse { 0%,100%{box-shadow:0 0 0 rgba(0,0,0,0)} 50%{box-shadow:0 0 10px rgba(245,158,11,.16)} }

  .glass-card {
    background: #151515;
    border: 1px solid #1E1E1E;
  }
  .elevated-card {
    box-shadow: 0 10px 24px rgba(0,0,0,.28);
  }
  .glow-primary {
    box-shadow:
      0 0 0 1px rgba(59, 130, 246, .14) inset,
      0 0 14px var(--glow-blue),
      0 0 24px var(--glow-blue-soft);
  }
  .interactive-press {
    transition: transform .15s ease, box-shadow .2s ease, border-color .2s ease;
  }
  .interactive-press:active { transform: scale(.98); }

  .mesh-hero {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    background:
      radial-gradient(120px 90px at 10% 18%, rgba(56,189,248,.2), transparent 68%),
      radial-gradient(180px 120px at 80% 18%, rgba(79,140,255,.2), transparent 74%),
      radial-gradient(200px 130px at 64% 76%, rgba(59,130,246,.18), transparent 72%),
      linear-gradient(145deg, rgba(16,22,39,.9), rgba(8,12,24,.8));
    border: 1px solid rgba(148, 163, 184, .34);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.06), 0 16px 32px rgba(2, 6, 23, .52);
  }
  .mesh-hero::after {
    content: "";
    position: absolute;
    inset: auto -20% -50% -20%;
    height: 80%;
    background: radial-gradient(circle at 50% 0, rgba(79,140,255,.18), transparent 60%);
    pointer-events: none;
    animation: heroGlow 6s ease-in-out infinite;
  }
  .hero-chip {
    border-radius: 999px;
    padding: 5px 11px;
    backdrop-filter: blur(8px);
    border: 1px solid var(--surface-border-strong);
    background: rgba(10, 14, 26, .56);
  }
  .hot-chip { border-color: rgba(245, 158, 11, .48); background: rgba(49, 30, 10, .52); }
  .cold-chip { border-color: rgba(125, 211, 252, .48); background: rgba(12, 30, 44, .52); }
  .xp-chip { border-color: rgba(79, 140, 255, .42); background: rgba(11, 24, 48, .5); }
  .logout-chip:hover { border-color: rgba(191, 219, 254, .55); }

  .mascot-wrap {
    width: 94px;
    height: 94px;
    flex-shrink: 0;
    animation: mascotFloat 3.4s ease-in-out infinite;
    filter: drop-shadow(0 8px 14px rgba(37, 99, 235, .16));
  }

  .continue-card {
    background: linear-gradient(145deg, rgba(11, 24, 48, .86), rgba(8, 17, 35, .78));
    border-color: rgba(79, 140, 255, .44);
  }
  .continue-ambient {
    display: none;
  }
  .play-orb {
    background: linear-gradient(145deg, #2563EB, #4f8cff 48%, #22d3ee);
    box-shadow: 0 6px 14px rgba(79,140,255,.14);
  }

  .stat-tile { box-shadow: inset 0 1px 0 rgba(255,255,255,.05), 0 10px 18px rgba(2, 6, 23, .26); }
  .progress-ring-wrap {
    position: relative;
    display: grid;
    place-items: center;
    filter: drop-shadow(0 0 6px rgba(79,140,255,.14));
  }
  .progress-ring-label {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.05;
    font-weight: 800;
    color: #dbeafe;
    letter-spacing: -.2px;
    font-size: 16px;
  }
  .progress-ring-label span {
    font-size: 10px;
    font-weight: 700;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .streak-fire { display:inline-flex; align-items:center; justify-content:center; line-height:1; }
  .streak-flame-icon {
    filter: drop-shadow(0 0 5px rgba(255,255,255,.08));
  }
  .streak-fire.hot {
  }
  .streak-fire.cold {
    filter: drop-shadow(0 0 6px rgba(125,211,252,.16));
  }

  .splash-progress {
    margin-top: 10px;
    width: min(180px, 48vw);
    height: 3px;
    border-radius: 999px;
    background: #1A1A1A;
    overflow: hidden;
  }
  .splash-progress-bar {
    width: 32%;
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(79,140,255,.35), rgba(79,140,255,.85));
    animation: splashProgress 1.35s ease-in-out infinite;
  }

  /* ── Skeleton loader ── */
  .skeleton {
    background: linear-gradient(90deg,#161616 25%,#1E1E1E 50%,#161616 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 10px;
  }

  /* ── Interactive cards ── */
  .tap-card { transition: transform .15s ease, box-shadow .15s ease; cursor:pointer; }
  .tap-card:hover { box-shadow: 0 0 0 1px rgba(59,130,246,.24) inset, 0 12px 22px rgba(2, 6, 23, .4); }
  .tap-card:active { transform: scale(.975); }

  /* ── Buttons ── */
  .btn-primary { transition: transform .15s ease, box-shadow .15s ease, opacity .15s; }
  .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(79,140,255,.2) !important; }
  .btn-primary:active:not(:disabled) { transform: scale(.975) translateY(0); }

  .btn-ghost { transition: background .15s, color .15s, transform .15s; }
  .btn-ghost:hover { background: #1A1A1A !important; }
  .btn-ghost:active { transform: scale(.95); }

  /* ── Nav tab ── */
  .nav-tab { transition: color .2s ease; position:relative; }
  .nav-tab svg { transition: transform .2s cubic-bezier(.34,1.56,.64,1); }
  .nav-tab.active svg { transform: scale(1.12); }
  .nav-tab::after {
    content:''; position:absolute; bottom:4px; left:50%; transform:translateX(-50%) scaleX(0);
    width:18px; height:3px; border-radius:999px; background:#4F8CFF;
    transition: transform .25s cubic-bezier(.34,1.56,.64,1);
  }
  .nav-tab.active::after { transform:translateX(-50%) scaleX(1); }

  /* ── Skill node ── */
  .skill-node { transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s ease; }
  .skill-node:hover:not([disabled]) { transform: scale(1.08); }
  .skill-node:active:not([disabled]) { transform: scale(.95); }

  /* ── Screen wrapper ── */
  .screen-enter { animation: screenIn .3s ease both; }

  /* ── Focus styles ── */
  input:focus, textarea:focus { border-color:#4F8CFF !important; box-shadow:0 0 0 3px rgba(79,140,255,.12) !important; outline:none; }

  @media (prefers-reduced-motion: reduce) {
    .splash-logo,
    .splash-progress-bar,
    .screen-enter,
    .mascot-wrap,
    .streak-fire.hot,
    .mesh-hero::after {
      animation: none !important;
    }
    .tap-card,
    .interactive-press,
    .btn-primary,
    .skill-node {
      transition: none !important;
    }
  }
`;

const WRAP = {
  background:"#0B0B0B", minHeight:"100vh", width:"100%", maxWidth:430, margin:"0 auto",
  fontFamily:"'Plus Jakarta Sans','SF Pro Display',system-ui,sans-serif",
  color:"#FFF", position:"relative", overflowX:"hidden",
};

export default function App() {
  const defaultSel = getDefaultSelection();
  const [splashDelayDone, setSplashDelayDone] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [screen,    setScreen]    = useState("home");
  const [lessonId,  setLessonId]  = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("Learner");
  const [authReady, setAuthReady] = useState(false);
  const [progressReady, setProgressReady] = useState(false);
  const [progressHydrated, setProgressHydrated] = useState(false);
  const [ud, setUd] = useState({
    xp:0,
    streak:0,
    lastStreakDate:null,
    dailyGoal:50,
    curriculumId: defaultSel.curriculumId,
    levelId: defaultSel.levelId,
  });

  const [deepDiveId, setDeepDiveId] = useState(null);
  const [testBusy, setTestBusy] = useState(false);

  const [content, setContent] = useState(/** @type {null|{skillMeta:any[], allLessons:Record<string,any[]>, deepDive:Record<string,any[]>}} */(null));
  const [contentErr, setContentErr] = useState("");
  const [contentLoading, setContentLoading] = useState(true);

  // Progress is stored per (curriculumId, levelId) so switching does not overwrite progress.
  const [skillsByLevel, setSkillsByLevel] = useState({});
  const persistTimeoutRef = useRef(null);

  const activeKey = levelKey(ud.curriculumId, ud.levelId);
  const skills = skillsByLevel[activeKey] || {};

  useEffect(() => {
    const t = setTimeout(() => setSplashDelayDone(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let alive = true;

    const applyProgress = (progress, user) => {
      if (!alive) return;
      setOnboarded(Boolean(progress?.onboarded));
      setUserName(progress?.displayName || user?.displayName || user?.email?.split("@")?.[0] || "Learner");
      setUd({
        xp: progress?.xp || 0,
        streak: progress?.streak || 0,
        lastStreakDate: progress?.lastStreakDate || null,
        dailyGoal: progress?.dailyGoal || 50,
        curriculumId: progress?.curriculumId || defaultSel.curriculumId,
        levelId: progress?.levelId || defaultSel.levelId,
      });
      setSkillsByLevel(progress?.skillsByLevel || {});
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserId(null);
        setUserName("Learner");
        setOnboarded(false);
        setUd({
          xp: 0,
          streak: 0,
          lastStreakDate: null,
          dailyGoal: 50,
          curriculumId: defaultSel.curriculumId,
          levelId: defaultSel.levelId,
        });
        setSkillsByLevel({});
        setLessonId(null);
        setDeepDiveId(null);
        setScreen("home");
        setAuthReady(true);
        setProgressReady(true);
        setProgressHydrated(true);
        return;
      }

      setAuthReady(true);
      setProgressReady(true);
      setProgressHydrated(false);
      setUserId(user.uid);

      const cachedProgress = readProgressCache(user.uid);
      if (cachedProgress) {
        applyProgress(cachedProgress, user);
        setProgressHydrated(true);
      }

      try {
        const progress = await loadUserProgress(user.uid);
        applyProgress(progress, user);
        writeProgressCache(user.uid, progress);
      } catch (err) {
        console.error("Failed to load user progress:", err);
      } finally {
        if (alive) setProgressHydrated(true);
      }
    });

    return () => {
      alive = false;
      unsubscribe();
    };
  }, [defaultSel.curriculumId, defaultSel.levelId]);

  useEffect(() => {
    if (!userId || !progressReady || !progressHydrated) return;
    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current);
    }

    persistTimeoutRef.current = setTimeout(() => {
      const snapshot = {
        streak: ud.streak,
        lastStreakDate: ud.lastStreakDate || null,
        dailyGoal: ud.dailyGoal,
        curriculumId: ud.curriculumId,
        levelId: ud.levelId,
        onboarded,
        displayName: userName,
        skillsByLevel,
        completedLessons: getCompletedLessons(skillsByLevel),
      };
      writeProgressCache(userId, snapshot);
      saveUserProgress(userId, snapshot).catch((err) => {
        console.error("Failed to save user progress:", err);
      });
    }, 450);

    return () => {
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current);
      }
    };
  }, [onboarded, progressHydrated, progressReady, skillsByLevel, ud, userId, userName]);

  useEffect(() => {
    let alive = true;
    setContentLoading(true);
    setContentErr("");
    loadLevelContent(ud.curriculumId, ud.levelId)
      .then((c) => {
        if (!alive) return;
        setContent({ skillMeta: c.skillMeta || [], allLessons: c.allLessons || {}, deepDive: c.deepDive || {} });
        setContentLoading(false);
        setSkillsByLevel(prev => {
          const k = levelKey(ud.curriculumId, ud.levelId);
          if (prev[k]) return prev;
          return { ...prev, [k]: buildDefaultSkills(c.skillMeta || [], c.allLessons || {}) };
        });
      })
      .catch((e) => {
        if (!alive) return;
        setContentErr(e?.message || "Failed to load content.");
        setContentLoading(false);
      });
    return () => { alive = false; };
  }, [ud.curriculumId, ud.levelId]);

  const startLesson = (id) => {
    if (!content?.allLessons?.[id]) return;
    if (isLocked(id, skills, content?.skillMeta || [])) return;
    setLessonId(id);
  };

  const finishLesson = (xpEarned, queueLen, correctAnswered, practiceAnswered) => {
    if (!lessonId) return;
    const total    = content?.allLessons?.[lessonId]?.length || 1;
    const activityDateKey = formatLocalDateKey();
    // accuracy uses only practice questions; progress uses queue length to ensure mastery on completion
    const accuracy = practiceAnswered > 0 ? correctAnswered / practiceAnswered : 1;
    const qAnswered = queueLen;
    const curLevel = skillsByLevel[activeKey] || {};
    const cur = curLevel[lessonId] || { progress:0, mastered:false, xp:0, lastPracticed:null, reviewInterval:1, reviewDue:null };
    const newP = Math.min(cur.progress + qAnswered, total);
    const masteredNow = newP >= total;

    setSkillsByLevel(prev => {
      const k        = levelKey(ud.curriculumId, ud.levelId);
      const curLevel = prev[k] || {};
      const cur      = curLevel[lessonId] || { progress:0, mastered:false, xp:0, lastPracticed:null, reviewInterval:1, reviewDue:null };
      const newP     = Math.min(cur.progress + qAnswered, total);
      const mastered = newP >= total;
      const { interval, due } = calcReviewDue(accuracy, cur.reviewInterval || 1);
      return {
        ...prev,
        [k]: {
          ...curLevel,
          [lessonId]: {
            progress: newP,
            mastered,
            xp: (cur.xp || 0) + xpEarned,
            lastPracticed: Date.now(),
            reviewInterval: mastered ? interval : cur.reviewInterval || 1,
            reviewDue:      mastered ? due      : cur.reviewDue,
          },
        },
      };
    });

    if (userId) {
      updateUserXP(userId, xpEarned).catch((err) => {
        console.error("Failed to update XP:", err);
      });
      recordUserStreakActivity(userId, activityDateKey)
        .then((next) => {
          setUd((u) => ({
            ...u,
            streak: typeof next?.streak === "number" ? next.streak : u.streak,
            lastStreakDate: next?.lastStreakDate || u.lastStreakDate,
          }));
        })
        .catch((err) => {
          console.error("Failed to update streak:", err);
        });
      if (masteredNow) {
        markLessonCompleted(userId, `${activeKey}:${lessonId}`).catch((err) => {
          console.error("Failed to mark lesson completed:", err);
        });
      }
    }

    setUd((u) => {
      const streakState = resolveStreakAfterActivity(
        u.streak,
        u.lastStreakDate,
        activityDateKey
      );
      return {
        ...u,
        xp: u.xp + xpEarned,
        streak: streakState.streak,
        lastStreakDate: streakState.lastStreakDate,
      };
    });
    setLessonId(null);
    setScreen("home");
  };

  const startDeepDive = (id) => {
    const qs = content?.deepDive?.[id];
    if (!qs || qs.length === 0) return;
    setDeepDiveId(id);
  };

  const finishDeepDive = (xpEarned) => {
    const activityDateKey = formatLocalDateKey();
    if (userId) {
      updateUserXP(userId, xpEarned).catch((err) => {
        console.error("Failed to update XP:", err);
      });
      recordUserStreakActivity(userId, activityDateKey)
        .then((next) => {
          setUd((u) => ({
            ...u,
            streak: typeof next?.streak === "number" ? next.streak : u.streak,
            lastStreakDate: next?.lastStreakDate || u.lastStreakDate,
          }));
        })
        .catch((err) => {
          console.error("Failed to update streak:", err);
        });
    }
    setUd((u) => {
      const streakState = resolveStreakAfterActivity(
        u.streak,
        u.lastStreakDate,
        activityDateKey
      );
      return {
        ...u,
        xp: u.xp + xpEarned,
        streak: streakState.streak,
        lastStreakDate: streakState.lastStreakDate,
      };
    });
    setDeepDiveId(null);
    setScreen("tree");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  const handleResetProgress = () => {
    setUd((u) => ({
      ...u,
      xp: 0,
      streak: 0,
      lastStreakDate: null,
    }));
    setSkillsByLevel({});
  };

  if (!authReady || !splashDelayDone) return (
    <div style={WRAP}><style>{CSS}</style>
      <SplashScreen />
    </div>
  );

  if (userId && !progressHydrated && !onboarded) return (
    <div style={WRAP}><style>{CSS}</style>
      <SkeletonLoader />
    </div>
  );

  if (!onboarded) return (
    <div style={WRAP}><style>{CSS}</style>
      <Onboarding onDone={d=>{ setUd(u=>({...u,...d})); if (d.displayName) setUserName(d.displayName); setOnboarded(true); }}/>
    </div>
  );

  if (contentLoading && !content) return (
    <div style={WRAP}><style>{CSS}</style>
      <SkeletonLoader />
    </div>
  );

  if (contentErr) return (
    <div style={WRAP}><style>{CSS}</style>
      <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24, textAlign:"center" }}>
        <div>
          <div style={{ fontWeight:800, marginBottom:8 }}>Content load failed</div>
          <div style={{ color:"#6B7280", fontSize:13, lineHeight:1.6 }}>{contentErr}</div>
        </div>
      </div>
    </div>
  );

  if (deepDiveId) return (
    <div style={WRAP}><style>{CSS}</style>
      <LessonEngine
        skillId={deepDiveId}
        questions={content?.deepDive?.[deepDiveId] || []}
        allLessons={content?.allLessons || {}}
        onComplete={finishDeepDive}
        onExit={() => setDeepDiveId(null)}
        isDeepDive
      />
    </div>
  );

  if (lessonId) return (
    <div style={WRAP}><style>{CSS}</style>
      <LessonEngine
        skillId={lessonId}
        allLessons={content?.allLessons || {}}
        onComplete={finishLesson}
        onExit={() => setLessonId(null)}
      />
    </div>
  );

  return (
    <div style={WRAP}><style>{CSS}</style>
      {screen==="home"     && <Home     ud={ud} skills={skills} startLesson={startLesson} skillMeta={content?.skillMeta||[]} allLessons={content?.allLessons||{}} userName={userName} onOpenSettings={() => setScreen("settings")}/>}
      {screen==="tree"     && <SkillTree skills={skills} startLesson={startLesson} startDeepDive={startDeepDive} skillMeta={content?.skillMeta||[]} allLessons={content?.allLessons||{}} deepDive={content?.deepDive||{}}/>}
      {screen==="test"     && <TestMode skills={skills} skillMeta={content?.skillMeta||[]} allLessons={content?.allLessons||{}} onActivityChange={setTestBusy}/>}
      {screen==="progress" && <Stats     ud={ud} skills={skills} skillMeta={content?.skillMeta||[]} allLessons={content?.allLessons||{}}/>}
      {screen==="settings" && <SettingsPage ud={ud} userName={userName} setUd={setUd} setUserName={setUserName} onLogout={handleLogout} onBack={() => setScreen("home")} onResetProgress={handleResetProgress}/>}
      {screen !== "settings" && !testBusy && <NavBar active={screen} go={setScreen}/>}
    </div>
  );
}
