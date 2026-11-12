// W3 carousels: Tue "caption that sells" formula, Sat "which pack fits you" quiz.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Grad, Grain, LineIcon, useFonts } from "../brand";
import { Dark, PaperStep, Header, Footer, CtaPill, PAPER, INK, SOFT, nbsp } from "./editorial";

// ---------------- Caption formula ----------------
const S1 = "SPOTLIGHT NOTES · N°03";
const STEPS = [
  { k: "STEP 01", t: "السطر اللول", s: "هو اللي كيبان قبل ما يكليكي", b: "جملة وحدة كتوقف القارئ: سؤال، رقم، ولا مشكل كيعرفو. إلا ما خدمش السطر اللول، الباقي ما غاديش يتقرا.", ic: "type" },
  { k: "STEP 02", t: "المشكل ديالو", s: "هضر على الكليان، ماشي عليك", b: "بدل ما تقول حنا أحسن محل، قول شنو كيعاني منو الكليان، و كيفاش كتحلها ليه بالضبط.", ic: "users" },
  { k: "STEP 03", t: "الدليل", s: "رقم، صورة، ولا كلام ديال كليان", b: "جملة وحدة ديال دليل حقيقي كتسوا أكثر من عشرة ديال الوعود. كون دقيق، و ما تزيدش فالكلام.", ic: "check" },
  { k: "STEP 04", t: "طلب واحد", s: "قول ليه شنو يدير دابا", b: "صيفط لينا فواتساب، ولا كتب كلمة فالكومونتير. طلب واحد واضح، ماشي جوج ولا تلاتة.", ic: "chat" },
  { k: "STEP 05", t: "هاشتاغات محلية", s: "المدينة ديالك قبل كلشي", b: "خلط العربية و اللاتينية، و زيد المدينة ديالك. الناس القراب منك هوما اللي غادي يشريو.", ic: "pin" },
];
export const CAPTION_SLIDES = STEPS.length + 3;

export const CaptionFormula: React.FC = () => {
  useFonts();
  const i = useCurrentFrame(); const n = CAPTION_SLIDES;
  if (i === 0) return (
    <Dark series={S1} i={i} n={n} swipe>
      <div dir="rtl" style={{ position: "absolute", top: 190, left: 90, right: 90, fontFamily: AR, fontWeight: 700, color: C.ink }}>
        <div style={{ fontSize: 50, color: C.muted, fontWeight: 600 }}>قبل ما تكتب الكابشن الجاي</div>
        <div style={{ fontSize: 330, lineHeight: 1, fontFamily: SG, marginTop: 20 }}><Grad g={HOT}>5</Grad></div>
        <div style={{ fontSize: 112, lineHeight: 1.15 }}>خطوات لكابشن</div>
        <div style={{ fontSize: 112, lineHeight: 1.15 }}><Grad g={AURORA}>كيبيع</Grad></div>
        <div style={{ width: 180, height: 6, background: AURORA, marginTop: 50, borderRadius: 3 }} />
        <div style={{ fontSize: 44, fontWeight: 500, color: C.muted, marginTop: 30 }}>فورمولا بالدارجة · سيفها لملي تبوسطي</div>
      </div>
    </Dark>
  );
  if (i === n - 2) return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Header series={S1} i={i} n={n} />
      <div dir="rtl" style={{ position: "absolute", top: 170, left: 90, right: 90, fontFamily: AR, color: INK }}>
        <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 30, letterSpacing: 4 }}><Grad g={HOT}>EXAMPLE</Grad></div>
        <div style={{ fontWeight: 700, fontSize: 92, lineHeight: 1.15, marginTop: 10 }}>قبل و من بعد</div>
        <div style={{ marginTop: 40, padding: "30px 36px", borderRadius: 28, background: "#E6DED3", position: "relative" }}>
          <div style={{ fontWeight: 700, fontSize: 30, color: "#B23A2E" }}>قبل</div>
          <div style={{ fontWeight: 500, fontSize: 42, lineHeight: 1.5, color: "#5a5560", marginTop: 8, textDecoration: "line-through", textDecorationColor: "rgba(178,58,46,.6)" }}>عرض خاص!!! تواصلو معنا فالخاص</div>
        </div>
        <div style={{ marginTop: 26, padding: "30px 36px", borderRadius: 28, background: "#fff", boxShadow: "0 30px 60px rgba(18,16,24,.08)", border: "2px solid rgba(18,16,24,.06)" }}>
          <div style={{ fontWeight: 700, fontSize: 30, color: "#1f8a4c" }}>من بعد</div>
          {[
            ["01", "كيسولوك على الثمن فالخاص و كيمشيو؟"],
            ["02", "الثمن دابا باين: 199 درهم، و التوصيل لتطوان."],
            ["03", "تقييم 5 نجوم من الكليان ديالنا."],
            ["04", "كتب بغيت فالكومونتير و نصيفطو ليك الكاتالوغ."],
            ["05", "#تطوان #مرتيل"],
          ].map(([k, t]) => (
            <div key={k} style={{ display: "flex", gap: 18, alignItems: "baseline", marginTop: 14 }}>
              <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 26 }}><Grad g={HOT}>{k}</Grad></span>
              <span style={{ fontWeight: 500, fontSize: 38, lineHeight: 1.45, color: INK }}>{t}{k === "05" && <span dir="ltr" style={{ fontFamily: SG, display: "inline-block", marginRight: 14 }}>#Tetouan</span>}</span>
            </div>
          ))}
        </div>
        <div style={{ fontWeight: 500, fontSize: 26, color: SOFT, marginTop: 22 }}>مثال توضيحي · الأرقام ديال المثال ماشي حقيقية</div>
      </div>
      <Footer swipe /><Grain o={0.05} />
    </AbsoluteFill>
  );
  if (i === n - 1) return (
    <Dark series={S1} i={i} n={n} glow="center">
      <div dir="rtl" style={{ position: "absolute", top: 290, left: 90, right: 90, textAlign: "center", fontFamily: AR, fontWeight: 700, color: C.ink }}>
        <div style={{ fontSize: 100, lineHeight: 1.2 }}>بغيتي نكتبو ليك</div>
        <div style={{ fontSize: 100, lineHeight: 1.2 }}><Grad g={AURORA}>الكابشنات؟</Grad></div>
        <div style={{ marginTop: 70 }}><CtaPill>كتب <span style={{ fontFamily: SG }}>AUDIT</span> فالكومونتير</CtaPill></div>
        <div style={{ fontSize: 40, fontWeight: 500, color: C.muted, marginTop: 40 }}>و نشوفو الكابشنات ديالك</div>
        <div dir="ltr" style={{ fontFamily: SG, fontSize: 58, marginTop: 40 }}>+212 701 177 915</div>
      </div>
    </Dark>
  );
  const it = STEPS[i - 1];
  return <PaperStep series={S1} i={i} n={n} kicker={it.k} title={it.t} sub={it.s} body={it.b} icon={it.ic} />;
};

// ---------------- Which pack fits you ----------------
const S2 = "SPOTLIGHT PACKS · 2026";
const QS = [
  { q: "شحال من ريل خاصك فالشهر؟", o: [["6", "Basic"], ["12", "Advanced"], ["24", "VIP"]] },
  { q: "بغيتي تعرف الأرقام كل شهر؟", o: [["غير المحتوى", "Basic"], ["إيه، ريبورتينغ", "Advanced"]] },
  { q: "بغيتي إعلانات و ستراتيجية كاملة؟", o: [["ماشي دابا", "Basic / Advanced"], ["إيه، فجميع المنصات", "VIP"]] },
];
const PACKS = [
  { n: "Basic", p: "3,000", f: ["6 ريلز احترافية", "ستوري تيلينغ", "ستوريز"], w: "إلا بغيتي حضور منظم و احترافي" },
  { n: "Advanced", p: "6,000", f: ["12 ريلز", "ريبورتينغ", "كلشي ديال Basic"], w: "إلا بغيتي تكبر و تتبع الأرقام" },
  { n: "VIP", p: "9,000", f: ["24 ريلز", "إعلانات فجميع المنصات", "ستراتيجية كاملة", "كلشي ديال Advanced"], w: "إلا بغيتي تكبر بسرعة" },
];
export const PACK_SLIDES = 1 + QS.length + PACKS.length + 1;

const LatinIn: React.FC<{ t: string }> = ({ t }) => /[A-Za-z0-9]/.test(t[0]) ? <span dir="ltr" style={{ fontFamily: SG }}>{t}</span> : <>{t}</>;

export const PackQuiz: React.FC = () => {
  useFonts();
  const i = useCurrentFrame(); const n = PACK_SLIDES;
  if (i === 0) return (
    <Dark series={S2} i={i} n={n} swipe>
      <div dir="rtl" style={{ position: "absolute", top: 220, left: 90, right: 90, fontFamily: AR, fontWeight: 700, color: C.ink }}>
        <div dir="ltr" style={{ fontFamily: SG, fontSize: 56, color: C.muted, fontWeight: 500, textAlign: "right" }}>Basic · Advanced · VIP</div>
        <div style={{ fontSize: 400, lineHeight: 1, fontFamily: SG, marginTop: 20 }}><Grad g={HOT}>3</Grad></div>
        <div style={{ fontSize: 120, lineHeight: 1.15 }}>أسئلة و تعرف</div>
        <div style={{ fontSize: 120, lineHeight: 1.15 }}><Grad g={AURORA}>شمن باك ليك</Grad></div>
        <div style={{ width: 180, height: 6, background: AURORA, marginTop: 50, borderRadius: 3 }} />
        <div style={{ fontSize: 44, fontWeight: 500, color: C.muted, marginTop: 30 }}>باكات السوشيال ميديا · الثمن بالواضح</div>
      </div>
    </Dark>
  );
  if (i <= QS.length) {
    const q = QS[i - 1];
    return (
      <AbsoluteFill style={{ background: PAPER }}>
        <Header series={S2} i={i} n={n} />
        <div style={{ position: "absolute", top: 120, left: 60, fontFamily: SG, fontWeight: 700, fontSize: 420, lineHeight: 1, WebkitTextStroke: `3px ${INK}`, color: "transparent", opacity: 0.12 }}>Q{i}</div>
        <div dir="rtl" style={{ position: "absolute", top: 470, left: 90, right: 90, fontFamily: AR, color: INK }}>
          <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 30, letterSpacing: 4 }}><Grad g={HOT}>QUESTION 0{i}</Grad></div>
          <div style={{ fontWeight: 700, fontSize: 92, lineHeight: 1.2, marginTop: 16 }}>{nbsp(q.q)}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 50 }}>
            {q.o.map(([a, r], k) => (
              <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "30px 36px", borderRadius: 28, background: "#fff", boxShadow: "0 20px 50px rgba(18,16,24,.07)" }}>
                <span style={{ fontWeight: 700, fontSize: 52 }}><LatinIn t={a} /></span>
                <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <svg width="40" height="24" viewBox="0 0 40 24"><path d="M38 12H4M14 2 4 12l10 10" stroke={SOFT} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 44 }}><Grad g={HOT}>{r}</Grad></span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <Footer swipe /><Grain o={0.05} />
      </AbsoluteFill>
    );
  }
  if (i <= QS.length + PACKS.length) {
    const k = i - QS.length - 1; const pk = PACKS[k]; const vip = pk.n === "VIP";
    const dark = vip;
    const ink = dark ? C.ink : INK, soft = dark ? C.muted : SOFT;
    const body = (
      <>
        <div style={{ position: "absolute", top: 180, left: 90, right: 90, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 30, letterSpacing: 4 }}><Grad g={HOT}>PACK 0{k + 1}</Grad></span>
          {vip && <span dir="rtl" style={{ padding: "8px 22px", borderRadius: 99, background: AURORA, fontFamily: AR, fontWeight: 700, fontSize: 28, color: "#fff" }}>الأكمل</span>}
        </div>
        <div dir="ltr" style={{ position: "absolute", top: 240, left: 90, right: 90, fontFamily: SG, fontWeight: 700, fontSize: 170, color: ink, letterSpacing: -6 }}>{pk.n}</div>
        <div dir="rtl" style={{ position: "absolute", top: 450, left: 90, right: 90, display: "flex", alignItems: "baseline", gap: 20, color: ink }}>
          <span dir="ltr" style={{ fontFamily: SG, fontWeight: 700, fontSize: 130 }}><Grad g={HOT}>{pk.p}</Grad></span>
          <span style={{ fontFamily: AR, fontWeight: 600, fontSize: 46, color: soft }}>درهم / الشهر</span>
        </div>
        <div style={{ position: "absolute", top: 660, left: 90, right: 90, height: 2, background: dark ? C.line : "rgba(18,16,24,.15)" }} />
        <div dir="rtl" style={{ position: "absolute", top: 700, left: 90, right: 90, display: "flex", flexDirection: "column", gap: 22 }}>
          {pk.f.map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: AR, fontWeight: 600, fontSize: 50, color: ink }}>
              <span style={{ width: 52, height: 52, borderRadius: 99, background: AURORA, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><LineIcon name="check" size={32} sw={3} /></span>
              {t.split(" ").map((w, j) => <span key={j}><LatinIn t={w} /></span>)}
            </div>
          ))}
        </div>
        <div dir="rtl" style={{ position: "absolute", bottom: 160, left: 90, right: 90, fontFamily: AR, fontWeight: 600, fontSize: 40, color: soft }}>
          <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 99, background: AURORA, marginLeft: 16 }} />{nbsp(pk.w)}
        </div>
      </>
    );
    return dark
      ? <Dark series={S2} i={i} n={n} glow="center" swipe>{body}</Dark>
      : <AbsoluteFill style={{ background: PAPER }}><Header series={S2} i={i} n={n} />{body}<Footer swipe /><Grain o={0.05} /></AbsoluteFill>;
  }
  return (
    <Dark series={S2} i={i} n={n} glow="center">
      <div dir="rtl" style={{ position: "absolute", top: 290, left: 90, right: 90, textAlign: "center", fontFamily: AR, fontWeight: 700, color: C.ink }}>
        <div style={{ fontSize: 96, lineHeight: 1.2 }}>مازال ما عرفتيش؟</div>
        <div style={{ fontSize: 96, lineHeight: 1.2 }}><Grad g={AURORA}>نختارو معاك</Grad></div>
        <div style={{ marginTop: 70 }}><CtaPill>صيفط <span style={{ fontFamily: SG }}>PACK</span> فواتساب</CtaPill></div>
        <div dir="ltr" style={{ fontFamily: SG, fontSize: 64, marginTop: 50 }}>+212 701 177 915</div>
        <div style={{ fontFamily: "Inter Tight", fontWeight: 500, fontSize: 38, color: C.muted, marginTop: 16 }}>spotlightadz.ma</div>
      </div>
    </Dark>
  );
};
