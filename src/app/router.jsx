import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "../features/screens/Home.jsx";
import SettingsPage from "../features/screens/SettingsPage.jsx";
import SkillTree from "../features/screens/SkillTree.jsx";
import Stats from "../features/screens/Stats.jsx";
import TestMode from "../features/screens/TestMode.jsx";
import NavBar from "../ui/NavBar.jsx";

function TabLayout({ testBusy }) {
  const location = useLocation();
  const hideNav = location.pathname === "/settings" || testBusy;
  return (
    <>
      <Outlet />
      {!hideNav && <NavBar />}
    </>
  );
}

export default function AppRouter({ session }) {
  const navigate = useNavigate();
  const { ud, skills, content, userName, setUserName, setUd, setTestBusy, startLesson, startDeepDive, handleLogout, handleResetProgress, testBusy } = session;

  return (
    <Routes>
      <Route element={<TabLayout testBusy={testBusy} />}>
        <Route
          path="/"
          element={(
            <Home
              ud={ud}
              skills={skills}
              startLesson={startLesson}
              skillMeta={content?.skillMeta || []}
              allLessons={content?.allLessons || {}}
              userName={userName}
              onOpenSettings={() => navigate("/settings")}
            />
          )}
        />
        <Route
          path="/learn"
          element={(
            <SkillTree
              skills={skills}
              startLesson={startLesson}
              startDeepDive={startDeepDive}
              skillMeta={content?.skillMeta || []}
              allLessons={content?.allLessons || {}}
              deepDive={content?.deepDive || {}}
            />
          )}
        />
        <Route
          path="/test"
          element={(
            <TestMode
              skills={skills}
              skillMeta={content?.skillMeta || []}
              allLessons={content?.allLessons || {}}
              onActivityChange={setTestBusy}
            />
          )}
        />
        <Route
          path="/stats"
          element={(
            <Stats
              ud={ud}
              skills={skills}
              skillMeta={content?.skillMeta || []}
              allLessons={content?.allLessons || {}}
            />
          )}
        />
        <Route
          path="/settings"
          element={(
            <SettingsPage
              ud={ud}
              userName={userName}
              setUd={setUd}
              setUserName={setUserName}
              onLogout={handleLogout}
              onBack={() => navigate("/")}
              onResetProgress={handleResetProgress}
            />
          )}
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
