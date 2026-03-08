import masteredIcon from "../assets/icons/mastered.svg";
import streakIcon from "../assets/icons/streak.svg";
import xpIcon from "../assets/icons/xp.svg";
import { ACC } from "./uiUtils.js";

function AssetGlyph({ src, size = 24, className, style, scale = 2.35 }) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        lineHeight: 0,
        ...style,
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          width: size,
          height: size,
          display: "block",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      />
    </span>
  );
}

function FireGlyph({ size = 24, className, style }) {
  return <AssetGlyph src={streakIcon} size={size} className={className} style={style} scale={1.35} />;
}

function XPGlyph({ size = 24, className, style }) {
  return <AssetGlyph src={xpIcon} size={size} className={className} style={style} scale={1.35} />;
}

export function MasteredGlyph({ size = 24, className, style }) {
  return <AssetGlyph src={masteredIcon} size={size} className={className} style={style} scale={1.35} />;
}

export function AppIcon({ name, size = 18, color = "currentColor", stroke = 2, style }) {
  const p = { fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "xp": return <XPGlyph size={size} style={style} />;
    case "streak": return <FireGlyph size={size} style={style} />;
    case "trophy": return <MasteredGlyph size={size} style={style} />;
    case "target": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><circle {...p} cx="12" cy="12" r="8" /><circle {...p} cx="12" cy="12" r="4" /><circle {...p} cx="12" cy="12" r="1.5" /></svg>;
    case "sparkle": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z" /><path {...p} d="M5 15l.8 1.8L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-1.2z" /><path {...p} d="M19 14l.6 1.4L21 16l-1.4.6L19 18l-.6-1.4L17 16l1.4-.6z" /></svg>;
    case "star": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M12 3l2.7 5.5L21 9.3l-4.5 4.4L17.6 21 12 18l-5.6 3 1.1-7.3L3 9.3l6.3-.8z" /></svg>;
    case "check": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M5 12l4 4L19 6" /></svg>;
    case "lock": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><rect {...p} x="5" y="10" width="14" height="10" rx="2" /><path {...p} d="M8 10V8a4 4 0 0 1 8 0v2" /></svg>;
    case "play": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M8 5v14l11-7z" /></svg>;
    case "close": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M6 6l12 12M18 6L6 18" /></svg>;
    case "back": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M15 18l-6-6 6-6" /></svg>;
    case "settings": return <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true"><path fill={color} fillRule="evenodd" clipRule="evenodd" d="M7 3.75h10L22 12l-5 8.25H7L2 12 7 3.75ZM12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /></svg>;
    case "graduation": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M3 9l9-4 9 4-9 4z" /><path {...p} d="M7 11v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4" /></svg>;
    case "celebrate": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M5 20l8-8" /><path {...p} d="M13 12l5-2-3-3-2 5z" /><path {...p} d="M16 4v2M20 8h-2M18.5 5.5l-1.4 1.4" /></svg>;
    case "telescope": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M3 7l12-4 2 6-12 4z" /><path {...p} d="M10 11l-2 8M14 10l2 9M4 20h14" /></svg>;
    case "info": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><circle {...p} cx="12" cy="12" r="9" /><path {...p} d="M12 10v6M12 7h.01" /></svg>;
    case "book": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path {...p} d="M4 5a2 2 0 0 1 2-2h12v17H6a2 2 0 0 0-2 2z" /><path {...p} d="M6 3v17" /></svg>;
    case "success": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><circle {...p} cx="12" cy="12" r="9" /><path {...p} d="M8 12l3 3 5-6" /></svg>;
    case "error": return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><circle {...p} cx="12" cy="12" r="9" /><path {...p} d="M9 9l6 6M15 9l-6 6" /></svg>;
    default: return <svg width={size} height={size} viewBox="0 0 24 24" style={style}><circle {...p} cx="12" cy="12" r="8" /></svg>;
  }
}

export function XPBar({ current, max }) {
  const pct = Math.min((current / Math.max(max, 1)) * 100, 100);
  return (
    <div style={{ background: "#1A1A1A", borderRadius: 999, height: 7, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#4F8CFF,#7BAAFF)", borderRadius: 999, transition: "width .8s cubic-bezier(.34,1.56,.64,1)", boxShadow: "0 0 6px rgba(79,140,255,.2)" }} />
    </div>
  );
}

export function StreakFlame({ streak }) {
  const hot = streak > 0;
  return (
    <span className={`streak-fire ${hot ? "hot" : "cold"}`}>
      <FireGlyph className="streak-flame-icon" size={38} />
    </span>
  );
}

function resolveSkillGlyphType(skill) {
  const key = `${skill?.id || ""} ${skill?.title || ""}`.toLowerCase();
  if (/trig|angle/.test(key)) return "trig";
  if (/integr|area|volume|circumference|perimeter/.test(key)) return "area";
  if (/different|derivative/.test(key)) return "slope";
  if (/probab|stat|sample|population|data/.test(key)) return "stats";
  if (/percent|ratio|proportion|fraction|decimal|rational/.test(key)) return "fraction";
  if (/equation|algebra|function|linear|quadratic|coordinate|exponent|log/.test(key)) return "graph";
  if (/sequence|series|binomial/.test(key)) return "sequence";
  if (/geometry|polygon|scale|drawing/.test(key)) return "geometry";
  return "spark";
}

export function SkillGlyph({ skill, size = 24, color = ACC }) {
  const t = resolveSkillGlyphType(skill);
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ color }} aria-hidden="true">
      {t === "trig" && (
        <>
          <path {...p} d="M4 18h16" />
          <path {...p} d="M6 18l5-8 7 8" />
          <path {...p} d="M14 8c1.5.6 2.5 1.8 3 3.3" />
        </>
      )}
      {t === "area" && (
        <>
          <path {...p} d="M4 18h16" />
          <path {...p} d="M4 18c2.8-6 5.8-8 10-8 2.2 0 4 .6 6 2" />
          <path d="M4 18c2.8-6 5.8-8 10-8 2.2 0 4 .6 6 2v6H4z" fill="currentColor" opacity=".2" />
        </>
      )}
      {t === "slope" && (
        <>
          <path {...p} d="M4 18h16M6 6v12" />
          <path {...p} d="M7 15l9-7" />
          <path {...p} d="M14.8 8.2l1.8-.6-.6 1.8" />
        </>
      )}
      {t === "stats" && (
        <>
          <path {...p} d="M4 18h16" />
          <rect x="6" y="12" width="2.4" height="6" rx="1" fill="currentColor" opacity=".35" />
          <rect x="10.8" y="9" width="2.4" height="9" rx="1" fill="currentColor" opacity=".55" />
          <rect x="15.6" y="6.5" width="2.4" height="11.5" rx="1" fill="currentColor" opacity=".8" />
        </>
      )}
      {t === "fraction" && (
        <>
          <circle {...p} cx="12" cy="12" r="7.5" />
          <path d="M12 12V4.5a7.5 7.5 0 0 1 6.5 3.8L12 12Z" fill="currentColor" opacity=".26" />
          <path {...p} d="M12 12l6.5-3.7" />
        </>
      )}
      {t === "graph" && (
        <>
          <path {...p} d="M4 18h16M6 6v12" />
          <path {...p} d="M7 15c2.4-4.4 6.1-7.2 10-8" />
          <circle cx="16.7" cy="7.2" r="1.1" fill="currentColor" />
        </>
      )}
      {t === "sequence" && (
        <>
          <circle {...p} cx="6" cy="16" r="1.6" />
          <circle {...p} cx="11" cy="12" r="1.6" />
          <circle {...p} cx="16" cy="8" r="1.6" />
          <path {...p} d="M7.4 15l2.3-1.8M12.4 11l2.3-1.8" />
        </>
      )}
      {t === "geometry" && (
        <>
          <path {...p} d="M12 4l7 4v8l-7 4-7-4V8z" />
          <path {...p} d="M12 4v8l7 4" />
          <path {...p} d="M12 12l-7 4" />
        </>
      )}
      {t === "spark" && (
        <>
          <path {...p} d="M12 4l2 4.5L18 10l-4 1.5L12 16l-2-4.5L6 10l4-1.5z" />
          <path {...p} d="M5.5 16.5l.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8z" />
        </>
      )}
    </svg>
  );
}
