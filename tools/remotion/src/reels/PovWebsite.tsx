// W4 Fri: relatable POV (web product). "الكليان سولك: عندك سيت؟" → only an Insta page → he wanted products, prices, location → a site that sells while you sleep.
// Mixed media: two-character hook → paper cut-out → phone chat flood → browser mockup with cursor → character CTA.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Tag, Phone, Grad, at, useSpring, ReelShell, LineIcon, SendCta, Illustrative, Bubble, FitLine, Kinetic, Browser, sec, ReelData } from "../brand";
import { Character } from "../mixed/Character";
import { Scrap, CutoutWords, PaperDesk, INK, PAPERS, useStep, jitter } from "../mixed/paper";
import data from "./S4.json";
const D = data as ReelData;

const Hook: React.FC = () => {
  const p = useSpring(0, 11);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag><span dir="ltr" style={{ fontFamily: SG, fontWeight: 700, letterSpacing: 2 }}>POV</span></Tag></div>
      <FitLine text="الكليان سولك:" y={320} max={90} width={700} color={C.muted} />
      <div dir="rtl" style={{ position: "absolute", top: 440, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 140, lineHeight: 1.15, color: C.ink }}>عندك <Grad g={HOT}>سيت؟</Grad></div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={290} y={1250} scale={0.82} mood="neutral" pose="phone" shirt={C.cya} hairStyle="cap" seed={1} />
        <Character x={790} y={1250} scale={0.82} mood="shocked" pose="idle" shirt={C.pink} flip seed={3} />
      </svg>
      <div dir="rtl" style={{ position: "absolute", top: 830, left: 80, padding: "18px 34px", borderRadius: "30px 30px 30px 8px", background: "#fff", border: `5px solid ${INK}`, fontFamily: AR, fontWeight: 700, fontSize: 64, color: INK,
        transform: `scale(${0.92 + 0.08 * p})`, transformOrigin: "left bottom", boxShadow: "6px 8px 0 rgba(26,18,34,.12)" }}>عندك سيت؟</div>
      <div style={{ position: "absolute", top: 700, left: 830, fontFamily: SG, fontWeight: 700, fontSize: 120, color: C.red, transform: `scale(${0.8 + 0.2 * p})` }}>!</div>
    </AbsoluteFill>
  );
};

const OnlyInsta: React.FC = () => {
  const step = useStep(3);
  const j = jitter(step, 6, 0.8);
  return (
    <PaperDesk>
      <CutoutWords words={["لا…", "غير", "صفحة", "فالإنستا"]} y={240} size={92} start={0} gap={4} />
      <Scrap x={290 + j.dx} y={620 + j.dy} w={500} h={760} color="#FFF8F0" seed={44} rot={-3 + j.rot} tape>
        <div style={{ position: "absolute", top: 40, left: 40, right: 40, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 90, height: 90, borderRadius: 45, background: AURORA, border: `4px solid ${INK}` }} />
          <div style={{ flex: 1 }}><div style={{ height: 18, width: "70%", background: INK, borderRadius: 9 }} /><div style={{ height: 14, width: "45%", background: "rgba(26,18,34,.3)", borderRadius: 7, marginTop: 12 }} /></div>
        </div>
        <div style={{ position: "absolute", top: 180, left: 40, right: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[...Array(9)].map((_, k) => <div key={k} style={{ aspectRatio: "1", background: PAPERS[(k * 2) % PAPERS.length], border: `3px solid ${INK}`, transform: `rotate(${((k * 37) % 7) - 3}deg)`, opacity: step >= 6 + k * 2 ? 1 : 0 }} />)}
        </div>
        <div dir="rtl" style={{ position: "absolute", bottom: 50, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 40, color: "#C23B2E", opacity: step >= 30 ? 1 : 0 }}>الثمن؟ فالخاص…</div>
      </Scrap>
    </PaperDesk>
  );
};

const Questions: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(0, 15);
  return (
    <AbsoluteFill>
      <Kinetic words={["بغا", "يشوف"]} start={2} step={4} y={230} size={100} />
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14 }}>
        {[["grid", "المنتوجات"], ["tag", "الأثمنة"], ["pin", "فين كاينين"]].map(([ic, l], i) => <Tag key={i} p={at(f, sec([0.9, 1.6, 2.6][i]), 10)}><LineIcon name={ic} size={30} color={C.pink} />{l}</Tag>)}
      </div>
      <Phone x={540} y={490} w={440} p={p} tilt={-5}>
        <div style={{ padding: "80px 26px 0", display: "flex", flexDirection: "column", gap: 14 }}>
          <Bubble at0={6} size={30}>شنو عندكم؟</Bubble>
          <Bubble at0={22} size={30}>بشحال هادي؟</Bubble>
          <Bubble at0={44} size={30}>فين كاينين بالضبط؟</Bubble>
          <Bubble at0={64} size={30}>واش كاين التوصيل؟</Bubble>
          <div dir="rtl" style={{ alignSelf: "flex-end", fontFamily: AR, fontSize: 24, color: "rgba(255,255,255,.5)", opacity: at(f, 80, 10) }}>شافها 23:41 · ما كاين جواب</div>
        </div>
      </Phone>
      <Illustrative y={1395} o={at(f, 20, 12)} />
    </AbsoluteFill>
  );
};

const Site: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(0, 15);
  const cx = interpolate(f, [sec(2.2), sec(3.4)], [880, 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) });
  const cy = interpolate(f, [sec(2.2), sec(3.4)], [1400, 1215], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) });
  const click = at(f, sec(3.5), 6) * (1 - at(f, sec(3.8), 8));
  const items: [string, string][] = [["#FFD9E6", "180"], ["#FFE7A8", "240"], ["#E4DAFF", "95"], ["#D7F3F7", "320"]];
  return (
    <AbsoluteFill>
      <FitLine text="سيت كيخدم عليك" y={230} max={110} width={880} p={at(f, 0, 10)} />
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag p={at(f, sec(1.2), 10)}><LineIcon name="moon" size={32} color={C.pur} />و نتا ناعس</Tag></div>
      <Browser x={110} y={500} w={860} h={860} url="yourshop.ma" p={p} tilt={-4}>
        <div style={{ padding: "26px 34px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 38, color: C.ink }}>Your Shop</span>
            <span dir="rtl" style={{ fontFamily: AR, fontWeight: 600, fontSize: 26, color: C.muted, display: "flex", alignItems: "center", gap: 8 }}><LineIcon name="pin" size={26} color={C.muted} />مرتيل</span>
          </div>
          <div dir="rtl" style={{ fontFamily: AR, fontWeight: 700, fontSize: 40, color: C.ink, margin: "18px 0 14px" }}>الكاتالوغ</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {items.map(([c, pr], i) => {
              const q = at(f, 8 + i * 5, 12);
              return (
                <div key={i} style={{ borderRadius: 22, background: "#FAF6F2", padding: 14, opacity: q, transform: `translateY(${(1 - q) * 30}px)` }}>
                  <div style={{ height: 150, borderRadius: 16, background: c }} />
                  <div dir="rtl" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, fontFamily: AR, fontWeight: 600, fontSize: 26, color: C.ink }}>
                    منتوج {i + 1}<span dir="ltr" style={{ fontFamily: SG, fontWeight: 700, color: C.pink }}>{pr} DH</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div dir="rtl" style={{ marginTop: 26, padding: "22px 0", borderRadius: 999, background: C.waDeep, color: "#fff", fontFamily: AR, fontWeight: 700, fontSize: 36, display: "flex", justifyContent: "center", alignItems: "center", gap: 14,
            transform: `scale(${1 - click * 0.05})`, boxShadow: `0 0 0 ${click * 18}px rgba(37,211,102,.25)` }}>
            <LineIcon name="chat" size={36} color="#fff" sw={2.2} />كوموند فالواتساب
          </div>
        </div>
      </Browser>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path transform={`translate(${cx} ${cy})`} d="M0 0 L0 52 L14 40 L24 62 L34 57 L24 36 L42 36 Z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      </svg>
      <Illustrative y={1375} o={at(f, 20, 12)} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kinetic words={["صيفطها", "لشي", "واحد"]} start={2} step={4} y={250} size={100} />
      <FitLine text="باقي ما عندوش سيت" y={400} max={100} width={820} p={at(f, 10, 12)} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={540} y={1330} scale={0.72} mood="happy" pose="coffee" shirt={C.pink} seed={3} />
      </svg>
      <SendCta p={at(f, sec(0.7), 16)} to="لصاحب الحانوت" y={640} />
    </AbsoluteFill>
  );
};

export const PovWebsite: React.FC = () => (
  <ReelShell data={D} audio="vo/S4_mix.wav" scenes={[Hook, OnlyInsta, Questions, Site, Cta]} capHide={(t, s) => s === 0 || s === 4} />
);
