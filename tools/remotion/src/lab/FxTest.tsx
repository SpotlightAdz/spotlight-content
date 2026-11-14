import React from "react";
import { AbsoluteFill, Solid, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { lightLeak } from "@remotion/effects/light-leak";
import { fitText } from "@remotion/layout-utils";
export const FxTest: React.FC = () => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const { fontSize } = fitText({ text: "البراند ديالك كيبان بحال", withinWidth: 900, fontFamily: "Readex", fontWeight: 700 });
  return (
    <AbsoluteFill style={{ background: "#06050C" }}>
      <div dir="rtl" style={{ position: "absolute", top: 600, width: 1080, textAlign: "center", fontFamily: "Readex", fontWeight: 700, fontSize, color: "#fff" }}>البراند ديالك كيبان بحال</div>
      <Solid width={width} height={height} style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }} effects={[lightLeak({ seed: 3, hueShift: Number(process.env.REMOTION_HUE ?? 0), progress: 0.4 })]} />
    </AbsoluteFill>
  );
};
