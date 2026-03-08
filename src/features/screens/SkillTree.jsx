import { useState } from "react";
import { AppIcon, MasteredGlyph, SkillGlyph, XPBar } from "../../ui/icons.jsx";
import { ACC, isLocked, prettyLabel } from "../../ui/uiUtils.js";

export default function SkillTree({ skills, startLesson, startDeepDive, skillMeta, allLessons, deepDive }) {
  const [modal, setModal] = useState(null);

  return (
    <div className="screen-enter" style={{ overflowY: "auto", height: "100vh", paddingBottom: 80 }}>
      <div className="glass-card" style={{ margin: "52px 24px 16px", borderRadius: 20, padding: "16px 18px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 2px" }}>Skill Tree</h1>
        <p style={{ color: "#6B7280", fontSize: 13, margin: 0 }}>Unlock topics by mastering prerequisites</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 24px 20px" }}>
        {(skillMeta || []).map((skill, i) => {
          const locked = isLocked(skill.id, skills, skillMeta);
          const mastered = skills[skill.id]?.mastered;
          const active = !locked && !mastered;
          const progress = skills[skill.id]?.progress || 0;
          const total = allLessons?.[skill.id]?.length || 1;
          const isLeft = i % 2 === 0;

          return (
            <div key={skill.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", animation: "fadeIn .3s ease both", animationDelay: `${i * 0.06}s` }}>
              {i > 0 && (
                <div style={{ width: 2, height: 28, background: mastered ? ACC : "#1E1E1E", transition: "background .3s" }} />
              )}
              <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: isLeft ? "flex-start" : "flex-end", gap: 14 }}>
                {!isLeft && (
                  <div style={{ flex: 1, textAlign: "right", animation: "slideIn .3s ease both", animationDelay: `${i * 0.06 + 0.05}s` }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: locked ? "#2A2A2A" : "#FFF" }}>{prettyLabel(skill.title)}</div>
                    <div style={{ fontSize: 11, color: locked ? "#1E1E1E" : "#6B7280", marginTop: 2 }}>
                      {mastered ? "Mastered" : active ? `${progress}/${total} done` : locked ? "Locked" : "Available"} · {skill.xpReward} XP
                    </div>
                  </div>
                )}
                <button onClick={() => !locked && setModal(skill)} className="skill-node" style={{
                  width: 68, height: 68, borderRadius: "50%", flexShrink: 0,
                  border: `3px solid ${mastered ? "#7BAAFF" : active ? ACC : "rgba(148, 163, 184, .26)"}`,
                  background: mastered || active ? "linear-gradient(145deg, rgba(13, 26, 46, .92), rgba(7, 18, 38, .88))" : "rgba(8, 11, 19, .74)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: locked ? "not-allowed" : "pointer",
                  boxShadow: active ? "0 0 20px rgba(79,140,255,.45),0 0 40px rgba(79,140,255,.15)" : mastered ? "0 0 16px rgba(79,140,255,.2)" : "none",
                  position: "relative", fontFamily: "inherit",
                }}>
                  {locked
                    ? <AppIcon name="lock" size={18} color="#2A2A2A" />
                    : <SkillGlyph skill={skill} size={24} color={mastered || active ? ACC : "#64748B"} />}
                  {mastered && (
                    <div style={{ position: "absolute", bottom: -4, right: -4, background: "#0B0B0B", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #4F8CFF" }}>
                      <MasteredGlyph size={11} />
                    </div>
                  )}
                </button>
                {isLeft && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: locked ? "#2A2A2A" : "#FFF" }}>{prettyLabel(skill.title)}</div>
                    <div style={{ fontSize: 11, color: locked ? "#1E1E1E" : "#6B7280", marginTop: 2 }}>
                      {mastered ? "Mastered" : active ? `${progress}/${total} done` : locked ? "Locked" : "Available"} · {skill.xpReward} XP
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <div onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", backdropFilter: "blur(4px)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn .18s ease" }}>
          <div onClick={(e) => e.stopPropagation()} className="glass-card" style={{ background: "linear-gradient(150deg, rgba(17, 21, 34, .94), rgba(8, 12, 24, .92))", border: "1px solid rgba(148, 163, 184, .24)", borderRadius: "24px 24px 0 0", padding: "26px 24px 40px", width: "100%", maxWidth: 430, animation: "slideUp .28s cubic-bezier(.34,1.56,.64,1)" }}>
            <div style={{ width: 36, height: 4, borderRadius: 999, background: "#2A2A2A", margin: "0 auto 20px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div className="glass-card" style={{ width: 50, height: 50, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: ACC }}>
                <SkillGlyph skill={modal} size={24} color={ACC} />
              </div>
              <div>
                <h2 style={{ fontSize: 19, fontWeight: 800, margin: "0 0 2px" }}>{prettyLabel(modal.title)}</h2>
                <div style={{ color: "#6B7280", fontSize: 12 }}>+{modal.xpReward} XP on completion</div>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#9CA3AF", fontSize: 12 }}>Lesson progress</span>
                <span style={{ color: ACC, fontSize: 12, fontWeight: 700 }}>{skills[modal.id]?.progress || 0} / {allLessons?.[modal.id]?.length || 0}</span>
              </div>
              <XPBar current={skills[modal.id]?.progress || 0} max={allLessons?.[modal.id]?.length || 1} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
              {allLessons?.[modal.id]?.filter((q) => q.type === "explanation").map((q) => (
                <div key={q.id} className="glass-card" style={{ borderRadius: 8, padding: "4px 10px", fontSize: 12, color: "#9CA3AF" }}>{prettyLabel(q.title)}</div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => { setModal(null); startLesson(modal.id); }} style={{ width: "100%", background: "linear-gradient(135deg,#4F8CFF,#2563EB)", color: "#FFF", border: "none", borderRadius: 16, padding: 17, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 28px rgba(79,140,255,.3)", marginBottom: skills[modal.id]?.mastered && deepDive?.[modal.id]?.length ? 10 : 0 }}>
              {skills[modal.id]?.mastered ? "Review Lesson →" : skills[modal.id]?.progress > 0 ? "Continue →" : "Start Lesson →"}
            </button>
            {skills[modal.id]?.mastered && deepDive?.[modal.id]?.length > 0 && (
              <button className="btn-primary interactive-press" onClick={() => { setModal(null); startDeepDive(modal.id); }} style={{ width: "100%", background: "rgba(11, 24, 48, .75)", border: "1.5px solid #1D4ED8", borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", color: "#60A5FA", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <AppIcon name="sparkle" size={14} color="#60A5FA" /> Deep Dive ({deepDive[modal.id].length} challenges)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
