// W3 Wed: client result story, keynote style. Happy Fitness: 101.1K followers, 151.2K-view reel, gym OS + AI member portal.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Kinetic, Tag, Phone, Glass, Grad, at, useSpring, ReelShell, Counter, LineIcon, Bubble, CommentCta, Illustrative, sec, ReelData } from "../brand";
import data from "./R2.json";
const D = data as ReelData;

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(f * 0.12);
  const s = useSpring(0, 12);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Tag><span dir="ltr" style={{ fontFamily: SG }}>@happy_fitness_martil</span></Tag>
      </div>
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, height: 420, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "absolute", width: 900, height: 420, borderRadius: 999, background: `radial-gradient(closest-side, rgba(255,45,122,${0.25 + 0.15 * glow}), transparent)` }} />
      </div>
      <div dir="ltr" style={{ position: "absolute", top: 480, left: 0, right: 0, textAlign: "center", fontFamily: SG, fontWeight: 700, fontSize: 330, letterSpacing: -16, lineHeight: 1, transform: `scale(${0.94 + 0.06 * s})` }}>
        <Grad g={HOT}>101.1K</Grad>
      </div>
      <Kinetic words={["متابع"]} instant start={0} y={830} size={110} />
      <Kinetic words={["و", "هادي", "غير", "البداية"]} instant start={0} y={1010} size={84} color={C.muted} hiIdx={[3]} grad={undefined} />
    </AbsoluteFill>
  );
};

const ReelProof: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(2, 15);
  const card = useSpring(sec(2.2), 14);
  const play = interpolate(f, [0, sec(5.5)], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Kinetic words={["ريل", "وحدة"]} start={2} step={5} y={230} size={104} hiIdx={[1]} />
      <Phone x={330} y={430} w={380} p={p} tilt={8}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg,#ff8a3d 0%,#c2185b 55%,#2a0d4a 100%)" }} />
        {/* abstract gym frame: plates + bar */}
        <svg width="352" height="752" viewBox="0 0 352 752" style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
          <rect x="40" y="370" width="272" height="12" rx="6" fill="#fff" />
          {[30, 60, 262, 292].map((x, i) => <rect key={i} x={x} y={i % 3 ? 320 : 300} width="26" height={i % 3 ? 112 : 152} rx="8" fill="#fff" opacity={0.85} />)}
          <circle cx="176" cy="200" r="54" fill="none" stroke="#fff" strokeWidth="6" />
        </svg>
        <div style={{ position: "absolute", left: "50%", top: "45%", width: 110, height: 110, marginLeft: -55, borderRadius: 99, background: "rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="52" height="52" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff" /></svg>
        </div>
        <div style={{ position: "absolute", right: 18, bottom: 140, display: "flex", flexDirection: "column", gap: 26, alignItems: "center" }}>
          {["heart", "chat", "send"].map((n) => <LineIcon key={n} name={n} size={40} />)}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: "rgba(255,255,255,.25)" }}><div style={{ width: `${play * 100}%`, height: "100%", background: "#fff" }} /></div>
      </Phone>
      <div style={{ position: "absolute", top: 560, left: 600, right: 60, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: at(f, 8, 12) }}>
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
          <span style={{ fontFamily: SG, fontWeight: 500, fontSize: 32, color: C.muted, letterSpacing: 2 }}>VIEWS</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 540, top: 0, width: 500, height: 1920 }}><Counter to={151.2} start={8} dur={50} fmt={(v) => `${v.toFixed(1)}K`} size={140} y={630} /></div>
      <div style={{ position: "absolute", top: 900, left: 600, right: 70, opacity: card, transform: `translateY(${(1 - card) * 50}px)` }}>
        <Glass style={{ padding: "26px 30px" }}>
          <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 44, color: C.ink }}>Happy Fitness</div>
          <div dir="rtl" style={{ fontFamily: AR, fontWeight: 500, fontSize: 32, color: C.muted, marginTop: 6 }}>صالة رياضة · مرتيل</div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};
// Counter is centered by default; shift it into the right column for this scene.
const ReelProofShifted: React.FC = () => (
  <AbsoluteFill>
    <ReelProof />
  </AbsoluteFill>
);

const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const qs = ["الاشتراكات؟", "الحضور؟", "الخلاص؟", "الحصص؟"];
  return (
    <AbsoluteFill>
      <Kinetic words={["المتابعين", "بوحدهم"]} start={2} step={4} y={250} size={100} />
      <Kinetic words={["ما", "كيسيروش", "صالة"]} start={12} step={4} y={390} size={100} hiIdx={[1, 2]} />
      <div style={{ position: "absolute", top: 700, left: 0, right: 0, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 34, padding: "0 90px" }}>
        {qs.map((q, i) => {
          const p = at(f, 18 + i * 6, 14);
          return (
            <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * -120}px) rotate(${(i % 2 ? 4 : -4) * p}deg)` }}>
              <Glass style={{ padding: "26px 40px", display: "flex", alignItems: "center", gap: 16 }}>
                <span dir="rtl" style={{ fontFamily: AR, fontWeight: 700, fontSize: 64, color: C.ink }}>{q}</span>
              </Glass>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const STATS = [{ k: "أعضاء نشطين", v: "412" }, { k: "دخول اليوم", v: "86" }, { k: "تجديد هاد السيمانة", v: "23" }];
const System: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(2, 15);
  const ph = useSpring(sec(1.4), 14);
  const bars = [0.45, 0.7, 0.55, 0.9, 0.65, 0.8, 1];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag p={at(f, 0, 12)}><LineIcon name="grid" size={32} />سيستام الصالة + بوابة الأعضاء</Tag></div>
      {/* dashboard */}
      <div style={{ position: "absolute", top: 400, left: 70, width: 640, opacity: p, transform: `perspective(1800px) rotateY(${12 - 4 * p}deg) translateX(${(1 - p) * -120}px)` }}>
        <Glass style={{ padding: 30, background: "linear-gradient(160deg, rgba(30,28,40,.95), rgba(15,14,22,.95))" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 30, color: C.ink }}>Gym OS</span>
            <span style={{ display: "flex", gap: 8 }}>{[C.red, C.yel, C.green].map((c) => <span key={c} style={{ width: 14, height: 14, borderRadius: 99, background: c }} />)}</span>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 24 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ flex: 1, padding: "18px 16px", borderRadius: 20, background: "rgba(255,255,255,.05)", opacity: at(f, 10 + i * 4, 10) }}>
                <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 52, color: C.ink }}>{s.v}</div>
                <div dir="rtl" style={{ fontFamily: AR, fontWeight: 500, fontSize: 21, color: C.muted, marginTop: 4 }}>{s.k}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 170, marginTop: 26 }}>
            {bars.map((b, i) => <div key={i} style={{ flex: 1, height: `${b * 100 * at(f, 16 + i * 2, 14)}%`, borderRadius: 10, background: i === bars.length - 1 ? AURORA : "rgba(255,255,255,.14)" }} />)}
          </div>
        </Glass>
      </div>
      {/* member portal phone with AI */}
      <Phone x={790} y={700} w={340} p={ph} tilt={-10}>
        <div dir="rtl" style={{ padding: "60px 16px 14px", background: "#15141b", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 99, background: AURORA, display: "flex", alignItems: "center", justifyContent: "center" }}><LineIcon name="sparkle" size={24} /></div>
          <div style={{ fontFamily: AR, fontWeight: 600, fontSize: 21, color: "#fff" }}>بوابة الأعضاء</div>
        </div>
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          <Bubble at0={sec(1.9)} side="out" size={24} maxW={260}>واش عندي حصة غدا؟</Bubble>
          <Bubble at0={sec(2.7)} side="in" size={24} maxW={270}>إيه، غدا 18:30 مع الكوتش. بغيتي نذكرك؟</Bubble>
          <Bubble at0={sec(3.6)} side="out" size={24} maxW={200}>عافاك</Bubble>
          <Bubble at0={sec(4.3)} side="in" size={24} maxW={270}>تم ✓ غادي نصيفط ليك تذكير</Bubble>
        </div>
        <div style={{ position: "absolute", left: 14, right: 14, bottom: 18, height: 54, borderRadius: 99, background: "#22212a", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 10px" }}>
          <div style={{ width: 38, height: 38, borderRadius: 99, background: AURORA }} />
        </div>
      </Phone>
      <Illustrative x={140} y={1080} o={at(f, 14, 12)} />
    </AbsoluteFill>
  );
};

const Thesis: React.FC = () => {
  const f = useCurrentFrame();
  const a = useSpring(2, 14), b = useSpring(sec(1.2), 14);
  const Row: React.FC<{ p: number; icon: string; k: string; v: string; g?: boolean }> = ({ p, icon, k, v, g }) => (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 60}px)` }}>
      <Glass style={{ padding: "40px 44px", display: "flex", alignItems: "center", gap: 34 }}>
        <div style={{ width: 120, height: 120, borderRadius: 32, background: g ? AURORA : "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><LineIcon name={icon} size={64} /></div>
        <div dir="rtl" style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 64, color: C.ink }}>{k}</div>
          <div style={{ fontFamily: AR, fontWeight: 600, fontSize: 46, marginTop: 6 }}>{g ? <Grad g={HOT}>{v}</Grad> : <span style={{ color: C.muted }}>{v}</span>}</div>
        </div>
      </Glass>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 520, left: 90, right: 90, display: "flex", flexDirection: "column", gap: 40 }}>
        <Row p={a} icon="users" k="الفولوورز" v="كيجيبو الناس" />
        <Row p={b} icon="grid" k="السيستام" v="كينظم كلشي" g />
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kinetic words={["بغيتي", "بحالها"]} start={2} step={5} y={330} size={120} />
      <Kinetic words={["للبيزنس", "ديالك؟"]} start={10} step={5} y={490} size={120} grad={AURORA} />
      <CommentCta p={at(f, sec(1.0), 16)} keyword="SPOT" y={820} />
    </AbsoluteFill>
  );
};

export const HappyFitnessSystem: React.FC = () => (
  <ReelShell data={D} audio="vo/R2_mix.wav" scenes={[Hook, ReelProofShifted, Problem, System, Thesis, Cta]}
    capHide={(t, s) => s === 0 || s === 5 || s === 2} />
);
