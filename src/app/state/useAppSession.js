import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDefaultSelection, loadLevelContent } from "../../content/index.js";
import { auth } from "../../firebase.js";
import {
  loadUserProgress,
  markLessonCompleted,
  recordUserStreakActivity,
  saveUserProgress,
  updateUserXP,
} from "../../services/progressService.js";
import {
  buildDefaultSkills,
  calcReviewDue,
  compactSkillsByLevel,
  expandSkillsByLevel,
  formatLocalDateKey,
  getCompletedLessons,
  levelKey,
  readProgressCache,
  resolveStreakAfterActivity,
  writeProgressCache,
} from "../../lib/progressUtils.js";
import { isLocked } from "../../ui/uiUtils.js";

export default function useAppSession() {
  const defaultSel = getDefaultSelection();
  const [splashDelayDone, setSplashDelayDone] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [lessonId, setLessonId] = useState(null);
  const [deepDiveId, setDeepDiveId] = useState(null);
  const [testBusy, setTestBusy] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("Learner");
  const [authReady, setAuthReady] = useState(false);
  const [progressHydrated, setProgressHydrated] = useState(false);
  const [ud, setUd] = useState({
    xp: 0,
    streak: 0,
    lastStreakDate: null,
    dailyGoal: 50,
    curriculumId: defaultSel.curriculumId,
    levelId: defaultSel.levelId,
  });

  const [content, setContent] = useState(null);
  const [contentErr, setContentErr] = useState("");
  const [contentLoading, setContentLoading] = useState(true);
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
      setSkillsByLevel(expandSkillsByLevel(progress?.skillsByLevel || {}));
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
        setAuthReady(true);
        setProgressHydrated(true);
        return;
      }

      setAuthReady(true);
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
    if (!userId || !progressHydrated) return;
    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current);
    }

    persistTimeoutRef.current = setTimeout(() => {
      const compactSkills = compactSkillsByLevel(skillsByLevel);
      const snapshot = {
        streak: ud.streak,
        lastStreakDate: ud.lastStreakDate || null,
        dailyGoal: ud.dailyGoal,
        curriculumId: ud.curriculumId,
        levelId: ud.levelId,
        onboarded,
        displayName: userName,
        skillsByLevel: compactSkills,
        completedLessons: getCompletedLessons(compactSkills),
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
  }, [onboarded, progressHydrated, skillsByLevel, ud, userId, userName]);

  useEffect(() => {
    let alive = true;
    setContentLoading(true);
    setContentErr("");
    loadLevelContent(ud.curriculumId, ud.levelId)
      .then((c) => {
        if (!alive) return;
        setContent({ skillMeta: c.skillMeta || [], allLessons: c.allLessons || {}, deepDive: c.deepDive || {} });
        setContentLoading(false);
        setSkillsByLevel((prev) => {
          const k = levelKey(ud.curriculumId, ud.levelId);
          const defaults = buildDefaultSkills(c.skillMeta || [], c.allLessons || {});
          const current = prev[k] || {};
          const merged = { ...defaults, ...current };
          if (prev[k] && Object.keys(defaults).every((skillId) => current[skillId])) {
            return prev;
          }
          return { ...prev, [k]: merged };
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
    const total = content?.allLessons?.[lessonId]?.length || 1;
    const activityDateKey = formatLocalDateKey();
    const accuracy = practiceAnswered > 0 ? correctAnswered / practiceAnswered : 1;
    const qAnswered = queueLen;
    const curLevel = skillsByLevel[activeKey] || {};
    const cur = curLevel[lessonId] || { progress: 0, mastered: false, xp: 0, lastPracticed: null, reviewInterval: 1, reviewDue: null };
    const newP = Math.min(cur.progress + qAnswered, total);
    const masteredNow = newP >= total;

    setSkillsByLevel((prev) => {
      const k = levelKey(ud.curriculumId, ud.levelId);
      const curLvl = prev[k] || {};
      const current = curLvl[lessonId] || { progress: 0, mastered: false, xp: 0, lastPracticed: null, reviewInterval: 1, reviewDue: null };
      const nextProgress = Math.min(current.progress + qAnswered, total);
      const mastered = nextProgress >= total;
      const { interval, due } = calcReviewDue(accuracy, current.reviewInterval || 1);
      return {
        ...prev,
        [k]: {
          ...curLvl,
          [lessonId]: {
            progress: nextProgress,
            mastered,
            xp: (current.xp || 0) + xpEarned,
            lastPracticed: Date.now(),
            reviewInterval: mastered ? interval : current.reviewInterval || 1,
            reviewDue: mastered ? due : current.reviewDue,
          },
        },
      };
    });

    if (userId) {
      updateUserXP(userId, xpEarned).catch((err) => console.error("Failed to update XP:", err));
      recordUserStreakActivity(userId, activityDateKey)
        .then((next) => {
          setUd((u) => ({
            ...u,
            streak: typeof next?.streak === "number" ? next.streak : u.streak,
            lastStreakDate: next?.lastStreakDate || u.lastStreakDate,
          }));
        })
        .catch((err) => console.error("Failed to update streak:", err));
      if (masteredNow) {
        markLessonCompleted(userId, `${activeKey}:${lessonId}`).catch((err) => console.error("Failed to mark lesson completed:", err));
      }
    }

    setUd((u) => {
      const streakState = resolveStreakAfterActivity(u.streak, u.lastStreakDate, activityDateKey);
      return { ...u, xp: u.xp + xpEarned, streak: streakState.streak, lastStreakDate: streakState.lastStreakDate };
    });
    setLessonId(null);
  };

  const startDeepDive = (id) => {
    const qs = content?.deepDive?.[id];
    if (!qs || qs.length === 0) return;
    setDeepDiveId(id);
  };

  const finishDeepDive = (xpEarned) => {
    const activityDateKey = formatLocalDateKey();
    if (userId) {
      updateUserXP(userId, xpEarned).catch((err) => console.error("Failed to update XP:", err));
      recordUserStreakActivity(userId, activityDateKey)
        .then((next) => {
          setUd((u) => ({
            ...u,
            streak: typeof next?.streak === "number" ? next.streak : u.streak,
            lastStreakDate: next?.lastStreakDate || u.lastStreakDate,
          }));
        })
        .catch((err) => console.error("Failed to update streak:", err));
    }
    setUd((u) => {
      const streakState = resolveStreakAfterActivity(u.streak, u.lastStreakDate, activityDateKey);
      return { ...u, xp: u.xp + xpEarned, streak: streakState.streak, lastStreakDate: streakState.lastStreakDate };
    });
    setDeepDiveId(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  const handleResetProgress = () => {
    setUd((u) => ({ ...u, xp: 0, streak: 0, lastStreakDate: null }));
    setSkillsByLevel({});
  };

  return {
    splashDelayDone,
    authReady,
    progressHydrated,
    onboarded,
    setOnboarded,
    userId,
    userName,
    setUserName,
    ud,
    setUd,
    content,
    contentErr,
    contentLoading,
    skills,
    lessonId,
    setLessonId,
    deepDiveId,
    setDeepDiveId,
    testBusy,
    setTestBusy,
    startLesson,
    finishLesson,
    startDeepDive,
    finishDeepDive,
    handleLogout,
    handleResetProgress,
  };
}
