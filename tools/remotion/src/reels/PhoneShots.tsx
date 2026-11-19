// W4 Sun: how-to (content & film). 3 phone shots that sell a product: macro texture, product in hand, before/after + window light.
// Mixed media: phone camera UI hook → macro lens → character holding the product → paper before/after → editorial light page → save CTA.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Tag, Phone, Grad, at, useSpring, ReelShell, Num, LineIcon, SaveCta, FitLine, Kinetic, sec, ReelData } from "../brand";
import { Character } from "../mixed/Character";
import { Scrap, PaperDesk, INK, useStep, jitter } from "../mixed/paper";
import { Mug } from "../mixed/props";
import data from "./S5.json";
const D = data as ReelData;

const Head: React.FC<{ n: string; label: string }> = ({ n, label }) => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag p={at(f, 0, 10)}><Num n={n} label={label} /></Tag></div>;
};

// camera viewfinder inside a phone (REC, thirds, focus box, shutter)
const CamUI: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const sec_ = Math.floor(f / 30);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 50% at 50% 45%, #FFF3E2, #E9D6C2)" }}>
      {children}
      {[1, 2].map((k) => <div key={k} style={{ position: "absolute", left: `${k * 33.3}%`, top: 0, bottom: 0, width: 1.5, background: "rgba(255,255,255,.7)" }} />)}
      {[1, 2].map((k) => <div key={k} style={{ position: "absolute", top: `${k * 33.3}%`, left: 0, right: 0, height: 1.5, background: "rgba(255,255,255,.7)" }} />)}
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 10, alignItems: "center", fontFamily: SG, fontWeight: 700, fontSize: 24, color: "#fff" }}>
        <div style={{ padding: "6px 14px", borderRadius: 10, background: "rgba(255,61,46,.9)", display: "flex", gap: 8, alignItems: "center" }}><div style={{ width: 12, height: 12, borderRadius: 6, background: "#fff", opacity: f % 30 < 18 ? 1 : 0.3 }} />REC 00:0{sec_}</div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: "46%", width: 170, height: 170, marginLeft: -85, marginTop: -85, border: "3px solid #FFB800", borderRadius: 14, transform: `scale(${1.25 - 0.25 * at(f, 6, 12)})` }} />
      <div style={{ position: "absolute", bottom: 40, left: "50%", marginLeft: -48, width: 96, height: 96, borderRadius: 48, border: "6px solid #fff", background: "rgba(255,255,255,.35)" }} />
    </div>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div dir="rtl" style={{ position: "absolute", top: 235, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 100, lineHeight: 1.15, color: C.ink, whiteSpace: "nowrap" }}>
        <span style={{ fontFamily: SG }}><Grad g={HOT}>3</Grad></span> لقطات بالتيليفون
      </div>
      <FitLine text="كيبيعو المنتوج ديالك" y={385} max={92} width={780} color={C.ink} />
      <Phone x={540} y={540} w={430} tilt={-4}>
        <CamUI>
          <svg width="402" height="852" style={{ position: "absolute", inset: 0 }}>
            <ellipse cx={201} cy={560} rx={150} ry={22} fill="rgba(90,50,40,.18)" />
            <Mug x={190} y={430} s={0.85 + f * 0.0015} />
          </svg>
        </CamUI>
      </Phone>
    </AbsoluteFill>
  );
};

const Macro: React.FC = () => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, sec(3.8)], [1.5, 2.1]);
  const p = useSpring(0, 14);
  return (
    <AbsoluteFill>
      <Head n="01" label="اللقطة" />
      <FitLine text="قريب بزاف" y={320} max={130} width={800} p={at(f, 2, 12)} />
      <div style={{ position: "absolute", left: 540 - 360, top: 560, width: 720, height: 720, borderRadius: 999, overflow: "hidden", border: `10px solid ${C.ink}`, boxShadow: "0 40px 100px rgba(90,50,40,.3)",
        transform: `scale(${0.6 + 0.4 * p})`, background: "#FFF3E2" }}>
        <svg width="720" height="720" viewBox="-360 -360 720 720">
          <g transform={`scale(${z}) translate(10 10)`}><Mug x={0} y={0} s={1} steam={false} /></g>
        </svg>
      </div>
      <div style={{ position: "absolute", top: 1300, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag p={at(f, sec(2), 10)}><LineIcon name="sparkle" size={30} color={C.ora} />الخامة</Tag></div>
    </AbsoluteFill>
  );
};

const InHand: React.FC = () => {
  const f = useCurrentFrame();
  const arrow = at(f, sec(1.6), 16);
  return (
    <AbsoluteFill>
      <Head n="02" label="اللقطة" />
      <FitLine text="المنتوج فاليد" y={320} max={130} width={820} p={at(f, 2, 12)} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={420} y={1130} scale={0.8} mood="happy" pose="idle" shirt={C.pur} hairStyle="scarf" seed={6} />
        <Mug x={500} y={1120} s={0.42} />
        <g opacity={arrow}>
          <path d={`M640 ${1020} V ${1020 + 150 * arrow}`} stroke={C.pink} strokeWidth={8} strokeLinecap="round" />
          <path d="M620 1022 h40 M620 1170 h40" stroke={C.pink} strokeWidth={8} strokeLinecap="round" />
        </g>
      </svg>
      <div style={{ position: "absolute", top: 1060, left: 690 }}><Tag p={arrow}>القياس</Tag></div>
    </AbsoluteFill>
  );
};

const BeforeAfter: React.FC = () => {
  const step = useStep(3);
  const j1 = jitter(step, 2, 0.7), j2 = jitter(step, 8, 0.7);
  const card = (x: number, j: { dx: number; dy: number; rot: number }, label: string, good: boolean, seed: number) => (
    <Scrap x={x + j.dx} y={600 + j.dy} w={420} h={620} color={good ? "#FFF8F0" : "#E3DDD6"} seed={seed} rot={(good ? 3 : -3) + j.rot} tape>
      <svg width="420" height="620" style={{ position: "absolute", inset: 0, filter: good ? "none" : "grayscale(1) brightness(.75) blur(1.5px)" }}>
        <Mug x={200} y={330} s={0.8} steam={good} />
      </svg>
      <div dir="rtl" style={{ position: "absolute", bottom: 26, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 50, color: good ? C.pink : "#6E6A75" }}>{label}</div>
    </Scrap>
  );
  return (
    <PaperDesk>
      <Head n="03" label="اللقطة" />
      <FitLine text="قبل و من بعد" y={320} max={130} width={820} />
      {card(560, j1, "قبل", false, 51)}
      {step >= 12 && card(100, j2, "من بعد", true, 52)}
    </PaperDesk>
  );
};

const Light: React.FC = () => {
  const f = useCurrentFrame();
  const x = at(f, sec(1.9), 10);
  return (
    <PaperDesk tint="#F3EEE7">
      <div style={{ position: "absolute", top: 220, left: 90, right: 90, display: "flex", justifyContent: "space-between", fontFamily: SG, fontWeight: 500, fontSize: 26, letterSpacing: 4, color: "#6E6A75" }}>
        <span>CONTENT & FILM · N°04</span><span>LIGHT</span>
      </div>
      <div style={{ position: "absolute", top: 268, left: 90, right: 90, height: 3, background: INK }} />
      <div dir="rtl" style={{ position: "absolute", top: 320, left: 90, right: 90, fontFamily: AR, color: INK }}>
        <div style={{ fontWeight: 600, fontSize: 60, opacity: at(f, 0, 10) }}>و الضو؟</div>
        <div style={{ fontWeight: 700, fontSize: 150, lineHeight: 1.1, opacity: at(f, 4, 14), transform: `translateY(${(1 - at(f, 4, 14)) * 40}px)` }}>حدا <Grad g={HOT}>الشرجم</Grad></div>
      </div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(150 760)" opacity={at(f, 8, 12)}>
          <rect width={260} height={340} rx={10} fill="#D7F3F7" stroke={INK} strokeWidth={8} />
          <path d="M130 0 V340 M0 170 H260" stroke={INK} strokeWidth={8} />
        </g>
        {[0, 1, 2, 3].map((k) => <path key={k} d={`M410 ${800 + k * 80} L${720} ${960 + k * 50}`} stroke="rgba(255,184,0,.45)" strokeWidth={26} strokeLinecap="round" opacity={at(f, 14 + k * 3, 12)} />)}
        <Mug x={790} y={1060} s={0.6} />
        <g transform="translate(900 830)" opacity={at(f, sec(1.6), 10)}>
          <path d="M-40 60h80M-30 80h60" stroke={INK} strokeWidth={8} strokeLinecap="round" />
          <path d="M0 -60a50 50 0 0 0 -30 90V50h60V30A50 50 0 0 0 0 -60z" fill="#FFE7A8" stroke={INK} strokeWidth={8} />
          <path d={`M${-70 * x} ${-70 * x} L${70 * x} ${90 * x}`} stroke={C.red} strokeWidth={14} strokeLinecap="round" />
        </g>
      </svg>
      <div dir="rtl" style={{ position: "absolute", top: 1240, left: 90, right: 90, fontFamily: AR, fontWeight: 600, fontSize: 48, color: "#3b3742", opacity: at(f, sec(2.1), 12) }}>ماشي الضو ديال السقف.</div>
    </PaperDesk>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kinetic words={["سيفها،"]} start={2} step={4} y={250} size={130} hiIdx={[0]} />
      <Kinetic words={["و", "صورها", "اليوم"]} start={8} step={4} y={420} size={110} />
      <SaveCta p={at(f, sec(0.7), 16)} label="سيف للمرة الجاية" y={640} sub="بغيتي تصوير احترافي؟" />
      <div dir="ltr" style={{ position: "absolute", top: 905, left: 0, right: 0, textAlign: "center", fontFamily: SG, fontWeight: 700, fontSize: 46, color: C.ink, opacity: at(f, sec(1), 14) }}>+212 701 177 915</div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={540} y={1330} scale={0.72} mood="happy" pose="phone" shirt={C.pur} hairStyle="scarf" seed={6} />
      </svg>
    </AbsoluteFill>
  );
};

export const PhoneShots: React.FC = () => (
  <ReelShell data={D} audio="vo/S5_mix.wav" scenes={[Hook, Macro, InHand, BeforeAfter, Light, Cta]} capHide={(t, s) => s === 0 || s === 4 || s === 5} />
);
