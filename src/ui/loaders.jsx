import theoremLogo from "../assets/theorem-logo.svg";

function SkeletonBlock({ w = "100%", h = 16, style = {} }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: h / 2 + 2, ...style }} />;
}

export function SplashScreen() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0B0B0B", padding: "0 24px" }}>
      <img
        src={theoremLogo}
        alt="Theorem"
        className="splash-logo"
        style={{ width: "min(170px, 72vw)", height: "auto", display: "block" }}
      />
      <p style={{ color: "#4A4A4A", fontSize: 13, marginTop: 20, letterSpacing: 0.2 }}>Solving for x…</p>
      <div className="splash-progress" aria-hidden="true">
        <div className="splash-progress-bar" />
      </div>
    </div>
  );
}

export function SkeletonLoader() {
  return (
    <div style={{ padding: "52px 24px 0", display: "flex", flexDirection: "column", gap: 18, animation: "fadeIn .3s ease" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <SkeletonBlock w="55%" h={12} />
        <SkeletonBlock w="75%" h={22} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <SkeletonBlock w={72} h={28} style={{ borderRadius: 14 }} />
        <SkeletonBlock w={90} h={28} style={{ borderRadius: 14 }} />
      </div>
      <div style={{ background: "#111", border: "1px solid #181818", borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <SkeletonBlock w="30%" h={13} />
          <SkeletonBlock w="18%" h={13} />
        </div>
        <SkeletonBlock w="100%" h={7} style={{ borderRadius: 999 }} />
        <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <SkeletonBlock key={i} w={29} h={29} style={{ borderRadius: 9, flexShrink: 0 }} />)}
        </div>
      </div>
      <SkeletonBlock w="100%" h={96} style={{ borderRadius: 20 }} />
      <div style={{ display: "flex", gap: 10 }}>
        <SkeletonBlock w="33%" h={78} style={{ borderRadius: 16 }} />
        <SkeletonBlock w="33%" h={78} style={{ borderRadius: 16 }} />
        <SkeletonBlock w="33%" h={78} style={{ borderRadius: 16 }} />
      </div>
    </div>
  );
}
