const DAY_MS = 86_400_000;

export function buildDefaultSkills(skillMeta, allLessons) {
  const base = Object.fromEntries((skillMeta || []).map((s) => [s.id, {
    progress: 0,
    mastered: false,
    xp: 0,
    lastPracticed: null,
    reviewInterval: 1,
    reviewDue: null,
  }]));

  for (const s of skillMeta || []) {
    const total = allLessons?.[s.id]?.length || 0;
    const cur = base[s.id];
    base[s.id] = { ...cur, mastered: total > 0 ? cur.progress >= total : cur.mastered };
  }

  return base;
}

export function calcReviewDue(accuracy, currentInterval) {
  const newInterval = accuracy >= 0.8 ? Math.min(currentInterval * 2, 21) : 1;
  return { interval: newInterval, due: Date.now() + newInterval * DAY_MS };
}

export function levelKey(curriculumId, levelId) {
  return `${curriculumId}/${levelId}`;
}

export function formatLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateKeyAsUTC(dateKey) {
  if (typeof dateKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return null;
  }
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function diffDateKeys(fromDateKey, toDateKey) {
  const from = parseDateKeyAsUTC(fromDateKey);
  const to = parseDateKeyAsUTC(toDateKey);
  if (from == null || to == null) return null;
  return Math.round((to - from) / DAY_MS);
}

export function resolveStreakAfterActivity(currentStreak, lastStreakDate, activityDateKey) {
  const nextDateKey =
    parseDateKeyAsUTC(activityDateKey) == null
      ? formatLocalDateKey()
      : activityDateKey;
  const previousDateKey = parseDateKeyAsUTC(lastStreakDate) == null ? null : lastStreakDate;
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

export function buildWeeklyStreakDays(streak, lastStreakDate) {
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

export function readProgressCache(userId) {
  try {
    const raw = localStorage.getItem(progressCacheKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeProgressCache(userId, progress) {
  try {
    localStorage.setItem(progressCacheKey(userId), JSON.stringify(progress));
  } catch {
    // Ignore cache write errors (private mode/quota).
  }
}

export function getCompletedLessons(skillsByLevel) {
  const completed = [];
  for (const [lvlKey, lvlSkills] of Object.entries(skillsByLevel || {})) {
    for (const [skillId, skillState] of Object.entries(lvlSkills || {})) {
      if (skillState?.mastered) completed.push(`${lvlKey}:${skillId}`);
    }
  }
  return completed;
}

function isDefaultSkillState(skillState) {
  if (!skillState || typeof skillState !== "object") return true;
  const progress = Number(skillState.progress) || 0;
  const xp = Number(skillState.xp) || 0;
  const reviewInterval = Number(skillState.reviewInterval) || 1;
  return (
    !skillState.mastered &&
    progress <= 0 &&
    xp <= 0 &&
    !skillState.lastPracticed &&
    !skillState.reviewDue &&
    reviewInterval <= 1
  );
}

export function compactSkillsByLevel(skillsByLevel) {
  const compact = {};
  for (const [lvlKey, lvlSkills] of Object.entries(skillsByLevel || {})) {
    const nextSkills = {};
    for (const [skillId, skillState] of Object.entries(lvlSkills || {})) {
      if (!isDefaultSkillState(skillState)) {
        nextSkills[skillId] = skillState;
      }
    }
    if (Object.keys(nextSkills).length > 0) {
      compact[lvlKey] = nextSkills;
    }
  }
  return compact;
}

export function expandSkillsByLevel(skillsByLevel) {
  const expanded = {};
  for (const [lvlKey, lvlSkills] of Object.entries(skillsByLevel || {})) {
    expanded[lvlKey] = { ...(lvlSkills || {}) };
  }
  return expanded;
}
