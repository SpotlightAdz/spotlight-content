// W3 Thu: behind the scenes, a shoot day in 25 seconds (content & film). Times and shot list are illustrative.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Kinetic, Tag, Glass, WaButton, Grad, at, useSpring, ReelShell, LineIcon, Illustrative, sec, ReelData } from "../brand";
import data from "./R3.json";
const D = data as ReelData;

// Camera viewfinder overlay: corner brackets, REC, timecode, rule-of-thirds. New reusable piece for BTS reels.
const Viewfinder: React.FC<{ o?: number; inset?: number }> = ({ o = 1, inset = 70 }) => {
  const f = useCurrentFrame();
  const tc = (fr: number) => { const s = Math.floor(fr / 30); return `00:${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}:${String(fr % 30).padStart(2, "0")}`; };
  const L = 70, W = 4;
  const corner = (st: React.CSSProperties) => <div style={{ position: "absolute", width: L, height: L, ...st }} />;
  return (
    <div style={{ position: "absolute", left: inset, right: inset, top: 200, bottom: 420, opacity: o }}>
      {corner({ left: 0, top: 0, borderLeft: `${W}px solid #fff`, borderTop: `${W}px solid #fff` })}
      {corner({ right: 0, top: 0, borderRight: `${W}px solid #fff`, borderTop: `${W}px solid #fff` })}
      {corner({ left: 0, bottom: 0, borderLeft: `${W}px solid #fff`, borderBottom: `${W}px solid #fff` })}
      {corner({ right: 0, bottom: 0, borderRight: `${W}px solid #fff`, borderBottom: `${W}px solid #fff` })}
      {[1, 2].map((k) => <div key={"v" + k} style={{ position: "absolute", top: 0, bottom: 0, left: `${k * 33.33}%`, width: 1, background: "rgba(255,255,255,.06)" }} />)}
      {[1, 2].map((k) => <div key={"h" + k} style={{ position: "absolute", left: 0, right: 0, top: `${k * 33.33}%`, height: 1, background: "rgba(255,255,255,.06)" }} />)}
      <div dir="ltr" style={{ position: "absolute", top: 26, left: 30, display: "flex", alignItems: "center", gap: 12, fontFamily: SG, fontWeight: 700, fontSize: 30, color: "#fff" }}>
        <span style={{ width: 20, height: 20, borderRadius: 99, background: C.red, opacity: Math.floor(f / 15) % 2 ? 0.3 : 1 }} />REC
      </div>
      <div dir="ltr" style={{ position: "absolute", top: 26, right: 30, fontFamily: SG, fontWeight: 500, fontSize: 28, color: "rgba(255,255,255,.8)", fontVariantNumeric: "tabular-nums" }}>{tc(f)}</div>
      <div dir="ltr" style={{ position: "absolute", bottom: 24, left: 30, fontFamily: SG, fontWeight: 500, fontSize: 24, color: "rgba(255,255,255,.7)", letterSpacing: 2 }}>4K · 30 FPS · ISO 400</div>
      <div style={{ position: "absolute", bottom: 24, right: 30, display: "flex", gap: 4 }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 12, height: 26, borderRadius: 3, background: i < 3 ? C.green : "rgba(255,255,255,.3)" }} />)}</div>
    </div>
  );
};

const Clock: React.FC<{ time: string; label: string }> = ({ time, label }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <Tag p={at(f, 0, 12)}><span dir="ltr" style={{ fontFamily: SG, fontWeight: 700 }}>{time}</span><span style={{ width: 2, height: 30, background: C.line }} />{label}</Tag>
    </div>
  );
};

const Hook: React.FC = () => {
  const s = useSpring(0, 12);
  return (
    <AbsoluteFill>
      <Viewfinder />
      <Kinetic words={["نهار", "تصوير", "معانا"]} instant start={0} y={420} size={104} />
      <div dir="ltr" style={{ position: "absolute", top: 590, left: 0, right: 0, textAlign: "center", fontFamily: SG, fontWeight: 700, fontSize: 420, lineHeight: 1, letterSpacing: -20,
        transform: `scale(${0.9 + 0.1 * s})`, filter: "drop-shadow(0 30px 90px rgba(255,45,122,.55))" }}><Grad g={HOT}>25</Grad></div>
      <Kinetic words={["ثانية"]} instant start={0} y={1010} size={110} grad={AURORA} />
    </AbsoluteFill>
  );
};

const SHOTS = ["لقطة الهوك", "المنتج من قريب", "الكليان فالبلاصة", "اليدين و هوما خدامين"];
const Morning: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(4, 15);
  return (
    <AbsoluteFill>
      <Clock time="09:00" label="الصباح" />
      <Kinetic words={["البريف", "و", "الشوت", "ليست"]} start={3} step={4} y={330} size={84} hiIdx={[2, 3]} />
      <div style={{ position: "absolute", top: 560, left: 110, right: 110, opacity: p, transform: `perspective(1600px) rotateX(${(1 - p) * 14}deg) translateY(${(1 - p) * 70}px)` }}>
        <Glass style={{ padding: "34px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <span dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 28, color: C.muted, letterSpacing: 3 }}>SHOT LIST</span>
            <LineIcon name="list" size={40} color={C.muted} />
          </div>
          {SHOTS.map((t, i) => {
            const done = at(f, sec(1.0) + i * 9, 8);
            return (
              <div key={i} dir="rtl" style={{ display: "flex", alignItems: "center", gap: 22, padding: "20px 0", borderTop: i ? `1.5px solid ${C.line}` : "none" }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, border: `3px solid ${done > 0.5 ? C.green : "rgba(255,255,255,.3)"}`, background: done > 0.5 ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {done > 0.5 && <LineIcon name="check" size={36} sw={3} />}
                </div>
                <span style={{ fontFamily: AR, fontWeight: 600, fontSize: 46, color: C.ink, opacity: 0.55 + 0.45 * done }}>{t}</span>
                <span dir="ltr" style={{ marginRight: "auto", fontFamily: SG, fontWeight: 500, fontSize: 26, color: C.muted }}>#{String(i + 1).padStart(2, "0")}</span>
              </div>
            );
          })}
        </Glass>
      </div>
      <Illustrative y={1300} o={at(f, 10, 12)} />
    </AbsoluteFill>
  );
};

const Set: React.FC = () => {
  const f = useCurrentFrame();
  const take = 1 + Math.min(2, Math.floor(Math.max(0, f - 20) / 30));
  const beam = 0.6 + 0.4 * Math.sin(f * 0.2);
  const cams = [{ a: -60, l: "A" }, { a: 0, l: "B" }, { a: 60, l: "C" }];
  const cx = 540, cy = 900;
  return (
    <AbsoluteFill>
      <Clock time="11:00" label="الضو و الزوايا" />
      <Kinetic words={["حتى", "تجي", "مزيانة"]} start={3} step={4} y={330} size={100} hiIdx={[2]} />
      {/* top-down set plan */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs><radialGradient id="beam" cx="0" cy="0.5" r="1"><stop offset="0" stopColor="rgba(255,184,0,.55)" /><stop offset="1" stopColor="rgba(255,184,0,0)" /></radialGradient></defs>
        <path d={`M200 640 L${cx - 30} ${cy - 40} L${cx - 30} ${cy + 40} Z`} fill="url(#beam)" opacity={beam * at(f, 6, 12)} />
        <circle cx={cx} cy={cy} r={82} fill="rgba(255,255,255,.08)" stroke="#fff" strokeWidth="3" />
        <circle cx={cx} cy={cy} r={8} fill="#fff" />
        {cams.map((c, i) => {
          const r = 330, rad = ((90 + c.a) * Math.PI) / 180;
          const x = cx + r * Math.cos(rad), y = cy + r * Math.sin(rad);
          const q = at(f, 8 + i * 6, 12);
          return (
            <g key={i} opacity={q}>
              <line x1={x} y1={y} x2={cx} y2={cy} stroke="rgba(255,255,255,.25)" strokeWidth="2" strokeDasharray="10 10" />
              <rect x={x - 46} y={y - 32} width="92" height="64" rx="14" fill={i === take - 1 ? C.pink : "#2a2833"} stroke="#fff" strokeWidth="2" />
              <text x={x} y={y + 13} textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="36" fill="#fff">{c.l}</text>
            </g>
          );
        })}
        <g opacity={at(f, 4, 12)}>
          <rect x="150" y="600" width="100" height="80" rx="16" fill={C.yel} />
          <text x="200" y="652" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="26" fill="#111">KEY</text>
        </g>
      </svg>
      <div style={{ position: "absolute", top: 600, right: 110, opacity: at(f, 10, 12) }}>
        <Glass style={{ padding: "18px 30px", textAlign: "center" }}>
          <div dir="ltr" style={{ fontFamily: SG, fontWeight: 500, fontSize: 24, color: C.muted, letterSpacing: 3 }}>TAKE</div>
          <div dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 80, color: C.ink, lineHeight: 1 }}>0{take}</div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

const HOOKS = ["شوف هادي قبل ما تشري", "3 حوايج ما كيقولهاش ليك حد", "هاد الغلطة كتكلفك بزاف"];
const Hooks: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Clock time="15:00" label="العشية" />
      <Kinetic words={["الهوكات", "بوحدهم"]} start={3} step={4} y={330} size={104} hiIdx={[0]} />
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 26 }}>
        {HOOKS.map((h, i) => {
          const p = at(f, 8 + i * 7, 14);
          const best = i === 1 && f > sec(2.6);
          return (
            <div key={i} style={{ width: 290, height: 520, borderRadius: 34, position: "relative", overflow: "hidden", opacity: p, transform: `translateY(${(1 - p) * 90}px) scale(${best ? 1.06 : 1})`,
              background: ["linear-gradient(170deg,#3a2d5c,#120f1d)", "linear-gradient(170deg,#ff8a3d,#c2185b 60%,#2a0d4a)", "linear-gradient(170deg,#1f4f5c,#0d1418)"][i],
              boxShadow: best ? "0 30px 90px rgba(255,45,122,.55), 0 0 0 4px #fff inset" : "0 30px 60px rgba(0,0,0,.5)" }}>
              <div dir="ltr" style={{ position: "absolute", top: 20, left: 20, fontFamily: SG, fontWeight: 700, fontSize: 24, color: "rgba(255,255,255,.8)", letterSpacing: 2 }}>HOOK {String.fromCharCode(65 + i)}</div>
              <div dir="rtl" style={{ position: "absolute", top: 170, left: 20, right: 20, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 38, lineHeight: 1.3, color: "#fff", textShadow: "0 4px 20px rgba(0,0,0,.5)" }}>{h}</div>
              <div dir="ltr" style={{ position: "absolute", bottom: 22, left: 0, right: 0, textAlign: "center", fontFamily: SG, fontWeight: 700, fontSize: 30, color: "#fff" }}>0:02</div>
            </div>
          );
        })}
      </div>
      <Illustrative y={1110} o={at(f, 10, 12)} />
    </AbsoluteFill>
  );
};

const Edit: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(3, 15);
  const head = interpolate(f, [6, sec(2.6)], [0.05, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const clips = [[0, 0.18, C.pink], [0.19, 0.4, C.pur], [0.41, 0.55, C.red], [0.56, 0.8, C.cya], [0.81, 1, C.yel]] as [number, number, string][];
  const caps = [[0.02, 0.2], [0.23, 0.45], [0.5, 0.7], [0.74, 0.96]];
  const Track: React.FC<{ icon: string; children: React.ReactNode }> = ({ icon, children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 18, height: 96 }}>
      <div style={{ width: 70, display: "flex", justifyContent: "center" }}><LineIcon name={icon} size={40} color={C.muted} /></div>
      <div style={{ position: "relative", flex: 1, height: "100%" }}>{children}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Clock time="20:00" label="الليل" />
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 30 }}>
        {[["cut", "المونتاج"], ["type", "الكتابة"], ["mic", "الصوت"]].map(([ic, t], i) => {
          const q = at(f, 4 + i * 6, 12);
          return <div key={i} dir="rtl" style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: AR, fontWeight: 700, fontSize: 54, color: C.ink, opacity: q, transform: `translateY(${(1 - q) * 30}px)` }}><LineIcon name={ic} size={48} />{t}</div>;
        })}
      </div>
      <div style={{ position: "absolute", top: 560, left: 70, right: 70, opacity: p, transform: `translateY(${(1 - p) * 80}px)` }}>
        <Glass style={{ padding: "30px 30px 34px", background: "linear-gradient(160deg, rgba(30,28,40,.95), rgba(15,14,22,.95))" }}>
          <div dir="ltr" style={{ display: "flex", justifyContent: "space-between", fontFamily: SG, fontWeight: 500, fontSize: 24, color: C.muted, marginBottom: 14, paddingLeft: 88 }}>
            {["0:00", "0:05", "0:10", "0:15", "0:20", "0:25"].map((t) => <span key={t}>{t}</span>)}
          </div>
          <div style={{ position: "relative" }}>
            <Track icon="camera">{clips.map(([a, b, c], i) => <div key={i} style={{ position: "absolute", left: `${a * 100}%`, width: `${(b - a) * 100}%`, top: 10, bottom: 10, borderRadius: 12, background: c, opacity: 0.85 * at(f, 8 + i * 3, 10) }} />)}</Track>
            <Track icon="type">{caps.map(([a, b], i) => <div key={i} style={{ position: "absolute", left: `${a * 100}%`, width: `${(b - a) * 100}%`, top: 24, bottom: 24, borderRadius: 10, background: "rgba(255,255,255,.85)", opacity: at(f, 18 + i * 3, 10) }} />)}</Track>
            <Track icon="mic">
              <svg width="100%" height="96" viewBox="0 0 100 96" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
                {[...Array(80)].map((_, i) => { const a = 8 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.31)) * 34; return <rect key={i} x={i * 1.25} y={48 - a / 2} width="0.7" height={a * at(f, 24, 14)} fill={C.green} />; })}
              </svg>
            </Track>
            <div style={{ position: "absolute", top: -10, bottom: -10, left: `calc(88px + (100% - 88px) * ${head})`, width: 4, background: "#fff", boxShadow: "0 0 18px #fff", borderRadius: 2 }} />
          </div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Viewfinder o={0.35} />
      <Kinetic words={["بغيتي", "نهار", "بحال", "هادا"]} start={2} step={4} y={340} size={100} />
      <Kinetic words={["للبراند", "ديالك؟"]} start={16} step={5} y={490} size={116} grad={AURORA} />
      <WaButton p={at(f, sec(1.2), 16)} label="صيفط لينا فواتساب" y={820} />
    </AbsoluteFill>
  );
};

export const ShootDay: React.FC = () => (
  <ReelShell data={D} audio="vo/R3_mix.wav" scenes={[Hook, Morning, Set, Hooks, Edit, Cta]} capHide={(t, s) => s === 0 || s === 5} />
);
