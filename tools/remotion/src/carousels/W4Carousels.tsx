// W4 carousels: Tue "Google Maps profile checklist" (7 steps), Sat "6 questions before you hire an agency" (+ our answers, packs).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, AR, SG, HOT, AURORA, Grad, Grain, LineIcon, useFonts } from "../brand";
import { Dark, PaperStep, Header, Footer, CtaPill, PAPER, INK, SOFT, nbsp } from "./editorial";

// ---------------- Google Maps checklist ----------------
const M = "SPOTLIGHT NOTES · N°04";
const MAPS = [
  { k: "STEP 01", t: "الاسم و النشاط", s: "بحال اللي كيقلبو عليه الناس", b: "سمية المحل كيما هي فالواجهة، و الكاتيغوري الصحيحة: ريسطو، صالة، حانوت ديال الحوايج… باش تبان فالبحث الصحيح.", ic: "tag" },
  { k: "STEP 02", t: "الساعات محدثة", s: "حتى فالعطل و رمضان", b: "كليان جا و لقى المحل مسدود و Google كيقول حال؟ ما غاديش يرجع. بدل الساعات كل ما تبدلات.", ic: "clock" },
  { k: "STEP 03", t: "رقم الواتساب", s: "خلي الكليان يكونتاكطيك فثانية", b: "زيد رقم التيليفون و الواتساب و السيت إلا كان عندك. كل خطوة زايدة كتضيع ليك كليان.", ic: "chat" },
  { k: "STEP 04", t: "تصاور حقيقية", s: "الواجهة، الداخل، و المنتوج", b: "تصاور واضحين بالضو ديال النهار. الواجهة كتعاون الناس يلقاوك، و المنتوج كيعطيهم السبب باش يجيو.", ic: "camera" },
  { k: "STEP 05", t: "جاوب على التقييمات", s: "المزيانين و الخايبين", b: "شكر اللي عطاك 5 نجوم، و جاوب بهدوء على اللي ما عجبوش الحال. الكليان الجديد كيقرا الأجوبة ديالك.", ic: "star" },
  { k: "STEP 06", t: "طلب التقييم", s: "من الكليان اللي فرحان", b: "ملي كيقول ليك شكرا، صيفط ليه اللينك ديال التقييم فالواتساب. جملة وحدة، فالوقت المناسب.", ic: "heart" },
  { k: "STEP 07", t: "بوسطي فالبروفيل", s: "عرض، منتوج جديد، ولا خبر", b: "Google Business كيخليك تبوسطي بحال الإنستا. بوست صغير كل سيمانة كيبين بلي المحل حي و خدام.", ic: "sparkle" },
];
export const MAPS_SLIDES = MAPS.length + 3;

export const MapsChecklist: React.FC = () => {
  useFonts();
  const i = useCurrentFrame(); const n = MAPS_SLIDES;
  if (i === 0) return (
    <Dark series={M} i={i} n={n} swipe>
      <div dir="rtl" style={{ position: "absolute", top: 210, left: 90, right: 90, fontFamily: AR, fontWeight: 700, color: C.ink }}>
        <div style={{ fontSize: 330, lineHeight: 1, fontFamily: SG }}><Grad g={HOT}>7</Grad></div>
        <div style={{ fontSize: 84, lineHeight: 1.15, marginTop: 20, whiteSpace: "nowrap" }}>حوايج فالبروفيل ديالك</div>
        <div dir="ltr" style={{ fontSize: 110, lineHeight: 1.1, fontFamily: SG, textAlign: "right", letterSpacing: -3 }}>Google Maps</div>
        <div style={{ fontSize: 96, lineHeight: 1.15 }}>كيجيبو ليك <Grad g={AURORA}>الكليان</Grad></div>
        <div style={{ width: 180, height: 6, background: AURORA, marginTop: 50, borderRadius: 3 }} />
        <div style={{ fontSize: 44, fontWeight: 500, color: C.muted, marginTop: 30 }}>ليست بالدارجة · سيفها و دير وحدة كل نهار</div>
      </div>
    </Dark>
  );
  if (i === 1) return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Header series={M} i={i} n={n} />
      <div dir="rtl" style={{ position: "absolute", top: 210, left: 90, right: 90, fontFamily: AR, color: INK }}>
        <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 30, letterSpacing: 4 }}><Grad g={HOT}>WHY IT MATTERS</Grad></div>
        <div style={{ fontWeight: 700, fontSize: 104, lineHeight: 1.2, marginTop: 16 }}>{nbsp("الكليان كيقلب عليك قبل ما يدخل للمحل")}</div>
        <div style={{ height: 2, background: "rgba(18,16,24,.15)", margin: "44px 0 34px" }} />
        <div style={{ fontWeight: 500, fontSize: 46, lineHeight: 1.6, color: "#3b3742" }}>{nbsp("البروفيل ديالك فـ ⁨Google Maps⁩ هو الواجهة الأولى ديال المحل. إلا كان ناقص، الكليان كيمشي للي حداك. هاد 7 خطوات ما كيتطلبو حتى درهم.")}</div>
      </div>
      <div style={{ position: "absolute", bottom: 170, left: 90, display: "flex", gap: 8 }}>{[0, 1, 2, 3, 4].map((k) => <LineIcon key={k} name="star" size={56} color={C.yel} fill={C.yel} />)}</div>
      <Footer swipe /><Grain o={0.05} />
    </AbsoluteFill>
  );
  if (i === n - 1) return (
    <Dark series={M} i={i} n={n} glow="center">
      <div dir="rtl" style={{ position: "absolute", top: 230, left: 90, right: 90, textAlign: "center", fontFamily: AR, fontWeight: 700, color: C.ink }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 30px", borderRadius: 999, background: "rgba(255,255,255,.7)", fontSize: 34 }}>
          {[0, 1, 2, 3, 4].map((k) => <LineIcon key={k} name="star" size={32} color={C.yel} fill={C.yel} />)}<span dir="ltr" style={{ fontFamily: SG }}>5.0 Google</span><span>· Spotlight Adz</span>
        </div>
        <div style={{ fontSize: 96, lineHeight: 1.2, marginTop: 50 }}>بغيتي نشوفو</div>
        <div style={{ fontSize: 96, lineHeight: 1.2 }}><Grad g={AURORA}>البروفيل ديالك؟</Grad></div>
        <div style={{ marginTop: 60 }}><CtaPill>كتب <span style={{ fontFamily: SG }}>AUDIT</span> فالكومونتير</CtaPill></div>
        <div dir="ltr" style={{ fontFamily: SG, fontSize: 56, marginTop: 44 }}>+212 701 177 915</div>
        <div style={{ fontFamily: "Inter Tight", fontWeight: 500, fontSize: 34, color: C.muted, marginTop: 12 }}>spotlightadz.ma</div>
      </div>
    </Dark>
  );
  const s = MAPS[i - 2];
  return <PaperStep series={M} i={i} n={n} kicker={s.k} title={s.t} sub={s.s} body={s.b} icon={s.ic} ghost={String(i - 1).padStart(2, "0")} note="سيف البوست · صيفطو لشي واحد عندو محل" />;
};

const L: React.FC<{ children: React.ReactNode }> = ({ children }) => <span dir="ltr" style={{ display: "inline-block", fontFamily: SG, fontWeight: 700 }}>{children}</span>;

// ---------------- 6 questions before hiring an agency ----------------
const Q = "SPOTLIGHT NOTES · N°05";
const QS = [
  { k: "QUESTION 01", t: "فين هوما النتائج؟", s: "سميات، حسابات، أرقام", b: "طلب تشوف حسابات ديال كليان حقيقيين، و أرقام كتقدر تتأكد منها. الكلام بوحدو ساهل.", ic: "check" },
  { k: "QUESTION 02", t: "شحال من ريل؟", s: "فالشهر، و شكون اللي كيصورها", b: "عدد الريلز، التصوير، المونتاج و الكتابة: خاصهم يكونو مكتوبين فالعرض، ماشي فالهضرة.", ic: "camera" },
  { k: "QUESTION 03", t: "الثمن باين؟", s: "و شنو داخل فيه بالضبط", b: "ثمن واضح كل شهر، و ليست ديال شنو داخل. إلا ما بانش الثمن من اللول، غادي يبان ليك من بعد.", ic: "tag" },
  { k: "QUESTION 04", t: "واش كاين ريبورتينغ؟", s: "باش تعرف واش خدام", b: "خاصك تشوف المشاهدات، الميساجات و المتابعين الجداد كل شهر، باش تعرف فين مشات الفلوس.", ic: "list" },
  { k: "QUESTION 05", t: "شكون كيجاوب الكليان؟", s: "الميساجات هوما المبيعات", b: "المحتوى كيجيب الميساج، و الجواب السريع هو اللي كيبيع. سول شكون مسؤول على هاد الجزء.", ic: "chat" },
  { k: "QUESTION 06", t: "كتعرفو المدينة ديالي؟", s: "الدارجة، الناس، و الحومة", b: "المحتوى اللي كيبيع فمرتيل و تطوان و طنجة كيهضر بحال الناس ديالها، ماشي ترجمة من الفرنسية.", ic: "pin" },
];
export const AGENCY_SLIDES = QS.length + 4;

export const AgencyQuestions: React.FC = () => {
  useFonts();
  const i = useCurrentFrame(); const n = AGENCY_SLIDES;
  if (i === 0) return (
    <Dark series={Q} i={i} n={n} swipe>
      <div dir="rtl" style={{ position: "absolute", top: 190, left: 90, right: 90, fontFamily: AR, fontWeight: 700, color: C.ink }}>
        <div style={{ fontSize: 50, color: C.muted, fontWeight: 600 }}>قبل ما تخلص حتى درهم</div>
        <div style={{ fontSize: 330, lineHeight: 1, fontFamily: SG, marginTop: 20 }}><Grad g={HOT}>6</Grad></div>
        <div style={{ fontSize: 108, lineHeight: 1.15 }}>أسئلة سولها</div>
        <div style={{ fontSize: 108, lineHeight: 1.15 }}>لأي <Grad g={AURORA}>أجونس</Grad></div>
        <div style={{ width: 180, height: 6, background: AURORA, marginTop: 50, borderRadius: 3 }} />
        <div style={{ fontSize: 44, fontWeight: 500, color: C.muted, marginTop: 30 }}>حتى حنا · و الأجوبة ديالنا فالأخير</div>
      </div>
    </Dark>
  );
  if (i === 1) return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Header series={Q} i={i} n={n} />
      <div dir="rtl" style={{ position: "absolute", top: 210, left: 90, right: 90, fontFamily: AR, color: INK }}>
        <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 30, letterSpacing: 4 }}><Grad g={HOT}>READ THIS FIRST</Grad></div>
        <div style={{ fontWeight: 700, fontSize: 104, lineHeight: 1.2, marginTop: 16 }}>{nbsp("أجونس مزيانة كتجاوب بالأرقام، ماشي بالوعود")}</div>
        <div style={{ height: 2, background: "rgba(18,16,24,.15)", margin: "44px 0 34px" }} />
        <div style={{ fontWeight: 500, fontSize: 46, lineHeight: 1.6, color: "#3b3742" }}>{nbsp("سواء خدمتي معانا ولا مع شي واحد آخر، هاد الأسئلة كتحميك من شهور ديال الفلوس اللي ما جابت والو.")}</div>
      </div>
      <Footer swipe /><Grain o={0.05} />
    </AbsoluteFill>
  );
  if (i === n - 2) return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Header series={Q} i={i} n={n} />
      <div dir="rtl" style={{ position: "absolute", top: 170, left: 90, right: 90, fontFamily: AR, color: INK }}>
        <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 30, letterSpacing: 4 }}><Grad g={HOT}>OUR ANSWERS</Grad></div>
        <div style={{ fontWeight: 700, fontSize: 92, lineHeight: 1.15, marginTop: 10 }}>و حنا؟</div>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            ["النتائج", <><L>Happy Fitness</L> ريل وحدة جابت <L>151.2K</L> مشاهدة<br /><L>Aboujoud</L> الكليان تزادو ب<L>+400%</L></>],
            ["Basic", <><L>3,000 DH</L> فالشهر · 6 ريلز احترافية، ستوري تيلينغ، ستوريز</>],
            ["Advanced", <><L>6,000 DH</L> · 12 ريلز + ريبورتينغ + كلشي ديال <L>Basic</L></>],
            ["VIP", <><L>9,000 DH</L> · 24 ريلز + إعلانات فجميع المنصات + ستراتيجية كاملة</>],
          ].map(([k, t], idx) => (
            <div key={idx} style={{ padding: "22px 30px", borderRadius: 26, background: idx === 0 ? "#fff" : "rgba(255,255,255,.6)", border: "2px solid rgba(18,16,24,.06)" }}>
              <div style={{ fontFamily: idx === 0 ? AR : SG, fontWeight: 700, fontSize: 32 }}><Grad g={HOT}>{k}</Grad></div>
              <div style={{ fontWeight: 500, fontSize: 36, lineHeight: 1.45, marginTop: 6 }}>{t}</div>
            </div>
          ))}
        </div>
        <div style={{ fontWeight: 500, fontSize: 28, color: SOFT, marginTop: 18, display: "flex", alignItems: "center", gap: 10 }}><LineIcon name="star" size={28} color={C.yel} fill={C.yel} /><span dir="ltr" style={{ fontFamily: SG }}>5.0</span> فـ Google</div>
      </div>
      <Footer swipe /><Grain o={0.05} />
    </AbsoluteFill>
  );
  if (i === n - 1) return (
    <Dark series={Q} i={i} n={n} glow="center">
      <div dir="rtl" style={{ position: "absolute", top: 290, left: 90, right: 90, textAlign: "center", fontFamily: AR, fontWeight: 700, color: C.ink }}>
        <div style={{ fontSize: 96, lineHeight: 1.2 }}>عندك سؤال آخر؟</div>
        <div style={{ fontSize: 96, lineHeight: 1.2 }}><Grad g={AURORA}>سولنا مباشرة</Grad></div>
        <div style={{ marginTop: 70 }}><CtaPill>صيفط لينا فواتساب</CtaPill></div>
        <div dir="ltr" style={{ fontFamily: SG, fontSize: 60, marginTop: 44 }}>+212 701 177 915</div>
        <div style={{ fontFamily: "Inter Tight", fontWeight: 500, fontSize: 34, color: C.muted, marginTop: 12 }}>spotlightadz.ma</div>
        <div style={{ fontSize: 36, fontWeight: 500, color: C.muted, marginTop: 50 }}>سيف البوست · صيفطو لشريكك</div>
      </div>
    </Dark>
  );
  const s = QS[i - 2];
  return <PaperStep series={Q} i={i} n={n} kicker={s.k} title={s.t} sub={s.s} body={s.b} icon={s.ic} ghost={String(i - 1).padStart(2, "0")} note="سيف البوست · سولهم قبل ما توقع" />;
};
