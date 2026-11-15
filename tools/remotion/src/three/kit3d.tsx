// Real 3D for reels (React Three Fiber via @remotion/three). WebGL → render with --gl=angle-egl.
// 3D is for objects, numbers, Latin words and the logo. Arabic stays as HTML on top (TextGeometry can't shape Arabic).
import React, { useEffect, useMemo, useState } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import type {} from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js";
import { Font } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// ---------- themes: backgrounds that are NOT black, built from the aurora brand ----------
export type Theme3D = {
  name: string; bg: string; floor: string; ink: string; sub: string;
  hero: string; a: string; b: string; c: string; glow: string; dark: boolean;
};
export const THEMES: Record<string, Theme3D> = {
  // A: warm studio, cream backdrop, glossy aurora objects (premium, Apple-like)
  sunlit: { name: "Sunlit Studio", bg: "radial-gradient(80% 60% at 50% 35%, #FFF8F0 0%, #F6EADF 55%, #EBD9C9 100%)", floor: "#EAD8C7",
    ink: "#1A1222", sub: "#6D5F6E", hero: "#FF2D7A", a: "#FFB800", b: "#FF3D2E", c: "#7B3CF2", glow: "rgba(255,45,122,.22)", dark: false },
  // B: Majorelle, saturated Moroccan blue-violet, not black
  majorelle: { name: "Majorelle", bg: "radial-gradient(90% 70% at 50% 30%, #4A3BD6 0%, #2D1F96 50%, #1B1260 100%)", floor: "#24187A",
    ink: "#FFF7EF", sub: "#C9C2FF", hero: "#FFB800", a: "#FF2D7A", b: "#22D3EE", c: "#FF7A1A", glow: "rgba(255,184,0,.28)", dark: true },
  // C: sunset aurora, the brand gradient as the background itself
  sunset: { name: "Sunset Aurora", bg: "linear-gradient(165deg, #FFB34D 0%, #FF5A4E 32%, #FF2D7A 62%, #8A3CF2 100%)", floor: "#E8406A",
    ink: "#FFFFFF", sub: "rgba(255,255,255,.82)", hero: "#FFFFFF", a: "#FFD86B", b: "#2B1659", c: "#22D3EE", glow: "rgba(255,255,255,.25)", dark: true },
};

// ---------- environment + lights: studio reflections without any external HDR file ----------
const Env: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const { gl, scene, invalidate } = useThree();
  // synchronous: the environment must exist in the same render Remotion screenshots
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; (scene as any).environmentIntensity = intensity;
    pm.dispose(); invalidate();
  }, [gl, scene, intensity, invalidate]);
  return null;
};

export const Stage3D: React.FC<{ children: React.ReactNode; camZ?: number; fov?: number; camY?: number }> = ({ children, camZ = 9, fov = 30, camY = 0 }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} style={{ position: "absolute", inset: 0 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      camera={{ fov, position: [0, camY, camZ], near: 0.1, far: 100 }} shadows>
      <Env />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 6, 5]} intensity={2.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[-5, 2, 3]} intensity={0.7} color="#ffd9e8" />
      <pointLight position={[0, -2, 4]} intensity={8} color="#ff7ab0" distance={12} />
      {children}
    </ThreeCanvas>
  );
};

// soft contact shadow catcher
export const Floor: React.FC<{ y?: number; opacity?: number }> = ({ y = -2.6, opacity = 0.22 }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
    <planeGeometry args={[40, 40]} />
    <shadowMaterial opacity={opacity} />
  </mesh>
);

// glossy candy / chrome / glass materials
export const gloss = (color: string, opts: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
  new THREE.MeshPhysicalMaterial({ color, roughness: 0.18, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.08, ...opts });
export const chrome = (tint = "#ffffff") => new THREE.MeshPhysicalMaterial({ color: tint, roughness: 0.08, metalness: 1, clearcoat: 1 });
export const glass = (tint = "#ffffff") => new THREE.MeshPhysicalMaterial({ color: tint, roughness: 0.05, metalness: 0, transmission: 0.92, thickness: 0.6, ior: 1.45, clearcoat: 1 });

// ---------- 3D extruded text (Latin + digits) from our own TTF ----------
const fontCache: Record<string, Font> = {};
// Call useTTF() in the DOM part of the composition (outside <Stage3D>) so Remotion waits for the font;
// Text3D then reads it from the cache.
export const useTTF = (file = "fonts/space-grotesk-700.ttf") => {
  const [font, setFont] = useState<Font | null>(fontCache[file] ?? null);
  const [h] = useState(() => (fontCache[file] ? null : delayRender("ttf " + file, { timeoutInMilliseconds: 60000 })));
  useEffect(() => {
    if (h === null) return;
    fetch(staticFile(file)).then((r) => r.arrayBuffer()).then((buf) => {
      const l = new TTFLoader(); l.reversed = false;
      fontCache[file] = new Font(l.parse(buf) as any); setFont(fontCache[file]); continueRender(h);
    }).catch((e) => { console.error("TTF load failed", e); continueRender(h); });
  }, [h, file]);
  return font;
};
export const Text3D: React.FC<{ text: string; size?: number; depth?: number; material: THREE.Material; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number }> =
  ({ text, size = 1, depth = 0.35, material, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
    const font = fontCache["fonts/space-grotesk-700.ttf"] ?? null;
    const geo = useMemo(() => {
      if (!font) return null;
      const g = new TextGeometry(text, { font, size, depth, curveSegments: 12, bevelEnabled: true, bevelThickness: depth * 0.18, bevelSize: size * 0.022, bevelSegments: 6 });
      g.center(); g.computeVertexNormals(); return g;
    }, [font, text, size, depth]);
    const mat = useMemo(() => { const m = (material as any).clone(); m.side = THREE.DoubleSide; return m; }, [material]);
    if (!geo) return null;
    return <mesh geometry={geo} material={mat} position={position} rotation={rotation} scale={scale} castShadow />;
  };

// ---------- a real 3D phone: rounded body, glass screen showing a canvas texture ----------
export const Phone3D: React.FC<{ screen?: THREE.Texture | null; body?: string; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number }> =
  ({ screen, body = "#1b1a22", position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
    const bodyGeo = useMemo(() => new RoundedBoxGeometry(1.9, 3.9, 0.22, 8, 0.24), []);
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <mesh geometry={bodyGeo} material={gloss(body, { metalness: 0.6, roughness: 0.25 })} castShadow />
        <mesh position={[0, 0, 0.113]}>
          <planeGeometry args={[1.76, 3.76]} />
          <meshBasicMaterial map={screen ?? undefined} color={screen ? "#ffffff" : "#0b0b10"} toneMapped={false} />
        </mesh>
        <mesh position={[0, 1.7, 0.115]}><capsuleGeometry args={[0.07, 0.36, 4, 12]} /><meshBasicMaterial color="#000" /></mesh>
      </group>
    );
  };

// Draw a 2D UI onto a canvas → texture for the phone screen (re-drawn every frame).
export const useCanvasTexture = (w: number, h: number, draw: (ctx: CanvasRenderingContext2D, frame: number) => void) => {
  const frame = useCurrentFrame();
  const { canvas, tex } = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
    const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    return { canvas, tex };
  }, [w, h]);
  const ctx = canvas.getContext("2d")!;
  draw(ctx, frame); tex.needsUpdate = true;
  return tex;
};

// floating primitives for depth
export const Float: React.FC<{ children: React.ReactNode; seed?: number; amp?: number; position?: [number, number, number] }> = ({ children, seed = 0, amp = 0.12, position = [0, 0, 0] }) => {
  const f = useCurrentFrame(); const t = f / 30;
  return <group position={[position[0], position[1] + Math.sin(t * 1.3 + seed) * amp, position[2]]} rotation={[Math.sin(t * 0.7 + seed) * 0.25, t * 0.5 + seed, Math.cos(t * 0.6 + seed) * 0.2]}>{children}</group>;
};
