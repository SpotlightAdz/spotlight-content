// Editorial carousel: one frame = one 1080x1350 slide. Render with stills.mjs (frames 0..n-1).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Grad, Grain, useFonts } from "../brand";

const PAPER = "#F3EEE7", INK = "#121018", SOFT = "#6E6A75";

const Icon: React.FC<{ d: string[]; color: string; size?: number }> = ({ d, color, size = 300 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">{d.map((p, i) => <path key={i} d={p} />)}</svg>
);
const ICONS: Record<string, string[]> = {
  camera: ["M3 8h3l2-3h8l2 3h3v12H3z", "M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  question: ["M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5z", "M9.6 9.2a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.2 1-1.2 1.9", "M12 16h.01"],
  split: ["M3 4h18v16H3z", "M12 4v16", "M7 10l-2 2 2 2", "M17 10l2 2-2 2"],
  quote: ["M5 10c0-3 2-5 5-5v2c-2 0-3 1.4-3 3h3v6H5z", "M14 10c0-3 2-5 5-5v2c-2 0-3 1.4-3 3h3v6h-5z"],
  clock: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 7v5l3 2"],
};

const Header: React.FC<{ i: number; n: number; dark?: boolean }> = ({ i, n, dark }) => (
  <div style={{ position: "absolute", top: 72, left: 90, right: 90, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: SG, fontWeight: 500, fontSize: 26, letterSpacing: 3, color: dark ? C.muted : SOFT }}>
    <span>SPOTLIGHT NOTES · N°02</span><span>{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
  </div>
);
const Footer: React.FC<{ dark?: boolean; swipe?: boolean }> = ({ dark, swipe }) => (
  <div style={{ position: "absolute", bottom: 70, left: 90, right: 90, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <Img src={staticFile("logo.webp")} style={{ width: 44, height: 44 }} />
      <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 28, color: dark ? C.ink : INK }}>@spotlightadzagency</span>
    </div>
    {swipe && <svg width="70" height="30" viewBox="0 0 70 30"><path d="M68 15H4M16 3 4 15l12 12" stroke={dark ? C.ink : INK} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
  </div>
);

const IDEAS = [
  { t: "وراء الكواليس", s: "ورّي كيفاش كتوجد الخدمة ديالك", b: "الناس كتيق فاللي كتشوفو بعينيها. لقطة ديال اليدين وهوما خدامين كتسوا أكثر من أي إعلان.", ic: "camera" },
  { t: "سؤال كيتعاود", s: "جاوب عليه فـ 15 ثانية", b: "شنو أكثر سؤال كيسولوك عليه الكليان؟ صور الجواب، و ولي كتصيفطو لكل واحد سول.", ic: "question" },
  { t: "قبل و بعد", s: "النتيجة فلقطة وحدة", b: "بيّن الفرق فأول ثانيتين. نفس البلاصة، نفس الزاوية، قبل و من بعد.", ic: "split" },
  { t: "كليان كيهضر", s: "بكلامو، بلا سكريبت", b: "جوج جمل صادقين من كليان فرحان كيبيعو أكثر من أي جملة كتكتبها نتا.", ic: "quote" },
  { t: "نهارك فالخدمة", s: "من الصباح حتى تسد", b: "لقطات قصار ديال 2 ثواني، و قصة بسيطة: البداية، الضغط، و النهاية.", ic: "clock" },
];
export const REEL_IDEAS_SLIDES = IDEAS.length + 2;

export const ReelIdeas: React.FC = () => {
  useFonts();
  const i = useCurrentFrame(); const n = REEL_IDEAS_SLIDES;
  if (i === 0) return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(50% 40% at 85% 15%, rgba(255,61,46,.45), transparent 70%), radial-gradient(50% 40% at 10% 95%, rgba(123,60,242,.5), transparent 70%)" }} />
      <Header i={i} n={n} dark />
      <div dir="rtl" style={{ position: "absolute", top: 230, left: 90, right: 90, fontFamily: AR, fontWeight: 700, color: C.ink }}>
        <div style={{ fontSize: 52, color: C.muted, fontWeight: 600 }}>ما عرفتيش شنو تصور؟</div>
        <div style={{ fontSize: 400, lineHeight: 1, fontFamily: SG, marginTop: 20 }}><Grad g={HOT}>5</Grad></div>
        <div style={{ fontSize: 132, lineHeight: 1.15 }}>أفكار ريلز</div>
        <div style={{ fontSize: 132, lineHeight: 1.15 }}><Grad g={AURORA}>بالتيليفون</Grad></div>
        <div style={{ width: 180, height: 6, background: AURORA, marginTop: 50, borderRadius: 3 }} />
        <div style={{ fontSize: 46, fontWeight: 500, color: C.muted, marginTop: 30 }}>لأي بيزنس فالمغرب · سيفها لملي تصور</div>
      </div>
      <Footer dark swipe /><Grain o={0.08} />
    </AbsoluteFill>
  );
  if (i === n - 1) return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 45% at 50% 40%, rgba(255,45,122,.35), transparent 70%)" }} />
      <Header i={i} n={n} dark />
      <div dir="rtl" style={{ position: "absolute", top: 300, left: 90, right: 90, textAlign: "center", fontFamily: AR, fontWeight: 700, color: C.ink }}>
        <div style={{ fontSize: 110, lineHeight: 1.2 }}>بغيتي نصورو</div>
        <div style={{ fontSize: 110, lineHeight: 1.2 }}><Grad g={AURORA}>ليك هادشي؟</Grad></div>
        <div style={{ display: "inline-block", marginTop: 70, padding: "30px 64px", borderRadius: 999, background: AURORA, fontSize: 54, color: "#fff", boxShadow: "0 30px 80px rgba(255,45,122,.4)" }}>
          كتب <span style={{ fontFamily: SG }}>SPOT</span> فالكومونتير
        </div>
        <div dir="ltr" style={{ fontFamily: SG, fontSize: 60, marginTop: 50 }}>+212 701 177 915</div>
      </div>
      <Footer dark /><Grain o={0.08} />
    </AbsoluteFill>
  );
  const it = IDEAS[i - 1];
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Header i={i} n={n} />
      <div style={{ position: "absolute", top: 120, left: 60, fontFamily: SG, fontWeight: 700, fontSize: 420, lineHeight: 1, WebkitTextStroke: `3px ${INK}`, color: "transparent", opacity: 0.12 }}>0{i}</div>
      <div style={{ position: "absolute", top: 170, left: 80 }}><Icon d={ICONS[it.ic]} color={INK} size={260} /></div>
      <div dir="rtl" style={{ position: "absolute", top: 540, left: 90, right: 90, fontFamily: AR, color: INK }}>
        <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 30, letterSpacing: 4 }}><Grad g={HOT}>IDEA 0{i}</Grad></div>
        <div style={{ fontWeight: 700, fontSize: 124, lineHeight: 1.15, marginTop: 14 }}>{it.t}</div>
        <div style={{ fontWeight: 600, fontSize: 52, lineHeight: 1.3, marginTop: 10 }}><Grad g={HOT}>{it.s}</Grad></div>
        <div style={{ height: 2, background: "rgba(18,16,24,.15)", margin: "44px 0 36px" }} />
        <div style={{ fontWeight: 500, fontSize: 47, lineHeight: 1.6, color: "#3b3742" }}>{it.b}</div>
      </div>
      <div dir="rtl" style={{ position: "absolute", bottom: 150, left: 90, right: 90, display: "flex", alignItems: "center", gap: 16, fontFamily: AR, fontWeight: 600, fontSize: 34, color: SOFT }}>
        <span style={{ width: 14, height: 14, borderRadius: 99, background: AURORA }} />سيف البوست · صيفطو لشي صاحب عندو بيزنس
      </div>
      <Footer swipe /><Grain o={0.05} />
    </AbsoluteFill>
  );
};
