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

// =====================================================================
// v2 kit (Nov 2026): reel shell, headers, counters, icons, chat, CTA.
// =====================================================================
import { Audio, Sequence } from "remotion";

export type ReelData = { total: number; cuts: number[]; beats?: number[]; lines: Word[][] };
export const sec = (s: number) => Math.round(s * 30);

// Whole-reel shell: stage, VO mix, whip cuts between scenes, flash, synced captions, chrome.
// scenes[i] plays from edge i to edge i+1 (edges = [0, ...cuts, total]).
export const ReelShell: React.FC<{ data: ReelData; audio: string; scenes: React.FC[]; capHide?: (t: number, scene: number) => boolean; index?: (scene: number) => string | undefined; capY?: number }> =
  ({ data, audio, scenes, capHide, index, capY = 1420 }) => {
    useFonts();
    const f = useCurrentFrame();
    const edges = [0, ...data.cuts, data.total];
    const sceneAt = (t: number) => Math.max(0, edges.findIndex((e, i) => t >= e && t < edges[i + 1]));
    const cur = sceneAt(f / 30);
    return (
      <Stage hue={cur * 0.7}>
        <Audio src={staticFile(audio)} />
        <Whip cuts={data.cuts}>
          {scenes.map((Sc, i) => (
            <Sequence key={i} from={sec(edges[i])} durationInFrames={sec(edges[i + 1] - edges[i]) + 1}><Sc /></Sequence>
          ))}
        </Whip>
        <Flash cuts={data.cuts} />
        <Captions lines={data.lines} y={capY} hide={(t) => (capHide ? capHide(t, sceneAt(t)) : false)} />
        <Chrome total={data.total} index={index ? index(cur) : undefined} />
      </Stage>
    );
  };

// Kicker chip + kinetic headline used at the top of explainer scenes.
export const SceneHead: React.FC<{ kicker: React.ReactNode; words: string[]; hi?: number[]; size?: number; y?: number }> = ({ kicker, words, hi = [], size = 108, y = 230 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag p={at(f, 0, 12)}>{kicker}</Tag></div>
      <Kinetic words={words} start={3} step={4} y={y + 90} size={size} hiIdx={hi} />
    </>
  );
};
export const Num: React.FC<{ n: string; label: string }> = ({ n, label }) => (
  <><span style={{ fontFamily: SG, fontWeight: 700 }}>{n}</span><span style={{ width: 2, height: 30, background: C.line }} />{label}</>
);

// Count-up number (Space Grotesk, gradient, glow). fmt receives the eased value.
export const Counter: React.FC<{ to: number; from?: number; start?: number; dur?: number; fmt?: (v: number) => string; size?: number; y: number; g?: string }> =
  ({ to, from = 0, start = 0, dur = 50, fmt = (v) => Math.round(v).toString(), size = 300, y, g = HOT }) => {
    const f = useCurrentFrame();
    const v = interpolate(f, [start, start + dur], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 4) });
    return (
      <div dir="ltr" style={{ position: "absolute", top: y, left: 0, right: 0, textAlign: "center", fontFamily: SG, fontWeight: 700, fontSize: size, letterSpacing: -size * 0.04, lineHeight: 1,
        filter: "drop-shadow(0 30px 80px rgba(255,45,122,.5))", fontVariantNumeric: "tabular-nums" }}><Grad g={g}>{fmt(v)}</Grad></div>
    );
  };

// Line icons (24px grid, stroke). Add new paths here, not inline in reels.
export const ICON: Record<string, string[]> = {
  heart: ["M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"],
  chat: ["M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5z"],
  send: ["M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"],
  save: ["M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"],
  camera: ["M3 8h3l2-3h8l2 3h3v12H3z", "M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  sun: ["M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"],
  list: ["M9 6h12M9 12h12M9 18h12", "M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"],
  cut: ["M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"],
  mic: ["M12 15a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v7a3 3 0 0 0 3 3z", "M19 11a7 7 0 0 1-14 0M12 18v4"],
  type: ["M4 7V4h16v3M9 20h6M12 4v16"],
  pin: ["M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z", "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  tag: ["M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z", "M7.5 7.5h.01"],
  bolt: ["M13 2 3 14h9l-1 8 10-12h-9z"],
  users: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"],
  grid: ["M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"],
  sparkle: ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z", "M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  globe: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"],
};
export const LineIcon: React.FC<{ name: string; size?: number; color?: string; sw?: number; fill?: string }> = ({ name, size = 44, color = "#fff", sw = 2, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{ICON[name].map((d, i) => <path key={i} d={d} />)}</svg>
);

// Chat bubble that pops in at frame `at0` (local). side "in" = customer (left, grey), "out" = business (right, green).
export const Bubble: React.FC<{ at0: number; side?: "in" | "out"; children: React.ReactNode; time?: string; size?: number; maxW?: number }> =
  ({ at0, side = "in", children, time, size = 26, maxW = 340 }) => {
    const p = useSpring(at0, 12);
    const out = side === "out";
    return (
      <div dir="rtl" style={{ alignSelf: out ? "flex-end" : "flex-start", maxWidth: maxW, padding: "14px 20px", borderRadius: out ? "22px 22px 6px 22px" : "22px 22px 22px 6px",
        background: out ? "#1f6f4a" : "#26252e", color: "#fff", fontFamily: AR, fontWeight: 500, fontSize: size, lineHeight: 1.4,
        opacity: Math.min(1, p * 1.4), transform: `scale(${0.75 + 0.25 * p})`, transformOrigin: out ? "right bottom" : "left bottom" }}>
        {children}
        {time && <div dir="ltr" style={{ fontFamily: SG, fontSize: 15, color: "rgba(255,255,255,.55)", marginTop: 4, textAlign: out ? "right" : "left" }}>{time}</div>}
      </div>
    );
  };

// Comment-keyword CTA: "كتب KEYWORD فالكومونتير" pill + WhatsApp line.
export const CommentCta: React.FC<{ p: number; keyword: string; y: number; wa?: boolean }> = ({ p, keyword, y, wa = true }) => (
  <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 28, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
    <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 18, padding: "28px 60px", borderRadius: 999, background: AURORA, boxShadow: "0 30px 80px rgba(255,45,122,.45)", fontFamily: AR, fontWeight: 700, fontSize: 54, color: "#fff" }}>
      <LineIcon name="chat" size={52} sw={2.2} />كتب <span style={{ fontFamily: SG, letterSpacing: 2 }}>{keyword}</span> فالكومونتير
    </div>
    {wa && <div dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 50, color: C.ink, letterSpacing: 1 }}>+212 701 177 915</div>}
    <div style={{ fontFamily: "Inter Tight", fontWeight: 500, fontSize: 36, color: C.muted, letterSpacing: 1 }}>spotlightadz.ma</div>
  </div>
);

// Small "مثال توضيحي" label for illustrative UI data.
export const Illustrative: React.FC<{ x?: number; y: number; o?: number }> = ({ x, y, o = 1 }) => (
  <div dir="rtl" style={{ position: "absolute", top: y, ...(x !== undefined ? { left: x } : { left: 0, right: 0, textAlign: "center" as const }), fontFamily: AR, fontWeight: 500, fontSize: 24, color: C.muted, opacity: o * 0.85 }}>مثال توضيحي</div>
);
