// Dec W1 Fri: relatable POV (social media management). The owner is the boss, the cameraman and the editor… and forgets to post.
// Mixed media: character + role tags hook → paper shop front at 09:00 → character filming take 10 → dark editor at 01:30 + stamp → editorial "leave it to us" (Basic pack facts) → character CTA.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Tag, Glass, Grad, at, useSpring, ReelShell, LineIcon, SendCta, Illustrative, FitLine, Kinetic, Stamp, sec, ReelData } from "../brand";
import { Character } from "../mixed/Character";
import { Scrap, PaperDesk, INK, PAPERS, useStep, jitter } from "../mixed/paper";
import data from "./T4.json";
const D = data as ReelData;

const Clock: React.FC<{ time: string; label: string; dark?: boolean }> = ({ time, label }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <Tag p={at(f, 0, 12)}><span dir="ltr" style={{ fontFamily: SG, fontWeight: 700 }}>{time}</span><span style={{ width: 2, height: 30, background: C.line }} />{label}</Tag>
    </div>
  );
};

const ROLES: [string, string, string][] = [["المول", "store", C.pink], ["الكاميرامان", "camera", C.pur], ["المونتور", "cut", C.red]];
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag><span dir="ltr" style={{ fontFamily: SG, fontWeight: 700, letterSpacing: 2 }}>POV</span></Tag></div>
      <div dir="rtl" style={{ position: "absolute", top: 320, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 84, lineHeight: 1.25, color: C.ink }}>
        نتا <Grad g={HOT}>المول،</Grad><br />الكاميرامان، و&nbsp;المونتور
      </div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={540} y={1340} scale={0.9} mood="tired" pose="phone" shirt={C.yel} seed={2} />
      </svg>
      {ROLES.map(([t, ic, c], i) => {
        const pos = [[110, 700], [640, 820], [120, 980]][i];
        const bob = Math.sin(f / 9 + i * 2) * 8;
        return (
          <div key={i} style={{ position: "absolute", left: pos[0], top: pos[1] + bob }}>
            <Tag style={{ fontSize: 40, background: "#fff", border: `4px solid ${INK}`, boxShadow: "6px 8px 0 rgba(26,18,34,.15)" }}><LineIcon name={ic} size={36} color={c} sw={2.4} />{t}</Tag>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Morning: React.FC = () => {
  const step = useStep(3);
  const j = jitter(step, 2, 0.8);
  const f = useCurrentFrame();
  const shutter = interpolate(step, [6, 30], [1, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const msgs = Math.min(23, Math.floor(Math.max(0, f - 30) / 2));
  return (
    <PaperDesk>
      <Clock time="09:00" label="الصباح" />
      <Scrap x={170 + j.dx} y={360 + j.dy} w={740} h={160} color="#FFE7A8" seed={4} rot={-2 + j.rot} tape>
        <div dir="rtl" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: AR, fontWeight: 700, fontSize: 64, color: INK }}>كتحل الحانوت…</div>
      </Scrap>
      <Scrap x={200} y={600} w={680} h={680} color="#FFF8F0" seed={21} rot={1}>
        <div style={{ position: "absolute", top: 40, left: 40, right: 40, height: 90, background: "#FF2D7A", border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SG, fontWeight: 700, fontSize: 44, color: "#fff", letterSpacing: 4 }}>SHOP</div>
        <div style={{ position: "absolute", top: 160, left: 60, right: 60, bottom: 40, border: `5px solid ${INK}`, background: "#FFD9E6", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${shutter * 100}%`, background: "repeating-linear-gradient(180deg,#C9C2CC 0 22px,#9E95A3 22px 26px)", borderBottom: `5px solid ${INK}` }} />
        </div>
      </Scrap>
      <div style={{ position: "absolute", top: 560, left: 760, width: 150, height: 150, borderRadius: 75, background: C.waDeep, border: `6px solid ${INK}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `rotate(8deg) scale(${0.9 + 0.1 * at(f, 30, 8)})` }}>
        <LineIcon name="chat" size={50} color="#fff" sw={2.4} />
        <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 40, color: "#fff" }}>{msgs}</span>
      </div>
    </PaperDesk>
  );
};

const Takes: React.FC = () => {
  const f = useCurrentFrame();
  const take = Math.min(10, 1 + Math.floor(f / 10));
  return (
    <AbsoluteFill>
      <Clock time="15:00" label="العشية" />
      <FitLine text="كتعاودها عشر مرات" y={330} max={104} width={880} p={at(f, 3, 12)} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={320} y={1230} scale={0.74} mood={take > 6 ? "tired" : "neutral"} pose="phone" shirt={C.yel} seed={6} />
      </svg>
      <div style={{ position: "absolute", top: 560, right: 110 }}>
        <Glass style={{ padding: "26px 40px", textAlign: "center" }}>
          <div dir="ltr" style={{ fontFamily: SG, fontWeight: 500, fontSize: 28, color: C.muted, letterSpacing: 4 }}>TAKE</div>
          <div dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 150, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}><Grad g={take >= 10 ? HOT : `linear-gradient(${C.ink},${C.ink})`}>{String(take).padStart(2, "0")}</Grad></div>
          <div dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 28, color: C.muted }}>/ 10</div>
        </Glass>
      </div>
      <div dir="ltr" style={{ position: "absolute", top: 900, right: 140, display: "flex", alignItems: "center", gap: 12, fontFamily: SG, fontWeight: 700, fontSize: 34, color: C.red }}>
        <span style={{ width: 22, height: 22, borderRadius: 11, background: C.red, opacity: Math.floor(f / 12) % 2 ? 0.3 : 1 }} />REC
      </div>
    </AbsoluteFill>
  );
};

const Night: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(0, 15);
  const typed = "عرض جديد… شوفو هادي";
  const n = Math.min(typed.length, Math.floor(Math.max(0, f - 20) / 2));
  return (
    <AbsoluteFill>
      <Clock time="01:30" label="الليل" />
      <FitLine text="كتمونطي، كتكتب…" y={330} max={104} width={880} p={at(f, 3, 12)} />
      <div style={{ position: "absolute", top: 500, left: 90, right: 90, opacity: p, transform: `translateY(${(1 - p) * 70}px)` }}>
        <div style={{ borderRadius: 36, padding: 30, background: "linear-gradient(160deg,#1E1C28,#0F0E16)", boxShadow: "0 40px 90px rgba(40,20,30,.35)" }}>
          <div dir="ltr" style={{ display: "flex", justifyContent: "space-between", fontFamily: SG, fontWeight: 700, fontSize: 24, color: "rgba(255,255,255,.5)", letterSpacing: 3 }}><span>EDIT · REEL_FINAL_v7</span><span>01:30</span></div>
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>{[C.pink, C.pur, C.red, C.cya, C.yel, C.pink, C.pur].map((c, i) => <div key={i} style={{ flex: [2, 1, 3, 1, 2, 1, 2][i], height: 70, borderRadius: 10, background: c, opacity: 0.85 }} />)}</div>
          <div dir="rtl" style={{ marginTop: 26, padding: "22px 26px", borderRadius: 20, background: "rgba(255,255,255,.08)", fontFamily: AR, fontWeight: 600, fontSize: 38, color: "#fff", minHeight: 60 }}>
            {typed.slice(0, n)}<span style={{ opacity: Math.floor(f / 8) % 2 ? 0 : 1 }}>|</span>
          </div>
          <div dir="rtl" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 26 }}>
            <div style={{ padding: "16px 40px", borderRadius: 999, background: "rgba(255,255,255,.12)", fontFamily: AR, fontWeight: 700, fontSize: 34, color: "rgba(255,255,255,.5)" }}>نشر</div>
            <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 26, color: "rgba(255,255,255,.45)", letterSpacing: 2 }}>DRAFT</div>
          </div>
        </div>
      </div>
      <Stamp p={useSpring(sec(2.4), 10)} y={1040} rot={-8} size={96}>نسيتي تنشر</Stamp>
      <Illustrative y={1385} o={at(f, 14, 12)} />
    </AbsoluteFill>
  );
};

const PACK = ["6 ريلز احترافية فالشهر", "ستوري تيلينغ", "ستوريز"];
const Us: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#F3EEE7" }}>
      <div style={{ position: "absolute", top: 220, left: 90, right: 90, height: 3, background: INK, opacity: at(f, 0, 12) }} />
      <div dir="rtl" style={{ position: "absolute", top: 250, left: 90, right: 90, display: "flex", justifyContent: "space-between", fontFamily: SG, fontWeight: 700, fontSize: 26, color: INK, letterSpacing: 3 }}><span dir="ltr">SPOTLIGHT ADZ</span><span dir="ltr">BASIC · 3,000 DH</span></div>
      <Kinetic words={["خلي", "الكونتنو"]} start={2} step={4} y={360} size={130} />
      <Kinetic words={["علينا"]} start={10} step={4} y={530} size={170} grad={HOT} />
      <div dir="rtl" style={{ position: "absolute", top: 800, left: 120, right: 120, display: "flex", flexDirection: "column", gap: 22 }}>
        {PACK.map((t, i) => {
          const q = at(f, sec(1.1) + i * 7, 12);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, opacity: q, transform: `translateX(${(1 - q) * -40}px)` }}>
              <div style={{ width: 58, height: 58, borderRadius: 16, background: AURORA, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><LineIcon name="check" size={38} color="#fff" sw={3} /></div>
              <span style={{ fontFamily: AR, fontWeight: 700, fontSize: 52, color: INK }}>{t}</span>
            </div>
          );
        })}
      </div>
      <div dir="rtl" style={{ position: "absolute", top: 1180, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 600, fontSize: 44, color: C.muted, opacity: at(f, sec(2.2), 12) }}>و نتا ركز على البيزنس ديالك</div>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kinetic words={["صيفطها", "لشي", "واحد"]} start={2} step={4} y={250} size={100} />
      <FitLine text="كيدير كلشي بوحدو" y={400} max={110} width={860} grad={HOT} p={at(f, 10, 12)} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={540} y={1330} scale={0.72} mood="happy" pose="coffee" shirt={C.yel} seed={2} />
      </svg>
      <SendCta p={at(f, sec(0.7), 16)} to="ليه دابا" y={620} />
    </AbsoluteFill>
  );
};

export const PovOneMan: React.FC = () => (
  <ReelShell data={D} audio="vo/T4_mix.wav" scenes={[Hook, Morning, Takes, Night, Us, Cta]} capHide={(t, s) => s === 0 || s === 5} />
);
