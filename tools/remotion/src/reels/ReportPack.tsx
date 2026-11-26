// Dec W1 Sun: offer (social media, Advanced pack 6,000 DH: 12 reels + reporting + everything in Basic). Report numbers are illustrative.
// Mixed media: confused character hook → glass monthly report → KPI dashboard + bars → paper "where to push" → 3D price hero + pack card → WhatsApp CTA.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Tag, Glass, Grad, at, useSpring, ReelShell, LineIcon, WaButton, Illustrative, FitLine, Kinetic, Bars, Counter, sec, ReelData } from "../brand";
import { Character } from "../mixed/Character";
import { Scrap, CutoutWords, PaperDesk, INK, useStep, jitter } from "../mixed/paper";
import { Hero3DText } from "../three/kit3d";
import data from "./T5.json";
const D = data as ReelData;

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <FitLine text="كتخلص على السوشيال ميديا…" y={240} max={84} width={920} color={C.muted} />
      <div dir="rtl" style={{ position: "absolute", top: 350, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 118, lineHeight: 1.2, color: C.ink }}>
        و ما عارفش<br /><Grad g={HOT}>شنو خدم؟</Grad>
      </div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={540} y={1340} scale={0.86} mood="shocked" pose="idle" shirt={C.pur} seed={7} />
      </svg>
      {[[220, 760, -14], [800, 720, 12], [860, 980, -6]].map(([x, y, r], i) => (
        <div key={i} style={{ position: "absolute", left: x, top: y + Math.sin(f / 8 + i) * 10, fontFamily: SG, fontWeight: 700, fontSize: 130, color: [C.pink, C.pur, C.yel][i], transform: `rotate(${r}deg)`, textShadow: "6px 8px 0 rgba(26,18,34,.12)" }}>?</div>
      ))}
    </AbsoluteFill>
  );
};

const Report: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(0, 14);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag p={at(f, 0, 12)}>الباك <span style={{ fontFamily: SG, fontWeight: 700 }}>Advanced</span></Tag></div>
      <FitLine text="كل شهر، ريبورت واضح" y={330} max={104} width={900} p={at(f, 3, 12)} />
      <div style={{ position: "absolute", top: 520, left: 150, right: 150, opacity: p, transform: `perspective(1800px) rotateX(${(1 - p) * 20}deg) rotateZ(${-3 + 3 * p}deg) translateY(${(1 - p) * 120}px)` }}>
        <Glass style={{ padding: "40px 44px", height: 780, position: "relative" }}>
          <div dir="ltr" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: C.muted }}>MONTHLY REPORT</span>
            <LineIcon name="chart" size={44} color={C.pink} />
          </div>
          <div dir="rtl" style={{ fontFamily: AR, fontWeight: 700, fontSize: 64, color: C.ink, marginTop: 20 }}>ريبورت الشهر</div>
          <div style={{ height: 2, background: C.line, margin: "26px 0" }} />
          {[0.9, 0.7, 0.8, 0.55, 0.75, 0.6].map((w, i) => (
            <div key={i} style={{ height: 22, width: `${w * 100 * at(f, 14 + i * 4, 12)}%`, borderRadius: 11, background: i === 0 ? AURORA : "rgba(26,18,34,.12)", marginBottom: 24, marginLeft: "auto" }} />
          ))}
          <div style={{ position: "absolute", bottom: 40, left: 44, right: 44, display: "flex", gap: 16 }}>
            {[C.pink, C.pur, C.yel].map((c, i) => <div key={i} style={{ flex: 1, height: 110, borderRadius: 22, background: `${c}22`, border: `2px solid ${c}55`, opacity: at(f, 30 + i * 5, 12) }} />)}
          </div>
        </Glass>
      </div>
      <Illustrative y={1330} o={at(f, 20, 12)} />
    </AbsoluteFill>
  );
};

const KPIS: [string, string, string][] = [["eye", "شحال شاف", "12.4K"], ["heart", "شحال تفاعل", "860"], ["star", "أحسن ريل", "#07"]];
const Dash: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(0, 15);
  return (
    <AbsoluteFill>
      <div dir="rtl" style={{ position: "absolute", top: 240, left: 90, right: 90, display: "flex", flexDirection: "column", gap: 18 }}>
        {KPIS.map(([ic, l, v], i) => {
          const q = useSpring(sec([0.2, 1.4, 3.0][i]), 14);
          return (
            <div key={i} style={{ opacity: q, transform: `translateX(${(1 - q) * -70}px)` }}>
              <Glass style={{ padding: "22px 32px", display: "flex", alignItems: "center", gap: 24, borderRadius: 30 }}>
                <div style={{ width: 80, height: 80, borderRadius: 22, background: i === 2 ? AURORA : "rgba(26,18,34,.06)", display: "flex", alignItems: "center", justifyContent: "center" }}><LineIcon name={ic} size={44} color={i === 2 ? "#fff" : C.ink} /></div>
                <span style={{ fontFamily: AR, fontWeight: 700, fontSize: 48, color: C.ink, flex: 1 }}>{l}</span>
                <span dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 58, color: i === 2 ? C.pink : C.ink }}>{v}</span>
              </Glass>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 820, left: 110, right: 110, opacity: p }}>
        <Glass style={{ padding: "26px 30px 18px" }}>
          <div dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 24, color: C.muted, letterSpacing: 3, marginBottom: 8 }}>VIEWS PER REEL</div>
          <Bars values={[0.35, 0.5, 0.42, 0.62, 0.48, 0.55, 0.95, 0.58]} labels={["01", "02", "03", "04", "05", "06", "07", "08"]} p={interpolate(f, [10, 70], [0, 1], { extrapolateRight: "clamp" })} h={300} hi={6} w={58} />
        </Glass>
      </div>
      <Illustrative y={1330} o={at(f, 20, 12)} />
    </AbsoluteFill>
  );
};

const Push: React.FC = () => {
  const step = useStep(3);
  const j = jitter(step, 5, 0.8);
  return (
    <PaperDesk>
      <CutoutWords words={["الأرقام", "كتقول", "ليك"]} y={260} size={92} start={0} gap={3} />
      <Scrap x={170 + j.dx} y={560 + j.dy} w={740} h={560} color="#FFF8F0" seed={61} rot={-2 + j.rot} tape>
        <svg width="740" height="560" style={{ position: "absolute", inset: 0 }}>
          <path d="M80 460 L250 380 L380 410 L520 250 L640 120" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="900" strokeDashoffset={900 - Math.min(900, step * 40)} />
          <path d="M600 110 L650 112 L645 165" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={step > 20 ? 1 : 0} />
          <circle cx={520} cy={250} r={30} fill="#FF2D7A" stroke={INK} strokeWidth={6} opacity={step > 14 ? 1 : 0} />
        </svg>
        <div dir="rtl" style={{ position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 80, color: "#C2185B", opacity: step > 24 ? 1 : 0 }}>فين تزيد</div>
      </Scrap>
    </PaperDesk>
  );
};

const LIST = ["12 ريل فالشهر", "ريبورتينغ كل شهر", "كلشي اللي ف Basic"];
const Price: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0, 12);
  const p = useSpring(sec(1.0), 15);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag p={at(f, 0, 12)}><span style={{ fontFamily: SG, fontWeight: 700, letterSpacing: 2 }}>ADVANCED</span></Tag></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: -380, height: 1920 }}><Hero3DText text="12" color="#7B3CF2" y={0.2} size={1.7} enter={s} /></div>
      <div dir="rtl" style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 52, color: C.ink, opacity: at(f, 10, 12) }}>ريل فالشهر</div>
      <div style={{ position: "absolute", top: 870, left: 130, right: 130, opacity: p, transform: `translateY(${(1 - p) * 60}px)` }}>
        <Glass style={{ padding: "30px 40px" }}>
          {LIST.map((t, i) => (
            <div key={i} dir="rtl" style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 0", opacity: at(f, sec(1.3) + i * 8, 10) }}>
              <LineIcon name="check" size={40} color={C.pink} sw={3} />
              <span style={{ fontFamily: AR, fontWeight: 700, fontSize: 44, color: C.ink }}>{t}</span>
            </div>
          ))}
          <div style={{ height: 2, background: C.line, margin: "14px 0 18px" }} />
          <div dir="rtl" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: AR, fontWeight: 600, fontSize: 38, color: C.muted }}>فالشهر</span>
            <span dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 96, letterSpacing: -3 }}><Grad g={HOT}>6,000 DH</Grad></span>
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
      <Kinetic words={["نشرحو", "ليك"]} start={2} step={4} y={300} size={120} />
      <Kinetic words={["كلشي"]} start={10} step={4} y={460} size={150} grad={AURORA} />
      <WaButton p={at(f, sec(0.8), 16)} label="صيفط لينا فواتساب" y={800} />
    </AbsoluteFill>
  );
};

export const ReportPack: React.FC = () => (
  <ReelShell data={D} audio="vo/T5_mix.wav" scenes={[Hook, Report, Dash, Push, Price, Cta]} capHide={(t, s) => s === 0 || s === 5} />
);
