// W4 Thu: Black Friday for small Moroccan shops. "Don't burn the price, add value": bundle, small gift, short offer + WhatsApp order.
// Mixed media: 3D hook → editorial → paper bundle → character + gift → phone countdown chat → character CTA.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Tag, Phone, Grad, at, useSpring, ReelShell, Num, LineIcon, SendCta, Illustrative, Bubble, FitLine, Kinetic, sec, ReelData } from "../brand";
import { Character } from "../mixed/Character";
import { CutoutWords, PaperDesk, INK, useStep, jitter } from "../mixed/paper";
import { GiftBox, ShopBox, PriceTag } from "../mixed/props";
import { Hero3DText } from "../three/kit3d";
import data from "./S3.json";
const D = data as ReelData;

const Head: React.FC<{ n: string; label: string; y?: number }> = ({ n, label, y = 230 }) => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag p={at(f, 0, 10)}><Num n={n} label={label} /></Tag></div>;
};

const Hook: React.FC = () => {
  const s = useSpring(0, 12);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, textAlign: "center", fontFamily: SG, fontWeight: 700, fontSize: 150, letterSpacing: -5, lineHeight: 1 }}><Grad g={AURORA}>Black Friday</Grad></div>
      <div style={{ position: "absolute", inset: 0 }}><Hero3DText text="-50%" color="#FF3D2E" y={0.6} size={1.25} enter={s} /></div>
      <FitLine text="و نتا غادي تنقص الثمن؟" y={1060} max={100} width={760} />
    </AbsoluteFill>
  );
};

const Value: React.FC = () => {
  const f = useCurrentFrame();
  const strike = at(f, 14, 10);
  return (
    <PaperDesk tint="#F3EEE7">
      <div style={{ position: "absolute", top: 220, left: 90, right: 90, display: "flex", justifyContent: "space-between", fontFamily: SG, fontWeight: 500, fontSize: 26, letterSpacing: 4, color: "#6E6A75" }}>
        <span>BLACK FRIDAY · SMALL SHOPS</span><span>RULE N°1</span>
      </div>
      <div style={{ position: "absolute", top: 268, left: 90, right: 90, height: 3, background: INK }} />
      <div dir="rtl" style={{ position: "absolute", top: 380, left: 90, right: 90, fontFamily: AR, color: INK }}>
        <div style={{ fontWeight: 700, fontSize: 96, opacity: at(f, 0, 10), position: "relative", display: "inline-block" }}>
          ما تحرقش الثمن
          <div style={{ position: "absolute", right: 0, top: "52%", height: 12, width: `${strike * 100}%`, background: C.red, borderRadius: 6, transform: "rotate(-3deg)" }} />
        </div>
        <div style={{ fontWeight: 700, fontSize: 210, lineHeight: 1.1, marginTop: 50, opacity: at(f, 24, 12), transform: `translateY(${(1 - at(f, 24, 12)) * 40}px)` }}>زيد</div>
        <div style={{ fontWeight: 700, fontSize: 230, lineHeight: 1.1, opacity: at(f, 30, 12), transform: `translateY(${(1 - at(f, 30, 12)) * 40}px)` }}><Grad g={HOT}>القيمة</Grad></div>
      </div>
    </PaperDesk>
  );
};

const Bundle: React.FC = () => {
  const step = useStep(3);
  const j = jitter(step, 4, 0.8);
  return (
    <PaperDesk>
      <Head n="01" label="الفكرة" />
      <CutoutWords words={["باك", "ديال", "جوج"]} y={320} size={96} start={0} gap={4} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, transform: `translate(${j.dx}px, ${j.dy}px)` }}>
        {step >= 9 && <ShopBox x={400} y={850} s={1.5} color="#FFD9E6" />}
        {step >= 15 && <ShopBox x={680} y={850} s={1.5} color="#E4DAFF" />}
        {step >= 24 && <path d="M260 860 Q540 780 820 860" fill="none" stroke={C.pink} strokeWidth={22} strokeLinecap="round" />}
      </svg>
      {step >= 33 && <PriceTag x={330} y={1120} w={460} h={190} rot={-5 + j.rot}><span dir="rtl" style={{ fontFamily: AR, fontWeight: 700, fontSize: 64, color: INK }}>بثمن واحد</span></PriceTag>}
    </PaperDesk>
  );
};

const Gift: React.FC = () => {
  const f = useCurrentFrame();
  const open = at(f, 18, 16);
  return (
    <AbsoluteFill>
      <Head n="02" label="الفكرة" />
      <Kinetic words={["كادو", "صغير"]} start={2} step={4} y={320} size={130} hiIdx={[1]} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={330} y={1180} scale={0.8} mood={open > 0.5 ? "happy" : "neutral"} pose="idle" shirt={C.yel} hairStyle="scarf" seed={5} />
        <GiftBox x={740} y={1000} s={1.15} open={open} />
        {[...Array(8)].map((_, k) => {
          const a = (k / 8) * Math.PI * 2, r = 60 + open * 170;
          return <g key={k} opacity={open * (1 - Math.max(0, open - 0.85) * 4)} transform={`translate(${740 + Math.cos(a) * r} ${860 + Math.sin(a) * r * 0.7})`}><path d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" fill={k % 2 ? C.yel : C.pink} /></g>;
        })}
      </svg>
      <div style={{ position: "absolute", top: 530, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag p={at(f, 10, 12)}><LineIcon name="gift" size={34} color={C.pink} />مع كل كوموند</Tag></div>
    </AbsoluteFill>
  );
};

const Countdown: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(2, 15);
  const left = 48 * 3600 - Math.floor(f * 47);
  const hh = String(Math.floor(left / 3600)).padStart(2, "0"), mm = String(Math.floor((left % 3600) / 60)).padStart(2, "0"), ss = String(left % 60).padStart(2, "0");
  return (
    <AbsoluteFill>
      <Head n="03" label="الفكرة" />
      <FitLine text="عرض لمدة قصيرة" y={320} max={110} width={860} p={at(f, 2, 12)} />
      <Phone x={540} y={480} w={440} p={p} tilt={6}>
        <div style={{ padding: "80px 26px 0", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ alignSelf: "center", padding: "14px 26px", borderRadius: 22, background: "rgba(255,61,46,.16)", display: "flex", alignItems: "center", gap: 12 }}>
            <LineIcon name="clock" size={34} color={C.red} />
            <span dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 52, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{hh}:{mm}:{ss}</span>
          </div>
          <Bubble at0={10} side="in" size={30}>بغيت الباك ديال Black Friday</Bubble>
          <Bubble at0={30} side="out" size={30} time="20:14">واخا! صيفط ليا العنوان و نوجدو ليك الكوموند</Bubble>
          <Bubble at0={56} side="in" size={30}>تبارك الله، صافي</Bubble>
        </div>
      </Phone>
      <Illustrative y={1395} o={at(f, 20, 12)} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kinetic words={["صيفطها", "لشي", "واحد"]} start={2} step={4} y={250} size={104} />
      <Kinetic words={["عندو", "حانوت"]} start={12} step={4} y={400} size={116} hiIdx={[1]} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={540} y={1330} scale={0.72} mood="happy" pose="coffee" shirt={C.yel} hairStyle="scarf" seed={5} />
      </svg>
      <SendCta p={at(f, sec(0.7), 16)} to="لمول الحانوت" y={640} />
    </AbsoluteFill>
  );
};

export const BlackFriday: React.FC = () => (
  <ReelShell data={D} audio="vo/S3_mix.wav" scenes={[Hook, Value, Bundle, Gift, Countdown, Cta]} capHide={(t, s) => s === 0 || s === 1 || s === 5} />
);
