import { buildWeeklyStreakDays } from "../../lib/progressUtils.js";
import { AppIcon, MasteredGlyph, SkillGlyph, StreakFlame, XPBar } from "../../ui/icons.jsx";
import { ACC, isLocked, prettyLabel } from "../../ui/uiUtils.js";

export default function Home({ ud, skills, startLesson, skillMeta, allLessons, userName, onOpenSettings }) {
  const totalXP = ud.xp + Object.values(skills).reduce((s, k) => s + (k.xp || 0), 0);
  const dayXP = Math.min(ud.xp % (ud.dailyGoal || 50) + 30, ud.dailyGoal);
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const doneDays = buildWeeklyStreakDays(ud.streak, ud.lastStreakDate);
  const activeSkill = (skillMeta || []).find((s) => !skills[s.id]?.mastered && !isLocked(s.id, skills, skillMeta));
  const masteredCount = (skillMeta || []).filter((s) => skills[s.id]?.mastered).length;
  const displayName = userName || "Learner";

  const now = Date.now();
  const dueForReview = (skillMeta || []).filter((s) => {
    const sk = skills[s.id];
    return sk?.mastered && sk.reviewDue && sk.reviewDue <= now;
  }).map((s) => {
    const daysOverdue = Math.floor((now - skills[s.id].reviewDue) / 86_400_000);
    return { ...s, daysOverdue };
  });

  const recs = (skillMeta || [])
    .filter((s) => !isLocked(s.id, skills, skillMeta) && !skills[s.id]?.mastered)
    .slice(0, 3)
    .map((s) => ({ title: s.title, skillId: s.id, time: "5 min", xp: s.xpReward / 5 | 0 }));

  return (
    <div className="screen-enter" style={{ overflowY: "auto", height: "100vh", paddingBottom: 80 }}>
      <div style={{ padding: "52px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14 }}>
          <div>
            <p style={{ color: "#6B7280", fontSize: 11, letterSpacing: .8, margin: 0 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }).toUpperCase()}
            </p>
            <h1 style={{ fontSize: 23, fontWeight: 800, margin: "4px 0 0", letterSpacing: -.5 }}>
              Welcome back, {displayName}
            </h1>
          </div>
          <button
            onClick={onOpenSettings}
            className="interactive-press"
            aria-label="Open settings"
            style={{ minWidth: 38, height: 38, borderRadius: 0, border: "none", background: "transparent", color: "#9CA3AF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <AppIcon name="settings" size={19} color="#9CA3AF" />
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#1E1A10", border: "1px solid #3D2E00", borderRadius: 20, padding: "5px 11px" }}>
            <AppIcon name="streak" size={24} color="#F59E0B" />
            <span style={{ color: "#F59E0B", fontWeight: 700, fontSize: 13 }}>{ud.streak}d</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#0D1A2E", border: "1px solid #1B3460", borderRadius: 20, padding: "5px 11px" }}>
            <AppIcon name="xp" size={20} color={ACC} />
            <span style={{ color: ACC, fontWeight: 700, fontSize: 13 }}>{totalXP} XP</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "18px 24px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="glass-card" style={{ background: "#111317", borderRadius: 20, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Daily Goal</span>
            <span style={{ color: ACC, fontWeight: 700, fontSize: 12 }}>{Math.min(dayXP, ud.dailyGoal)} / {ud.dailyGoal} XP</span>
          </div>
          <XPBar current={Math.min(dayXP, ud.dailyGoal)} max={ud.dailyGoal} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 13 }}>
            {days.map((d, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div style={{ width: 29, height: 29, borderRadius: 9, background: doneDays[i] ? "#0D1A2E" : "#1A1A1A", border: `1.5px solid ${doneDays[i] ? ACC : "#252525"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: ACC }}>
                  {doneDays[i] ? <AppIcon name="check" size={12} color={ACC} /> : null}
                </div>
                <span style={{ fontSize: 9, color: "#444" }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        {activeSkill ? (
          <div className="tap-card glass-card elevated-card interactive-press continue-card" onClick={() => startLesson(activeSkill.id)} style={{ borderRadius: 20, padding: 20, cursor: "pointer", position: "relative", overflow: "hidden" }}>
            <div className="continue-ambient" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: 10, color: ACC, fontWeight: 700, letterSpacing: 1 }}>CONTINUE LEARNING</span>
                <h3 style={{ fontSize: 19, fontWeight: 800, margin: "5px 0 3px", letterSpacing: -.3 }}>{prettyLabel(activeSkill.title)}</h3>
                <p style={{ color: "#9CA3AF", fontSize: 12, margin: 0 }}>
                  {allLessons?.[activeSkill.id]?.length || 0} questions · Tap to start
                </p>
              </div>
              <div className="play-orb" style={{ borderRadius: 12, width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <AppIcon name="play" size={19} color="#E0E7FF" />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <XPBar current={skills[activeSkill.id]?.progress || 0} max={allLessons?.[activeSkill.id]?.length || 1} />
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ background: "linear-gradient(135deg,rgba(6, 24, 12, .88),rgba(4, 18, 10, .78))", borderRadius: 20, padding: 20, border: "1px solid #166534", textAlign: "center" }}>
            <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}><AppIcon name="graduation" size={32} color="#4ADE80" /></div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#4ADE80", margin: "0 0 4px" }}>All topics mastered!</h3>
            <p style={{ color: "#6B7280", fontSize: 13, margin: 0 }}>You've completed the entire skill tree.</p>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
          <div className="glass-card stat-tile" style={{ background: "#111317", flex: 1, borderRadius: 16, padding: 14, textAlign: "center", minHeight: 138, display: "grid", gridTemplateRows: "52px 20px 16px", rowGap: 3, alignContent: "center", justifyItems: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><MasteredGlyph size={34} /></div>
            <div style={{ fontWeight: 800, fontSize: 20, color: "#10B981", lineHeight: 1 }}>{masteredCount}</div>
            <div style={{ color: "#6B7280", fontSize: 11 }}>Mastered</div>
          </div>
          <div className="glass-card stat-tile" style={{ background: "#111317", flex: 1, borderRadius: 16, padding: 14, textAlign: "center", minHeight: 138, display: "grid", gridTemplateRows: "52px 20px 16px", rowGap: 3, alignContent: "center", justifyItems: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><StreakFlame streak={ud.streak} /></div>
            <div style={{ fontWeight: 800, fontSize: 20, color: "#F59E0B", lineHeight: 1 }}>{ud.streak}</div>
            <div style={{ color: "#6B7280", fontSize: 11 }}>Day Streak</div>
          </div>
          <div className="glass-card stat-tile" style={{ background: "#111317", flex: 1, borderRadius: 16, padding: 14, textAlign: "center", minHeight: 138, display: "grid", gridTemplateRows: "52px 20px 16px", rowGap: 3, alignContent: "center", justifyItems: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><AppIcon name="xp" size={34} color={ACC} /></div>
            <div style={{ fontWeight: 800, fontSize: 20, color: ACC, lineHeight: 1 }}>{totalXP}</div>
            <div style={{ color: "#6B7280", fontSize: 11 }}>Total XP</div>
          </div>
        </div>

        {dueForReview.length > 0 && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 10px" }}>Due for Review</h2>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
              {dueForReview.map((s) => (
                <div key={s.id} onClick={() => startLesson(s.id)} className="tap-card glass-card interactive-press" style={{ background: "linear-gradient(145deg, rgba(34, 11, 18, .86), rgba(19, 7, 10, .82))", border: "1px solid rgba(248, 113, 113, .45)", borderRadius: 15, padding: 14, minWidth: 140, cursor: "pointer", flexShrink: 0 }}>
                  <div style={{ marginBottom: 7, display: "flex", alignItems: "center" }}>
                    <SkillGlyph skill={s} size={24} color={ACC} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.4, marginBottom: 7, color: "#FFF" }}>{prettyLabel(s.title)}</div>
                  <div style={{ fontSize: 11, color: "#F87171", fontWeight: 600 }}>
                    {s.daysOverdue === 0 ? "Due today" : `Overdue ${s.daysOverdue}d`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recs.length > 0 && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 10px" }}>Recommended</h2>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
              {recs.map((r, i) => (
                <div key={i} onClick={() => startLesson(r.skillId)} className="tap-card glass-card interactive-press" style={{ borderRadius: 15, padding: 14, minWidth: 140, cursor: "pointer", flexShrink: 0 }}>
                  <div style={{ marginBottom: 7, display: "flex", alignItems: "center" }}>
                    <SkillGlyph skill={{ id: r.skillId, title: r.title }} size={24} color={ACC} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.4, marginBottom: 7 }}>{prettyLabel(r.title)}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#6B7280" }}>{r.time}</span>
                    <span style={{ fontSize: 11, color: ACC, fontWeight: 700 }}>+{r.xp} XP</span>
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
