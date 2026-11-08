// Spotlight Adz motion system: shared look for every reel.
// Rules live in tools/STYLE.md. Keep scenes inside the safe zone: x 80..1000, y 220..1480.
import React from "react";
import {
  AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, continueRender, delayRender,
} from "remotion";

export const C = {
  bg: "#06050C", ink: "#FBF8F5", muted: "#9C9CB1", line: "rgba(255,255,255,.12)",
  yel: "#FFB800", ora: "#FF7A1A", red: "#FF3D2E", pink: "#FF2D7A", pur: "#7B3CF2", cya: "#22D3EE", green: "#25D366",
};
export const AURORA = `linear-gradient(100deg, ${C.yel} 0%, ${C.red} 30%, ${C.pink} 55%, ${C.pur} 80%, ${C.cya} 100%)`;
export const HOT = `linear-gradient(100deg, ${C.yel}, ${C.red} 45%, ${C.pink})`;
export const AR = "Readex, sans-serif";
export const SG = "Space Grotesk, sans-serif";

// ---------- fonts ----------
const FONTS: [string, string, number][] = [
  ["Readex", "fonts/readex-500.ttf", 500], ["Readex", "fonts/readex-600.ttf", 600], ["Readex", "fonts/readex-700.ttf", 700],
  ["Space Grotesk", "fonts/space-grotesk-500.ttf", 500], ["Space Grotesk", "fonts/space-grotesk-700.ttf", 700],
  ["Inter Tight", "fonts/inter-tight-500.ttf", 500],
];
let fontsLoaded = false;
export const useFonts = () => {
  const [h] = React.useState(() => (fontsLoaded ? null : delayRender("fonts")));
  React.useEffect(() => {
    if (h === null) return;
    Promise.all(FONTS.map(([fam, src, w]) => {
      const f = new FontFace(fam, `url(${staticFile(src)})`, { weight: String(w) });
      return f.load().then((ff) => document.fonts.add(ff));
    })).then(() => { fontsLoaded = true; continueRender(h); });
  }, [h]);
};

// ---------- motion helpers ----------
export const ease = Easing.bezier(0.16, 1, 0.3, 1);       // expo-out: snappy, premium
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
export const at = (f: number, s: number, d: number) => interpolate(f, [s, s + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
export const useSpring = (delay = 0, damping = 14, mass = 0.8) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, mass, stiffness: 140 } });
};

// ---------- background: soft black, moving aurora light, grain, vignette ----------
export const Stage: React.FC<{ hue?: number; children?: React.ReactNode }> = ({ hue = 0, children }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const b1x = 30 + Math.sin(t * 0.35 + hue) * 12, b1y = 18 + Math.cos(t * 0.27) * 6;
  const b2x = 72 + Math.cos(t * 0.3 + hue) * 10, b2y = 78 + Math.sin(t * 0.22) * 6;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(40% 28% at ${b1x}% ${b1y}%, rgba(255,61,46,.42), transparent 70%), radial-gradient(45% 30% at ${b2x}% ${b2y}%, rgba(123,60,242,.45), transparent 70%), radial-gradient(30% 20% at 85% 30%, rgba(255,45,122,.22), transparent 70%)` }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(0,0,0,.75) 100%)" }} />
      {children}
      <Grain />
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{ o?: number }> = ({ o = 0.06 }) => {
  const f = useCurrentFrame();
  return <Img src={staticFile(`grain${f % 8}.png`)} style={{ position: "absolute", inset: 0, width: 1080, height: 1920, opacity: o, mixBlendMode: "overlay", pointerEvents: "none" }} />;
};

// ---------- chrome: progress bar + brand chip ----------
export const Chrome: React.FC<{ total: number; index?: string }> = ({ total, index }) => {
  const f = useCurrentFrame();
  const p = f / (total * 30);
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, height: 8, width: `${p * 100}%`, background: AURORA }} />
      <div style={{ position: "absolute", top: 120, left: 72, display: "flex", alignItems: "center", gap: 16, opacity: 0.9 }}>
        <Img src={staticFile("logo.webp")} style={{ width: 54, height: 54 }} />
        <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 32, color: C.ink, letterSpacing: -0.5 }}>Spotlight Adz</span>
      </div>
      {index && <div style={{ position: "absolute", top: 128, right: 72, fontFamily: SG, fontWeight: 500, fontSize: 30, color: C.muted, letterSpacing: 2 }}>{index}</div>}
    </>
  );
};

// ---------- gradient text ----------
export const Grad: React.FC<{ g?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ g = HOT, children, style }) => (
  <span style={{ backgroundImage: g, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", ...style }}>{children}</span>
);

// ---------- kinetic line: words rise through a mask, one by one ----------
export const Kinetic: React.FC<{ words: string[]; start: number; step?: number; size?: number; weight?: number; color?: string; grad?: string; hiIdx?: number[]; y: number; instant?: boolean }> =
  ({ words, start, step = 4, size = 120, weight = 700, color = C.ink, grad, hiIdx = [], y, instant }) => {
    const f = useCurrentFrame();
    return (
      <div dir="rtl" style={{ position: "absolute", top: y, left: 70, right: 70, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `0 ${size * 0.26}px`, fontFamily: AR, fontWeight: weight, fontSize: size, lineHeight: 1.25, color }}>
        {words.map((w, i) => {
          const p = instant ? 1 : at(f, start + i * step, 14);
          const hi = hiIdx.includes(i);
          return (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.12 }}>
              <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 110}%)`, opacity: p }}>
                {hi || grad ? <Grad g={grad || HOT}>{w}</Grad> : w}
              </span>
            </span>
          );
        })}
      </div>
    );
  };

// ---------- synced captions: phrase on screen, active word lit ----------
export type Word = { t: string; s: number; e: number };
export const Captions: React.FC<{ lines: Word[][]; y?: number; hide?: (t: number) => boolean }> = ({ lines, y = 1300, hide }) => {
  const f = useCurrentFrame(); const t = f / 30;
  const li = lines.findIndex((l, i) => t >= l[0].s - 0.05 && (i === lines.length - 1 || t < lines[i + 1][0].s - 0.05));
  if (li < 0 || (hide && hide(t))) return null;
  const line = lines[li];
  const pop = at(f, line[0].s * 30 - 2, 8);
  return (
    <div dir="rtl" style={{ position: "absolute", top: y, left: 60, right: 60, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 16px",
      transform: `translateY(${(1 - pop) * 24}px) scale(${0.96 + 0.04 * pop})`, opacity: pop }}>
      {line.map((w, i) => {
        const active = t >= w.s && t < (line[i + 1]?.s ?? w.e + 0.4);
        const said = t >= w.s;
        return (
          <span key={i} style={{ fontFamily: AR, fontWeight: 700, fontSize: 62, lineHeight: 1.3, padding: "2px 18px 10px", borderRadius: 18,
            color: said ? C.ink : "rgba(251,248,245,.38)", background: active ? AURORA : "transparent",
            boxShadow: active ? "0 10px 40px rgba(255,45,122,.35)" : "none", textShadow: active ? "none" : "0 4px 24px rgba(0,0,0,.6)" }}>{w.t}</span>
        );
      })}
    </div>
  );
};

// ---------- whip transition: blur + push on the way out, flash at the cut ----------
export const Whip: React.FC<{ cuts: number[]; children: React.ReactNode }> = ({ cuts, children }) => {
  const f = useCurrentFrame(); const t = f / 30;
  let k = 0, dir = 0;
  for (const c of cuts) {
    const d = t - c;
    if (d > -0.2 && d < 0) { k = Math.max(k, 1 + d / 0.2); dir = -1; }
    if (d >= 0 && d < 0.3) { const v = 1 - d / 0.3; if (v > k) { k = v; dir = 1; } }
  }
  const e = inOut(Math.max(0, Math.min(1, k)));
  return (
    <AbsoluteFill style={{ transform: `translateY(${dir * -e * 120}px) scale(${1 + e * 0.08})`, filter: `blur(${e * 18}px)`, opacity: 1 - e * 0.35 }}>
      {children}
    </AbsoluteFill>
  );
};
export const Flash: React.FC<{ cuts: number[] }> = ({ cuts }) => {
  const f = useCurrentFrame(); const t = f / 30;
  let o = 0;
  for (const c of cuts) { const d = Math.abs(t - c); if (d < 0.18) o = Math.max(o, 1 - d / 0.18); }
  return <AbsoluteFill style={{ background: "radial-gradient(60% 40% at 50% 45%, rgba(255,184,0,.55), rgba(255,45,122,.25) 50%, transparent 80%)", opacity: o * 0.8, mixBlendMode: "screen" }} />;
};

// ---------- UI pieces ----------
export const Tag: React.FC<{ children: React.ReactNode; p?: number; style?: React.CSSProperties }> = ({ children, p = 1, style }) => (
  <div dir="rtl" style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "12px 28px", borderRadius: 999, border: `2px solid ${C.line}`, background: "rgba(255,255,255,.05)",
    fontFamily: AR, fontWeight: 600, fontSize: 36, color: C.ink, opacity: p, transform: `translateY(${(1 - p) * 20}px)`, ...style }}>{children}</div>
);

export const Phone: React.FC<{ x: number; y: number; w?: number; p?: number; tilt?: number; children: React.ReactNode }> = ({ x, y, w = 560, p = 1, tilt = 0, children }) => {
  const h = w * 2.05;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: h, borderRadius: w * 0.13, padding: 14, background: "linear-gradient(160deg,#2a2833,#0d0c12)",
      boxShadow: "0 60px 120px rgba(0,0,0,.6), inset 0 0 0 2px rgba(255,255,255,.12)", opacity: p,
      transform: `perspective(1600px) translateY(${(1 - p) * 140}px) rotateX(${(1 - p) * 18}deg) rotateY(${tilt}deg) scale(${0.9 + 0.1 * p})` }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: w * 0.11, overflow: "hidden", background: "#0b0b10" }}>
        {children}
        <div style={{ position: "absolute", top: 14, left: "50%", width: w * 0.3, height: 34, marginLeft: -w * 0.15, borderRadius: 20, background: "#000" }} />
      </div>
    </div>
  );
};

export const Glass: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ borderRadius: 36, background: "linear-gradient(160deg, rgba(255,255,255,.10), rgba(255,255,255,.03))", border: `1.5px solid ${C.line}`,
    boxShadow: "0 40px 80px rgba(0,0,0,.45)", ...style }}>{children}</div>
);

export const WaButton: React.FC<{ p: number; label: string; y: number }> = ({ p, label, y }) => (
  <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
    <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 20, padding: "30px 64px", borderRadius: 999, background: AURORA, boxShadow: "0 30px 80px rgba(255,45,122,.45)",
      fontFamily: AR, fontWeight: 700, fontSize: 52, color: "#fff" }}>
      <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5z" /></svg>
      {label}
    </div>
    <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 60, color: C.ink, letterSpacing: 1 }}>+212 701 177 915</div>
    <div style={{ fontFamily: "Inter Tight", fontWeight: 500, fontSize: 38, color: C.muted, letterSpacing: 1 }}>spotlightadz.ma</div>
  </div>
);
