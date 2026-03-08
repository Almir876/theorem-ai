import { useEffect, useRef, useState } from "react";
import { AppIcon, SkillGlyph } from "../../ui/icons.jsx";
import { ACC, isLocked, prettyLabel } from "../../ui/uiUtils.js";

function QCard({ q, sel, setSel, fill, setFill }) {
  const isChoiceType = q.type === "multiple_choice" || q.type === "application";
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, lineHeight: 1.5, letterSpacing: -.3 }}>{q.question}</h2>
      {isChoiceType && (
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {(q.options || []).map((opt, i) => (
            <button key={i} onClick={() => setSel(i)} className="interactive-press" style={{ background: sel === i ? "#0D1A2E" : "rgba(13, 18, 32, .72)", border: `1.5px solid ${sel === i ? ACC : "rgba(148, 163, 184, .24)"}`, borderRadius: 13, padding: "14px 16px", textAlign: "left", cursor: "pointer", color: sel === i ? ACC : "#FFF", fontWeight: 600, fontSize: 15, fontFamily: "inherit" }}>
              <span style={{ color: "#555", marginRight: 10, fontSize: 12 }}>{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          ))}
        </div>
      )}
      {q.type === "fill_blank" && (
        <input type="text" value={fill} onChange={(e) => setFill(e.target.value)} placeholder="Your answer…"
          style={{ width: "100%", background: "#151515", border: `1.5px solid ${fill ? ACC : "#1E1E1E"}`, borderRadius: 14, padding: "17px", color: "#FFF", fontSize: 18, fontWeight: 700, fontFamily: "inherit", outline: "none", boxSizing: "border-box", textAlign: "center" }}
        />
      )}
    </div>
  );
}

export default function TestMode({ skills, skillMeta, allLessons, onActivityChange }) {
  const [active, setActive] = useState(null);
  const [qi, setQi] = useState(0);
  const [ans, setAns] = useState({});
  const [sel, setSel] = useState(null);
  const [fill, setFill] = useState("");
  const [done, setDone] = useState(false);
  const [timeLeft, setTime] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (onActivityChange) {
      onActivityChange(!!(active && !done));
    }
  }, [active, done, onActivityChange]);

  useEffect(() => () => {
    if (onActivityChange) onActivityChange(false);
  }, [onActivityChange]);

  const tests = (skillMeta || []).map((s) => ({
    ...s,
    questions: (allLessons?.[s.id] || []).filter((q) => q.type !== "explanation" && q.type !== "reflection"),
    unlocked: !isLocked(s.id, skills, skillMeta) || skills[s.id]?.mastered,
    time: Math.max(((allLessons?.[s.id] || []).filter((q) => q.type !== "explanation" && q.type !== "reflection").length) * 45, 60),
  })).filter((t) => t.questions.length > 0);

  useEffect(() => {
    if (active && timeLeft > 0 && !done) { timer.current = setTimeout(() => setTime((t) => t - 1), 1000); }
    else if (active && timeLeft === 0 && !done) { setDone(true); }
    return () => clearTimeout(timer.current);
  }, [active, timeLeft, done]);

  const startTest = (t) => { setActive(t); setTime(t.time); setQi(0); setAns({}); setSel(null); setFill(""); setDone(false); };

  if (done && active) {
    const qs = active.questions;
    const correct = qs.filter((q, i) => {
      if (q.type === "multiple_choice") return ans[i] === q.answer;
      return String(ans[i] || "").trim() === String(q.answer).trim();
    }).length;
    const pct = qs.length > 0 ? Math.round((correct / qs.length) * 100) : 0;
    const weak = qs.filter((q, i) => {
      if (q.type === "multiple_choice") return ans[i] !== q.answer;
      return String(ans[i] || "").trim() !== String(q.answer).trim();
    });
    return (
      <div style={{ overflowY: "auto", height: "100vh", padding: "56px 24px calc(80px + env(safe-area-inset-bottom))", background: "var(--bg-base)" }}>
        <h1 style={{ fontSize: 25, fontWeight: 800, marginBottom: 3 }}>Results</h1>
        <p style={{ color: "#6B7280", fontSize: 13, marginBottom: 18 }}>{prettyLabel(active.title)}</p>
        <div className="glass-card elevated-card" style={{ borderRadius: 20, padding: 22, textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 58, fontWeight: 800, color: pct >= 70 ? "#4ADE80" : "#F87171" }}>{pct}%</div>
          <p style={{ color: "#9CA3AF", margin: "5px 0 0" }}>{correct} / {qs.length} correct</p>
        </div>
        {weak.length > 0 && (
          <div className="glass-card" style={{ background: "linear-gradient(145deg, rgba(11, 24, 48, .82), rgba(8, 20, 42, .76))", border: "1px solid #1B3460", borderRadius: 16, padding: 16, marginBottom: 14 }}>
            <div style={{ color: ACC, fontWeight: 700, fontSize: 12, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><AppIcon name="book" size={12} color={ACC} /> Review these questions:</div>
            {weak.slice(0, 4).map((q, i) => (
              <p key={i} style={{ color: "#93C5FD", fontSize: 13, margin: "0 0 5px" }}>• {q.question.slice(0, 65)}…</p>
            ))}
          </div>
        )}
        <button onClick={() => setActive(null)} className="btn-primary" style={{ width: "100%", background: ACC, color: "#FFF", border: "none", borderRadius: 16, padding: 17, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Back to Tests</button>
      </div>
    );
  }

  if (active) {
    const qs = active.questions;
    const q = qs[qi];
    if (!q) { setDone(true); return null; }
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-base)", overflow: "hidden" }}>
        <div style={{ padding: "50px 24px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ color: "#9CA3AF", fontWeight: 700, fontSize: 13 }}>{qi + 1} / {qs.length}</span>
          <div className="glass-card" style={{ borderRadius: 10, padding: "5px 14px", border: "1px solid rgba(148, 163, 184, .22)" }}>
            <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 18, color: timeLeft < 30 ? "#F87171" : ACC }}>{mins}:{String(secs).padStart(2, "0")}</span>
          </div>
          <button onClick={() => setDone(true)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>End</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 24px" }}>
          <QCard q={q} sel={sel} setSel={setSel} fill={fill} setFill={setFill} />
        </div>
        <div style={{ padding: "8px 24px calc(28px + env(safe-area-inset-bottom))", flexShrink: 0, position: "sticky", bottom: 0, background: "var(--bg-base)" }}>
          <button onClick={() => {
            const v = q.type === "multiple_choice" ? sel : fill;
            setAns((a) => ({ ...a, [qi]: v }));
            setSel(null);
            setFill("");
            if (qi + 1 >= qs.length) setDone(true); else setQi((i) => i + 1);
          }} className="btn-primary" disabled={sel === null && fill === ""} style={{ width: "100%", background: (sel !== null || fill) ? "linear-gradient(135deg,#4F8CFF,#2563EB)" : "#1A1A1A", color: (sel !== null || fill) ? "#FFF" : "#444", border: "none", borderRadius: 16, padding: 18, fontSize: 16, fontWeight: 700, cursor: (sel !== null || fill) ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
            {qi + 1 >= qs.length ? "Submit →" : "Next →"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-enter" style={{ overflowY: "auto", height: "100vh", padding: "52px 24px calc(80px + env(safe-area-inset-bottom))" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px" }}>Test Mode</h1>
      <p style={{ color: "#6B7280", fontSize: 13, margin: "0 0 20px" }}>Challenge yourself on any topic.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {tests.map((t) => (
          <div key={t.id} className="glass-card" style={{ borderRadius: 18, padding: 18, opacity: t.unlocked ? 1 : .45 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div className="glass-card" style={{ width: 40, height: 40, background: "linear-gradient(145deg, rgba(11, 24, 48, .86), rgba(8, 20, 42, .82))", border: "1px solid #1B3460", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", color: ACC, flexShrink: 0 }}>
                <SkillGlyph skill={t} size={20} color={ACC} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{prettyLabel(t.title)}</h3>
                <p style={{ margin: "2px 0 0", color: "#6B7280", fontSize: 12 }}>{t.questions.length} questions · {Math.floor(t.time / 60)} min</p>
              </div>
            </div>
            <button onClick={() => t.unlocked && startTest(t)} className="interactive-press" disabled={!t.unlocked} style={{ width: "100%", background: t.unlocked ? "rgba(13,26,46,.68)" : "rgba(15,15,15,.55)", border: `1px solid ${t.unlocked ? "#1B3460" : "#1A1A1A"}`, borderRadius: 12, padding: "11px", color: t.unlocked ? ACC : "#333", fontWeight: 700, fontSize: 14, cursor: t.unlocked ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
              {t.unlocked ? "Start Test →" : "Complete prerequisites first"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
