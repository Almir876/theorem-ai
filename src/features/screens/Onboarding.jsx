import { useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { curriculumCatalog, getDefaultSelection } from "../../content/index.js";
import { auth } from "../../firebase.js";
import { AppIcon } from "../../ui/icons.jsx";
import { ACC, prettyLabel } from "../../ui/uiUtils.js";

export function SignupPage({ onDone, prefill, initialMode = "signup" }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) { setErr("Please fill in all fields."); return; }
    setLoading(true);
    setErr("");
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onDone();
    } catch (e) {
      setErr(e.message?.replace("Firebase: ", "")?.replace(/\(auth.*\)/, "")?.trim() || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setErr("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      onDone();
    } catch (e) {
      setErr(e.message?.replace("Firebase: ", "")?.replace(/\(auth.*\)/, "")?.trim() || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "52px 28px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 8 }}>∑</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px", letterSpacing: -0.8 }}>Almost there!</h1>
          <p style={{ color: "#6B7280", fontSize: 13, margin: 0 }}>
            {mode === "signup" ? "Create your account to save your progress." : "Welcome back! Sign in to continue."}
          </p>
        </div>

        {prefill && (
          <div style={{ background: "#0D1A2E", border: "1px solid #1B3460", borderRadius: 14, padding: "12px 16px", marginBottom: 24, display: "flex", gap: 12, alignItems: "center" }}>
            <AppIcon name="check" size={16} color={ACC} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: ACC }}>Your selections are saved</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>{prefill.curriculumLabel} · {prefill.levelLabel}</div>
            </div>
          </div>
        )}

        <button onClick={handleGoogle} disabled={loading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, background: "#FFF", border: "none", borderRadius: 14, padding: "14px 18px", fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", color: "#111", fontFamily: "inherit", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,.18)", transition: "all .2s", opacity: loading ? .7 : 1 }}>
          <svg width={20} height={20} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: "#1E1E1E" }} />
          <span style={{ color: "#3A3A3A", fontSize: 12 }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#1E1E1E" }} />
        </div>

        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", background: "#151515", border: "1.5px solid #222", borderRadius: 12, padding: "14px 16px", color: "#FFF", fontSize: 15, fontFamily: "inherit", outline: "none", marginBottom: 10, display: "block" }}
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{ width: "100%", background: "#151515", border: "1.5px solid #222", borderRadius: 12, padding: "14px 16px", color: "#FFF", fontSize: 15, fontFamily: "inherit", outline: "none", marginBottom: 4, display: "block" }}
        />

        {err && <p style={{ color: "#F87171", fontSize: 12, margin: "8px 0 0", lineHeight: 1.5 }}>{err}</p>}
      </div>

      <div style={{ marginTop: 24 }}>
        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: loading ? "#1A1A1A" : "linear-gradient(135deg,#4F8CFF,#2563EB)", color: loading ? "#444" : "#FFF", border: "none", borderRadius: 16, padding: 18, fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: loading ? "none" : "0 8px 28px rgba(79,140,255,.3)", transition: "all .2s", marginBottom: 14 }}>
          {loading ? "Please wait…" : mode === "signup" ? "Create Account →" : "Sign In →"}
        </button>
        <p style={{ textAlign: "center", color: "#6B7280", fontSize: 13, margin: 0 }}>
          {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => { setMode((m) => m === "signup" ? "login" : "signup"); setErr(""); }} style={{ color: ACC, fontWeight: 700, cursor: "pointer" }}>
            {mode === "signup" ? "Sign in" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default function Onboarding({ onDone }) {
  const defaultSel = getDefaultSelection();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const MAX_NAME_LENGTH = 12;

  const saved = (() => { try { return JSON.parse(localStorage.getItem("theorem_choices") || "{}"); } catch { return {}; } })();
  const [curriculumId, setCurriculumId] = useState(saved.curriculumId || null);
  const [levelId, setLevelId] = useState(saved.levelId || null);
  const [goal, setGoal] = useState(saved.dailyGoal || 50);
  const [showSignup, setShowSignup] = useState(false);
  const [authStartMode, setAuthStartMode] = useState("signup");

  const TOTAL_STEPS = 4;
  const ok = [true, name.trim().length >= 2, !!curriculumId, !!levelId, true][step] ?? true;

  const curriculumList = Object.values(curriculumCatalog);
  const levels = curriculumId ? (curriculumCatalog[curriculumId]?.levels || []) : [];
  const goals = [
    { v: 20, l: "Casual", s: "~5 min" }, { v: 50, l: "Regular", s: "~10 min" },
    { v: 100, l: "Serious", s: "~20 min" }, { v: 200, l: "Intense", s: "~40 min" },
  ];
  const welcomeFeatures = [
    { title: "Structured skill trees", desc: "Follow a clear progression from fundamentals to mastery.", icon: "circle:12,5,2|circle:6,19,2|circle:18,19,2|path:M12 7v6|path:M12 13H6|path:M12 13h6" },
    { title: "Short interactive lessons", desc: "High-focus sessions designed for consistent daily progress.", icon: "path:M8 5v14l11-7z" },
    { title: "Streaks and XP", desc: "Build momentum with measurable goals and daily rewards.", icon: "path:M13 2L4 14h6l-1 8 9-12h-6z" },
    { title: "AI explanations", desc: "Get guided, step-by-step support whenever you get stuck.", icon: "path:M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-4 4v-4H6a2 2 0 0 1-2-2z|path:M8 9h8|path:M8 12h5" },
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

  const saveChoices = () => {
    const choices = { curriculumId, levelId, dailyGoal: goal };
    try { localStorage.setItem("theorem_choices", JSON.stringify(choices)); } catch { /* ignore storage errors */ }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      saveChoices();
      setStep((s) => s + 1);
    } else {
      saveChoices();
      setShowSignup(true);
    }
  };

  if (showSignup) {
    const curriculumLabel = curriculumCatalog[curriculumId]?.title || curriculumId;
    const levelLabel = (curriculumCatalog[curriculumId]?.levels || []).find((l) => l.id === levelId)?.title || levelId;
    return (
      <SignupPage
        prefill={{ curriculumLabel: prettyLabel(curriculumLabel), levelLabel: prettyLabel(levelLabel) }}
        initialMode={authStartMode}
        onDone={() => onDone({ curriculumId, levelId, dailyGoal: goal, displayName: name.trim() })}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "56px 24px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 50, lineHeight: 1 }}>∑</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "8px 0 4px", letterSpacing: -1 }}>Theorem</h1>
        <p style={{ color: "#6B7280", fontSize: 13 }}>Master Mathematics. One lesson at a time.</p>
      </div>
      <div style={{ flex: 1 }}>
        {step === 0 && (
          <div style={{ animation: "fadeIn .35s ease" }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, letterSpacing: -.4 }}>Welcome to your math studio</h2>
            <p style={{ color: "#9CA3AF", lineHeight: 1.7, marginBottom: 20 }}>A premium learning flow built for steady progress, sharper intuition, and consistent results.</p>
            <div style={{ background: "linear-gradient(145deg,#131313,#0E0E0E)", border: "1px solid #222", borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: "inset 0 1px 0 rgba(255,255,255,.05), 0 16px 30px rgba(0,0,0,.24)" }}>
              {welcomeFeatures.map((item, idx) => (
                <div key={item.title} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 4px", borderBottom: idx < welcomeFeatures.length - 1 ? "1px solid #1D1D1D" : "none" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "#0E1B2E", color: ACC, display: "grid", placeItems: "center", flexShrink: 0, border: "1px solid #1C365F" }}>
                    {renderFeatureIcon(item.icon)}
                  </div>
                  <div>
                    <div style={{ color: "#E5E7EB", fontWeight: 700, fontSize: 14 }}>{item.title}</div>
                    <div style={{ color: "#6B7280", fontSize: 12, lineHeight: 1.5, marginTop: 2 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 1 && (
          <div style={{ animation: "fadeIn .35s ease" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>What's your name?</h2>
            <p style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 18 }}>We'll use this to personalise your experience.</p>
            <input
              autoFocus
              type="text"
              placeholder="Your first name"
              value={name}
              maxLength={MAX_NAME_LENGTH}
              onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
              onKeyDown={(e) => e.key === "Enter" && name.trim().length >= 2 && handleNext()}
              style={{ width: "100%", background: "#151515", border: `1.5px solid ${name.trim().length >= 2 ? ACC : "#222"}`, borderRadius: 14, padding: "16px 18px", color: "#FFF", fontSize: 17, fontFamily: "inherit", outline: "none", display: "block", transition: "border-color .2s" }}
            />
            {name.trim().length > 0 && name.trim().length < 2 && (
              <p style={{ color: "#F87171", fontSize: 12, marginTop: 8 }}>Please enter at least 2 characters.</p>
            )}
            <p style={{ textAlign: "center", color: "#6B7280", fontSize: 13, margin: "14px 0 0" }}>
              Already have an account{" "}
              <span
                onClick={() => {
                  const nextCurriculum = curriculumId || defaultSel.curriculumId;
                  const nextLevel = levelId || defaultSel.levelId;
                  setCurriculumId(nextCurriculum);
                  setLevelId(nextLevel);
                  try { localStorage.setItem("theorem_choices", JSON.stringify({ curriculumId: nextCurriculum, levelId: nextLevel, dailyGoal: goal })); } catch { /* ignore storage errors */ }
                  setAuthStartMode("login");
                  setShowSignup(true);
                }}
                style={{ color: ACC, fontWeight: 700, cursor: "pointer" }}
              >
                Sign in
              </span>
            </p>
          </div>
        )}
        {step === 2 && (
          <div style={{ animation: "fadeIn .35s ease" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Pick your curriculum</h2>
            <p style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 18 }}>We'll tailor your skill tree to match.</p>
            {curriculumList.map((c) => (
              <button
                key={c.id}
                onClick={() => { setCurriculumId(c.id); setLevelId(null); }}
                style={{
                  width: "100%", display: "block", marginBottom: 9,
                  background: curriculumId === c.id ? "#0D1A2E" : "#151515",
                  border: `1.5px solid ${curriculumId === c.id ? ACC : "#1E1E1E"}`,
                  borderRadius: 14, padding: "15px 18px", textAlign: "left",
                  cursor: "pointer", color: curriculumId === c.id ? ACC : "#FFF",
                  fontWeight: 600, fontSize: 15, fontFamily: "inherit", transition: "all .2s",
                }}
              >
                {prettyLabel(c.title)}
              </button>
            ))}
          </div>
        )}
        {step === 3 && (
          <div style={{ animation: "fadeIn .35s ease" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Your current level?</h2>
            <p style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 18 }}>Start right where you belong.</p>
            {levels.map((l) => (
              <button
                key={l.id}
                onClick={() => setLevelId(l.id)}
                style={{
                  width: "100%", display: "block", marginBottom: 9,
                  background: levelId === l.id ? "#0D1A2E" : "#151515",
                  border: `1.5px solid ${levelId === l.id ? ACC : "#1E1E1E"}`,
                  borderRadius: 14, padding: "14px 18px", textAlign: "left",
                  cursor: "pointer", fontFamily: "inherit", transition: "all .2s",
                }}
              >
                <div style={{ color: levelId === l.id ? ACC : "#FFF", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{prettyLabel(l.title)}</div>
              </button>
            ))}
          </div>
        )}
        {step === 4 && (
          <div style={{ animation: "fadeIn .35s ease" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Daily XP goal</h2>
            <p style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 18 }}>How much time do you want to invest daily?</p>
            {goals.map(({ v, l, s }) => (
              <button key={v} onClick={() => setGoal(v)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9, background: goal === v ? "#0D1A2E" : "#151515", border: `1.5px solid ${goal === v ? ACC : "#1E1E1E"}`, borderRadius: 14, padding: "14px 18px", cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}>
                <div>
                  <div style={{ color: goal === v ? ACC : "#FFF", fontWeight: 700, fontSize: 15 }}>{l}</div>
                  <div style={{ color: "#6B7280", fontSize: 12 }}>{s}/day</div>
                </div>
                <div style={{ color: ACC, fontWeight: 800, fontSize: 17 }}>{v} XP</div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 18 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ width: i === step ? 22 : 6, height: 6, borderRadius: 999, background: i === step ? ACC : "#222", transition: "all .3s" }} />
          ))}
        </div>
        <button onClick={handleNext} disabled={!ok}
          style={{ width: "100%", background: ok ? "linear-gradient(135deg,#4F8CFF,#2563EB)" : "#1A1A1A", color: ok ? "#FFF" : "#444", border: "none", borderRadius: 16, padding: 18, fontSize: 16, fontWeight: 700, cursor: ok ? "pointer" : "not-allowed", fontFamily: "inherit", boxShadow: ok ? "0 8px 28px rgba(79,140,255,.3)" : "none", transition: "all .2s" }}>
          {step === 4 ? "Create Account →" : "Continue"}
        </button>
      </div>
    </div>
  );
}
