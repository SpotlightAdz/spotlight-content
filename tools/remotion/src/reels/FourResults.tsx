// W4 Wed: client result story (keynote). Four businesses, four results — numbers from the facts list only.
// Mixed media: 3D hook → glass result card → paper menu collage → character + shops → 3D number → CTA.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Tag, Glass, Grad, at, useSpring, ReelShell, LineIcon, CommentCta, ResultCard, Counter, FitLine, sec, ReelData } from "../brand";
import { Character } from "../mixed/Character";
import { Scrap, PaperDesk, INK, useStep, jitter } from "../mixed/paper";
import { Hero3DText } from "../three/kit3d";
import data from "./S2.json";
const D = data as ReelData;
const CLIENTS = ["Happy Fitness", "Khay Ahmed", "Aboujoud", "W Yoga"];

const Hook: React.FC = () => {
  const s = useSpring(0, 12);
  return (
    <AbsoluteFill>
      <FitLine text="ربعة ديال البيزنسات…" y={250} max={112} width={900} />
      <div style={{ position: "absolute", inset: 0 }}><Hero3DText text="4" color="#FF2D7A" y={0.5} size={3.2} enter={s} /></div>
      <div dir="rtl" style={{ position: "absolute", top: 1010, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 112, color: C.ink }}>و ربعة ديال <Grad g={HOT}>النتائج</Grad></div>
      <div style={{ position: "absolute", top: 1200, left: 80, right: 80, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
        {CLIENTS.map((c) => <Tag key={c} style={{ fontFamily: SG, fontWeight: 700, fontSize: 32 }}>{c}</Tag>)}
      </div>
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{ n: string; label: string }> = ({ n, label }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <Tag p={at(f, 0, 12)}><span style={{ fontFamily: SG, fontWeight: 700 }}>{n}/04</span><span style={{ width: 2, height: 30, background: C.line }} />{label}</Tag>
    </div>
  );
};

const HappyFitness: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kicker n="01" label="صالة رياضة · مرتيل" />
      <ResultCard name="Happy Fitness" handle="@happy_fitness_martil" to={151.2} fmt={(v) => `${v.toFixed(1)}K`} label="مشاهدة فريل وحدة" y={380} />
      <div style={{ position: "absolute", top: 1030, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18 }}>
        <Tag p={at(f, 40, 12)}><LineIcon name="users" size={32} color={C.pink} /><span dir="ltr" style={{ fontFamily: SG, fontWeight: 700 }}>101.1K</span>متابع</Tag>
      </div>
    </AbsoluteFill>
  );
};

const KhayAhmed: React.FC = () => {
  const step = useStep(3);
  const j = jitter(step, 5, 0.7), j2 = jitter(step, 9, 0.7);
  return (
    <PaperDesk>
      <Kicker n="02" label="ريسطو · مشوي" />
      <Scrap x={150 + j.dx} y={380 + j.dy} w={780} h={300} color="#FFF8F0" seed={31} rot={-3 + j.rot} tape>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 60, color: INK, letterSpacing: -1 }}>Grillade Khay Ahmed</div>
          <div style={{ fontFamily: SG, fontWeight: 500, fontSize: 32, color: "#6E6A75" }}>@restokhayahmed</div>
        </div>
      </Scrap>
      {step >= 6 && (
        <Scrap x={200 + j2.dx} y={720 + j2.dy} w={680} h={460} color="#FFE7A8" seed={32} rot={2.5 + j2.rot}>
          <Counter to={35.6} start={6} dur={36} fmt={(v) => `${v.toFixed(1)}K`} size={200} y={90} />
          <div dir="rtl" style={{ position: "absolute", top: 320, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 50, color: INK }}>مشاهدة فريل وحدة</div>
        </Scrap>
      )}
    </PaperDesk>
  );
};

const Storefront: React.FC<{ x: number; p: number; label: string; hot?: boolean }> = ({ x, p, label, hot }) => (
  <g transform={`translate(${x} 900) scale(${p})`} opacity={Math.min(1, p * 1.5)}>
    <rect x={-150} y={-60} width={300} height={300} rx={14} fill="#FFF8F0" stroke={INK} strokeWidth={8} />
    {[...Array(5)].map((_, k) => <path key={k} d={`M${-160 + k * 64} -60 h64 v50 a32 32 0 0 1 -64 0 z`} fill={k % 2 ? "#FFF8F0" : hot ? C.pink : C.yel} stroke={INK} strokeWidth={6} />)}
    <rect x={-100} y={40} width={110} height={200} rx={8} fill={hot ? "#FFD9E6" : "#FFE7A8"} stroke={INK} strokeWidth={7} />
    <rect x={40} y={40} width={80} height={80} rx={8} fill="#D7F3F7" stroke={INK} strokeWidth={6} />
    <text x={0} y={-90} textAnchor="middle" fontFamily="Readex" fontWeight={700} fontSize={44} fill={INK}>{label}</text>
  </g>
);
const Aboujoud: React.FC = () => {
  const f = useCurrentFrame();
  const s2 = useSpring(sec(2.6), 10);
  return (
    <AbsoluteFill>
      <Kicker n="03" label="Aboujoud" />
      <Counter to={400} start={4} dur={40} fmt={(v) => `+${Math.round(v)}%`} size={230} y={330} />
      <div dir="rtl" style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 56, color: C.ink, opacity: at(f, 20, 12) }}>فالكليان</div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <path d="M60 1150 H1020" stroke="rgba(26,18,34,.15)" strokeWidth={6} />
        <Storefront x={300} p={useSpring(4, 13)} label="الحانوت 1" />
        <Storefront x={780} p={s2} label="الحانوت 2" hot />
        <Character x={540} y={1150} scale={0.55} mood="happy" pose="idle" shirt={C.cya} hairStyle="cap" seed={4} />
      </svg>
    </AbsoluteFill>
  );
};

const WYoga: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0, 12);
  const stats: [string, string][] = [["5", "شهور"], ["0 DH", "إعلانات"], ["1", "منصة all-in-one"]];
  return (
    <AbsoluteFill>
      <Kicker n="04" label="W Yoga Academy" />
      <div style={{ position: "absolute", inset: 0 }}><Hero3DText text="11K+" color="#FFB800" y={1.75} size={1.05} enter={s} /></div>
      <div dir="rtl" style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 64, color: C.ink, opacity: at(f, 10, 12) }}>أورو فالاشتراكات</div>
      <div style={{ position: "absolute", top: 900, left: 80, right: 80, display: "flex", justifyContent: "center", gap: 22 }}>
        {stats.map(([n, l], i) => {
          const q = at(f, sec(1.6) + i * 8, 12);
          return (
            <Glass key={i} style={{ width: 280, padding: "30px 10px", textAlign: "center", opacity: q, transform: `translateY(${(1 - q) * 40}px)` }}>
              <div dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 76, lineHeight: 1 }}><Grad g={HOT}>{n}</Grad></div>
              <div dir="rtl" style={{ fontFamily: AR, fontWeight: 600, fontSize: 32, color: C.ink, marginTop: 12 }}>{l}</div>
            </Glass>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <FitLine text="شكون اللي جاي؟" y={300} max={150} width={880} p={at(f, 0, 12)} />
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Tag p={at(f, 8, 12)}>{[0, 1, 2, 3, 4].map((k) => <LineIcon key={k} name="star" size={30} color={C.yel} fill={C.yel} />)}<span dir="ltr" style={{ fontFamily: SG, fontWeight: 700 }}>5.0 Google</span></Tag>
      </div>
      <CommentCta p={at(f, sec(0.7), 16)} keyword="SPOT" y={760} />
    </AbsoluteFill>
  );
};

export const FourResults: React.FC = () => (
  <ReelShell data={D} audio="vo/S2_mix.wav" scenes={[Hook, HappyFitness, KhayAhmed, Aboujoud, WYoga, Cta]} capHide={(t, s) => s === 0 || s === 5} />
);
