export const ACC = "#4F8CFF";

export const ACHIEVEMENTS_DEF = [
  { id: "first_lesson", icon: "target", title: "First Steps", desc: "Complete your first lesson" },
  { id: "streak_3", icon: "streak", title: "On Fire", desc: "Maintain a 3-day streak" },
  { id: "perfect", icon: "sparkle", title: "Perfectionist", desc: "Score 100% on a lesson" },
  { id: "speed", icon: "xp", title: "Speed Solver", desc: "Answer correctly in under 5s" },
  { id: "streak_7", icon: "star", title: "Week Warrior", desc: "Maintain a 7-day streak" },
  { id: "master", icon: "trophy", title: "Topic Master", desc: "Master your first topic" },
];

export function prettyLabel(s) {
  return typeof s === "string" ? s.replace(/_/g, " ") : s;
}

export function isLocked(skillId, skills, skillMeta) {
  const sm = (skillMeta || []).find((s) => s.id === skillId);
  if (!sm) return true;
  return sm.prereqs.some((p) => !skills[p]?.mastered);
}
