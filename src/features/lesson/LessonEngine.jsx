import { useRef, useState } from "react";
import { AppIcon } from "../../ui/icons.jsx";
import { ACC } from "../../ui/uiUtils.js";

function buildInitialQueue(questions) {
  const explanations = questions.filter((q) => q.type === "explanation");
  const reflections = questions.filter((q) => q.type === "reflection");
  const tier1 = questions.filter((q) => q.type !== "explanation" && q.type !== "reflection" && (q.difficulty || 1) === 1);
  const tier2 = questions.filter((q) => q.type !== "explanation" && q.type !== "reflection" && (q.difficulty || 1) === 2);
  const tier3 = questions.filter((q) => q.type !== "explanation" && q.type !== "reflection" && (q.difficulty || 1) >= 3);
  return [...explanations, ...tier1, ...tier2, ...tier3, ...reflections];
}

export default function LessonEngine({ skillId, questions: questionsProp, onComplete, onExit, allLessons, isDeepDive }) {
  const baseQs = questionsProp || allLessons?.[skillId] || [];

  const queueRef = useRef(buildInitialQueue(baseQs));
  const [queueIdx, setQueueIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [fill, setFill] = useState("");
  const [sub, setSub] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [xp, setXp] = useState(0);
  const [xpFloat, setXpFloat] = useState(false);
  const [shake, setShake] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiLoad, setAiLoad] = useState(false);
  const [done, setDone] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [correctInARow, setCorrectInARow] = useState(0);
  const [currentTier, setCurrentTier] = useState(1);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const qStart = useRef(Date.now());

  const queue = queueRef.current;
  const q = queue[queueIdx];

  if (!q) return null;

  const totalQuestions = queue.length;
  const progressPct = (queueIdx / Math.max(totalQuestions, 1)) * 100;

  const fetchAI = async (question, wrong) => {
    setAiLoad(true);
    setAiText("");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system: "You are an encouraging math tutor. Give a concise step-by-step explanation in 3 numbered steps using simple language. End with one short motivating line.",
          messages: [{ role: "user", content: `Question: "${question.question}"\nStudent's answer: "${wrong}"\nCorrect answer: "${question.type === "multiple_choice" ? question.options[question.answer] : question.answer}"\n\nExplain how to get the correct answer.` }],
        }),
      });
      const d = await r.json();
      setAiText(d.content?.map((b) => b.text || "").join("") || question.explanation || "Review the hint and try again!");
    } catch {
      setAiText(question.explanation || "Check your working carefully!");
    }
    setAiLoad(false);
  };

  const submit = () => {
    if (q.type === "explanation") { advance(); return; }
    if (q.type === "reflection") { advance(true); return; }

    const elapsed = (Date.now() - qStart.current) / 1000;
    let ok = false;
    let wrong = "";
    if (q.type === "multiple_choice" || q.type === "application") {
      ok = sel === q.answer;
      wrong = (q.options && q.options[sel]) || "no answer";
    }
    if (q.type === "fill_blank") {
      ok = fill.trim().toLowerCase() === String(q.answer).trim().toLowerCase();
      wrong = fill || "blank";
    }

    setSub(true);
    setCorrect(ok);
    setAnsweredCount((c) => c + 1);

    if (ok) {
      const gained = (elapsed < 5 ? 15 : 10) + (q.difficulty || 1) * 5;
      setXp((x) => x + gained);
      setXpFloat(true);
      setTimeout(() => setXpFloat(false), 1500);
      setCorrectCount((c) => c + 1);

      const newCiR = correctInARow + 1;
      setCorrectInARow(newCiR);
      if (newCiR >= 2 && currentTier < 3) {
        const nextTier = currentTier + 1;
        setCurrentTier(nextTier);
        const nextTierQs = baseQs.filter((bq) =>
          (bq.difficulty || 1) === nextTier
          && !queue.slice(queueIdx + 1).some((existing) => existing.id === bq.id));
        if (nextTierQs.length > 0) {
          queue.splice(queueIdx + 1, 0, nextTierQs[0]);
        }
      }
    } else {
      setMistakes((m) => m + 1);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setCorrectInARow(0);
      fetchAI(q, wrong);

      const remedial = baseQs.find((bq) =>
        (bq.difficulty || 1) === 1
          && bq.type !== "explanation"
          && bq.type !== "reflection"
          && bq.id !== q.id
          && !queue.slice(0, queueIdx + 1).some((existing) => existing.id === bq.id));
      if (remedial) {
        queue.splice(queueIdx + 1, 0, { ...remedial, id: `${remedial.id}_retry` });
      }
    }
  };

  const advance = (isReflection = false) => {
    if (isReflection) {
      setXp((x) => x + 10);
    }
    if (queueIdx + 1 >= queue.length) { setDone(true); return; }
    setQueueIdx((i) => i + 1);
    setSel(null);
    setFill("");
    setSub(false);
    setCorrect(null);
    setAiText("");
    setAiLoad(false);
    qStart.current = Date.now();
  };

  const canSubmit =
    q.type === "explanation"
    || (q.type === "reflection" && fill.trim().length > 0)
    || sel !== null
    || (fill !== "" && q.type !== "reflection");

  const practiceTotal = queue.filter((qq) => qq.type !== "explanation" && qq.type !== "reflection").length;

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
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-base)", overflow: "hidden" }}>
      <div style={{ padding: "50px 24px 12px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button onClick={onExit} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4, fontFamily: "inherit", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><AppIcon name="close" size={20} color="#555" /></button>
        <div style={{ flex: 1 }}>
          <div style={{ background: "rgba(10, 14, 25, .9)", borderRadius: 999, height: 7, overflow: "hidden", border: "1px solid rgba(148, 163, 184, .18)" }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg,#4F8CFF,#7BAAFF)", borderRadius: 999, transition: "width .5s ease", boxShadow: "0 0 8px rgba(79,140,255,.5)" }} />
          </div>
        </div>
        <span style={{ color: ACC, fontWeight: 700, fontSize: 12, minWidth: 52, textAlign: "right" }}>+{xp} XP</span>
      </div>

      {xpFloat && (
        <div style={{ position: "absolute", top: 90, right: 22, color: ACC, fontWeight: 800, fontSize: 19, animation: "floatUp 1.4s ease forwards", zIndex: 10, pointerEvents: "none" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>+{(q.difficulty || 1) * 5 + 10} <AppIcon name="xp" size={16} color={ACC} /></span>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", padding: "4px 24px 14px", animation: shake ? "shake .5s ease" : "none" }}>
        {q.type === "explanation"
          ? <ExplCard q={q} />
          : q.type === "reflection"
            ? <ReflectionCard q={q} text={fill} setText={setFill} />
            : <QCard q={q} sel={sel} setSel={setSel} fill={fill} setFill={setFill} submitted={sub} correct={correct} />}
        {aiLoad && (
          <div className="glass-card" style={{ marginTop: 14, border: "1px solid #1B3460", borderRadius: 16, padding: 16 }}>
            <div style={{ color: "#6B7280", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ animation: "pulse 1s infinite" }}>●</span> Generating explanation…
            </div>
          </div>
        )}
        {aiText && !aiLoad && (
          <div className="glass-card" style={{ marginTop: 14, border: "1px solid #1B3460", borderRadius: 16, padding: 16, animation: "slideUp .3s ease" }}>
            <span className="glass-card" style={{ background: "linear-gradient(145deg, rgba(13, 26, 46, .75), rgba(7, 17, 36, .64))", borderRadius: 7, padding: "3px 8px", fontSize: 10, color: ACC, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}><AppIcon name="sparkle" size={11} color={ACC} /> AI EXPLANATION</span>
            <p style={{ color: "#D1D5DB", fontSize: 14, lineHeight: 1.8, margin: "10px 0 0", whiteSpace: "pre-wrap" }}>{aiText}</p>
          </div>
        )}
      </div>

      <div style={{ padding: "8px 24px 28px", flexShrink: 0 }}>
        {!sub ? (
          <button className="btn-primary" onClick={submit} disabled={!canSubmit} style={{ width: "100%", background: canSubmit ? "linear-gradient(135deg,#4F8CFF,#2563EB)" : "#1A1A1A", color: canSubmit ? "#FFF" : "#444", border: "none", borderRadius: 16, padding: 18, fontSize: 16, fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "inherit", boxShadow: canSubmit ? "0 8px 28px rgba(79,140,255,.28)" : "none", transition: "all .2s" }}>
            {q.type === "explanation" ? "Got it →" : q.type === "reflection" ? "Submit Reflection →" : "Check Answer"}
          </button>
        ) : (
          <div>
            {q.type !== "reflection" && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: "11px 14px", background: correct ? "#0A1A0A" : "#1A0A0A", border: `1px solid ${correct ? "#166534" : "#7F1D1D"}`, borderRadius: 12 }}>
                <span style={{ display: "inline-flex" }}>{correct ? <AppIcon name="success" size={17} color="#4ADE80" /> : <AppIcon name="error" size={17} color="#F87171" />}</span>
                <span style={{ fontWeight: 700, color: correct ? "#4ADE80" : "#F87171", fontSize: 14 }}>
                  {correct ? "Correct!" : (q.type === "multiple_choice" || q.type === "application") ? `Answer: ${q.options?.[q.answer]}` : `Answer: ${q.answer}`}
                </span>
              </div>
            )}
            <button className="btn-primary" onClick={() => advance(q.type === "reflection")} style={{ width: "100%", background: "linear-gradient(135deg,#4F8CFF,#2563EB)", color: "#FFF", border: "none", borderRadius: 16, padding: 18, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 28px rgba(79,140,255,.28)" }}>
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
      <div style={{ marginBottom: 14 }}>
        <span style={{ fontSize: 10, color: "#60A5FA", fontWeight: 700, letterSpacing: 1 }}>REFLECTION</span>
        <h2 style={{ fontSize: 19, fontWeight: 800, margin: "6px 0 0", letterSpacing: -.3 }}>Explain It In Your Own Words</h2>
      </div>
      <div className="glass-card" style={{ background: "linear-gradient(145deg, rgba(11, 24, 48, .86), rgba(8, 17, 35, .82))", borderRadius: 16, padding: 18, border: "1px solid #1E3A8A", marginBottom: 14 }}>
        <p style={{ color: "#93C5FD", lineHeight: 1.85, fontSize: 14.5, margin: 0 }}>{q.prompt}</p>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your explanation here…"
        rows={5}
        style={{ width: "100%", background: "rgba(10, 14, 25, .75)", border: "1.5px solid #1E3A8A", borderRadius: 14, padding: 16, color: "#FFF", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "vertical", lineHeight: 1.7 }}
      />
      <p style={{ color: "#6B7280", fontSize: 12, marginTop: 8 }}>No right or wrong - just your own understanding. +10 XP for completing.</p>
    </div>
  );
}

function ExplCard({ q }) {
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <span style={{ fontSize: 10, color: ACC, fontWeight: 700, letterSpacing: 1 }}>CONCEPT</span>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: "5px 0 0", letterSpacing: -.3 }}>{q.title?.replace(/_/g, " ")}</h2>
      </div>
      <div className="glass-card" style={{ borderRadius: 16, padding: 18 }}>
        <p style={{ color: "#D1D5DB", lineHeight: 1.85, fontSize: 14.5, whiteSpace: "pre-wrap", margin: 0 }}>{q.content}</p>
      </div>
      {q.example && (
        <div className="glass-card" style={{ marginTop: 12, background: "linear-gradient(145deg, rgba(11, 24, 48, .85), rgba(8, 20, 42, .8))", borderRadius: 14, padding: 16, border: "1px solid #1B3460" }}>
          <span style={{ fontSize: 10, color: ACC, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 7 }}>EXAMPLE</span>
          <p style={{ color: "#93C5FD", fontFamily: "monospace", fontSize: 14, margin: 0, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{q.example}</p>
        </div>
      )}
    </div>
  );
}

function QCard({ q, sel, setSel, fill, setFill, submitted, correct }) {
  const diffColors = { 1: "#4ADE80", 2: ACC, 3: "#F59E0B", 4: "#60A5FA" };
  const diffLabels = { 1: "BEGINNER", 2: "INTERMEDIATE", 3: "ADVANCED", 4: "CHALLENGE" };
  const isChoiceType = q.type === "multiple_choice" || q.type === "application";
  return (
    <div>
      <span style={{ fontSize: 10, color: diffColors[q.difficulty || 1] || ACC, fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 9 }}>{diffLabels[q.difficulty || 1] || "QUESTION"}</span>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, lineHeight: 1.5, letterSpacing: -.3 }}>{q.question}</h2>
      {isChoiceType && (
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {(q.options || []).map((opt, i) => {
            let bg = "rgba(13, 18, 32, .72)";
            let bd = "rgba(148, 163, 184, .24)";
            let col = "#FFF";
            if (submitted) {
              if (i === q.answer) { bg = "#0A1A0A"; bd = "#166534"; col = "#4ADE80"; }
              else if (i === sel && !correct) { bg = "#1A0A0A"; bd = "#7F1D1D"; col = "#F87171"; }
            } else if (sel === i) { bg = "#0D1A2E"; bd = ACC; col = ACC; }
            return (
              <button key={i} onClick={() => !submitted && setSel(i)} className="interactive-press" style={{ background: bg, border: `1.5px solid ${bd}`, borderRadius: 13, padding: "14px 16px", textAlign: "left", cursor: submitted ? "default" : "pointer", color: col, fontWeight: 600, fontSize: 15, transition: "all .18s", fontFamily: "inherit", backdropFilter: "blur(10px)" }}>
                <span style={{ color: "#555", marginRight: 10, fontSize: 12 }}>{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            );
          })}
        </div>
      )}
      {q.type === "fill_blank" && (
        <div>
          <input type="text" value={fill} onChange={(e) => !submitted && setFill(e.target.value)} placeholder="Your answer…"
            style={{ width: "100%", background: "#151515", border: `1.5px solid ${submitted ? (correct ? "#166534" : "#7F1D1D") : fill ? ACC : "#1E1E1E"}`, borderRadius: 14, padding: "17px", color: "#FFF", fontSize: 18, fontWeight: 700, fontFamily: "inherit", outline: "none", boxSizing: "border-box", textAlign: "center", transition: "border .2s" }}
          />
          {q.hint && !submitted && (
            <p style={{ color: "#6B7280", fontSize: 12, marginTop: 9, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><AppIcon name="info" size={12} color="#6B7280" /> {q.hint}</p>
          )}
        </div>
      )}
    </div>
  );
}

function LessonDone({ xp, mistakes, total, isDeepDive, onContinue }) {
  const acc = total > 0 ? Math.round(((total - mistakes) / total) * 100) : 100;
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 28px", textAlign: "center", background: "var(--bg-base)" }}>
      <div style={{ animation: "popIn .5s cubic-bezier(.34,1.56,.64,1)" }}>
        <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>{isDeepDive ? <AppIcon name="telescope" size={66} color={ACC} /> : <AppIcon name="celebrate" size={66} color={ACC} />}</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{isDeepDive ? "Deep Dive Complete!" : "Lesson Complete!"}</h1>
        <p style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 28 }}>{isDeepDive ? "Excellent challenge - real mastery takes depth!" : "Keep going - you're building real skills."}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 32 }}>
          {[
            { icon: "xp", l: "XP Earned", v: `+${xp}`, c: ACC },
            { icon: "target", l: "Accuracy", v: `${acc}%`, c: acc === 100 ? "#4ADE80" : "#F59E0B" },
            { icon: "error", l: "Mistakes", v: mistakes, c: mistakes === 0 ? "#4ADE80" : "#F87171" },
          ].map((s) => (
            <div key={s.l} className="glass-card" style={{ borderRadius: 16, padding: "13px 14px", minWidth: 76 }}>
              <div style={{ marginBottom: 4, display: "flex", justifyContent: "center" }}><AppIcon name={s.icon} size={20} color={s.c} /></div>
              <div style={{ fontWeight: 800, fontSize: 16, color: s.c }}>{s.v}</div>
              <div style={{ color: "#6B7280", fontSize: 10, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={onContinue} style={{ width: "100%", background: "linear-gradient(135deg,#4F8CFF,#2563EB)", color: "#FFF", border: "none", borderRadius: 16, padding: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Continue →
        </button>
      </div>
    </div>
  );
}
