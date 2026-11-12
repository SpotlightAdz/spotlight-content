// W3 Mon: 3 branding mistakes (dark editorial explainer). Brand "NOUR" is fictional, used for illustration.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Kinetic, Tag, Phone, Glass, WaButton, Grad, at, useSpring, ReelShell, SceneHead, Num, LineIcon, Illustrative, sec, ReelData } from "../brand";
import data from "./R1.json";
const D = data as ReelData;

// chaotic vs consistent post tiles
const CHAOS = [
  { bg: "#e53935", fg: "#fff", ff: "Georgia, serif", t: "SALE" }, { bg: "#ffeb3b", fg: "#1a237e", ff: "Impact, sans-serif", t: "NEW" }, { bg: "#00bcd4", fg: "#fff", ff: "Courier New, monospace", t: "-20%" },
  { bg: "#8bc34a", fg: "#4a148c", ff: "Comic Sans MS, cursive", t: "Promo" }, { bg: "#ff4081", fg: "#ffff00", ff: "Times New Roman, serif", t: "WOW" }, { bg: "#3f51b5", fg: "#ff9800", ff: "Arial Black, sans-serif", t: "TOP" },
  { bg: "#ff9800", fg: "#0d47a1", ff: "Verdana, sans-serif", t: "Offre" }, { bg: "#9c27b0", fg: "#76ff03", ff: "Georgia, serif", t: "HOT" }, { bg: "#795548", fg: "#e1f5fe", ff: "Impact, sans-serif", t: "!!!" },
];
const BRAND = { a: "#1E3A2F", b: "#E9DCC5", c: "#C8743A" };
const Tile: React.FC<{ i: number; size: number; clean?: boolean }> = ({ i, size, clean }) => {
  const t = CHAOS[i];
  if (!clean) return (
    <div style={{ width: size, height: size, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: t.ff, fontWeight: 700, fontSize: size * 0.26, color: t.fg, transform: `rotate(${((i * 37) % 9) - 4}deg)` }}>{t.t}</div>
  );
  const bgs = [BRAND.a, BRAND.b, BRAND.c];
  const bg = bgs[i % 3]; const fg = bg === BRAND.b ? BRAND.a : BRAND.b;
  return (
    <div style={{ width: size, height: size, background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: size * 0.05 }}>
      <div style={{ width: size * 0.3, height: size * 0.3, borderRadius: 99, border: `${size * 0.03}px solid ${fg}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SG, fontWeight: 700, fontSize: size * 0.14, color: fg }}>N</div>
      <div style={{ fontFamily: SG, fontWeight: 700, fontSize: size * 0.11, letterSpacing: size * 0.02, color: fg }}>NOUR</div>
    </div>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0, 11);
  return (
    <AbsoluteFill>
      {/* chaotic wall of mismatched posts behind the number */}
      <div style={{ position: "absolute", left: 120, top: 560, width: 840, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, opacity: 0.2, transform: `rotate(-6deg) translateY(${-f * 0.6}px)`, filter: "blur(1px)" }}>
        {CHAOS.map((_, i) => <Tile key={i} i={i} size={265} />)}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(55% 35% at 50% 52%, rgba(6,5,12,.92), transparent 85%)" }} />
      <Kinetic words={["البراند", "ديالك"]} start={0} instant y={240} size={100} />
      <Kinetic words={["كيبان", "بحال"]} start={0} instant y={370} size={100} />
      <div dir="ltr" style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center", fontFamily: SG, fontWeight: 700, fontSize: 560, lineHeight: 1, letterSpacing: -30,
        transform: `scale(${0.88 + 0.12 * s})`, filter: "drop-shadow(0 30px 90px rgba(255,45,122,.55))" }}><Grad g={HOT}>10</Grad></div>
      <Kinetic words={["براندات؟"]} instant start={0} y={1090} size={130} grad={AURORA} />
    </AbsoluteFill>
  );
};

const M1: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(4, 16);
  const wipe = interpolate(f, [sec(1.6), sec(2.8)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) });
  const T = 118;
  const Grid: React.FC<{ clean?: boolean }> = ({ clean }) => (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(3, ${T}px)`, gap: 4, overflow: "hidden" }}>{[...CHAOS, ...CHAOS.slice(0, 3)].map((_, i) => <div key={i} style={{ overflow: "hidden" }}><Tile i={i % 9} size={T} clean={clean} /></div>)}</div>
  );
  return (
    <AbsoluteFill>
      <SceneHead kicker={<Num n="01" label="الغلطة" />} words={["كل", "بوست", "بلون", "جديد"]} hi={[3]} size={90} />
      <Phone x={540} y={540} w={400} p={p} tilt={-4}>
        <div style={{ padding: "74px 12px 0" }}>
          <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 8px 16px" }}>
            <div style={{ width: 64, height: 64, borderRadius: 99, background: AURORA, padding: 3 }}><div style={{ width: "100%", height: "100%", borderRadius: 99, background: wipe < 0.5 ? BRAND.a : "#222" }} /></div>
            <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 24, color: "#fff" }}>nour.cafe</div>
          </div>
          <div style={{ position: "relative", width: 362, height: 484, margin: "0 auto" }}>
            <div style={{ position: "absolute", inset: 0 }}><Grid clean /></div>
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${(1 - wipe) * 100}%)` }}><Grid /></div>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${(1 - wipe) * 100}%`, width: 4, marginLeft: -2, background: "#fff", boxShadow: "0 0 20px rgba(255,255,255,.8)", opacity: wipe > 0.01 && wipe < 0.99 ? 1 : 0 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
            <div dir="rtl" style={{ padding: "6px 18px", borderRadius: 10, background: wipe > 0.5 ? "rgba(255,61,46,.85)" : "rgba(37,211,102,.85)", fontFamily: AR, fontWeight: 600, fontSize: 22, color: "#fff" }}>{wipe > 0.5 ? "قبل" : "من بعد"}</div>
          </div>
        </div>
      </Phone>
      <Illustrative y={1385} o={at(f, 10, 12)} />
    </AbsoluteFill>
  );
};

const LOGOS = [
  { ff: "Georgia, serif", c: "#e53935", bg: "#fff3e0", r: 0, t: "Nour" }, { ff: "Comic Sans MS, cursive", c: "#7b1fa2", bg: "#fff59d", r: 40, t: "nour!" },
  { ff: "Impact, sans-serif", c: "#00acc1", bg: "#212121", r: 8, t: "NOUR" }, { ff: "Courier New, monospace", c: "#ff6f00", bg: "#e8f5e9", r: 999, t: "nour" },
];
const M2: React.FC = () => {
  const f = useCurrentFrame();
  const k = Math.min(3, Math.floor(Math.max(0, f - 12) / 11));
  const p = useSpring(6, 13);
  return (
    <AbsoluteFill>
      <SceneHead kicker={<Num n="02" label="الغلطة" />} words={["اللوغو", "كيتبدل"]} hi={[1]} />
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 26 }}>
        {LOGOS.map((l, i) => {
          const on = i <= k; const q = at(f, 12 + i * 11, 10);
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: on ? 1 : 0.15, transform: `translateY(${(1 - q) * 40}px) rotate(${(i % 2 ? 1 : -1) * 3 * q}deg)` }}>
              <div style={{ width: 200, height: 200, borderRadius: Math.min(l.r, 100), background: l.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: l.ff, fontWeight: 700, fontSize: 44, color: l.c, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>{l.t}</div>
              <div dir="ltr" style={{ fontFamily: SG, fontWeight: 500, fontSize: 26, color: C.muted }}>v{i + 1}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 1000, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: p, transform: `scale(${0.85 + 0.15 * p})` }}>
        <Glass style={{ padding: "26px 44px", display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 20, height: 20, borderRadius: 99, background: C.red, boxShadow: `0 0 24px ${C.red}` }} />
          <div dir="rtl" style={{ fontFamily: AR, fontWeight: 700, fontSize: 50, color: C.ink }}>الكليان: <Grad g={HOT}>شكون هادا؟</Grad></div>
        </Glass>
      </div>
      <Illustrative y={1200} o={at(f, 10, 12)} />
    </AbsoluteFill>
  );
};

const LANGS = [{ t: "العربية", ff: AR, sub: "مرحبا بيك" }, { t: "Français", ff: SG, sub: "Bienvenue" }, { t: "English", ff: SG, sub: "Welcome" }];
const M3: React.FC = () => {
  const f = useCurrentFrame();
  const all = at(f, sec(1.9), 14);
  return (
    <AbsoluteFill>
      <SceneHead kicker={<Num n="03" label="الغلطة" />} words={["بلغة", "وحدة"]} hi={[1]} />
      <div style={{ position: "absolute", top: 560, left: 110, right: 110, display: "flex", flexDirection: "column", gap: 30 }}>
        {LANGS.map((l, i) => {
          const q = at(f, 6 + i * 5, 14);
          const lit = i === 0 ? 1 : all;
          return (
            <div key={i} style={{ opacity: q, transform: `translateX(${(1 - q) * (i % 2 ? -80 : 80)}px)` }}>
              <Glass style={{ padding: "30px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.3 + 0.7 * lit, borderColor: lit > 0.5 ? "rgba(37,211,102,.6)" : C.line }}>
                <div style={{ width: 64, height: 64, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", background: lit > 0.5 ? C.green : "rgba(255,255,255,.08)" }}>
                  {lit > 0.5 ? <LineIcon name="check" size={40} sw={3} /> : <span style={{ fontFamily: SG, fontSize: 36, color: C.muted }}>—</span>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: l.ff, fontWeight: 700, fontSize: 56, color: C.ink }}>{l.t}</div>
                  <div style={{ fontFamily: l.ff, fontWeight: 500, fontSize: 32, color: C.muted, marginTop: 4 }}>{l.sub}</div>
                </div>
              </Glass>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Fix: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(6, 15);
  const sw = [BRAND.a, BRAND.b, BRAND.c, "#121212"];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag p={at(f, 0, 12)}><LineIcon name="sparkle" size={34} />الحل</Tag></div>
      <Kinetic words={["كيتعرف", "من", "نظرة", "وحدة"]} start={3} step={4} y={330} size={88} hiIdx={[3]} />
      <div style={{ position: "absolute", top: 600, left: 110, right: 110, opacity: p, transform: `perspective(1600px) rotateX(${(1 - p) * 16}deg) translateY(${(1 - p) * 80}px)` }}>
        <Glass style={{ padding: 36 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 14 }}>{sw.map((c, i) => <div key={i} style={{ width: 84, height: 84, borderRadius: 20, background: c, border: "1.5px solid rgba(255,255,255,.2)", transform: `scale(${at(f, 14 + i * 3, 10)})` }} />)}</div>
            <div style={{ width: 120, height: 120, borderRadius: 99, background: BRAND.a, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SG, fontWeight: 700, fontSize: 56, color: BRAND.b, border: `5px solid ${BRAND.b}` }}>N</div>
          </div>
          <div style={{ height: 1.5, background: C.line, margin: "30px 0" }} />
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", color: C.ink }}>
            <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 110, lineHeight: 1 }}>Aa</span>
            <span style={{ fontFamily: AR, fontWeight: 700, fontSize: 96, lineHeight: 1 }}>أب</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 30 }}>{[0, 1, 2].map((i) => <div key={i} style={{ opacity: at(f, 24 + i * 4, 10) }}><Tile i={i} size={250} clean /></div>)}</div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const a = at(f, 4, 12), b = at(f, 14, 12);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40 }}>
        <div style={{ transform: `scale(${0.7 + 0.3 * a})`, opacity: a }}><LineIcon name="save" size={120} color={C.ink} fill={a > 0.6 ? C.ink : "none"} /></div>
        <div style={{ transform: `scale(${0.7 + 0.3 * b})`, opacity: b }}><LineIcon name="send" size={120} color={C.ink} /></div>
      </div>
      <Kinetic words={["سيفها", "و", "صيفط", "لينا"]} start={4} step={5} y={430} size={92} />
      <Kinetic words={["نشوفو", "البراند", "ديالك"]} start={18} step={5} y={580} size={104} grad={AURORA} />
      <WaButton p={at(f, sec(1.6), 16)} label="صيفط لينا فواتساب" y={900} />
    </AbsoluteFill>
  );
};

export const BrandMistakes: React.FC = () => (
  <ReelShell data={D} audio="vo/R1_mix.wav" scenes={[Hook, M1, M2, M3, Fix, Cta]}
    capHide={(t, s) => s === 0 || s === 5} index={(s) => (s >= 1 && s <= 3 ? `0${s} / 03` : undefined)} />
);
