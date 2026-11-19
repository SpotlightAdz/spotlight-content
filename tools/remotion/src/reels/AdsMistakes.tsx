// W4 Mon: performance ads explainer. "درتي سبونسور… و حتى واحد ما شرا؟" 3 mistakes + what a good ad starts from.
// Mixed media: character hook → paper target → phone ad insights → character waiting → editorial → character CTA.
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Kinetic, FitLine, Tag, Phone, Glass, Grad, at, useSpring, ReelShell, SceneHead, Num, LineIcon, SendCta, Illustrative, Stamp, sec, ReelData } from "../brand";
import { Character } from "../mixed/Character";
import { Scrap, CutoutWords, PaperDesk, INK, useStep, jitter } from "../mixed/paper";
import data from "./S1.json";
const D = data as ReelData;

// ---------- S0 · hook: owner pays for a "sponsor", sales counter stays at 0 ----------
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const st = useSpring(sec(1.4), 9, 0.6);
  const coins = [...Array(7)].map((_, i) => ({ x: 200 + i * 110 + random(`c${i}`) * 40, d: (i * 7) % 20 }));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag><LineIcon name="bolt" size={32} color={C.ora} />Sponsored</Tag></div>
      <div dir="rtl" style={{ position: "absolute", top: 310, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 136, lineHeight: 1.2, color: C.ink, whiteSpace: "nowrap" }}>درتي <Grad g={HOT}>سبونسور</Grad></div>
      <FitLine text="و حتى واحد ما شرا؟" y={490} max={104} width={800} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        {coins.map((c, i) => {
          const y = ((f * 9 + c.d * 30 + i * 140) % 700) + 700;
          return <g key={i} transform={`translate(${c.x} ${y})`} opacity={0.9}>
            <circle r={34} fill={C.yel} stroke={INK} strokeWidth={6} /><text y={13} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={34} fill={INK}>DH</text></g>;
        })}
        <Character x={540} y={1330} scale={1.1} mood={f > sec(1.3) ? "shocked" : "neutral"} pose="phone" shirt={C.pur} />
      </svg>
      <div style={{ position: "absolute", top: 780, left: 650 }}>
        <Glass style={{ padding: "18px 30px", display: "flex", alignItems: "center", gap: 16 }}>
          <span dir="rtl" style={{ fontFamily: AR, fontWeight: 600, fontSize: 34, color: C.muted }}>المبيعات</span>
          <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 64, color: C.red }}>0</span>
        </Glass>
      </div>
      <Stamp p={st} y={900} x={630} size={70} rot={-12}>والو</Stamp>
    </AbsoluteFill>
  );
};

// ---------- S1 · paper target, darts everywhere except the centre ----------
const Target: React.FC = () => {
  const step = useStep(3);
  const darts = [...Array(14)].map((_, i) => ({ a: random(`a${i}`) * Math.PI * 2, r: 230 + random(`r${i}`) * 170, at: 6 + i * 3 }));
  return (
    <PaperDesk>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag><Num n="01" label="الغلطة" /></Tag></div>
      <CutoutWords words={["سبونسور", "لكلشي"]} y={320} size={96} start={0} gap={5} />
      {(() => { const j = jitter(step, 3, 0.6); return (
        <Scrap x={170 + j.dx} y={620 + j.dy} w={740} h={740} color="#FFF8F0" seed={12} rot={j.rot} tape>
          <svg width="740" height="740" style={{ position: "absolute", inset: 0 }}>
            {[300, 230, 160, 90].map((r, k) => <circle key={k} cx={370} cy={370} r={r} fill={k % 2 ? "#FFF8F0" : "#FFD9E6"} stroke={INK} strokeWidth={6} />)}
            <circle cx={370} cy={370} r={34} fill={C.pink} stroke={INK} strokeWidth={6} />
            {darts.map((d, i) => step >= d.at && (
              <g key={i} transform={`translate(${370 + Math.cos(d.a) * d.r} ${370 + Math.sin(d.a) * d.r * 0.92})`}>
                <circle r={12} fill={INK} /><path d="M0 0 l 40 -40" stroke={INK} strokeWidth={7} /><path d="M40 -40 l 18 -4 l -6 -14 z" fill={C.cya} stroke={INK} strokeWidth={4} />
              </g>
            ))}
          </svg>
        </Scrap>
      ); })()}
    </PaperDesk>
  );
};

// ---------- S2 · phone ad insights: likes high, messages and sales at 0 ----------
const Insights: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(2, 15);
  const likes = Math.round(interpolate(f, [8, 40], [0, 1240], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const row = (icon: string, label: string, val: string, color: string, d: number, bad?: boolean) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 30px", borderRadius: 26, background: bad ? "rgba(255,61,46,.12)" : "rgba(255,255,255,.06)", opacity: at(f, d, 10), transform: `translateX(${(1 - at(f, d, 10)) * 60}px)` }}>
      <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 54, color }}>{val}</span>
      <span dir="rtl" style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: AR, fontWeight: 600, fontSize: 32, color: "#fff" }}>{label}<LineIcon name={icon} size={36} color={color} /></span>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag p={at(f, 0, 12)}><Num n="02" label="الغلطة" /></Tag></div>
      <FitLine text="اللايكات ماشي مبيعات" y={330} max={96} width={860} p={at(f, 3, 12)} />
      <Phone x={540} y={500} w={520} p={p} tilt={-6}>
        <div style={{ padding: "90px 34px 0", display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 30, color: "rgba(255,255,255,.6)", letterSpacing: 3 }}>AD RESULTS</div>
          {row("heart", "لايكات", likes.toLocaleString("en"), C.pink, 6)}
          {row("chat", "ميساجات", "0", C.red, 16, true)}
          {row("tag", "مبيعات", "0", C.red, 24, true)}
        </div>
      </Phone>
      <Illustrative y={1330} o={at(f, 20, 12)} />
    </AbsoluteFill>
  );
};

// ---------- S3 · character customer waiting, message unanswered, clock spinning ----------
const Waiting: React.FC = () => {
  const f = useCurrentFrame();
  const hours = Math.min(9, Math.floor(f / 9));
  return (
    <AbsoluteFill>
      <SceneHead kicker={<Num n="03" label="الغلطة" />} words={["ميساج", "بلا", "جواب"]} hi={[2]} size={100} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={300} y={1080} scale={0.8} mood={hours > 4 ? "tired" : "neutral"} pose="phone" shirt={C.cya} hairStyle="scarf" seed={2} />
        <g transform="translate(800 720)">
          <circle r={130} fill="#FFF8F0" stroke={INK} strokeWidth={9} />
          {[...Array(12)].map((_, k) => <path key={k} d="M0 -110 v18" stroke={INK} strokeWidth={6} transform={`rotate(${k * 30})`} />)}
          <path d="M0 0 v-80" stroke={INK} strokeWidth={10} strokeLinecap="round" transform={`rotate(${f * 24})`} />
          <path d="M0 0 v-55" stroke={C.pink} strokeWidth={12} strokeLinecap="round" transform={`rotate(${f * 2})`} />
        </g>
      </svg>
      <div style={{ position: "absolute", top: 600, left: 400, width: 300, display: "flex", flexDirection: "column", gap: 14 }}>
        {["سلام", "بشحال؟", "واش كاين؟"].map((m, i) => (
          <div key={i} dir="rtl" style={{ padding: "14px 22px", borderRadius: "24px 24px 24px 6px", background: "#fff", border: `4px solid ${INK}`, fontFamily: AR, fontWeight: 700, fontSize: 38, color: INK,
            opacity: at(f, i * 10, 8), transform: `scale(${0.7 + 0.3 * at(f, i * 10, 8)})`, transformOrigin: "left bottom", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {m}<span style={{ fontFamily: SG, fontSize: 24, color: C.muted }}>✓</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 900, left: 720 }}><Tag p={at(f, 20, 10)}><span dir="ltr" style={{ fontFamily: SG, fontWeight: 700 }}>+{hours}h</span></Tag></div>
    </AbsoluteFill>
  );
};

// ---------- S4 · editorial: a good ad starts from the goal ----------
const Goal: React.FC = () => {
  const f = useCurrentFrame();
  const rows: [string, string, string][] = [["users", "شكون", "الناس اللي غادي يشريو"], ["pin", "فين", "المدينة و الحومة ديالهم"], ["bolt", "شنو غادي يدير", "ميساج، كوموند، ولا زيارة"]];
  return (
    <PaperDesk tint="#F3EEE7">
      <div style={{ position: "absolute", top: 220, left: 90, right: 90, display: "flex", justifyContent: "space-between", fontFamily: SG, fontWeight: 500, fontSize: 26, letterSpacing: 4, color: "#6E6A75" }}>
        <span>PERFORMANCE ADS · N°01</span><span>GOAL FIRST</span>
      </div>
      <div style={{ position: "absolute", top: 268, left: 90, right: 90, height: 3, background: INK }} />
      <div dir="rtl" style={{ position: "absolute", top: 320, left: 90, right: 90, fontFamily: AR, color: INK }}>
        <div style={{ fontWeight: 600, fontSize: 58, opacity: at(f, 0, 10) }}>الإعلان المزيان كيبدا من</div>
        <div style={{ fontWeight: 700, fontSize: 220, lineHeight: 1.1, opacity: at(f, 4, 14), transform: `translateY(${(1 - at(f, 4, 14)) * 40}px)` }}><Grad g={HOT}>الهدف</Grad></div>
        <div style={{ height: 3, background: "rgba(18,16,24,.18)", margin: "30px 0 20px", width: `${at(f, 10, 20) * 100}%` }} />
        {rows.map(([ic, h, s], i) => {
          const q = at(f, sec(2.4) + i * sec(0.8), 12);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, padding: "26px 0", borderBottom: "2px solid rgba(18,16,24,.12)", opacity: q, transform: `translateX(${(q - 1) * 60}px)` }}>
              <div style={{ width: 110, height: 110, borderRadius: 30, background: AURORA, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><LineIcon name={ic} size={58} color="#fff" sw={2.2} /></div>
              <div><div style={{ fontWeight: 700, fontSize: 64 }}>{h}</div><div style={{ fontWeight: 500, fontSize: 38, color: "#5b5560" }}>{s}</div></div>
            </div>
          );
        })}
      </div>
    </PaperDesk>
  );
};

// ---------- S5 · CTA ----------
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kinetic words={["صيفطها", "لصاحبك"]} start={2} step={4} y={250} size={110} hiIdx={[1]} />
      <Kinetic words={["اللي", "كيدير", "سبونسور"]} start={10} step={4} y={410} size={92} />
      <Kinetic words={["كل", "سيمانة"]} start={18} step={4} y={540} size={92} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={540} y={1330} scale={0.72} mood="happy" pose="coffee" shirt={C.pur} />
      </svg>
      <SendCta p={at(f, sec(0.8), 16)} to="لصاحبك" y={720} />
    </AbsoluteFill>
  );
};

export const AdsMistakes: React.FC = () => (
  <ReelShell data={D} audio="vo/S1_mix.wav" scenes={[Hook, Target, Insights, Waiting, Goal, Cta]} capHide={(t, s) => s === 0 || s === 4 || s === 5} />
);
