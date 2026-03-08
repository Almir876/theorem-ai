import { AppIcon, SkillGlyph } from "../../ui/icons.jsx";
import { ACHIEVEMENTS_DEF, ACC, isLocked, prettyLabel } from "../../ui/uiUtils.js";

export default function Stats({ ud, skills, skillMeta, allLessons }) {
  const totalXP = ud.xp + Object.values(skills).reduce((s, k) => s + (k.xp || 0), 0);
  const mastered = (skillMeta || []).filter((s) => skills[s.id]?.mastered).length;
  const weekXP = [20, 45, 80, 30, 60, 75, Math.min(totalXP % 90 + 10, 90)];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const mx = Math.max(...weekXP, 1);

  const achievements = ACHIEVEMENTS_DEF.map((a) => ({
    ...a,
    earned: (a.id === "first_lesson" && Object.values(skills).some((s) => s.progress > 0))
      || (a.id === "streak_3" && ud.streak >= 3)
      || (a.id === "master" && mastered > 0)
      || (a.id === "streak_7" && ud.streak >= 7),
  }));

  return (
    <div className="screen-enter" style={{ overflowY: "auto", height: "100vh", padding: "52px 24px 80px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px" }}>Progress</h1>
      <p style={{ color: "#6B7280", fontSize: 13, margin: "0 0 18px" }}>Your math journey so far.</p>

      <div style={{ display: "flex", gap: 9, marginBottom: 14 }}>
        {[{ l: "Total XP", v: totalXP, i: "xp", c: ACC }, { l: "Streak", v: `${ud.streak}d`, i: "streak", c: "#F59E0B" }, { l: "Mastered", v: mastered, i: "trophy", c: "#10B981" }].map((s) => (
          <div key={s.l} className="glass-card stat-tile" style={{ flex: 1, borderRadius: 16, padding: "12px 9px", textAlign: "center" }}>
            <div style={{ marginBottom: 3, display: "flex", justifyContent: "center" }}><AppIcon name={s.i} size={19} color={s.c} /></div>
            <div style={{ fontWeight: 800, fontSize: 18, color: s.c }}>{s.v}</div>
            <div style={{ color: "#6B7280", fontSize: 10, marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div className="glass-card elevated-card" style={{ borderRadius: 20, padding: 18, marginBottom: 13 }}>
        <h3 style={{ margin: "0 0 13px", fontSize: 14, fontWeight: 700 }}>Weekly XP</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 7, height: 70 }}>
          {weekXP.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ width: "100%", borderRadius: 6, background: i === 6 ? "linear-gradient(180deg,#4F8CFF,#2563EB)" : "rgba(148, 163, 184, .16)", height: `${(v / mx) * 100}%`, minHeight: 4, boxShadow: i === 6 ? "0 0 10px rgba(79,140,255,.4)" : "none" }} />
              <span style={{ fontSize: 9, color: "#444" }}>{days[i]}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 8, color: ACC, fontWeight: 700, fontSize: 12 }}>
          This week: {weekXP.reduce((a, b) => a + b, 0)} XP
        </div>
      </div>

      <div className="glass-card" style={{ borderRadius: 20, padding: 18, marginBottom: 13 }}>
        <h3 style={{ margin: "0 0 13px", fontSize: 14, fontWeight: 700 }}>Topic Mastery</h3>
        {(skillMeta || []).map((s) => {
          const locked = isLocked(s.id, skills, skillMeta);
          const m = skills[s.id]?.mastered;
          const prog = skills[s.id]?.progress || 0;
          const total = allLessons?.[s.id]?.length || 1;
          const pct = m ? 100 : Math.round((prog / total) * 100);
          const col = m ? "#4ADE80" : locked ? "#1A1A1A" : ACC;
          return (
            <div key={s.id} style={{ marginBottom: 11 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: locked ? "#444" : "#D1D5DB", display: "flex", alignItems: "center", gap: 6 }}>
                  <SkillGlyph skill={s} size={14} color={locked ? "#444" : "#93C5FD"} />{prettyLabel(s.title)}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: locked ? "#333" : col }}>
                  {locked ? "Locked" : m ? "100%" : `${pct}%`}
                </span>
              </div>
              <div style={{ background: "rgba(148, 163, 184, .16)", borderRadius: 999, height: 5 }}>
                <div style={{ width: `${pct}%`, height: "100%", background: locked ? "rgba(148, 163, 184, .16)" : `linear-gradient(90deg,${col}88,${col})`, borderRadius: 999, boxShadow: pct > 0 && !locked ? `0 0 6px ${col}44` : "none" }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card" style={{ borderRadius: 20, padding: 18 }}>
        <h3 style={{ margin: "0 0 13px", fontSize: 14, fontWeight: 700 }}>Achievements</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {achievements.map((a) => (
            <div key={a.id} className="glass-card" style={{ background: a.earned ? "linear-gradient(145deg, rgba(11, 24, 48, .82), rgba(8, 20, 42, .76))" : "rgba(15, 15, 15, .55)", border: `1px solid ${a.earned ? "#1B3460" : "#1A1A1A"}`, borderRadius: 13, padding: "9px 12px", display: "flex", alignItems: "center", gap: 8, opacity: a.earned ? 1 : .3 }}>
              <span style={{ display: "inline-flex", opacity: a.earned ? 1 : .7 }}><AppIcon name={a.icon} size={17} color={a.earned ? ACC : "#555"} /></span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: a.earned ? "#FFF" : "#333" }}>{a.title}</div>
                <div style={{ fontSize: 10, color: "#555" }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
