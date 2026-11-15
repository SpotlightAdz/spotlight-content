// Mixed-media montage: every scene switches medium so the eye never settles.
// character animation → paper cut-out stop-motion → character walk on a paper street → real 3D phone → editorial → character CTA.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Kinetic, Tag, Grad, at, useSpring, ReelShell, LineIcon, SendCta, Illustrative, sec, ReelData } from "../brand";
import { Character } from "../mixed/Character";
import { Scrap, CutoutWords, PaperDesk, PAPERS, INK, useStep, jitter } from "../mixed/paper";
import { Stage3D, Phone3D, Float, gloss, chrome, useCanvasTexture } from "../three/kit3d";
import type {} from "@react-three/fiber";
import data from "./R4m.json";
const D = data as ReelData;

// ---------------- S0 · character hook ----------------
const BUBBLES = [[-330, -380], [300, -400], [-390, -230], [360, -250], [-380, -470], [380, -480], [-420, -40], [410, -60]];
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.min(47, 12 + Math.floor(f * 0.45));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag><span dir="ltr" style={{ fontFamily: SG, fontWeight: 700, letterSpacing: 2 }}>POV</span></Tag></div>
      <div dir="rtl" style={{ position: "absolute", top: 320, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 170, lineHeight: 1.1, color: C.ink }}>بشحال؟</div>
      <div dir="rtl" style={{ position: "absolute", top: 530, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 76, color: C.ink }}>
        للمرة <span dir="ltr" style={{ fontFamily: SG, fontSize: 120 }}><Grad g={HOT}>{n}</Grad></span> اليوم
      </div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={540} y={1300} scale={1.2} mood="tired" pose="phone" shirt="#FF2D7A" />
      </svg>
      {BUBBLES.map(([dx, dy], i) => {
        const p = useSpring(i * 4, 11);
        return (
          <div key={i} dir="rtl" style={{ position: "absolute", left: 540 + dx * p - 90, top: 1240 + dy * p, opacity: Math.min(1, p * 1.5), transform: `scale(${0.4 + 0.6 * p}) rotate(${(i % 2 ? 1 : -1) * 6}deg)`,
            padding: "14px 24px", borderRadius: "26px 26px 26px 8px", background: "#fff", border: `4px solid ${INK}`, fontFamily: AR, fontWeight: 700, fontSize: 40, color: INK, boxShadow: "6px 8px 0 rgba(26,18,34,.12)" }}>بشحال؟</div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------- S1 · paper cut-out stop-motion ----------------
const PaperReply: React.FC = () => {
  const step = useStep(3);
  const tallies = Math.min(9, Math.floor(step / 6) + 1);
  const notes = [[90, 1000, -8], [700, 980, 7], [120, 1250, 5], [690, 1230, -6]];
  return (
    <PaperDesk>
      <CutoutWords words={["واحد", "بواحد"]} y={230} size={110} start={0} gap={4} />
      {(() => { const j = jitter(step, 9); return (
        <Scrap x={210 + j.dx} y={520 + j.dy} w={660} h={420} color="#FFF8F0" seed={21} rot={-2 + j.rot} tape>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(180deg, transparent 0 58px, rgba(91,108,255,.25) 58px 60px)", borderLeft: "4px solid rgba(255,61,46,.35)", marginLeft: 70 }} />
          <svg width="660" height="420" style={{ position: "absolute", inset: 0 }}>
            {[...Array(tallies)].map((_, k) => {
              const g = Math.floor(k / 5), m = k % 5;
              return m < 4
                ? <path key={k} d={`M${150 + g * 230 + m * 34} 140 l${(random(`tl${k}`) - 0.5) * 8} 150`} stroke={INK} strokeWidth={11} strokeLinecap="round" />
                : <path key={k} d={`M${130 + g * 230} 280 L${280 + g * 230} 150`} stroke="#FF2D7A" strokeWidth={11} strokeLinecap="round" />;
            })}
          </svg>
        </Scrap>
      ); })()}
      {notes.map(([x, y, r], i) => step >= 6 + i * 6 && (
        <Scrap key={i} x={x} y={y} w={280} h={150} color={PAPERS[(i + 2) % PAPERS.length]} seed={40 + i} rot={r + jitter(step, 50 + i).rot}>
          <div dir="rtl" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: AR, fontWeight: 700, fontSize: 52, color: INK }}>بشحال؟</div>
        </Scrap>
      ))}
    </PaperDesk>
  );
};

// ---------------- S2 · character walks to the neighbour (paper street) ----------------
const Shop: React.FC<{ x: number; label: string; color: string; seed: number; status: string; good?: boolean }> = ({ x, label, color, seed, status, good }) => (
  <Scrap x={x} y={640} w={400} h={560} color={color} seed={seed} rot={seed % 2 ? 1.5 : -1.5}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 90, background: `repeating-linear-gradient(90deg, ${good ? "#FF2D7A" : "#9C8FA0"} 0 50px, #FFF8F0 50px 100px)`, borderBottom: `5px solid ${INK}` }} />
    <div dir="rtl" style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 64, color: INK }}>{label}</div>
    <div style={{ position: "absolute", top: 230, left: 60, width: 280, height: 220, border: `5px solid ${INK}`, borderRadius: 12, background: good ? "#FFE7A8" : "#E9E1DA" }} />
    <div dir="rtl" style={{ position: "absolute", bottom: 26, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 34, color: good ? "#0E7A43" : "#C23B2E" }}>{status}</div>
  </Scrap>
);
const Walk: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [6, sec(1.9)], [800, 290], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const walking = f > 6 && f < sec(1.9);
  return (
    <AbsoluteFill>
      <Kinetic words={["مشا", "عند", "جارك"]} start={2} step={4} y={250} size={120} hiIdx={[2]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1190, height: 16, background: "rgba(26,18,34,.08)" }} />
      <Shop x={590} label="نتا" color="#F3E6D6" seed={61} status="ما زال ما جاوبش" />
      <Shop x={90} label="جارك" color="#FFF8F0" seed={62} status="جاوب فالحين ✓" good />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={x} y={1060} scale={0.62} mood={walking ? "neutral" : "happy"} pose={walking ? "walk" : "wave"} shirt="#22D3EE" hairStyle="cap" flip seed={3} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------- S3 · real 3D phone with the AI reply ----------------
const drawChat = (ctx: CanvasRenderingContext2D, f: number) => {
  const W = ctx.canvas.width;
  ctx.fillStyle = "#0f0e14"; ctx.fillRect(0, 0, W, ctx.canvas.height);
  ctx.fillStyle = "#16151d"; ctx.fillRect(0, 0, W, 180);
  ctx.direction = "rtl"; ctx.textAlign = "right"; ctx.fillStyle = "#fff"; ctx.font = "600 44px Readex"; ctx.fillText("كليان جديد", W - 150, 115);
  ctx.fillStyle = "#3a3948"; ctx.beginPath(); ctx.arc(W - 80, 100, 42, 0, 7); ctx.fill();
  const bubble = (y: number, lines: string[], out: boolean, show: number) => {
    if (show <= 0) return; ctx.globalAlpha = Math.min(1, show); ctx.font = "500 40px Readex";
    const w = Math.min(W - 140, Math.max(...lines.map((l) => ctx.measureText(l).width)) + 64), h = 40 + lines.length * 54;
    const x = out ? W - 40 - w : 40; ctx.fillStyle = out ? "#1f6f4a" : "#2a2933"; ctx.beginPath(); (ctx as any).roundRect(x, y, w, h, 30); ctx.fill();
    ctx.fillStyle = "#fff"; lines.forEach((l, k) => ctx.fillText(l, x + w - 32, y + 66 + k * 54)); ctx.globalAlpha = 1;
  };
  bubble(250, ["بشحال؟"], false, f / 6);
  if (f > 22 && f < 40) { ctx.fillStyle = "#1f6f4a"; ctx.beginPath(); (ctx as any).roundRect(W - 220, 400, 180, 90, 40); ctx.fill(); ctx.fillStyle = "#fff"; [0, 1, 2].forEach((k) => { ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(f * 0.3 + k)); ctx.beginPath(); ctx.arc(W - 170 + k * 40, 445, 10, 0, 7); ctx.fill(); }); ctx.globalAlpha = 1; }
  bubble(400, ["مرحبا بيك! هاهي الأثمنة", "و الكاتالوغ. نحجز ليك؟"], true, (f - 40) / 6);
  bubble(600, ["إيه عافاك"], false, (f - 70) / 6);
};
const Ai3D: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const screen = useCanvasTexture(720, 1480, drawChat);
  const enter = useSpring(0, 14);
  const pink = useMemo(() => gloss("#FF4F8F"), []), amber = useMemo(() => gloss("#FFC23D"), []), ch = useMemo(() => chrome("#ffeef4"), []);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", fontFamily: SG, fontWeight: 700, fontSize: 112, letterSpacing: -3, opacity: at(f, 0, 10) }}><Grad g={AURORA}>Spotlight AI</Grad></div>
      <Stage3D camZ={15} fov={30} shadows>
        <Phone3D screen={screen} position={[0, -0.25 - (1 - enter) * 4, 0]} rotation={[-0.08, -0.55 + enter * 0.4 + Math.sin(t) * 0.05, 0.04]} scale={1.08} />
        <Float seed={1} position={[-1.9, 1.6, -1]}><mesh material={pink}><torusGeometry args={[0.4, 0.15, 32, 64]} /></mesh></Float>
        <Float seed={2} position={[1.9, -2.6, 0.5]}><mesh material={amber}><sphereGeometry args={[0.32, 48, 48]} /></mesh></Float>
        <Float seed={3} position={[2.0, 1.9, -0.5]}><mesh material={ch}><sphereGeometry args={[0.22, 48, 48]} /></mesh></Float>
      </Stage3D>
      <div style={{ position: "absolute", top: 1300, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
        <Tag p={at(f, sec(1.6), 12)}><LineIcon name="bolt" size={32} color="#FF2D7A" />فدقايق، ليل و نهار</Tag>
      </div>
      <Illustrative y={345} o={at(f, 10, 12)} />
    </AbsoluteFill>
  );
};

// ---------------- S4 · editorial page ----------------
const Editorial: React.FC = () => {
  const f = useCurrentFrame();
  const stamp = useSpring(sec(1.1), 9, 0.6);
  return (
    <PaperDesk tint="#F3EEE7">
      <div style={{ position: "absolute", top: 220, left: 90, right: 90, display: "flex", justifyContent: "space-between", fontFamily: SG, fontWeight: 500, fontSize: 26, letterSpacing: 4, color: "#6E6A75" }}>
        <span>SPOTLIGHT AI · N°01</span><span>HUMAN IN THE LOOP</span>
      </div>
      <div style={{ position: "absolute", top: 268, left: 90, right: 90, height: 3, background: INK }} />
      <div dir="rtl" style={{ position: "absolute", top: 330, left: 90, right: 90, fontFamily: AR, color: INK }}>
        <div style={{ fontWeight: 600, fontSize: 60, opacity: at(f, 0, 10) }}>و ديما كاين</div>
        <div style={{ fontWeight: 700, fontSize: 230, lineHeight: 1.05, transform: `translateY(${(1 - at(f, 3, 14)) * 40}px)`, opacity: at(f, 3, 14) }}>بنادم</div>
        <div style={{ fontWeight: 700, fontSize: 230, lineHeight: 1.05, transform: `translateY(${(1 - at(f, 9, 14)) * 40}px)`, opacity: at(f, 9, 14) }}><Grad g={HOT}>مسؤول</Grad></div>
        <div style={{ height: 3, background: "rgba(18,16,24,.18)", margin: "40px 0 30px", width: `${at(f, 14, 20) * 100}%` }} />
        <div style={{ fontWeight: 500, fontSize: 52, lineHeight: 1.5, color: "#3b3742", opacity: at(f, 18, 14) }}>على كل ميساج كيخرج باسمك.</div>
      </div>
      <div style={{ position: "absolute", top: 1080, left: 120, transform: `rotate(-12deg) scale(${2 - stamp})`, opacity: Math.min(1, stamp * 2) }}>
        <div style={{ width: 240, height: 240, borderRadius: 999, border: "10px solid #0E7A43", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#0E7A43" }}>
          <LineIcon name="check" size={90} color="#0E7A43" sw={3} />
          <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 30, letterSpacing: 3 }}>APPROVED</span>
        </div>
      </div>
    </PaperDesk>
  );
};

// ---------------- S5 · character CTA ----------------
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kinetic words={["صيفطها", "لشي", "واحد"]} start={2} step={4} y={260} size={100} />
      <Kinetic words={["عيا", "من", "بشحال؟"]} start={12} step={4} y={410} size={110} hiIdx={[2]} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={290} y={1080} scale={0.95} mood="happy" pose="coffee" shirt="#FF2D7A" />
      </svg>
      <div style={{ position: "absolute", left: 400, right: 20, top: 0, height: 1920 }}>
        <SendCta p={at(f, sec(0.9), 16)} to="لصاحبك" y={760} />
      </div>
    </AbsoluteFill>
  );
};

export const BchhalMontage: React.FC = () => (
  <ReelShell data={D} audio="vo/R4m_mix.wav" scenes={[Hook, PaperReply, Walk, Ai3D, Editorial, Cta]} capHide={(t, s) => s === 0 || s === 5 || s === 4 || s === 3} />
);
