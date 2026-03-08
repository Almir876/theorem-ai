import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppRouter from "./app/router.jsx";
import useAppSession from "./app/state/useAppSession.js";
import LessonEngine from "./features/lesson/LessonEngine.jsx";
import Onboarding from "./features/screens/Onboarding.jsx";
import { SkeletonLoader, SplashScreen } from "./ui/loaders.jsx";
import "./styles/app.css";

const WRAP = {
  background: "#0B0B0B",
  minHeight: "100vh",
  width: "100%",
  maxWidth: 430,
  margin: "0 auto",
  fontFamily: "'Plus Jakarta Sans','SF Pro Display',system-ui,sans-serif",
  color: "#FFF",
  position: "relative",
  overflowX: "hidden",
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useAppSession();

  const {
    splashDelayDone,
    authReady,
    progressHydrated,
    onboarded,
    setOnboarded,
    userId,
    setUserName,
    setUd,
    content,
    contentErr,
    contentLoading,
    lessonId,
    setLessonId,
    deepDiveId,
    setDeepDiveId,
    finishLesson,
    finishDeepDive,
  } = session;

  useEffect(() => {
    if (onboarded && location.pathname === "/settings") return;
    if (!onboarded && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate, onboarded]);

  if (!authReady || !splashDelayDone) return (
    <div style={WRAP}>
      <SplashScreen />
    </div>
  );

  if (userId && !progressHydrated && !onboarded) return (
    <div style={WRAP}>
      <SkeletonLoader />
    </div>
  );

  if (!onboarded) return (
    <div style={WRAP}>
      <Onboarding onDone={(d) => { setUd((u) => ({ ...u, ...d })); if (d.displayName) setUserName(d.displayName); setOnboarded(true); }} />
    </div>
  );

  if (contentLoading && !content) return (
    <div style={WRAP}>
      <SkeletonLoader />
    </div>
  );

  if (contentErr) return (
    <div style={WRAP}>
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Content load failed</div>
          <div style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6 }}>{contentErr}</div>
        </div>
      </div>
    </div>
  );

  if (deepDiveId) return (
    <div style={WRAP}>
      <LessonEngine
        skillId={deepDiveId}
        questions={content?.deepDive?.[deepDiveId] || []}
        allLessons={content?.allLessons || {}}
        onComplete={(xpEarned) => {
          finishDeepDive(xpEarned);
          navigate("/learn");
        }}
        onExit={() => setDeepDiveId(null)}
        isDeepDive
      />
    </div>
  );

  if (lessonId) return (
    <div style={WRAP}>
      <LessonEngine
        skillId={lessonId}
        allLessons={content?.allLessons || {}}
        onComplete={(...args) => {
          finishLesson(...args);
          navigate("/");
        }}
        onExit={() => setLessonId(null)}
      />
    </div>
  );

  return (
    <div style={WRAP}>
      <AppRouter session={session} />
    </div>
  );
}
