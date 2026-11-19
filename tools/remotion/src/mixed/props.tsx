// Flat editorial props in the Character style (thick plum outline, brand fills). Place inside an <svg>.
// <GiftBox x y s open/>  <PriceTag x y text/> (HTML, paper)  <Mug x y s steam/>  <ShopBox x y s color label/>
import React from "react";
import { useCurrentFrame } from "remotion";
import { Scrap } from "./paper";

const INK = "#1A1222";

// Gift box; `open` 0..1 lifts the lid, `bow` color for ribbon.
export const GiftBox: React.FC<{ x: number; y: number; s?: number; open?: number; color?: string; bow?: string }> = ({ x, y, s = 1, open = 0, color = "#FF2D7A", bow = "#FFB800" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-60} width={220} height={170} rx={14} fill={color} stroke={INK} strokeWidth={8} />
    <rect x={-22} y={-60} width={44} height={170} fill={bow} stroke={INK} strokeWidth={6} />
    <g transform={`translate(0 ${-open * 90}) rotate(${-open * 14})`}>
      <rect x={-128} y={-104} width={256} height={50} rx={12} fill={color} stroke={INK} strokeWidth={8} />
      <rect x={-22} y={-104} width={44} height={50} fill={bow} stroke={INK} strokeWidth={6} />
      <path d="M0 -104 C -70 -170 -110 -110 0 -104 C 110 -110 70 -170 0 -104 Z" fill={bow} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    </g>
  </g>
);

// Ceramic mug with optional steam (animated from the frame).
export const Mug: React.FC<{ x: number; y: number; s?: number; color?: string; steam?: boolean; pattern?: boolean }> = ({ x, y, s = 1, color = "#FFB800", steam = true, pattern = true }) => {
  const f = useCurrentFrame(); const t = f / 30;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {steam && [-40, 0, 40].map((dx, i) => (
        <path key={i} d={`M${dx} -150 c 20 -30 -20 -50 0 -80 c 20 -30 -20 -50 0 -80`} fill="none" stroke="rgba(26,18,34,.25)" strokeWidth={8} strokeLinecap="round"
          strokeDasharray="60 200" strokeDashoffset={-((t * 60 + i * 50) % 260)} />
      ))}
      <path d="M120 -60 c 70 0 70 110 0 110" fill="none" stroke={INK} strokeWidth={30} />
      <path d="M120 -60 c 70 0 70 110 0 110" fill="none" stroke={color} strokeWidth={14} />
      <path d="M-130 -130 h260 v200 a40 40 0 0 1 -40 40 h-180 a40 40 0 0 1 -40 -40 z" fill={color} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      {pattern && [0, 1, 2].map((k) => <path key={k} d={`M-130 ${-80 + k * 60} q 32 -22 65 0 t 65 0 t 65 0 t 65 0`} fill="none" stroke="rgba(26,18,34,.35)" strokeWidth={7} />)}
      <ellipse cx={0} cy={-130} rx={130} ry={18} fill="#6B3A22" stroke={INK} strokeWidth={8} />
    </g>
  );
};

// Product box (shop item) with a label.
export const ShopBox: React.FC<{ x: number; y: number; s?: number; color?: string; label?: string }> = ({ x, y, s = 1, color = "#E4DAFF", label }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-100 -60 L0 -110 L100 -60 L0 -10 Z" fill="#fff" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M-100 -60 L0 -10 L0 120 L-100 70 Z" fill={color} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M100 -60 L0 -10 L0 120 L100 70 Z" fill={color} stroke={INK} strokeWidth={8} strokeLinejoin="round" style={{ filter: "brightness(.88)" }} />
    {label && <text x={-50} y={40} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={34} fill={INK}>{label}</text>}
  </g>
);

// Paper price tag (HTML) with a string hole. Text can be Arabic or Latin.
export const PriceTag: React.FC<{ x: number; y: number; w?: number; h?: number; rot?: number; color?: string; seed?: number; children: React.ReactNode }> = ({ x, y, w = 360, h = 200, rot = -6, color = "#FFE7A8", seed = 7, children }) => (
  <Scrap x={x} y={y} w={w} h={h} color={color} seed={seed} rot={rot}>
    <div style={{ position: "absolute", left: 26, top: h / 2 - 16, width: 32, height: 32, borderRadius: 16, background: "#EFE2D2", boxShadow: "inset 0 2px 4px rgba(0,0,0,.25)" }} />
    <div style={{ position: "absolute", inset: 0, left: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
  </Scrap>
);
