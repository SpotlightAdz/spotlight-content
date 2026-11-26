// Dec W1 Thu: mistakes explainer (social media): 3 Instagram Stories mistakes that make people tap through.
// Mixed media: character hook → phone with racing story bars → paper story with tiny text + stamp → poll sticker card → 3-part story framework → character CTA.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Tag, Grad, at, useSpring, ReelShell, LineIcon, SendCta, Illustrative, FitLine, Kinetic, Phone, Num, Stamp, StoryBars, PollSticker, sec, ReelData } from "../brand";
import { Character } from "../mixed/Character";
import { Scrap, PaperDesk, INK, useStep, jitter } from "../mixed/paper";
import data from "./T3.json";
const D = data as ReelData;

const Kick: React.FC<{ n: string; label: string; y?: number }> = ({ n, label, y = 230 }) => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag p={at(f, 0, 12)}><Num n={n} label={label} /></Tag></div>;
};
const STORY_BG = ["linear-gradient(160deg,#FF8A3D,#C2185B)", "linear-gradient(160deg,#7B3CF2,#22D3EE)", "linear-gradient(160deg,#3a2d5c,#120f1d)", "linear-gradient(160deg,#FFB800,#FF3D2E)", "linear-gradient(160deg,#1f4f5c,#0d1418)"];

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const n = 8, per = 7;
  const idx = Math.min(n - 1, Math.floor(f / per)), p = (f % per) / per;
  return (
    <AbsoluteFill>
      <FitLine text="الناس كيدوزو الستوريز ديالك" y={250} max={84} width={900} />
      <div dir="rtl" style={{ position: "absolute", top: 350, left: 0, right: 0, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 170, lineHeight: 1.15 }}><Grad g={HOT}>بالزربة؟</Grad></div>
      <div style={{ position: "absolute", top: 600, left: 150, right: 150, height: 40 }}><StoryBars n={n} active={idx} p={p} top={0} inset={0} dark={false} /></div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={540} y={1330} scale={0.85} mood="tired" pose="phone" shirt={C.cya} hairStyle="cap" seed={1} />
      </svg>
      {[0, 1, 2].map((k) => {
        const q = ((f + k * 9) % 27) / 27;
        return <div key={k} style={{ position: "absolute", top: 880 - q * 120, left: 640 + k * 40, fontFamily: SG, fontWeight: 700, fontSize: 40, color: C.pink, opacity: 1 - q }}>tap</div>;
      })}
    </AbsoluteFill>
  );
};

const TooMany: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(0, 15);
  const n = 10, per = 10;
  const idx = Math.min(n - 1, Math.floor(f / per)), q = (f % per) / per;
  return (
    <AbsoluteFill>
      <Kick n="01" label="الغلطة" />
      <FitLine text="10 ستوريز… بلا قصة" y={330} max={104} width={900} p={at(f, 3, 12)} />
      <Phone x={540} y={500} w={420} p={p} tilt={-4}>
        <div style={{ position: "absolute", inset: 0, background: STORY_BG[idx % STORY_BG.length] }} />
        <StoryBars n={n} active={idx} p={q} top={70} inset={20} />
        <div dir="rtl" style={{ position: "absolute", top: 380, left: 30, right: 30, textAlign: "center", fontFamily: AR, fontWeight: 700, fontSize: 44, color: "#fff" }}>{["عرض!", "شوفو", "جديد", "بروموسيون", "شوفو هادي"][idx % 5]}</div>
        <div dir="ltr" style={{ position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center", fontFamily: SG, fontWeight: 700, fontSize: 30, color: "rgba(255,255,255,.75)" }}>{idx + 1} / 10</div>
      </Phone>
      <Illustrative y={1385} o={at(f, 14, 12)} />
    </AbsoluteFill>
  );
};

const TinyText: React.FC = () => {
  const step = useStep(3);
  const j = jitter(step, 8, 0.8);
  return (
    <PaperDesk>
      <Kick n="02" label="الغلطة" />
      <Scrap x={130 + j.dx} y={330 + j.dy} w={820} h={180} color="#FFE7A8" seed={14} rot={-2 + j.rot} tape>
        <div dir="rtl" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: AR, fontWeight: 700, fontSize: 78, color: INK }}>كتابة صغيرة بزاف</div>
      </Scrap>
      <Scrap x={290} y={590} w={500} h={760} color="#FFF8F0" seed={33} rot={2}>
        <div style={{ position: "absolute", inset: 24, borderRadius: 24, background: STORY_BG[2], overflow: "hidden" }}>
          <div dir="rtl" style={{ position: "absolute", top: 300, left: 40, right: 40, fontFamily: AR, fontWeight: 500, fontSize: 15, lineHeight: 1.5, color: "rgba(255,255,255,.75)" }}>
            مرحبا بكم عندنا عرض جديد على جميع المنتوجات ديالنا لمدة محدودة و التوصيل متوفر لجميع المدن و الخلاص عند الاستلام و للمزيد من المعلومات تواصلو معنا فالخاص و لا تنسو تتابعونا
          </div>
        </div>
      </Scrap>
      <Stamp p={useSpring(sec(1.2), 10)} y={1030} rot={-10} size={100}>ما كيتقراش</Stamp>
    </PaperDesk>
  );
};

const Ask: React.FC = () => {
  const f = useCurrentFrame();
  const p = useSpring(4, 14);
  const vote = at(f, sec(2.2), 30);
  return (
    <AbsoluteFill>
      <Kick n="03" label="الغلطة" />
      <FitLine text="ما كتسولش" y={330} max={130} width={860} p={at(f, 3, 12)} />
      <div style={{ position: "absolute", top: 520, left: 250, width: 580, height: 840, borderRadius: 44, background: STORY_BG[0], boxShadow: "0 40px 90px rgba(90,50,40,.3)", opacity: p, transform: `rotate(-2deg) translateY(${(1 - p) * 80}px)`, overflow: "hidden" }}>
        <StoryBars n={3} active={1} p={0.4 + 0.5 * at(f, 0, 120)} top={30} inset={24} />
        <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <PollSticker q="شمن لون بغيتي؟" a="الكحل" b="البيج" p={at(f, sec(0.8), 14)} vote={vote} pa={0.64} w={440} />
        </div>
        <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18 }}>
          {["chat", "heart", "send"].map((n, i) => <div key={n} style={{ width: 84, height: 84, borderRadius: 42, background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", opacity: at(f, sec(2.6) + i * 5, 10) }}><LineIcon name={n} size={42} color="#fff" sw={2.2} /></div>)}
        </div>
      </div>
      <Illustrative y={1385} o={at(f, 14, 12)} />
    </AbsoluteFill>
  );
};

const PARTS: [string, string, string][] = [["1", "بداية", "سؤال ولا مشكل"], ["2", "وسط", "الحل ولا المنتوج"], ["3", "طلب واحد", "صيفط · جاوب · شري"]];
const Frame: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <FitLine text="الستوري المزيانة" y={240} max={120} width={880} p={at(f, 2, 12)} />
      <div style={{ position: "absolute", top: 420, left: 170, right: 170, height: 30 }}><StoryBars n={3} active={Math.min(2, Math.floor(f / 40))} p={(f % 40) / 40} top={0} inset={0} dark={false} /></div>
      <div dir="rtl" style={{ position: "absolute", top: 500, left: 90, right: 90, display: "flex", flexDirection: "column", gap: 26 }}>
        {PARTS.map(([n, t, s], i) => {
          const q = at(f, 8 + i * sec(1.0), 14);
          const on = f >= 8 + i * sec(1.0);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, padding: "30px 36px", borderRadius: 34, background: on ? "rgba(255,255,255,.85)" : "rgba(255,255,255,.4)",
              boxShadow: "0 20px 50px rgba(90,50,40,.12)", opacity: q, transform: `translateX(${(1 - q) * -60}px)` }}>
              <div style={{ width: 110, height: 110, borderRadius: 28, background: AURORA, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SG, fontWeight: 700, fontSize: 64, color: "#fff", flexShrink: 0 }}>{n}</div>
              <div>
                <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 64, color: C.ink, lineHeight: 1.2 }}>{t}</div>
                <div style={{ fontFamily: AR, fontWeight: 600, fontSize: 36, color: C.muted }}>{s}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Kinetic words={["صيفطها", "لشي", "واحد"]} start={2} step={4} y={250} size={100} />
      <FitLine text="كيدير ستوريز كل نهار" y={400} max={96} width={860} grad={HOT} p={at(f, 10, 12)} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <Character x={540} y={1330} scale={0.72} mood="happy" pose="wave" shirt={C.pink} seed={4} />
      </svg>
      <SendCta p={at(f, sec(0.7), 16)} to="ليه دابا" y={620} />
    </AbsoluteFill>
  );
};

export const StoryMistakes: React.FC = () => (
  <ReelShell data={D} audio="vo/T3_mix.wav" scenes={[Hook, TooMany, TinyText, Ask, Frame, Cta]} capHide={(t, s) => s === 0 || s === 5} />
);
