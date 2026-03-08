import {
  AreaChart,
  BarChart3,
  Flame,
  GitCommitHorizontal,
  Hexagon,
  LineChart,
  PieChart,
  Sparkles,
  Triangle,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { ACC } from "./uiUtils.js";

function LucideGlyph({ Icon, size = 24, color = "currentColor", stroke = 2, className, style }) {
  return <Icon size={size} color={color} strokeWidth={stroke} className={className} style={style} aria-hidden="true" />;
}

function FireGlyph({ size = 24, className, style, color = "currentColor", stroke = 2 }) {
  return <LucideGlyph Icon={Flame} size={size} color={color} stroke={stroke} className={className} style={style} />;
}

function XPGlyph({ size = 24, className, style, color = "currentColor", stroke = 2 }) {
  return <LucideGlyph Icon={Zap} size={size} color={color} stroke={stroke} className={className} style={style} />;
}

export function MasteredGlyph({ size = 24, className, style, color = "currentColor", stroke = 2 }) {
  return <LucideGlyph Icon={Trophy} size={size} color={color} stroke={stroke} className={className} style={style} />;
}

export function AppIcon({ name, size = 18, color = "currentColor", stroke = 2, style }) {
  const p = { fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "xp": return <XPGlyph size={size} color={color} stroke={stroke} style={style} />;
    case "streak": return <FireGlyph size={size} color={color} stroke={stroke} style={style} />;
    case "trophy": return <MasteredGlyph size={size} color={color} stroke={stroke} style={style} />;
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

export function StreakFlame({ streak, color = "currentColor" }) {
  const hot = streak > 0;
  return (
    <span className={`streak-fire ${hot ? "hot" : "cold"}`}>
      <FireGlyph className="streak-flame-icon" size={38} color={color} />
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
  const iconMap = {
    trig: Triangle,
    area: AreaChart,
    slope: TrendingUp,
    stats: BarChart3,
    fraction: PieChart,
    graph: LineChart,
    sequence: GitCommitHorizontal,
    geometry: Hexagon,
    spark: Sparkles,
  };
  const Icon = iconMap[t] || Sparkles;
  return <LucideGlyph Icon={Icon} size={size} color={color} stroke={1.9} />;
}
