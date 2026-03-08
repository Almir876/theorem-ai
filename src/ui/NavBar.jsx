import { useLocation, useNavigate } from "react-router-dom";
import { ACC } from "./uiUtils.js";

const tabs = [
  { id: "home", label: "Home", path: "/", d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|M9 22V12h6v10" },
  { id: "tree", label: "Learn", path: "/learn", d: "M12 3a2 2 0 100 4 2 2 0 000-4|M5 19a2 2 0 100 4 2 2 0 000-4|M19 19a2 2 0 100 4 2 2 0 000-4|M12 7v5|M12 12l-7 6|M12 12l7 6" },
  { id: "test", label: "Test", path: "/test", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2|M9 5a2 2 0 002 2h2a2 2 0 002-2|M9 12h6|M9 16h4" },
  { id: "progress", label: "Stats", path: "/stats", d: "M22 12h-4l-3 9L9 3l-3 9H2" },
];

function activeForPath(pathname) {
  if (pathname === "/learn") return "tree";
  if (pathname === "/test") return "test";
  if (pathname === "/stats") return "progress";
  return "home";
}

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const active = activeForPath(location.pathname);

  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "rgba(12,12,12,.97)", backdropFilter: "blur(12px)", borderTop: "1px solid #1A1A1A", display: "flex", zIndex: 200, paddingBottom: "env(safe-area-inset-bottom)", boxSizing: "border-box" }}>
      {tabs.map((t) => {
        const on = active === t.id;
        const paths = t.d.split("|");
        return (
          <button key={t.id} onClick={() => navigate(t.path)} className={`nav-tab${on ? " active" : ""}`} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "10px 0 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: on ? ACC : "#3A3A3A" }}>
            <svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={on ? 2.4 : 1.7} strokeLinecap="round" strokeLinejoin="round">
              {paths.map((p, i) => <path key={i} d={p} />)}
            </svg>
            <span style={{ fontSize: 10, fontWeight: on ? 700 : 500, letterSpacing: .3, transition: "color .2s" }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
