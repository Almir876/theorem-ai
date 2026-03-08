import {
  arrayUnion,
  doc,
  getDoc,
  increment,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const USERS_COLLECTION = "users";
const DAY_MS = 86_400_000;

const DEFAULT_USER_PROGRESS = {
  xp: 0,
  completedLessons: [],
  streak: 0,
  lastStreakDate: null,
  lastActive: null,
  onboarded: false,
  dailyGoal: 50,
  curriculumId: null,
  levelId: null,
  skillsByLevel: {},
};

function userRef(userId) {
  return doc(db, USERS_COLLECTION, userId);
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeDateKey(dateKey) {
  return typeof dateKey === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateKey)
    ? dateKey
    : null;
}

function parseDateKey(dateKey) {
  const normalized = normalizeDateKey(dateKey);
  if (!normalized) return null;
  const [year, month, day] = normalized.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function getDayDiff(fromDateKey, toDateKey) {
  const from = parseDateKey(fromDateKey);
  const to = parseDateKey(toDateKey);
  if (from == null || to == null) return null;
  return Math.round((to - from) / DAY_MS);
}

function inferDateKeyFromLastActive(lastActive) {
  if (!lastActive) return null;
  const millis =
    typeof lastActive?.toMillis === "function"
      ? lastActive.toMillis()
      : typeof lastActive === "number"
      ? lastActive
      : null;
  if (typeof millis !== "number" || !Number.isFinite(millis)) return null;
  return formatDateKey(new Date(millis));
}

function normalizeProgress(data = {}) {
  return {
    ...DEFAULT_USER_PROGRESS,
    ...data,
    completedLessons: Array.isArray(data.completedLessons)
      ? data.completedLessons
      : [],
    skillsByLevel:
      data.skillsByLevel && typeof data.skillsByLevel === "object"
        ? data.skillsByLevel
        : {},
    lastStreakDate: normalizeDateKey(data.lastStreakDate),
    lastActive: data.lastActive?.toMillis
      ? data.lastActive.toMillis()
      : data.lastActive ?? null,
  };
}

export async function createOrMergeUserProgress(userId, seed = {}) {
  await setDoc(
    userRef(userId),
    {
      ...DEFAULT_USER_PROGRESS,
      ...seed,
      lastActive: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function loadUserProgress(userId) {
  const snapshot = await getDoc(userRef(userId));

  if (!snapshot.exists()) {
    await createOrMergeUserProgress(userId);
    return { ...DEFAULT_USER_PROGRESS };
  }

  return normalizeProgress(snapshot.data());
}

export async function saveUserProgress(userId, progress) {
  const completedLessons = Array.isArray(progress?.completedLessons)
    ? [...new Set(progress.completedLessons)]
    : [];

  await setDoc(
    userRef(userId),
    {
      ...progress,
      completedLessons,
      lastActive: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function updateUserXP(userId, xpDelta) {
  await setDoc(
    userRef(userId),
    {
      xp: increment(xpDelta),
      lastActive: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function markLessonCompleted(userId, lessonId) {
  await setDoc(
    userRef(userId),
    {
      completedLessons: arrayUnion(lessonId),
      lastActive: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function recordUserStreakActivity(userId, dateKeyInput) {
  const todayKey = normalizeDateKey(dateKeyInput) || formatDateKey(new Date());

  return runTransaction(db, async (transaction) => {
    const ref = userRef(userId);
    const snapshot = await transaction.get(ref);

    if (!snapshot.exists()) {
      transaction.set(
        ref,
        {
          ...DEFAULT_USER_PROGRESS,
          streak: 1,
          lastStreakDate: todayKey,
          lastActive: serverTimestamp(),
        },
        { merge: true }
      );
      return { streak: 1, lastStreakDate: todayKey };
    }

    const data = snapshot.data() || {};
    const currentStreak =
      typeof data.streak === "number" && Number.isFinite(data.streak)
        ? data.streak
        : 0;
    const storedDateKey =
      normalizeDateKey(data.lastStreakDate) ||
      inferDateKeyFromLastActive(data.lastActive);

    let nextStreak = Math.max(0, currentStreak);
    let nextDateKey = storedDateKey;

    if (!storedDateKey) {
      nextStreak = 1;
      nextDateKey = todayKey;
    } else if (storedDateKey === todayKey) {
      nextStreak = Math.max(1, nextStreak);
    } else {
      const dayDiff = getDayDiff(storedDateKey, todayKey);
      if (dayDiff === 1) {
        nextStreak = Math.max(1, nextStreak) + 1;
        nextDateKey = todayKey;
      } else if (typeof dayDiff === "number" && dayDiff > 1) {
        nextStreak = 1;
        nextDateKey = todayKey;
      } else if (typeof dayDiff === "number" && dayDiff < 0) {
        nextStreak = Math.max(1, nextStreak);
      } else {
        nextStreak = 1;
        nextDateKey = todayKey;
      }
    }

    transaction.set(
      ref,
      {
        streak: nextStreak,
        lastStreakDate: nextDateKey,
        lastActive: serverTimestamp(),
      },
      { merge: true }
    );

    return { streak: nextStreak, lastStreakDate: nextDateKey };
  });
}
