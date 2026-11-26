// Dec W1 Mon: behind the scenes part 2 (content & film): the edit nobody sees. Part 1 = ShootDay (best reel of W3).
// Mixed media: 3D "EDIT" hook → take picker UI → before/after colour wipe on a product → paper mixing desk → phone preview + character → character CTA.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Tag, Glass, Grad, at, useSpring, ReelShell, LineIcon, SendCta, Illustrative, FitLine, Kinetic, Phone, BeforeAfter, Fader, Waveform, Num, sec, ReelData } from "../brand";
import { Character } from "../mixed/Character";
import { Scrap, PaperDesk, INK, useStep, jitter } from "../mixed/paper";
import { Mug } from "../mixed/props";
import { Hero3DText } from "../three/kit3d";
import data from "./T1.json";
const D = data as ReelData;

const Kick: React.FC<{ n: string; label: string; y?: number }> = ({ n, label, y = 230 }) => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag p={at(f, 0, 12)}><Num n={n} label={label} /></Tag></div>;
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0, 12);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag><LineIcon name="film" size={32} color={C.pink} />وراء الكواليس · الجزء 2</Tag></div>
      <div dir="rtl" style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 118, lineHeight: 1.2, color: C.ink }}>
        التصوير غير <Grad g={HOT}>النص…</Grad>
      </div>
      <div style={{ position: "absolute", inset: 0 }}><Hero3DText text="EDIT" color="#FF2D7A" y={0.3} size={1.45} enter={s} /></div>
      <Kinetic words={["و", "هادا", "هو", "النص", "اللي", "ما", "كتشوفوش"]} start={sec(1.5)} step={3} y={1200} size={66} color={C.muted} hiIdx={[5, 6]} />
      <div style={{ position: "absolute", top: 1110, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14, opacity: 0.9 }}>
        {[C.pink, C.pur, C.red, C.cya, C.yel, C.pink].map((c, i) => <div key={i} style={{ width: 110, height: 26, borderRadius: 8, background: c, opacity: 0.35 + 0.65 * at(f, 4 + i * 3, 10) }} />)}
      </div>
    </AbsoluteFill>
  );
};

const TAKES = ["#3a2d5c", "#5c2d3a", "#2d4f5c", "#ff8a3d", "#4a3a2d", "#2d5c45"];
const Pick: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(2, 15);
  const chosen = 3;
  const sel = at(f, sec(2.0), 10);
  const cx = interpolate(f, [sec(0.8), sec(1.9)], [900, 330], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) });
  const cy = interpolate(f, [sec(0.8), sec(1.9)], [1300, 1010], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) });
  return (
    <AbsoluteFill>
      <Kick n="01" label="اللقطة" />
      <FitLine text="اللقطة اللي فيها الحياة" y={330} max={100} width={900} p={at(f, 3, 12)} />
      <div style={{ position: "absolute", top: 520, left: 90, right: 90, opacity: p, transform: `perspective(1600px) rotateX(${(1 - p) * 14}deg) translateY(${(1 - p) * 70}px)` }}>
        <Glass style={{ padding: 30 }}>
          <div dir="ltr" style={{ display: "flex", justifyContent: "space-between", fontFamily: SG, fontWeight: 700, fontSize: 26, color: C.muted, letterSpacing: 3, marginBottom: 20 }}><span>TAKES · 06</span><span>BIN / HOOK</span></div>
          <div dir="ltr" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {TAKES.map((c, i) => {
              const win = i === chosen;
              const q = at(f, 6 + i * 3, 10);
              return (
                <div key={i} style={{ position: "relative", aspectRatio: "9 / 12", borderRadius: 20, overflow: "hidden", opacity: q * (win ? 1 : 1 - 0.6 * sel),
                  background: `linear-gradient(165deg, ${c}, #120f1d)`, transform: `scale(${win ? 1 + 0.06 * sel : 1 - 0.04 * sel})`,
                  boxShadow: win ? `0 0 0 ${5 * sel}px ${C.pink}, 0 20px 50px rgba(255,45,122,${0.4 * sel})` : "0 10px 24px rgba(0,0,0,.18)" }}>
                  <div style={{ position: "absolute", top: 12, left: 14, fontFamily: SG, fontWeight: 700, fontSize: 22, color: "rgba(255,255,255,.85)" }}>T{String(i + 1).padStart(2, "0")}</div>
                  <svg viewBox="0 0 100 130" style={{ position: "absolute", inset: 0 }}><circle cx="50" cy="52" r="16" fill="rgba(255,255,255,.22)" /><path d="M22 130 C 26 90 74 90 78 130Z" fill="rgba(255,255,255,.18)" /></svg>
                  {win && <div style={{ position: "absolute", bottom: 12, right: 12, width: 46, height: 46, borderRadius: 23, background: C.pink, display: "flex", alignItems: "center", justifyContent: "center", opacity: sel }}><LineIcon name="check" size={30} color="#fff" sw={3} /></div>}
                </div>
              );
            })}
          </div>
        </Glass>
      </div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path transform={`translate(${cx} ${cy})`} d="M0 0 L0 52 L14 40 L24 62 L34 57 L24 36 L42 36 Z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      </svg>
      <Illustrative y={1350} o={at(f, 12, 12)} />
    </AbsoluteFill>
  );
};

const Color: React.FC = () => {
  const f = useCurrentFrame();
  const wipe = interpolate(f, [sec(0.6), sec(2.8)], [0.05, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 0.5 - Math.cos(Math.PI * x) / 2 });
  const p = useSpring(0, 15);
  return (
    <AbsoluteFill>
      <Kick n="02" label="الألوان" />
      <FitLine text="بحال فالحقيقة" y={330} max={120} width={860} grad={HOT} p={at(f, 3, 12)} />
      <div style={{ opacity: p, transform: `translateY(${(1 - p) * 60}px)` }}>
        <BeforeAfter x={110} y={540} w={860} h={760} p={wipe}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 60% at 50% 40%, #FFE7C7, #F2B98C 60%, #C9784F)" }} />
          <svg width="860" height="760" style={{ position: "absolute", inset: 0 }}>
            <ellipse cx="430" cy="610" rx="260" ry="40" fill="rgba(90,40,20,.25)" />
            <Mug x={410} y={470} s={1.25} color="#FF2D7A" />
          </svg>
        </BeforeAfter>
      </div>
      <div dir="ltr" style={{ position: "absolute", top: 1330, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14, fontFamily: SG, fontWeight: 700, fontSize: 26, color: C.muted, letterSpacing: 2, opacity: at(f, 20, 12) }}>
        <span>WB +6</span><span>·</span><span>SAT +12</span><span>·</span><span>CONTRAST +8</span>
      </div>
    </AbsoluteFill>
  );
};

const Sound: React.FC = () => {
  const f = useCurrentFrame();
  const step = useStep(3);
  const j = jitter(step, 4, 0.7);
  const music = interpolate(f, [sec(0.6), sec(1.8)], [0.8, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const voice = interpolate(f, [sec(1.2), sec(2.4)], [0.4, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <PaperDesk>
      <Kick n="03" label="الصوت" />
      <Scrap x={130 + j.dx} y={360 + j.dy} w={820} h={190} color="#FFE7A8" seed={12} rot={-2 + j.rot} tape>
        <div dir="rtl" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: AR, fontWeight: 700, fontSize: 70, color: INK }}>الكلام ديما فوق</div>
      </Scrap>
      <Scrap x={150} y={640} w={780} h={700} color="#FFF8F0" seed={27} rot={1.5}>
        <div style={{ position: "absolute", top: 60, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 160 }}>
          <Fader v={voice} label="الكلام" color={C.pink} h={300} />
          <Fader v={music} label="الموسيقى" color={C.pur} h={300} />
        </div>
        <div style={{ position: "absolute", bottom: 50, left: 60, right: 60, display: "flex", flexDirection: "column", gap: 10 }}>
          <Waveform w={660} h={60} level={voice} color={C.pink} seed={2} />
          <Waveform w={660} h={60} level={music} color={C.pur} seed={7} />
        </div>
      </Scrap>
    </PaperDesk>
  );
};

const PhoneCheck: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(0, 15);
  const play = interpolate(f, [10, sec(4.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Kick n="04" label="فالتيليفون" />
      <FitLine text="تما فين كيشوفها الكليان" y={330} max={92} width={900} p={at(f, 3, 12)} />
      <Phone x={640} y={480} w={420} p={p} tilt={-6}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 60% at 50% 35%, #FFE7C7, #F2B98C 60%, #8a4a30)" }} />
        <svg width="100%" height="100%" viewBox="0 0 420 860" style={{ position: "absolute", inset: 0 }}><Mug x={200} y={430} s={0.62} color="#FF2D7A" /></svg>
        <div dir="rtl" style={{ position: "absolute", top: 610, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <span style={{ padding: "6px 16px", borderRadius: 12, background: AURORA, fontFamily: AR, fontWeight: 700, fontSize: 30, color: "#fff" }}>شوف هادي</span>
        </div>
        <div style={{ position: "absolute", right: 16, top: 470, display: "flex", flexDirection: "column", gap: 26 }}>
          {["heart", "chat", "send"].map((n) => <LineIcon key={n} name={n} size={40} color="#fff" sw={2.2} />)}
        </div>
        <div style={{ position: "absolute", bottom: 26, left: 22, right: 22, height: 6, borderRadius: 3, background: "rgba(255,255,255,.3)" }}><div style={{ width: `${play * 100}%`, height: "100%", borderRadius: 3, background: "#fff" }} /></div>
      </Phone>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={240} y={1160} scale={0.58} mood="happy" pose="phone" shirt={C.cya} hairStyle="cap" seed={2} />
      </svg>
      <Illustrative y={1395} o={at(f, 16, 12)} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kinetic words={["المونتاج", "ساهل؟"]} start={2} step={5} y={250} size={120} hiIdx={[1]} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={540} y={1330} scale={0.72} mood="shocked" pose="coffee" shirt={C.pink} seed={3} />
      </svg>
      <SendCta p={at(f, sec(0.6), 16)} to="لصاحبك اللي كيقولها" y={520} wa={false} />
      <div dir="ltr" style={{ position: "absolute", top: 690, left: 0, right: 0, textAlign: "center", fontFamily: SG, fontWeight: 700, fontSize: 44, color: C.ink, opacity: at(f, sec(1.1), 14) }}>+212 701 177 915</div>
    </AbsoluteFill>
  );
};

export const EditDay: React.FC = () => (
  <ReelShell data={D} audio="vo/T1_mix.wav" scenes={[Hook, Pick, Color, Sound, PhoneCheck, Cta]} capHide={(t, s) => s === 0 || s === 5} />
);
