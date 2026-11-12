// W3 Sun: myth explainer: "you need 10K followers to sell?" No. 3 things that sell. UI data illustrative.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Kinetic, Tag, Phone, Glass, Grad, at, useSpring, ReelShell, SceneHead, Num, LineIcon, Bubble, CommentCta, Illustrative, sec, ReelData } from "../brand";
import data from "./R5.json";
const D = data as ReelData;

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const st = useSpring(sec(2.05), 9, 0.6);
  const s = useSpring(0, 12);
  return (
    <AbsoluteFill>
      <Kinetic words={["خاصك"]} instant start={0} y={260} size={110} />
      <div dir="ltr" style={{ position: "absolute", top: 410, left: 0, right: 0, textAlign: "center", fontFamily: SG, fontWeight: 700, fontSize: 470, lineHeight: 1, letterSpacing: -24,
        transform: `scale(${0.9 + 0.1 * s})`, filter: "drop-shadow(0 30px 90px rgba(255,45,122,.5))", opacity: 1 - 0.55 * st }}><Grad g={HOT}>10K</Grad></div>
      <Kinetic words={["متابع", "باش", "تبيع؟"]} instant start={0} y={900} size={110} />
      {/* NO stamp */}
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(1, st * 2), transform: `rotate(-10deg) scale(${2.2 - 1.2 * st})` }}>
        <div dir="rtl" style={{ padding: "10px 70px 30px", border: `12px solid ${C.red}`, borderRadius: 40, fontFamily: AR, fontWeight: 700, fontSize: 230, lineHeight: 1.1, color: C.red, background: "rgba(6,5,12,.55)", boxShadow: `0 0 80px rgba(255,61,46,.45)` }}>لا</div>
      </div>
    </AbsoluteFill>
  );
};

const Number_: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(2, 15);
  const strike = interpolate(f, [sec(0.8), sec(1.3)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Kinetic words={["المتابعين", "رقم"]} start={2} step={5} y={250} size={110} hiIdx={[1]} />
      <div style={{ position: "absolute", top: 480, left: 160, right: 160, opacity: p, transform: `translateY(${(1 - p) * 60}px)` }}>
        <Glass style={{ padding: "34px 40px", textAlign: "center", position: "relative" }}>
          <div dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 150, color: C.muted, lineHeight: 1 }}>10,000</div>
          <div style={{ fontFamily: SG, fontWeight: 500, fontSize: 30, color: C.muted, letterSpacing: 4, marginTop: 10 }}>FOLLOWERS</div>
          <div style={{ position: "absolute", left: 30, top: "42%", height: 8, width: `calc((100% - 60px) * ${strike})`, background: C.red, borderRadius: 4, transform: "rotate(-4deg)" }} />
        </Glass>
      </div>
      <Kinetic words={["المبيعات", "كتجي", "من"]} start={sec(1.6)} step={4} y={850} size={84} />
      <div style={{ position: "absolute", top: 990, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 36 }}>
        {[1, 2, 3].map((n, i) => {
          const q = useSpring(sec(2.2) + i * 5, 11);
          return <div key={n} style={{ width: 150, height: 150, borderRadius: 99, background: AURORA, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SG, fontWeight: 700, fontSize: 80, color: "#fff", transform: `scale(${q})`, boxShadow: "0 24px 60px rgba(255,45,122,.4)" }}>{n}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const PINS = [[300, 760], [470, 690], [620, 800], [760, 700], [410, 900], [690, 930], [540, 860], [350, 1010], [800, 1020], [560, 1060]];
const Local: React.FC = () => {
  const f = useCurrentFrame();
  const cities = ["مرتيل", "تطوان", "طنجة"];
  return (
    <AbsoluteFill>
      <SceneHead kicker={<Num n="01" label="شنو كيبيع" />} words={["الناس", "الصحاح"]} hi={[1]} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <circle cx="540" cy="880" r={300} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="2" />
        <circle cx="540" cy="880" r={200} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="2" />
        <circle cx="540" cy="880" r={100 + (f % 45) * 5} fill="none" stroke={C.pink} strokeOpacity={1 - (f % 45) / 45} strokeWidth="3" />
      </svg>
      {PINS.map(([x, y], i) => {
        const q = useSpring(8 + i * 3, 10);
        return <div key={i} style={{ position: "absolute", left: x - 30, top: y - 60, transform: `scale(${q}) translateY(${(1 - q) * -40}px)`, transformOrigin: "bottom center" }}><LineIcon name="pin" size={60} color={i % 3 ? C.ink : C.yel} sw={2} fill={i % 3 ? "rgba(255,255,255,.08)" : "rgba(255,184,0,.25)"} /></div>;
      })}
      <div style={{ position: "absolute", top: 1230, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
        {cities.map((c, i) => <Tag key={c} p={at(f, sec(1.2) + i * 5, 12)}>{c}</Tag>)}
      </div>
    </AbsoluteFill>
  );
};

const Offer: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(4, 15);
  const tag = useSpring(sec(1.2), 10);
  return (
    <AbsoluteFill>
      <SceneHead kicker={<Num n="02" label="شنو كيبيع" />} words={["عرض", "واضح"]} hi={[1]} />
      <div style={{ position: "absolute", top: 560, left: 200, right: 200, opacity: p, transform: `perspective(1600px) rotateY(${(1 - p) * -18}deg) translateY(${(1 - p) * 60}px)` }}>
        <Glass style={{ padding: 26 }}>
          <div style={{ height: 380, borderRadius: 24, background: "linear-gradient(160deg,#3a2d5c,#c2185b 70%,#ff8a3d)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="190" height="190" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round"><path d="M6 7h12l-1 14H7z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
          </div>
          <div dir="rtl" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22 }}>
            <span style={{ fontFamily: AR, fontWeight: 700, fontSize: 46, color: C.ink }}>المنتج ديالك</span>
            <span dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 50, color: C.ink }}>199 DH</span>
          </div>
          <div dir="rtl" style={{ marginTop: 20, padding: "20px 0", borderRadius: 999, background: C.green, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 40, color: "#fff" }}>اطلب فالواتساب</div>
        </Glass>
      </div>
      <div style={{ position: "absolute", top: 600, right: 140, transform: `rotate(${12 * tag}deg) scale(${tag})` }}>
        <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 26px", borderRadius: 20, background: C.yel, fontFamily: AR, fontWeight: 700, fontSize: 38, color: "#111", boxShadow: "0 20px 50px rgba(255,184,0,.4)" }}>
          <LineIcon name="tag" size={36} color="#111" />الثمن باين
        </div>
      </div>
      <Illustrative y={1330} o={at(f, 10, 12)} />
    </AbsoluteFill>
  );
};

const Reply: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(2, 15);
  const t = Math.floor(interpolate(f, [sec(1.0), sec(1.8)], [0, 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill>
      <SceneHead kicker={<Num n="03" label="شنو كيبيع" />} words={["جواب", "سريع"]} hi={[1]} />
      <Phone x={540} y={540} w={400} p={p} tilt={-3}>
        <div dir="rtl" style={{ padding: "64px 20px 16px", background: "#0f5132", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 99, background: "linear-gradient(135deg,#6b6b80,#3a3a48)" }} />
          <div style={{ fontFamily: AR, fontWeight: 600, fontSize: 25, color: "#fff" }}>كليانة جديدة</div>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <Bubble at0={4} side="in" time="14:02">واش كاين التوصيل لتطوان؟</Bubble>
          <Bubble at0={sec(1.6)} side="out" time="14:03">إيه كاين، و الخلاص عند الاستلام. نأكد ليك الطلب؟</Bubble>
          <Bubble at0={sec(2.3)} side="in" time="14:03">أكد عافاك</Bubble>
        </div>
      </Phone>
      <div style={{ position: "absolute", top: 1180, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: at(f, sec(1.6), 12) }}>
        <Glass style={{ padding: "18px 34px", display: "flex", alignItems: "center", gap: 16 }}>
          <LineIcon name="bolt" size={40} color={C.yel} />
          <span dir="rtl" style={{ fontFamily: AR, fontWeight: 700, fontSize: 40, color: C.ink }}>جاوب فـ <span dir="ltr" style={{ fontFamily: SG }}>{t || 1}</span> دقيقة</span>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kinetic words={["فين", "كتضيع"]} start={2} step={5} y={320} size={120} />
      <Kinetic words={["المبيعات", "ديالك؟"]} start={10} step={5} y={480} size={120} grad={AURORA} />
      <CommentCta p={at(f, sec(0.6), 16)} keyword="AUDIT" y={800} />
    </AbsoluteFill>
  );
};

export const FollowersMyth: React.FC = () => (
  <ReelShell data={D} audio="vo/R5_mix.wav" scenes={[Hook, Number_, Local, Offer, Reply, Cta]}
    capHide={(t, s) => s === 0 || s === 5} index={(s) => (s >= 2 && s <= 4 ? `0${s - 1} / 03` : undefined)} />
);
