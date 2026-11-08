import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { C, AR, SG, HOT, AURORA, Stage, Chrome, Kinetic, Captions, Whip, Flash, Tag, Phone, Glass, WaButton, Grad, at, useSpring, useFonts, Word } from "../brand";
import data from "./R.json";

const S = (s: number) => Math.round(s * 30);
const CUT = data.cuts; // scene starts (s)

// ---------- illustrations ----------
const Plate: React.FC<{ size: number; dark?: boolean }> = ({ size, dark }) => (
  <svg width={size} height={size} viewBox="0 0 400 400" style={{ filter: dark ? "brightness(.32) saturate(.35) contrast(.9)" : "saturate(1.15)" }}>
    <defs>
      <radialGradient id="tbl" cx="50%" cy="45%" r="75%"><stop offset="0" stopColor="#8a5a34" /><stop offset="1" stopColor="#3b2414" /></radialGradient>
      <radialGradient id="pl" cx="45%" cy="40%" r="60%"><stop offset="0" stopColor="#ffffff" /><stop offset=".8" stopColor="#ece6dc" /><stop offset="1" stopColor="#cfc6b8" /></radialGradient>
      <linearGradient id="meat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b5541c" /><stop offset="1" stopColor="#6e2a0c" /></linearGradient>
      <radialGradient id="sh" cx="50%" cy="50%" r="50%"><stop offset=".7" stopColor="rgba(0,0,0,.45)" /><stop offset="1" stopColor="rgba(0,0,0,0)" /></radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#tbl)" />
    {[60, 140, 220, 300, 380].map((y) => <path key={y} d={`M0 ${y} Q200 ${y - 14} 400 ${y}`} stroke="rgba(0,0,0,.18)" strokeWidth="3" fill="none" />)}
    <circle cx="205" cy="212" r="168" fill="url(#sh)" />
    <circle cx="200" cy="200" r="158" fill="url(#pl)" />
    <circle cx="200" cy="200" r="122" fill="none" stroke="rgba(0,0,0,.06)" strokeWidth="4" />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`rotate(${-28 + i * 22} 200 200) translate(0 ${-50 + i * 50})`}>
        <rect x="90" y="190" width="220" height="10" rx="5" fill="#d8c7a2" />
        {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={108 + k * 38} y="176" width="32" height="38" rx="12" fill="url(#meat)" />)}
        {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${112 + k * 38} 186 l24 18`} stroke="#3a1504" strokeWidth="4" strokeLinecap="round" opacity=".6" />)}
      </g>
    ))}
    {[[120, 300, "#3fae4a"], [150, 318, "#57c45c"], [270, 300, "#e5402b"], [292, 278, "#f2c230"], [96, 120, "#57c45c"], [300, 112, "#e5402b"]].map(([x, y, c], i) =>
      <circle key={i} cx={x as number} cy={y as number} r="20" fill={c as string} />)}
    <ellipse cx="160" cy="140" rx="70" ry="26" fill="rgba(255,255,255,.35)" transform="rotate(-25 160 140)" />
  </svg>
);

const Icon: React.FC<{ d: string; size?: number; color?: string; fill?: string }> = ({ d, size = 44, color = "#fff", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const HEART = "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z";
const CHAT = "M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5z";
const SEND = "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z";
const BOOK = "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z";

// ---------- scenes (lt = local frame) ----------
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const s3 = useSpring(0, 10);
  const spin = f * 0.15;
  return (
    <AbsoluteFill>
      <svg width="900" height="900" viewBox="0 0 400 400" style={{ position: "absolute", left: 90, top: 470, opacity: 0.22, transform: `rotate(${spin}deg)` }}>
        <circle cx="200" cy="200" r="150" fill="none" stroke="#fff" strokeWidth="2" />
        {[0, 90, 180, 270].map((a) => (
          <g key={a} transform={`rotate(${a} 200 200)`}><circle cx="200" cy="85" r="34" fill="none" stroke="#fff" strokeWidth="2" /><line x1="160" y1="70" x2="160" y2="100" stroke="#fff" strokeWidth="2" /><line x1="240" y1="70" x2="240" y2="100" stroke="#fff" strokeWidth="2" /></g>
        ))}
      </svg>
      <Kinetic words={["إلا", "عندك", "ريسطو"]} start={0} instant y={250} size={118} />
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center", fontFamily: SG, fontWeight: 700, fontSize: 600, lineHeight: 1,
        transform: `scale(${0.85 + 0.15 * s3}) rotate(${(1 - s3) * -8}deg)`, filter: "drop-shadow(0 30px 90px rgba(255,45,122,.55))" }}>
        <Grad g={HOT}>3</Grad>
      </div>
      <Kinetic words={["غلطات"]} start={S(2.1)} y={1080} size={120} />
      <Kinetic words={["كيخسروك", "الكليان"]} start={S(2.75)} step={5} y={1240} size={104} color={C.red} hiIdx={[0, 1]} grad={`linear-gradient(90deg, ${C.red}, ${C.pink})`} />
    </AbsoluteFill>
  );
};

const Head: React.FC<{ n: string; words: string[]; hi: number[] }> = ({ n, words, hi }) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Tag p={at(f, 0, 12)}><span style={{ fontFamily: SG, fontWeight: 700 }}>{n}</span><span style={{ width: 2, height: 30, background: C.line }} />الغلطة</Tag>
      </div>
      <Kinetic words={words} start={3} step={4} y={320} size={108} hiIdx={hi} />
    </>
  );
};

const Mistake1: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(4, 16);
  const wipe = interpolate(f, [S(1.2), S(3.2)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) });
  const W = 372;
  return (
    <AbsoluteFill>
      <Head n="01" words={["تصاور", "مضلمين"]} hi={[1]} />
      <Phone x={540} y={520} w={400} p={p} tilt={-4}>
        <div style={{ padding: "70px 0 0" }}>
          <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 20px 14px" }}>
            <div style={{ width: 46, height: 46, borderRadius: 99, background: AURORA, padding: 3 }}><div style={{ width: "100%", height: "100%", borderRadius: 99, background: "#222" }} /></div>
            <div style={{ fontFamily: AR, fontWeight: 600, fontSize: 24, color: "#fff" }}>الريسطو ديالك</div>
          </div>
          <div style={{ position: "relative", width: W, height: W }}>
            <div style={{ position: "absolute", inset: 0 }}><Plate size={W} /></div>
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${(1 - wipe) * 100}%)` }}><Plate size={W} dark /></div>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${(1 - wipe) * 100}%`, width: 4, marginLeft: -2, background: "#fff", boxShadow: "0 0 20px rgba(255,255,255,.8)", opacity: wipe > 0.01 && wipe < 0.99 ? 1 : 0 }} />
            <div style={{ position: "absolute", top: 14, right: 14, padding: "4px 14px", borderRadius: 10, background: "rgba(0,0,0,.55)", fontFamily: AR, fontWeight: 600, fontSize: 22, color: "#fff", opacity: wipe }}>قبل</div>
            <div style={{ position: "absolute", top: 14, left: 14, padding: "4px 14px", borderRadius: 10, background: "rgba(37,211,102,.85)", fontFamily: AR, fontWeight: 600, fontSize: 22, color: "#fff", opacity: 1 - wipe }}>من بعد</div>
          </div>
          <div dir="rtl" style={{ display: "flex", gap: 22, padding: "18px 20px" }}><Icon d={HEART} size={38} color={wipe < 0.5 ? C.red : "#fff"} fill={wipe < 0.5 ? C.red : "none"} /><Icon d={CHAT} size={38} /><Icon d={SEND} size={38} /></div>
          {[300, 220].map((w, i) => <div key={i} style={{ height: 14, width: w, margin: "8px 20px 0 auto", borderRadius: 8, background: "rgba(255,255,255,.14)" }} />)}
        </div>
      </Phone>
    </AbsoluteFill>
  );
};

const Mistake2: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(4, 16);
  const scan = interpolate(f, [S(1.0), S(3.4)], [0, 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leave = at(f, S(5.0), 18);
  const items = ["المنيو", "الثمن", "العنوان"];
  return (
    <AbsoluteFill>
      <Head n="02" words={["المنيو", "فين؟"]} hi={[1]} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${leave * -150}px)`, opacity: 1 - leave * 0.55 }}>
        <Phone x={540} y={540} w={400} p={p} tilt={4}>
          <div dir="rtl" style={{ padding: "80px 24px 0", color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ width: 110, height: 110, borderRadius: 99, background: AURORA, padding: 4 }}><div style={{ width: "100%", height: "100%", borderRadius: 99, background: "#1d1b24" }} /></div>
              <div style={{ display: "flex", gap: 18 }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 52, height: 40, borderRadius: 8, background: "rgba(255,255,255,.12)" }} />)}</div>
            </div>
            <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 30, marginTop: 18 }}>الريسطو ديالك</div>
            {[260, 200].map((w, i) => <div key={i} style={{ height: 14, width: w, marginTop: 12, borderRadius: 8, background: "rgba(255,255,255,.14)" }} />)}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
              {items.map((nm, i) => {
                const hit = scan >= i - 0.15;
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 92, height: 92, borderRadius: 99, border: `3px dashed ${hit ? C.red : "rgba(255,255,255,.35)"}`, display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: AR, fontWeight: 700, fontSize: 46, color: hit ? C.red : "rgba(255,255,255,.4)", transform: `scale(${hit ? 1 + 0.08 * Math.max(0, 1 - (scan - i) * 3) : 1})` }}>؟</div>
                    <div style={{ fontFamily: AR, fontWeight: 500, fontSize: 22, color: "rgba(255,255,255,.7)" }}>{nm}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, marginTop: 40 }}>{[...Array(6)].map((_, i) => <div key={i} style={{ height: 110, background: "rgba(255,255,255,.07)" }} />)}</div>
          </div>
        </Phone>
        {/* magnifier scanning the highlights */}
        <svg width="120" height="120" viewBox="0 0 24 24" style={{ position: "absolute", left: 610 - scan * 115, top: 905, opacity: p * (scan < 2 ? 1 : 1 - (scan - 2)), filter: "drop-shadow(0 10px 20px rgba(0,0,0,.5))" }}>
          <circle cx="10" cy="10" r="6.5" fill="rgba(255,255,255,.15)" stroke="#fff" strokeWidth="2.2" /><path d="M15 15l6 6" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ position: "absolute", top: 760, right: 70, opacity: leave, transform: `translateX(${(1 - leave) * 80}px)` }}>
        <Glass style={{ padding: "30px 36px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <svg width="92" height="92" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill={C.green} /><path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 46, color: C.ink }}>عند جارك</div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

const Mistake3: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(4, 16);
  const msg = useSpring(S(0.8), 12);
  const secs = Math.floor(interpolate(f, [S(1.6), S(5.2)], [0, 3 * 3600 + 12 * 60 + 45], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => x * x }));
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0"), mm = String(Math.floor(secs / 60) % 60).padStart(2, "0"), ss = String(secs % 60).padStart(2, "0");
  const tp = at(f, S(1.4), 14);
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.4);
  return (
    <AbsoluteFill>
      <Head n="03" words={["بلا", "جواب"]} hi={[1]} />
      <Phone x={540} y={520} w={400} p={p} tilt={-3}>
        <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 16, padding: "70px 22px 18px", borderBottom: "1px solid rgba(255,255,255,.08)", background: "#15141b" }}>
          <div style={{ width: 54, height: 54, borderRadius: 99, background: "linear-gradient(135deg,#6b6b80,#3a3a48)" }} />
          <div><div style={{ fontFamily: AR, fontWeight: 600, fontSize: 26, color: "#fff" }}>كليان جديد</div><div style={{ fontFamily: AR, fontSize: 18, color: C.green }}>متصل</div></div>
        </div>
        <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
          <div dir="rtl" style={{ alignSelf: "flex-start", maxWidth: 300, padding: "16px 20px", borderRadius: "22px 22px 22px 6px", background: "#26252e", color: "#fff",
            fontFamily: AR, fontWeight: 500, fontSize: 25, lineHeight: 1.45, opacity: msg, transform: `scale(${0.8 + 0.2 * msg})`, transformOrigin: "left bottom" }}>
            السلام، واش كاينة طبلة الليلة؟
            <div style={{ fontFamily: SG, fontSize: 16, color: C.muted, marginTop: 6 }}>23:04 ✓✓</div>
          </div>
        </div>
      </Phone>
      <div style={{ position: "absolute", top: 1100, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: tp, transform: `translateY(${(1 - tp) * 40}px)` }}>
        <Glass style={{ padding: "22px 40px", display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 22, height: 22, borderRadius: 99, background: C.red, boxShadow: `0 0 ${20 + 20 * pulse}px ${C.red}` }} />
          <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 76, color: C.ink, letterSpacing: 2, fontVariantNumeric: "tabular-nums" }}>{hh}:{mm}:{ss}</div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

const Proof: React.FC = () => {
  const f = useCurrentFrame();
  const k = interpolate(f, [6, S(2.6)], [0, 35.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 4) });
  const c = useSpring(S(1.2), 15);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag p={at(f, 0, 12)}>نتيجة حقيقية</Tag></div>
      <div style={{ position: "absolute", top: 360, left: 0, right: 0, textAlign: "center", fontFamily: SG, fontWeight: 700, fontSize: 290, letterSpacing: -12, lineHeight: 1,
        filter: "drop-shadow(0 30px 80px rgba(255,45,122,.5))" }}><Grad g={HOT}>{k.toFixed(1)}K</Grad></div>
      <Kinetic words={["مشاهدة", "فريل", "وحدة"]} start={8} y={680} size={84} color={C.ink} />
      <div style={{ position: "absolute", top: 880, left: 110, right: 110, opacity: c, transform: `translateY(${(1 - c) * 60}px)` }}>
        <Glass style={{ padding: 28, display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ width: 150, height: 230, borderRadius: 22, background: "linear-gradient(160deg,#ff8a3d,#c2185b 60%,#4a148c)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="64" height="64" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff" /></svg>
          </div>
          <div>
            <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 52, color: C.ink, lineHeight: 1.1 }}>Grillade Khay Ahmed</div>
            <div style={{ fontFamily: "Inter Tight", fontWeight: 500, fontSize: 34, color: C.muted, marginTop: 12 }}>@restokhayahmed</div>
          </div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const fillB = at(f, 6, 12);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40 }}>
        <div style={{ transform: `scale(${0.7 + 0.3 * fillB})`, opacity: fillB }}><Icon d={BOOK} size={120} color={C.ink} fill={fillB > 0.6 ? C.ink : "none"} /></div>
        <div style={{ transform: `scale(${0.7 + 0.3 * at(f, 16, 12)})`, opacity: at(f, 16, 12) }}><Icon d={SEND} size={120} color={C.ink} /></div>
      </div>
      <Kinetic words={["سيفها", "و", "صيفطها"]} start={4} step={5} y={430} size={92} />
      <Kinetic words={["لمول", "الريسطو"]} start={18} step={5} y={580} size={116} grad={AURORA} />
      <WaButton p={at(f, S(2.2), 16)} label="صيفط لينا فواتساب" y={900} />
    </AbsoluteFill>
  );
};

export const RestaurantMistakes: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  const scenes = [Hook, Mistake1, Mistake2, Mistake3, Proof, Cta];
  const edges = [0, ...CUT, data.total];
  const idx = edges.findIndex((e, i) => f / 30 >= e && f / 30 < edges[i + 1]);
  const index = idx >= 1 && idx <= 3 ? `0${idx} / 03` : undefined;
  return (
    <Stage>
      <Audio src={staticFile("vo/R_mix.wav")} />
      <Whip cuts={CUT}>
        {scenes.map((Sc, i) => (
          <Sequence key={i} from={S(edges[i])} durationInFrames={S(edges[i + 1] - edges[i]) + 1}>
            <Sc />
          </Sequence>
        ))}
      </Whip>
      <Flash cuts={CUT} />
      <Captions lines={data.lines as Word[][]} y={1420} hide={(t) => t < CUT[0] || t >= CUT[4] || (t > CUT[3] && t < CUT[3] + 0.0)} />
      <Chrome total={data.total} index={index} />
    </Stage>
  );
};
