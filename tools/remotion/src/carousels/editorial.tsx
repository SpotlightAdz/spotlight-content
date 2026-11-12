// Shared editorial carousel kit (1080x1350): dark cover/CTA, paper inner slides, header with series + page, footer handle.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, AR, SG, HOT, AURORA, Grad, Grain, LineIcon } from "../brand";

// keep a lone "و" glued to the next word so it never ends a line
export const nbsp = (t: string) => t.replace(/(^|\s)و\s/g, "$1و\u00A0");

export const PAPER = "#F3EEE7", INK = "#121018", SOFT = "#6E6A75";

export const Header: React.FC<{ series: string; i: number; n: number; dark?: boolean }> = ({ series, i, n, dark }) => (
  <div style={{ position: "absolute", top: 72, left: 90, right: 90, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: SG, fontWeight: 500, fontSize: 26, letterSpacing: 3, color: dark ? C.muted : SOFT }}>
    <span>{series}</span><span>{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
  </div>
);
export const Footer: React.FC<{ dark?: boolean; swipe?: boolean }> = ({ dark, swipe }) => (
  <div style={{ position: "absolute", bottom: 70, left: 90, right: 90, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <Img src={staticFile("logo.webp")} style={{ width: 44, height: 44 }} />
      <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 28, color: dark ? C.ink : INK }}>@spotlightadzagency</span>
    </div>
    {swipe && <svg width="70" height="30" viewBox="0 0 70 30"><path d="M68 15H4M16 3 4 15l12 12" stroke={dark ? C.ink : INK} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
  </div>
);

// Dark slide with aurora light. glow: "cover" (corners) or "center".
export const Dark: React.FC<{ series: string; i: number; n: number; glow?: "cover" | "center"; swipe?: boolean; children: React.ReactNode }> = ({ series, i, n, glow = "cover", swipe, children }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <div style={{ position: "absolute", inset: 0, background: glow === "cover"
      ? "radial-gradient(50% 40% at 85% 15%, rgba(255,61,46,.45), transparent 70%), radial-gradient(50% 40% at 10% 95%, rgba(123,60,242,.5), transparent 70%)"
      : "radial-gradient(60% 45% at 50% 40%, rgba(255,45,122,.35), transparent 70%)" }} />
    <Header series={series} i={i} n={n} dark />
    {children}
    <Footer dark swipe={swipe} /><Grain o={0.08} />
  </AbsoluteFill>
);

// Paper editorial slide: ghost number, kicker, headline, gradient sub, rule, body, line icon.
export const PaperStep: React.FC<{ series: string; i: number; n: number; kicker: string; title: string; sub: string; body: string; icon: string; note?: string }> =
  ({ series, i, n, kicker, title, sub, body, icon, note = "سيف البوست · صيفطو لشي صاحب عندو بيزنس" }) => (
    <AbsoluteFill style={{ background: PAPER }}>
      <Header series={series} i={i} n={n} />
      <div style={{ position: "absolute", top: 120, left: 60, fontFamily: SG, fontWeight: 700, fontSize: 420, lineHeight: 1, WebkitTextStroke: `3px ${INK}`, color: "transparent", opacity: 0.12 }}>{String(i).padStart(2, "0")}</div>
      <div style={{ position: "absolute", top: 190, right: 90 }}><LineIcon name={icon} size={230} color={INK} sw={0.9} /></div>
      <div dir="rtl" style={{ position: "absolute", top: 520, left: 90, right: 90, fontFamily: AR, color: INK }}>
        <div style={{ fontFamily: SG, fontWeight: 700, fontSize: 30, letterSpacing: 4 }}><Grad g={HOT}>{kicker}</Grad></div>
        <div style={{ fontWeight: 700, fontSize: 112, lineHeight: 1.15, marginTop: 14 }}>{title}</div>
        <div style={{ fontWeight: 600, fontSize: 50, lineHeight: 1.3, marginTop: 10 }}><Grad g={HOT}>{sub}</Grad></div>
        <div style={{ height: 2, background: "rgba(18,16,24,.15)", margin: "40px 0 32px" }} />
        <div style={{ fontWeight: 500, fontSize: 44, lineHeight: 1.6, color: "#3b3742" }}>{nbsp(body)}</div>
      </div>
      <div dir="rtl" style={{ position: "absolute", bottom: 150, left: 90, right: 90, display: "flex", alignItems: "center", gap: 16, fontFamily: AR, fontWeight: 600, fontSize: 32, color: SOFT }}>
        <span style={{ width: 14, height: 14, borderRadius: 99, background: AURORA }} />{note}
      </div>
      <Footer swipe /><Grain o={0.05} />
    </AbsoluteFill>
  );

export const CtaPill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div dir="rtl" style={{ display: "inline-block", padding: "30px 64px", borderRadius: 999, background: AURORA, fontFamily: AR, fontWeight: 700, fontSize: 54, color: "#fff", boxShadow: "0 30px 80px rgba(255,45,122,.4)" }}>{children}</div>
);
