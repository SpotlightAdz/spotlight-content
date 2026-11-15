// Flat editorial character (thick plum outline, brand fills), animated procedurally from the frame.
// <Character x y scale mood="tired|happy|shocked|neutral" pose="phone|wave|walk|idle|coffee" shirt="#FF2D7A" />
import React from "react";
import { useCurrentFrame } from "remotion";

const INK = "#1A1222";
const SKIN = "#E3A77C", SKIN_D = "#C98B62", HAIR = "#2A1A14";
export type Mood = "tired" | "happy" | "shocked" | "neutral";
export type Pose = "phone" | "wave" | "walk" | "idle" | "coffee";

const Limb: React.FC<{ x: number; y: number; a1: number; a2: number; l1: number; l2: number; w: number; color: string; hand?: React.ReactNode }> = ({ x, y, a1, a2, l1, l2, w, color, hand }) => {
  const r = Math.PI / 180;
  const ex = x + Math.sin(a1 * r) * l1, ey = y + Math.cos(a1 * r) * l1;
  const hx = ex + Math.sin((a1 + a2) * r) * l2, hy = ey + Math.cos((a1 + a2) * r) * l2;
  return (
    <g>
      <path d={`M${x} ${y} L${ex} ${ey} L${hx} ${hy}`} fill="none" stroke={INK} strokeWidth={w + 12} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${x} ${y} L${ex} ${ey} L${hx} ${hy}`} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      <g transform={`translate(${hx} ${hy})`}>{hand ?? <circle r={w * 0.55} fill={SKIN} stroke={INK} strokeWidth={6} />}</g>
    </g>
  );
};

export const Character: React.FC<{ x: number; y: number; scale?: number; mood?: Mood; pose?: Pose; shirt?: string; pants?: string; flip?: boolean; seed?: number; hairStyle?: "short" | "cap" | "scarf"; phoneGlow?: boolean }> =
  ({ x, y, scale = 1, mood = "neutral", pose = "idle", shirt = "#FF2D7A", pants = "#3A2F55", flip = false, seed = 0, hairStyle = "short", phoneGlow = false }) => {
    const f = useCurrentFrame() + seed * 17; const t = f / 30;
    const breathe = Math.sin(t * 2.2) * 4;
    const blink = (f % 95) < 4 ? 0.1 : 1;
    const walk = pose === "walk" ? Math.sin(t * 9) : 0;
    const bob = pose === "walk" ? Math.abs(Math.sin(t * 9)) * -10 : breathe * 0.5;
    // arms
    let lA = [12, -10], rA = [-12, 10];
    if (pose === "phone") { lA = [40 + Math.sin(t * 14) * 3, -120]; rA = [-40 - Math.sin(t * 14 + 1) * 3, 120]; }
    if (pose === "wave") { lA = [10, -10]; rA = [-150 + Math.sin(t * 10) * 18, -20]; }
    if (pose === "walk") { lA = [walk * 28, -20]; rA = [-walk * 28, 20]; }
    if (pose === "coffee") { lA = [10, -10]; rA = [-38, 125 + Math.sin(t * 1.5) * 4]; }
    const brow = mood === "tired" ? 10 : mood === "shocked" ? -14 : mood === "happy" ? -4 : 0;
    const mouth = mood === "happy" ? "M-26 0 Q0 26 26 0 Q0 12 -26 0Z" : mood === "shocked" ? "M-12 0 a12 16 0 1 0 24 0 a12 16 0 1 0 -24 0" : mood === "tired" ? "M-22 6 Q-11 -2 0 6 T22 6" : "M-18 4 Q0 12 18 4";
    const phone = <g transform="rotate(-8)"><rect x={-26} y={-60} width={52} height={92} rx={10} fill={INK} /><rect x={-20} y={-53} width={40} height={74} rx={6} fill={phoneGlow ? "#25D366" : "#5B6CFF"} opacity={0.9} /></g>;
    const cup = <g><rect x={-22} y={-30} width={44} height={50} rx={8} fill="#FFF8F0" stroke={INK} strokeWidth={6} /><path d="M22 -18 q18 0 18 14 q0 14 -18 14" fill="none" stroke={INK} strokeWidth={6} />
      {[0, 1].map((k) => <path key={k} d={`M${-8 + k * 14} -40 q-8 -14 0 -26`} fill="none" stroke="#B9A9A0" strokeWidth={5} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(t * 3 + k)} transform={`translate(0 ${-((t * 20 + k * 10) % 12)})`} />)}</g>;
    return (
      <g transform={`translate(${x} ${y + bob}) scale(${flip ? -scale : scale} ${scale})`}>
        {/* shadow */}
        <ellipse cx={0} cy={300} rx={120} ry={18} fill="rgba(90,50,40,.18)" />
        {/* legs */}
        <Limb x={-34} y={130} a1={walk * 25} a2={Math.max(0, -walk) * 30} l1={90} l2={85} w={44} color={pants} hand={<ellipse cx={14} cy={4} rx={36} ry={18} fill={INK} />} />
        <Limb x={34} y={130} a1={-walk * 25} a2={Math.max(0, walk) * 30} l1={90} l2={85} w={44} color={pants} hand={<ellipse cx={14} cy={4} rx={36} ry={18} fill={INK} />} />
        {/* back arm */}
        <Limb x={-70} y={-40} a1={lA[0]} a2={lA[1]} l1={78} l2={74} w={34} color={shirt} hand={pose === "phone" ? undefined : undefined} />
        {/* body */}
        <path d={`M-92 -60 Q-100 ${60 + breathe} -78 150 L78 150 Q100 ${60 + breathe} 92 -60 Q0 -96 -92 -60Z`} fill={shirt} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <path d="M-30 -78 Q0 -50 30 -78" fill="none" stroke={INK} strokeWidth={6} />
        {/* head */}
        <g transform={`translate(0 ${-150 + breathe * 0.3}) rotate(${pose === "walk" ? walk * 3 : Math.sin(t * 1.2) * 3})`}>
          <rect x={-22} y={40} width={44} height={40} fill={SKIN_D} stroke={INK} strokeWidth={7} />
          <circle r={98} fill={SKIN} stroke={INK} strokeWidth={8} />
          {hairStyle === "short" && <path d="M-96 -10 Q-104 -96 -10 -104 Q86 -110 98 -20 Q70 -64 20 -62 Q-40 -70 -96 -10Z" fill={HAIR} stroke={INK} strokeWidth={8} strokeLinejoin="round" />}
          {hairStyle === "cap" && <g><path d="M-98 -18 Q-96 -104 0 -106 Q96 -104 98 -18Z" fill="#FFB800" stroke={INK} strokeWidth={8} /><path d="M40 -26 L150 -20 Q150 -6 98 -10Z" fill="#FFB800" stroke={INK} strokeWidth={8} strokeLinejoin="round" /></g>}
          {hairStyle === "scarf" && <path d="M-110 30 Q-120 -110 0 -116 Q120 -110 110 30 Q90 -60 0 -66 Q-90 -60 -110 30Z" fill="#7B3CF2" stroke={INK} strokeWidth={8} strokeLinejoin="round" />}
          <circle cx={-98} cy={8} r={16} fill={SKIN} stroke={INK} strokeWidth={7} /><circle cx={98} cy={8} r={16} fill={SKIN} stroke={INK} strokeWidth={7} />
          {/* eyes */}
          {[-36, 36].map((ex, i) => (
            <g key={i} transform={`translate(${ex} 4) scale(1 ${blink})`}>
              <ellipse rx={mood === "shocked" ? 20 : 16} ry={mood === "shocked" ? 24 : mood === "tired" ? 12 : 19} fill="#fff" stroke={INK} strokeWidth={6} />
              <circle cx={mood === "tired" ? 0 : 3} cy={mood === "tired" ? 4 : 2} r={8} fill={INK} />
              {mood === "tired" && <path d="M-18 -4 L18 -4" stroke={INK} strokeWidth={6} />}
            </g>
          ))}
          {[-36, 36].map((ex, i) => <path key={i} d={`M${ex - 20} ${-26 + (i ? -brow : brow) * 0.4} L${ex + 20} ${-26 + (i ? brow : -brow) * 0.4}`} stroke={INK} strokeWidth={8} strokeLinecap="round" transform={`translate(0 ${mood === "shocked" ? -8 : 0})`} />)}
          <ellipse cx={-56} cy={38} rx={14} ry={8} fill="#FF7A9C" opacity={mood === "happy" ? 0.7 : 0.3} /><ellipse cx={56} cy={38} rx={14} ry={8} fill="#FF7A9C" opacity={mood === "happy" ? 0.7 : 0.3} />
          <path d="M-6 14 Q0 30 8 22" fill="none" stroke={SKIN_D} strokeWidth={6} strokeLinecap="round" />
          <g transform="translate(0 52)"><path d={mouth} fill={mood === "happy" || mood === "shocked" ? INK : "none"} stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /></g>
          {mood === "tired" && <path d={`M70 -40 q10 18 0 26 q-10 -8 0 -26Z`} fill="#7FD3FF" stroke={INK} strokeWidth={4} transform={`translate(0 ${(t * 30) % 30})`} opacity={1 - ((t * 30) % 30) / 40} />}
        </g>
        {/* front arm (+ prop) */}
        <Limb x={70} y={-40} a1={rA[0]} a2={rA[1]} l1={78} l2={74} w={34} color={shirt} hand={pose === "phone" ? <g><circle r={19} fill={SKIN} stroke={INK} strokeWidth={6} />{phone}</g> : pose === "coffee" ? <g><circle r={19} fill={SKIN} stroke={INK} strokeWidth={6} />{cup}</g> : undefined} />
      </g>
    );
  };
