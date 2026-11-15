// Look test: one hook frame in each 3D theme. <Look3D theme="sunlit|majorelle|sunset" />
import React, { useMemo } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import * as THREE from "three";
import type {} from "@react-three/fiber";
import { useFonts, AR, SG, Grain } from "../brand";
import { useTTF, THEMES, Stage3D, Floor, Text3D, Phone3D, Float, gloss, chrome, glass, useCanvasTexture } from "./kit3d";

const drawChat = (ink: string) => (ctx: CanvasRenderingContext2D, f: number) => {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  ctx.fillStyle = "#0f0e14"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#1a1922"; ctx.fillRect(0, 0, W, 170);
  ctx.direction = "rtl"; ctx.textAlign = "right";
  ctx.fillStyle = "#fff"; ctx.font = "600 42px Readex"; ctx.fillText("كليانة جديدة", W - 140, 110);
  ctx.fillStyle = "#3a3948"; ctx.beginPath(); ctx.arc(W - 70, 95, 40, 0, 7); ctx.fill();
  const bubble = (y: number, txt: string, out: boolean, show: number) => {
    if (show <= 0) return;
    ctx.globalAlpha = Math.min(1, show);
    ctx.font = "500 40px Readex"; const w = Math.min(W - 160, ctx.measureText(txt).width + 64);
    const x = out ? W - 40 - w : 40;
    ctx.fillStyle = out ? "#1f6f4a" : "#2a2933"; ctx.beginPath(); (ctx as any).roundRect(x, y, w, 96, 30); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.textAlign = "right"; ctx.fillText(txt, x + w - 32, y + 62); ctx.globalAlpha = 1;
  };
  bubble(240, "واش كاين التوصيل لتطوان؟", false, 1);
  bubble(370, "إيه كاين، و الخلاص عند الاستلام", true, (f - 10) / 8);
  bubble(500, "أكد عافاك", false, (f - 25) / 8);
};

export const Look3D: React.FC<{ theme: string }> = ({ theme }) => {
  useFonts(); const font3d = useTTF();
  const T = THEMES[theme];
  const f = useCurrentFrame(); const t = f / 30;
  const screen = useCanvasTexture(720, 1480, drawChat(T.ink));
  const heroMat = useMemo(() => gloss(T.hero, { metalness: 0.15 }), [T.hero]);
  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(40% 25% at 50% 52%, ${T.glow}, transparent 70%)` }} />
      {font3d && <Stage3D camZ={17 - t * 0.2} fov={30}>
        <Floor y={-4.2} opacity={T.dark ? 0.35 : 0.18} />
        <Text3D text="10K" size={1.55} depth={0.55} material={heroMat} position={[0, 1.05, 0]} rotation={[0.08, -0.35 + Math.sin(t * 0.8) * 0.12, 0]} />
        <Phone3D screen={screen} position={[1.15, -2.6, 0.4]} rotation={[-0.18, -0.5 + t * 0.03, 0.1]} scale={0.6} body={T.dark ? "#16151d" : "#2b2933"} />
        <Float seed={1} position={[-1.5, -2.2, 1]}><mesh castShadow material={gloss(T.a)}><torusGeometry args={[0.42, 0.17, 32, 64]} /></mesh></Float>
        <Float seed={2} position={[1.7, 2.9, -1]}><mesh castShadow material={chrome(T.dark ? "#ffd6e6" : "#ffe9f1")}><sphereGeometry args={[0.38, 48, 48]} /></mesh></Float>
        <Float seed={3} position={[-1.7, 2.4, -0.5]}><mesh castShadow material={gloss(T.c)}><icosahedronGeometry args={[0.32, 0]} /></mesh></Float>
        <Float seed={4} position={[-0.5, -3.4, 1.6]}><mesh castShadow material={glass(T.dark ? "#ffffff" : "#ffd9ea")}><sphereGeometry args={[0.3, 48, 48]} /></mesh></Float>
      </Stage3D>}
      <div dir="rtl" style={{ position: "absolute", top: 250, left: 70, right: 70, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 104, lineHeight: 1.2, color: T.ink }}>خاصك</div>
      <div dir="rtl" style={{ position: "absolute", top: 1090, left: 70, right: 70, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 92, lineHeight: 1.2, color: T.ink }}>متابع باش تبيع؟</div>
      <div style={{ position: "absolute", top: 120, left: 72, display: "flex", alignItems: "center", gap: 16 }}>
        <Img src={staticFile("logo.webp")} style={{ width: 54, height: 54 }} />
        <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 32, color: T.ink }}>Spotlight Adz</span>
      </div>
      <div style={{ position: "absolute", top: 128, right: 72, fontFamily: SG, fontWeight: 500, fontSize: 26, color: T.sub, letterSpacing: 3 }}>{T.name.toUpperCase()}</div>
      <Grain o={0.05} />
    </AbsoluteFill>
  );
};
