// Paper cut-out / collage kit: torn-edge paper shapes, paper grain, tape, cut-out word scraps, stop-motion timing.
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";

export const PAPERS = ["#FFF8F0", "#F3E6D6", "#FFD9E6", "#FFE7A8", "#E4DAFF", "#D7F3F7"];
export const INK = "#1A1222";

// Stop-motion: the frame number advanced only every `hold` frames (3 → 10 fps feel).
export const useStep = (hold = 3) => { const f = useCurrentFrame(); return Math.floor(f / hold) * hold; };
// tiny per-step jitter like hand-placed paper
export const jitter = (step: number, seed: number, amt = 1) => ({
  dx: (random(`x${seed}-${step}`) - 0.5) * 4 * amt, dy: (random(`y${seed}-${step}`) - 0.5) * 4 * amt, rot: (random(`r${seed}-${step}`) - 0.5) * 1.6 * amt,
});

// Torn rectangle path (w × h), seeded so it is stable across frames.
export const tornPath = (w: number, h: number, seed: number, rough = 7) => {
  const pts: string[] = []; const n = Math.max(8, Math.round((w + h) / 18));
  const edge = (x0: number, y0: number, x1: number, y1: number, k: number) => {
    for (let i = 0; i < n; i++) {
      const u = i / n, x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u;
      const o = (random(`t${seed}-${k}-${i}`) - 0.5) * rough;
      pts.push(`${(x + (y1 !== y0 ? o : 0)).toFixed(1)},${(y + (x1 !== x0 ? o : 0)).toFixed(1)}`);
    }
  };
  edge(0, 0, w, 0, 0); edge(w, 0, w, h, 1); edge(w, h, 0, h, 2); edge(0, h, 0, 0, 3);
  return "M" + pts.join(" L") + "Z";
};

let gid = 0;
// A torn paper scrap with grain and a soft drop shadow. Children are placed inside (HTML).
export const Scrap: React.FC<{ x: number; y: number; w: number; h: number; color?: string; seed?: number; rot?: number; children?: React.ReactNode; tape?: boolean; style?: React.CSSProperties }> =
  ({ x, y, w, h, color = PAPERS[0], seed = 1, rot = 0, children, tape, style }) => {
    const id = useMemo(() => `pg${gid++}`, []);
    const d = useMemo(() => tornPath(w, h, seed), [w, h, seed]);
    return (
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 10px 14px rgba(90,50,40,.22)) drop-shadow(0 2px 2px rgba(90,50,40,.18))", ...style }}>
        <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <filter id={id} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0.10 0" result="g" />
              <feComposite in="g" in2="SourceGraphic" operator="in" result="gg" />
              <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="gg" /></feMerge>
            </filter>
          </defs>
          <path d={d} fill={color} filter={`url(#${id})`} />
        </svg>
        <div style={{ position: "absolute", inset: 0 }}>{children}</div>
        {tape && <div style={{ position: "absolute", top: -18, left: w / 2 - 60, width: 120, height: 38, background: "rgba(255,240,200,.75)", transform: `rotate(${-4 + (seed % 3) * 3}deg)`, boxShadow: "0 2px 4px rgba(0,0,0,.08)" }} />}
      </div>
    );
  };

// Ransom-note words: each word cut out on its own paper scrap (RTL order), stop-motion arrival.
export const CutoutWords: React.FC<{ words: string[]; y: number; size?: number; start?: number; gap?: number; seed?: number; hold?: number }> = ({ words, y, size = 96, start = 0, gap = 5, seed = 3, hold = 3 }) => {
  const step = useStep(hold);
  return (
    <div dir="rtl" style={{ position: "absolute", top: y, left: 50, right: 50, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18 }}>
      {words.map((w, i) => {
        if (step < start + i * gap) return null;
        const j = jitter(step, seed + i, 1.2);
        const color = PAPERS[(i + seed) % PAPERS.length];
        const pad = size * 0.28;
        const wpx = w.length * size * 0.52 + pad * 2;
        return (
          <div key={i} style={{ position: "relative", width: wpx, height: size * 1.5, transform: `translate(${j.dx}px, ${j.dy}px) rotate(${(random(`w${seed}${i}`) - 0.5) * 8 + j.rot}deg)` }}>
            <Scrap x={0} y={0} w={wpx} h={size * 1.5} color={color} seed={seed * 10 + i}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Readex, sans-serif", fontWeight: 700, fontSize: size, color: i % 3 === 1 ? "#FF2D7A" : INK }}>{w}</div>
            </Scrap>
          </div>
        );
      })}
    </div>
  );
};

// Cork/cardboard-free paper table backdrop: warm paper with fibres, for the collage scenes.
export const PaperDesk: React.FC<{ children?: React.ReactNode; tint?: string }> = ({ children, tint = "#EFE2D2" }) => (
  <AbsoluteFill style={{ background: tint }}>
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
      <filter id="desk"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.6" numOctaves={3} seed={4} /><feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.38  0 0 0 0 0.3  0 0 0 0.12 0" /></filter>
      <rect width="1080" height="1920" filter="url(#desk)" />
    </svg>
    {children}
  </AbsoluteFill>
);
