// Dec W1 carousels: Tue "7 WhatsApp Business settings to set today" (value), Sat "Caftan Zouhair: one system" (case study).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Grad, Grain, LineIcon, useFonts } from "../brand";
import { Dark, PaperStep, Header, Footer, CtaPill, PAPER, INK, SOFT, nbsp } from "./editorial";

const L: React.FC<{ children: React.ReactNode }> = ({ children }) => <span dir="ltr" style={{ display: "inline-block", fontFamily: SG, fontWeight: 700 }}>{children}</span>;

// ---------------- WhatsApp Business: 7 settings ----------------
const W = "SPOTLIGHT NOTES · N°06";
const WA = [
  { k: "SETTING 01", t: "البروفيل كامل", s: "الساعات، العنوان و اللوكاسيون", b: "عمر الوصف، ساعات الخدمة، العنوان و اللوكاسيون. الكليان كيعرف فين و إمتى، بلا ما يسول.", ic: "pin" },
  { k: "SETTING 02", t: "الكاتالوغ", s: "المنتوجات بالتصاور و الثمن", b: "الكليان كيشوف و كيختار بوحدو، و نتا كتصيفط لينك واحد بلاصة عشرين تصويرة.", ic: "grid" },
  { k: "SETTING 03", t: "ميساج الترحيب", s: "أول جواب كيمشي بوحدو", b: "ملي كيكتب ليك شي واحد لأول مرة، كيوصلو سلام، شنو كتبيع، و فين يلقى الكاتالوغ.", ic: "chat" },
  { k: "SETTING 04", t: "ميساج الغياب", s: "ملي يكون المحل مسدود", b: "فالليل ولا نهار العطلة، الكليان كيعرف إمتى غادي تجاوبو. ما كيبقاش يتسنى حتى يمشي.", ic: "moon" },
  { k: "SETTING 05", t: "الأجوبة السريعة", s: "للأسئلة اللي كتعاود كل نهار", b: "الثمن، التوصيل، الخلاص… كتب الجواب مرة وحدة، و صيفطو فثانية فكل محادثة.", ic: "bolt" },
  { k: "SETTING 06", t: "الليبلات", s: "جديد · كوموند · خلص", b: "رتب المحادثات بالألوان، باش ما يضيع حتى كليان و تعرف شكون خاصك تعاود معاه.", ic: "tag" },
  { k: "SETTING 07", t: "اللينك القصير", s: "فالبيو، الستوري و الكارطة", b: "اللينك ديال الواتساب ديالك كيحل المحادثة بضغطة وحدة. حطو فكل بلاصة كيشوفك فيها الكليان.", ic: "send" },
];
export const WA_SLIDES = WA.length + 3;

export const WaSettings: React.FC = () => {
  useFonts();
  const i = useCurrentFrame(); const n = WA_SLIDES;
  if (i === 0) return (
    <Dark series={W} i={i} n={n} swipe>
      <div dir="rtl" style={{ position: "absolute", top: 200, left: 90, right: 90, fontFamily: AR, fontWeight: 700, color: C.ink }}>
        <div style={{ fontSize: 330, lineHeight: 1, fontFamily: SG }}><Grad g={HOT}>7</Grad></div>
        <div style={{ fontSize: 88, lineHeight: 1.15, marginTop: 20 }}>حوايج دير فـ</div>
        <div dir="ltr" style={{ fontSize: 104, lineHeight: 1.1, fontFamily: SG, textAlign: "right", letterSpacing: -3 }}>WhatsApp Business</div>
        <div style={{ fontSize: 100, lineHeight: 1.15 }}><Grad g={AURORA}>اليوم</Grad></div>
        <div style={{ width: 180, height: 6, background: AURORA, marginTop: 50, borderRadius: 3 }} />
        <div style={{ fontSize: 44, fontWeight: 500, color: C.muted, marginTop: 30 }}>إعدادات فابور · كيخدمو عليك كل نهار</div>
      </div>
      <div style={{ position: "absolute", top: 260, left: 90, width: 170, height: 170, borderRadius: 46, background: C.waDeep, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-8deg)", boxShadow: "0 30px 70px rgba(14,122,67,.35)" }}>
        <LineIcon name="chat" size={100} color="#fff" sw={2.2} />
      </div>
    </Dark>
  );
  if (i === 1) return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Header series={W} i={i} n={n} />
      <div dir="rtl" style={{ position: "absolute", top: 210, left: 90, right: 90, fontFamily: AR, color: INK }}>
        <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 30, letterSpacing: 4 }}><Grad g={HOT}>WHY IT MATTERS</Grad></div>
        <div style={{ fontWeight: 700, fontSize: 108, lineHeight: 1.2, marginTop: 16 }}>{nbsp("الكليان كيصيفط… و كيتسنى")}</div>
        <div style={{ height: 2, background: "rgba(18,16,24,.15)", margin: "44px 0 34px" }} />
        <div style={{ fontWeight: 500, fontSize: 46, lineHeight: 1.6, color: "#3b3742" }}>{nbsp("بزاف ديال البيع كيبدا بميساج فالواتساب. إلا تعطل الجواب ولا ما لقاش المعلومة، كيمشي عند اللي حداك. هاد 7 إعدادات ما كيتطلبو حتى درهم.")}</div>
      </div>
      <div style={{ position: "absolute", bottom: 170, left: 90, display: "flex", gap: 14 }}>
        {[0, 1, 2].map((k) => <div key={k} style={{ width: 60, height: 60, borderRadius: 30, background: k === 2 ? C.waDeep : "rgba(18,16,24,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}><LineIcon name="chat" size={32} color={k === 2 ? "#fff" : SOFT} /></div>)}
      </div>
      <Footer swipe /><Grain o={0.05} />
    </AbsoluteFill>
  );
  if (i === n - 1) return (
    <Dark series={W} i={i} n={n} glow="center">
      <div dir="rtl" style={{ position: "absolute", top: 230, left: 90, right: 90, textAlign: "center", fontFamily: AR, fontWeight: 700, color: C.ink }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 30px", borderRadius: 999, background: "rgba(255,255,255,.7)", fontSize: 34 }}><LineIcon name="save" size={32} color={C.pink} />سيف البوست و دير وحدة كل نهار</div>
        <div style={{ fontSize: 92, lineHeight: 1.2, marginTop: 50 }}>بغيتي الواتساب ديالك</div>
        <div style={{ fontSize: 92, lineHeight: 1.2 }}><Grad g={AURORA}>يبيع بلاصتك؟</Grad></div>
        <div style={{ marginTop: 60 }}><CtaPill>صيفط لينا فواتساب</CtaPill></div>
        <div dir="ltr" style={{ fontFamily: SG, fontSize: 56, marginTop: 44 }}>+212 701 177 915</div>
        <div style={{ fontFamily: "Inter Tight", fontWeight: 500, fontSize: 34, color: C.muted, marginTop: 12 }}>spotlightadz.ma</div>
      </div>
    </Dark>
  );
  const s = WA[i - 2];
  return <PaperStep series={W} i={i} n={n} kicker={s.k} title={s.t} sub={s.s} body={s.b} icon={s.ic} ghost={String(i - 1).padStart(2, "0")} note="سيف البوست · صيفطو لشي واحد عندو حانوت" />;
};

// ---------------- Caftan Zouhair: one system ----------------
const Z = "SPOTLIGHT CASE · N°07";
const MODS = [
  { k: "MODULE 01", t: "الإنتاج", s: "كل كوموند، مرحلة بمرحلة", b: "الإنتاج ديال كل قطعة باين للفريق، بلا كناش و بلا ما تعاود تسول شكون فين وصل.", ic: "layers" },
  { k: "MODULE 02", t: "الكاسة", s: "POS · البيع فالمحل", b: "كل بيعة فالمحل كتتسجل فنفس البلاصة اللي فيها الإنتاج و البيع أونلاين.", ic: "card" },
  { k: "MODULE 03", t: "المتجر الإلكتروني", s: "البيع من التيليفون", b: "الكليان كيشوف الموديلات و كيكوموندي أونلاين، و الكوموند كتدخل نيشان للسيستام.", ic: "store" },
  { k: "MODULE 04", t: "داشبورد الطلبات", s: "كلشي فشاشة وحدة", b: "الكوموندات ديال المحل و الأونلاين فبلاصة وحدة: شنو جديد، شنو فالخدمة، و شنو تسلم.", ic: "chart" },
];
export const CAFTAN_SLIDES = MODS.length + 4;

const Module: React.FC<{ ic: string; t: string; on: boolean }> = ({ ic, t, on }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 28px", borderRadius: 26, background: on ? "#fff" : "rgba(255,255,255,.5)", boxShadow: on ? "0 16px 40px rgba(90,50,40,.12)" : "none" }}>
    <div style={{ width: 70, height: 70, borderRadius: 20, background: on ? AURORA : "rgba(18,16,24,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}><LineIcon name={ic} size={40} color={on ? "#fff" : SOFT} /></div>
    <span style={{ fontFamily: AR, fontWeight: 700, fontSize: 44, color: INK }}>{t}</span>
  </div>
);

export const CaftanCase: React.FC = () => {
  useFonts();
  const i = useCurrentFrame(); const n = CAFTAN_SLIDES;
  if (i === 0) return (
    <Dark series={Z} i={i} n={n} swipe>
      <div dir="rtl" style={{ position: "absolute", top: 200, left: 90, right: 90, fontFamily: AR, fontWeight: 700, color: C.ink }}>
        <div style={{ fontSize: 40, fontWeight: 600, color: C.muted }}>قصة كليان</div>
        <div dir="ltr" style={{ fontSize: 120, lineHeight: 1.05, fontFamily: SG, textAlign: "right", letterSpacing: -4, marginTop: 10 }}>Caftan Zouhair</div>
        <div style={{ fontSize: 96, lineHeight: 1.2, marginTop: 40 }}>من الكناش…</div>
        <div style={{ fontSize: 110, lineHeight: 1.2 }}>لـ<Grad g={AURORA}>سيستام واحد</Grad></div>
        <div style={{ width: 180, height: 6, background: AURORA, marginTop: 50, borderRadius: 3 }} />
        <div style={{ fontSize: 44, fontWeight: 500, color: C.muted, marginTop: 30 }}>الإنتاج · الكاسة · المتجر · الطلبات</div>
      </div>
    </Dark>
  );
  if (i === 1) return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Header series={Z} i={i} n={n} />
      <div dir="rtl" style={{ position: "absolute", top: 200, left: 90, right: 90, fontFamily: AR, color: INK }}>
        <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 30, letterSpacing: 4 }}><Grad g={HOT}>THE PROBLEM</Grad></div>
        <div style={{ fontWeight: 700, fontSize: 84, lineHeight: 1.25, marginTop: 16 }}>{nbsp("الإنتاج فكناش، الكاسة فكناش، و الطلبات فالواتساب؟")}</div>
        <div style={{ fontWeight: 500, fontSize: 44, lineHeight: 1.55, color: "#3b3742", marginTop: 30 }}>{nbsp("ربعة ديال الخدمات، و كل وحدة فبلاصة. Caftan Zouhair دابا خدام بسيستام واحد فيه كلشي.")}</div>
      </div>
      <div dir="rtl" style={{ position: "absolute", top: 830, left: 90, right: 90, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {MODS.map((m) => <Module key={m.k} ic={m.ic} t={m.t} on />)}
      </div>
      <Footer swipe /><Grain o={0.05} />
    </AbsoluteFill>
  );
  if (i === n - 2) return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Header series={Z} i={i} n={n} />
      <div dir="rtl" style={{ position: "absolute", top: 240, left: 90, right: 90, fontFamily: AR, color: INK }}>
        <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 30, letterSpacing: 4 }}><Grad g={HOT}>THE LESSON</Grad></div>
        <div style={{ fontWeight: 700, fontSize: 100, lineHeight: 1.2, marginTop: 16 }}>السيستام كيتبنى</div>
        <div style={{ fontWeight: 700, fontSize: 100, lineHeight: 1.2 }}><Grad g={HOT}>على قياسك</Grad></div>
        <div style={{ height: 2, background: "rgba(18,16,24,.15)", margin: "44px 0 34px" }} />
        <div style={{ fontWeight: 500, fontSize: 46, lineHeight: 1.6, color: "#3b3742" }}>{nbsp("كل بيزنس عندو الطريقة ديالو فالخدمة. السيستام المزيان كيتبع الطريقة ديالك، ماشي نتا اللي كتبدل الخدمة باش تبع البرنامج.")}</div>
      </div>
      <div style={{ position: "absolute", bottom: 160, left: 90, right: 90, fontFamily: AR, fontWeight: 600, fontSize: 30, color: SOFT, textAlign: "right" }}>الواجهات فهاد البوست: مثال توضيحي</div>
      <Footer swipe /><Grain o={0.05} />
    </AbsoluteFill>
  );
  if (i === n - 1) return (
    <Dark series={Z} i={i} n={n} glow="center">
      <div dir="rtl" style={{ position: "absolute", top: 230, left: 90, right: 90, textAlign: "center", fontFamily: AR, fontWeight: 700, color: C.ink }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 30px", borderRadius: 999, background: "rgba(255,255,255,.7)", fontSize: 34 }}>
          {[0, 1, 2, 3, 4].map((k) => <LineIcon key={k} name="star" size={32} color={C.yel} fill={C.yel} />)}<L>5.0 Google</L><span>· Spotlight Adz</span>
        </div>
        <div style={{ fontSize: 96, lineHeight: 1.2, marginTop: 50 }}>بغيتي سيستام</div>
        <div style={{ fontSize: 96, lineHeight: 1.2 }}><Grad g={AURORA}>على قياسك؟</Grad></div>
        <div style={{ marginTop: 60 }}><CtaPill>كتب <span style={{ fontFamily: SG }}>SPOT</span> فالكومونتير</CtaPill></div>
        <div dir="ltr" style={{ fontFamily: SG, fontSize: 56, marginTop: 44 }}>+212 701 177 915</div>
        <div style={{ fontFamily: "Inter Tight", fontWeight: 500, fontSize: 34, color: C.muted, marginTop: 12 }}>spotlightadz.ma</div>
      </div>
    </Dark>
  );
  const s = MODS[i - 2];
  return <PaperStep series={Z} i={i} n={n} kicker={s.k} title={s.t} sub={s.s} body={s.b} icon={s.ic} ghost={String(i - 1).padStart(2, "0")} note="Caftan Zouhair · سيستام واحد" />;
};
