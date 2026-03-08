import { useEffect, useState } from "react";
import { curriculumCatalog } from "../../content/index.js";
import { ACC, prettyLabel } from "../../ui/uiUtils.js";

export default function SettingsPage({ ud, userName, setUd, setUserName, onLogout, onBack, onResetProgress }) {
  const [draftName, setDraftName] = useState(userName || "Learner");
  const [nameSaved, setNameSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const goals = [
    { v: 20, l: "Casual", s: "~5 min/day" },
    { v: 50, l: "Regular", s: "~10 min/day" },
    { v: 100, l: "Serious", s: "~20 min/day" },
    { v: 200, l: "Intense", s: "~40 min/day" },
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
    <div className="screen-enter" style={{ overflowY: "auto", height: "100vh", padding: "52px 24px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <button
          onClick={onBack}
          className="interactive-press"
          aria-label="Close settings"
          style={{ width: 34, height: 34, borderRadius: 0, border: "none", background: "transparent", color: "#9CA3AF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >
          <span aria-hidden="true" style={{ color: "#9CA3AF", fontSize: 22, lineHeight: 1, fontWeight: 500 }}>×</span>
        </button>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: -.5 }}>Settings</h1>
          <p style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>Manage your account and learning preferences</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="glass-card" style={{ borderRadius: 18, padding: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>Profile</h2>
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
            style={{ width: "100%", background: "#151515", border: `1.5px solid ${nameChanged && nameValid ? ACC : "#222"}`, borderRadius: 12, padding: "13px 14px", color: "#FFF", fontSize: 15, fontFamily: "inherit", outline: "none", marginBottom: 9 }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span style={{ color: nameSaved ? "#4ADE80" : "#6B7280", fontSize: 12 }}>
              {nameSaved ? "Name saved" : trimmedName.length > 0 && trimmedName.length < 2 ? "Minimum 2 characters" : "Max 12 characters"}
            </span>
            <button
              onClick={handleSaveName}
              disabled={!nameValid || !nameChanged}
              className="interactive-press"
              style={{ border: "none", borderRadius: 10, padding: "9px 12px", fontFamily: "inherit", fontWeight: 700, fontSize: 12, background: nameValid && nameChanged ? ACC : "#1A1A1A", color: nameValid && nameChanged ? "#FFF" : "#444", cursor: nameValid && nameChanged ? "pointer" : "not-allowed" }}
            >
              Save Name
            </button>
          </div>
        </div>

        <div className="glass-card" style={{ borderRadius: 18, padding: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>Learning</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {goals.map((g) => (
              <button
                key={g.v}
                onClick={() => handleGoalChange(g.v)}
                className="interactive-press"
                style={{
                  borderRadius: 12,
                  border: `1.5px solid ${ud.dailyGoal === g.v ? ACC : "#232323"}`,
                  background: ud.dailyGoal === g.v ? "#0D1A2E" : "#141414",
                  color: ud.dailyGoal === g.v ? ACC : "#D1D5DB",
                  padding: "10px 12px",
                  textAlign: "left",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700 }}>{g.l}</div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{g.s}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ borderRadius: 18, padding: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>Curriculum</h2>
          <p style={{ color: "#6B7280", fontSize: 12, margin: "0 0 8px" }}>Program</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {curriculumList.map((curriculum) => (
              <button
                key={curriculum.id}
                onClick={() => handleCurriculumChange(curriculum.id)}
                className="interactive-press"
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "11px 12px",
                  borderRadius: 12,
                  border: `1.5px solid ${ud.curriculumId === curriculum.id ? ACC : "#232323"}`,
                  background: ud.curriculumId === curriculum.id ? "#0D1A2E" : "#141414",
                  color: ud.curriculumId === curriculum.id ? ACC : "#D1D5DB",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {prettyLabel(curriculum.title)}
              </button>
            ))}
          </div>
          <p style={{ color: "#6B7280", fontSize: 12, margin: "0 0 8px" }}>Level</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleLevelChange(level.id)}
                className="interactive-press"
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "11px 12px",
                  borderRadius: 12,
                  border: `1.5px solid ${ud.levelId === level.id ? ACC : "#232323"}`,
                  background: ud.levelId === level.id ? "#0D1A2E" : "#141414",
                  color: ud.levelId === level.id ? ACC : "#D1D5DB",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {prettyLabel(level.title)}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ borderRadius: 18, padding: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>Account</h2>
          <button
            onClick={onLogout}
            className="interactive-press"
            style={{ width: "100%", borderRadius: 12, border: "1.5px solid #2A2A2A", background: "#161616", color: "#D1D5DB", fontFamily: "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: "12px 14px", textAlign: "center" }}
          >
            Logout
          </button>
        </div>

        <div className="glass-card" style={{ borderRadius: 18, padding: 16, border: "1px solid rgba(220, 38, 38, .45)", background: "linear-gradient(145deg, rgba(45, 14, 14, .55), rgba(22, 8, 8, .52))" }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 6px", color: "#FCA5A5" }}>Danger Zone</h2>
          <p style={{ color: "#FCA5A5", fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>
            Reset all progress data for this account while keeping your login and preferences.
          </p>
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="interactive-press"
              style={{ width: "100%", borderRadius: 12, border: "1.5px solid #B91C1C", background: "#7F1D1D", color: "#FFF", fontFamily: "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: "12px 14px" }}
            >
              Reset All Progress
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ color: "#FECACA", fontSize: 12, margin: 0 }}>
                This cannot be undone. Your XP, streak, and lesson progress will be removed.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleReset}
                  className="interactive-press"
                  style={{ flex: 1, borderRadius: 10, border: "1.5px solid #DC2626", background: "#B91C1C", color: "#FFF", fontFamily: "inherit", fontWeight: 700, fontSize: 12, cursor: "pointer", padding: "10px 12px" }}
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="interactive-press"
                  style={{ flex: 1, borderRadius: 10, border: "1.5px solid #3A3A3A", background: "#1A1A1A", color: "#D1D5DB", fontFamily: "inherit", fontWeight: 700, fontSize: 12, cursor: "pointer", padding: "10px 12px" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {resetDone && (
            <p style={{ color: "#86EFAC", fontSize: 12, margin: "10px 0 0" }}>Progress reset successfully.</p>
          )}
        </div>
      </div>
    </div>
  );
}
