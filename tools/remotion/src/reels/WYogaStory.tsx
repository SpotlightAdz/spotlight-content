// Dec W1 Wed: client result story (keynote), web product. W Yoga Academy: 11K+ euros in subscriptions in 5 months, 0 MAD ad spend, all-in-one yoga platform.
// Facts from the facts list only; platform UI and notifications are labelled illustrative.
// Mixed media: 3D number hook → browser platform UI → result card + 5-month timeline → paper receipt + stamp → night character + notifications → CTA.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Tag, Glass, Grad, at, useSpring, ReelShell, LineIcon, CommentCta, ResultCard, FitLine, Kinetic, Browser, Stamp, Illustrative, sec, ReelData } from "../brand";
import { Character } from "../mixed/Character";
import { Scrap, CutoutWords, PaperDesk, INK, useStep, jitter } from "../mixed/paper";
import { Hero3DText } from "../three/kit3d";
import data from "./T2.json";
const D = data as ReelData;

const Hook: React.FC = () => {
  const s = useSpring(0, 12);
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag><span style={{ fontFamily: SG, fontWeight: 700 }}>W Yoga Academy</span><span style={{ width: 2, height: 30, background: C.line }} />قصة نجاح</Tag></div>
      <FitLine text="فوق 11 ألف أورو…" y={330} max={120} width={880} />
      <div style={{ position: "absolute", inset: 0 }}><Hero3DText text="11K+" color="#FFB800" y={0.45} size={1.2} enter={s} /></div>
      <div dir="rtl" style={{ position: "absolute", top: 1140, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 84, lineHeight: 1.25, color: C.ink }}>
        بلا حتى درهم<br />ديال <Grad g={HOT}>الإعلانات</Grad>
      </div>
      <div dir="ltr" style={{ position: "absolute", top: 1050, left: 0, right: 0, textAlign: "center", fontFamily: SG, fontWeight: 700, fontSize: 36, color: C.muted, letterSpacing: 4, opacity: 0.6 + 0.4 * at(f, 6, 12) }}>EUROS · 5 MONTHS</div>
    </AbsoluteFill>
  );
};

const TILES: [string, string][] = [["users", "الأعضاء"], ["card", "الاشتراكات"], ["clock", "البرنامج"], ["chart", "الأرقام"]];
const Platform: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(0, 15);
  return (
    <AbsoluteFill>
      <FitLine text="منصة وحدة، فيها كلشي" y={240} max={104} width={900} p={at(f, 2, 12)} />
      <div style={{ position: "absolute", top: 390, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag p={at(f, 10, 12)}><span dir="ltr" style={{ fontFamily: SG, fontWeight: 700, letterSpacing: 2 }}>ALL-IN-ONE</span></Tag></div>
      <Browser x={110} y={500} w={860} h={820} url="yoga platform" p={p} tilt={-4}>
        <div style={{ padding: "28px 34px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 38, color: C.ink }}>W Yoga</span>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: AURORA }} />
          </div>
          <div dir="rtl" style={{ marginTop: 22, padding: "26px 30px", borderRadius: 26, background: "linear-gradient(120deg,#FFE7C7,#FFD9E6)", fontFamily: AR, fontWeight: 700, fontSize: 40, color: C.ink }}>
            مرحبا بيك
            <div style={{ fontWeight: 500, fontSize: 28, color: C.muted, marginTop: 6 }}>كلشي فبلاصة وحدة</div>
          </div>
          <div dir="rtl" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 22 }}>
            {TILES.map(([ic, l], i) => {
              const q = at(f, 10 + i * 6, 12);
              return (
                <div key={i} style={{ height: 170, borderRadius: 24, background: "#FAF6F2", padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between", opacity: q, transform: `translateY(${(1 - q) * 30}px)` }}>
                  <LineIcon name={ic} size={48} color={[C.pink, C.pur, C.red, C.cya][i]} />
                  <span style={{ fontFamily: AR, fontWeight: 700, fontSize: 34, color: C.ink }}>{l}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Browser>
      <Illustrative y={1350} o={at(f, 20, 12)} />
    </AbsoluteFill>
  );
};

const Subs: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ResultCard name="W Yoga Academy" to={11} fmt={(v) => `${Math.round(v)}K€+`} label="فالاشتراكات" y={300} g={HOT} />
      <div style={{ position: "absolute", top: 1000, left: 140, right: 140 }}>
        <div style={{ position: "relative", height: 6, borderRadius: 3, background: C.line }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${at(f, 10, 50) * 100}%`, borderRadius: 3, background: AURORA }} />
        </div>
        <div dir="ltr" style={{ display: "flex", justifyContent: "space-between", marginTop: -21 }}>
          {[1, 2, 3, 4, 5].map((m, i) => {
            const on = at(f, 10 + i * 11, 8);
            return (
              <div key={m} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 18, background: on > 0.5 ? C.pink : "#fff", border: `4px solid ${on > 0.5 ? "#fff" : C.line}`, boxShadow: "0 6px 16px rgba(0,0,0,.12)" }} />
                <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 28, color: C.muted }}>M{m}</span>
              </div>
            );
          })}
        </div>
        <div dir="rtl" style={{ textAlign: "center", marginTop: 20, fontFamily: AR, fontWeight: 700, fontSize: 50, color: C.ink, opacity: at(f, 60, 12) }}>ف<span dir="ltr" style={{ fontFamily: SG }}>5</span> شهور</div>
      </div>
    </AbsoluteFill>
  );
};

const ZeroAds: React.FC = () => {
  const step = useStep(3);
  const j = jitter(step, 3, 0.8);
  const f = useCurrentFrame();
  return (
    <PaperDesk>
      <CutoutWords words={["و", "الإعلانات؟"]} y={250} size={100} start={0} gap={4} />
      <Scrap x={230 + j.dx} y={520 + j.dy} w={620} h={700} color="#FFF8F0" seed={51} rot={-2 + j.rot} tape>
        <div dir="ltr" style={{ position: "absolute", top: 50, left: 50, right: 50, fontFamily: SG, color: INK }}>
          <div style={{ fontWeight: 700, fontSize: 40, letterSpacing: 4, textAlign: "center" }}>AD SPEND</div>
          <div style={{ borderTop: `3px dashed ${INK}`, margin: "24px 0" }} />
          {["Meta Ads", "Google Ads", "TikTok Ads", "Boosts"].map((t) => (
            <div key={t} style={{ display: "flex", justifyContent: "space-between", fontWeight: 500, fontSize: 36, padding: "12px 0" }}><span>{t}</span><span>0 DH</span></div>
          ))}
          <div style={{ borderTop: `3px dashed ${INK}`, margin: "24px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 46 }}><span>TOTAL</span><span>0 DH</span></div>
        </div>
      </Scrap>
      <Stamp p={useSpring(sec(1.1), 10)} y={1150} rot={-10} size={120}>صفر درهم</Stamp>
      <div style={{ opacity: at(f, 0, 1) }} />
    </PaperDesk>
  );
};

const NOTES = ["اشتراك جديد", "عضوة جديدة تسجلات", "اشتراك جديد"];
const Night: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(40,26,70,.0), rgba(40,26,70,.10))" }} />
      <FitLine text="كتخدم عليك" y={240} max={120} width={880} p={at(f, 2, 12)} />
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag p={at(f, 12, 12)}><LineIcon name="moon" size={32} color={C.pur} />حتى و نتا ناعس</Tag></div>
      <div dir="ltr" style={{ position: "absolute", top: 520, right: 90, fontFamily: SG, fontWeight: 700, fontSize: 110, color: C.ink, opacity: 0.85 }}>02:14</div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={270} y={1180} scale={0.62} mood="tired" pose="idle" shirt={C.pur} seed={5} />
      </svg>
      <div style={{ position: "absolute", top: 720, right: 80, width: 520, display: "flex", flexDirection: "column", gap: 20 }}>
        {NOTES.map((t, i) => {
          const q = useSpring(sec(0.7) + i * 22, 13);
          return (
            <div key={i} style={{ opacity: q, transform: `translateX(${(1 - q) * 80}px)` }}>
              <Glass style={{ padding: "22px 26px", display: "flex", alignItems: "center", gap: 18, borderRadius: 28 }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: AURORA, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><LineIcon name="card" size={36} color="#fff" sw={2.2} /></div>
                <div dir="rtl" style={{ flex: 1 }}>
                  <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 22, color: C.muted, letterSpacing: 2 }}>W YOGA</div>
                  <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 34, color: C.ink }}>{t}</div>
                </div>
              </Glass>
            </div>
          );
        })}
      </div>
      <Illustrative y={1310} o={at(f, 20, 12)} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kinetic words={["بغيتي", "منصة"]} start={2} step={4} y={270} size={120} />
      <Kinetic words={["بحالها؟"]} start={10} step={4} y={430} size={130} grad={AURORA} />
      <CommentCta p={at(f, sec(1.0), 16)} keyword="SPOT" y={720} />
    </AbsoluteFill>
  );
};

export const WYogaStory: React.FC = () => (
  <ReelShell data={D} audio="vo/T2_mix.wav" scenes={[Hook, Platform, Subs, ZeroAds, Night, Cta]} capHide={(t, s) => s === 0 || s === 5} />
);
