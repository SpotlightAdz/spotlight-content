// W3 Fri: relatable POV: "بشحال؟" for the 47th time today -> Spotlight AI replies in minutes. Chats are illustrative.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Kinetic, Tag, Phone, Glass, Grad, at, useSpring, ReelShell, LineIcon, Bubble, Illustrative, sec, ReelData } from "../brand";
import data from "./R4.json";
const D = data as ReelData;

const FLOOD = [
  [120, 560, -8], [640, 520, 6], [300, 700, 4], [760, 760, -5], [90, 900, 7], [560, 960, -3], [250, 1110, -6], [720, 1150, 5], [430, 1300, 2],
] as [number, number, number][];

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const shake = Math.sin(f * 1.3) * 3;
  return (
    <AbsoluteFill>
      {FLOOD.map(([x, y, r], i) => (
        <div key={i} dir="rtl" style={{ position: "absolute", left: x, top: y + Math.sin(f * 0.08 + i) * 8, transform: `rotate(${r}deg)`, padding: "16px 26px", borderRadius: "26px 26px 26px 8px", background: "#26252e",
          fontFamily: AR, fontWeight: 600, fontSize: 40, color: "rgba(255,255,255,.55)", boxShadow: "0 20px 40px rgba(0,0,0,.45)" }}>بشحال؟</div>
      ))}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 30% at 50% 40%, rgba(6,5,12,.92), rgba(6,5,12,.4) 80%)" }} />
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag><span dir="ltr" style={{ fontFamily: SG, fontWeight: 700, letterSpacing: 2 }}>POV</span></Tag></div>
      <div dir="rtl" style={{ position: "absolute", top: 380, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 190, lineHeight: 1.1, color: C.ink, transform: `translateX(${shake}px)` }}>بشحال؟</div>
      <div dir="rtl" style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 92, color: C.ink }}>
        للمرة <span dir="ltr" style={{ fontFamily: SG, fontSize: 150 }}><Grad g={HOT}>47</Grad></span> اليوم
      </div>
      <div style={{ position: "absolute", top: 890, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 150, height: 150, borderRadius: 40, background: "linear-gradient(160deg,#2a2833,#15141b)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
          <LineIcon name="chat" size={84} />
          <div dir="ltr" style={{ position: "absolute", top: -22, right: -26, minWidth: 74, height: 74, borderRadius: 99, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SG, fontWeight: 700, fontSize: 38, color: "#fff", padding: "0 10px", boxShadow: `0 0 30px ${C.red}` }}>47</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const REPLY = "السلام، الثمن هو…";
const OneByOne: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(2, 15);
  const cyc = 26; const k = Math.floor(f / cyc); const lt = f % cyc;
  const typed = REPLY.slice(0, Math.min(REPLY.length, Math.floor(lt * 1.1)));
  const n = 12 + k * 7;
  return (
    <AbsoluteFill>
      <Kinetic words={["واحد", "بواحد"]} start={2} step={5} y={240} size={110} hiIdx={[1]} />
      <Phone x={540} y={460} w={400} p={p} tilt={-3}>
        <div dir="rtl" style={{ padding: "64px 20px 16px", background: "#15141b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: AR, fontWeight: 600, fontSize: 24, color: "#fff" }}>الرسائل</span>
          <span dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 22, color: "#fff", background: C.red, borderRadius: 99, padding: "2px 12px" }}>{n}</span>
        </div>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} dir="rtl" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
            <div style={{ width: 52, height: 52, borderRadius: 99, background: ["#6b6b80", "#80606b", "#5f7a80", "#7a705a", "#6a5f80", "#5a7a62"][i] }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 12, width: 120 + (i * 37) % 90, borderRadius: 6, background: "rgba(255,255,255,.25)" }} />
              <div style={{ fontFamily: AR, fontWeight: 600, fontSize: 22, color: "#fff", marginTop: 8 }}>بشحال؟</div>
            </div>
            <div style={{ width: 14, height: 14, borderRadius: 99, background: "#3b82f6" }} />
          </div>
        ))}
        <div dir="rtl" style={{ position: "absolute", left: 14, right: 14, bottom: 20, height: 62, borderRadius: 99, background: "#22212a", display: "flex", alignItems: "center", padding: "0 22px", fontFamily: AR, fontSize: 24, color: "#fff" }}>
          {typed}<span style={{ opacity: Math.floor(f / 8) % 2 ? 0 : 1 }}>|</span>
        </div>
      </Phone>
    </AbsoluteFill>
  );
};

const Neighbor: React.FC = () => {
  const f = useCurrentFrame();
  const go = interpolate(f, [sec(0.9), sec(1.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => x * x * (3 - 2 * x) });
  const a = at(f, 2, 12);
  const Shop: React.FC<{ x: number; label: string; win?: boolean; dim?: boolean }> = ({ x, label, win, dim }) => (
    <div style={{ position: "absolute", left: x, top: 640, width: 360, opacity: a * (dim ? 0.5 + 0.5 * (1 - go) : 1) }}>
      <Glass style={{ padding: "34px 26px", textAlign: "center", borderColor: win && go > 0.9 ? "rgba(37,211,102,.7)" : C.line }}>
        <svg width="120" height="110" viewBox="0 0 24 22" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round"><path d="M2 8l2-6h16l2 6M2 8h20v12H2zM2 8c0 2 1.5 3 3.3 3S8.7 10 8.7 8c0 2 1.5 3 3.3 3s3.3-1 3.3-3c0 2 1.5 3 3.3 3S22 10 22 8M9 20v-5h6v5" /></svg>
        <div dir="rtl" style={{ fontFamily: AR, fontWeight: 700, fontSize: 48, color: C.ink, marginTop: 14 }}>{label}</div>
        {win && <div dir="rtl" style={{ marginTop: 14, fontFamily: AR, fontWeight: 600, fontSize: 30, color: C.green, opacity: go }}>جاوب فالحين ✓</div>}
        {!win && <div dir="rtl" style={{ marginTop: 14, fontFamily: AR, fontWeight: 600, fontSize: 30, color: C.red }}>ما زال ما جاوبش</div>}
      </Glass>
    </div>
  );
  const ax = interpolate(go, [0, 1], [760, 300]);
  return (
    <AbsoluteFill>
      <Kinetic words={["مشا", "عند", "جارك"]} start={2} step={4} y={250} size={120} hiIdx={[2]} />
      <Shop x={610} label="نتا" dim />
      <Shop x={110} label="جارك" win />
      <div style={{ position: "absolute", left: ax - 50, top: 1060 - Math.sin(go * Math.PI) * 120, width: 100, height: 100, borderRadius: 99, background: AURORA, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 50px rgba(255,45,122,.5)", opacity: a }}>
        <LineIcon name="users" size={54} />
      </div>
    </AbsoluteFill>
  );
};

const Ai: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(2, 15);
  const typing = f > sec(1.3) && f < sec(2.2);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center", fontFamily: SG, fontWeight: 700, fontSize: 104, letterSpacing: -2, opacity: at(f, 0, 12) }}><Grad g={AURORA}>Spotlight AI</Grad></div>
      <Phone x={540} y={420} w={420} p={p} tilt={3}>
        <div dir="rtl" style={{ padding: "64px 20px 16px", background: "#15141b", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 54, height: 54, borderRadius: 99, background: "linear-gradient(135deg,#6b6b80,#3a3a48)" }} />
          <div><div style={{ fontFamily: AR, fontWeight: 600, fontSize: 25, color: "#fff" }}>كليان جديد</div><div style={{ fontFamily: AR, fontSize: 18, color: C.green }}>متصل</div></div>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <Bubble at0={4} side="in" time="23:41">بشحال؟</Bubble>
          {typing && <div style={{ alignSelf: "flex-end", padding: "18px 24px", borderRadius: 22, background: "#1f6f4a", display: "flex", gap: 8 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 12, height: 12, borderRadius: 99, background: "#fff", opacity: 0.4 + 0.6 * Math.abs(Math.sin(f * 0.3 + i)) }} />)}</div>}
          {f >= sec(2.2) && <Bubble at0={sec(2.2)} side="out" time="23:42" maxW={330}>مرحبا بيك! هاهي الأثمنة و الكاتالوغ. بغيتي نحجز ليك؟</Bubble>}
          {f >= sec(3.6) && <Bubble at0={sec(3.6)} side="in" time="23:43">إيه عافاك</Bubble>}
        </div>
      </Phone>
      <div style={{ position: "absolute", top: 1290, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
        <Tag p={at(f, sec(2.4), 12)}><LineIcon name="bolt" size={32} />فدقايق، ليل و نهار</Tag>
        <Tag p={at(f, sec(3.4), 12)}><LineIcon name="users" size={32} />بنادم مسؤول</Tag>
      </div>
      <Illustrative y={355} o={at(f, 10, 12)} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const fly = at(f, sec(0.8), 18);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `translate(${fly * 30}px, ${-fly * 20}px) rotate(${fly * -8}deg)`, opacity: at(f, 0, 10) }}>
        <div style={{ width: 200, height: 200, borderRadius: 60, background: AURORA, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 30px 80px rgba(255,45,122,.45)" }}><LineIcon name="send" size={110} sw={2} /></div>
      </div>
      <Kinetic words={["صيفطها", "لشي", "واحد"]} start={4} step={4} y={560} size={104} />
      <Kinetic words={["عيا", "من"]} start={14} step={4} y={710} size={104} />
      <div dir="rtl" style={{ position: "absolute", top: 860, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 150, opacity: at(f, 22, 12) }}><Grad g={HOT}>بشحال؟</Grad></div>
      <div style={{ position: "absolute", top: 1130, left: 0, right: 0, textAlign: "center", opacity: at(f, sec(1.6), 14) }}>
        <div dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 52, color: C.ink }}>+212 701 177 915</div>
        <div style={{ fontFamily: "Inter Tight", fontWeight: 500, fontSize: 34, color: C.muted, marginTop: 10 }}>spotlightadz.ma</div>
      </div>
    </AbsoluteFill>
  );
};

export const PovBchhal: React.FC = () => (
  <ReelShell data={D} audio="vo/R4_mix.wav" scenes={[Hook, OneByOne, Neighbor, Ai, Cta]} capHide={(t, s) => s === 0 || s === 4} />
);
