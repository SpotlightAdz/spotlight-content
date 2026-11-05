#!/usr/bin/env python3
"""Week 2 reels. Scene lengths come from the voiceover (vo5/times.json); hook is on screen from frame 0.
   R = dark VFX: 3 restaurant mistakes     B = keynote: Aboujoud story
   E = light launch: anatomy of a reel     C = dark VFX: POV your cousin runs your IG
   Z = light launch: Caftan Zouhair, one system
Usage: render5.py <var> <start> <end> out.mp4 | render5.py <var> still <t> out.png"""
import sys, os, math, json, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import render as R
import render2 as R2
import render3 as R3
from render2 import T, FT, logo, logo_at, icon_layer, chat_icon, tsprite
from render import (W, H, FPS, MAG, PUR, BLU, CYA, ORA, YEL, RED, clamp, eo, eio, prog, env, grad_img, glow_dot,
                    place, rrect_sprite, grad_pill, with_alpha)
from render3 import reveal, soft_glow, card, cursor, click_ring, check, espring, INK, INK2, GREEN

HERE = os.path.dirname(os.path.abspath(__file__))
TIMES = json.load(open(f"{HERE}/vo5/times.json"))
GREY = (200, 200, 214)

def fit(s, fk, size, maxw=W - 140):
    while FT(fk, size).getlength(s) > maxw and size > 30: size -= 2
    return size

def TF(c, s, y, fk="ar7", size=100, fill="fg", a=1., x=W / 2, anchor="c"):
    return T(c, s, x, y, fk, fit(s, fk, size), fill, a=a, anchor=anchor)

def inout(lt, D, st=.0, dur=.35):
    return eo(prog(lt, st, dur)) * (1 - eio(prog(lt, D - .3, .3)))

def darkbox(c, x, y, w, h, a=1., r=40):
    if a > 0: place(c, rrect_sprite(int(w), int(h), r, (14, 12, 30, 225), (255, 255, 255, 40), 2), x, y, a)

def xmark(d, x, y, s, col, w=8):
    d.line((x - s, y - s, x + s, y + s), fill=col, width=w); d.line((x - s, y + s, x + s, y - s), fill=col, width=w)

def wa_cta(c, lt, y, light=False, label="صيفط لينا فواتساب"):
    bw, bh = 760, 130
    ba = eo(prog(lt, .5, .4))
    btn = Image.new("RGBA", (bw, bh), (0, 0, 0, 0)); btn.alpha_composite(grad_pill("hot", bw, bh))
    tw = T(btn, label, bw / 2 - 40, 26, "ar7", 54, (255, 255, 255))
    btn.alpha_composite(icon_layer(70, 70, chat_icon, 35, 35, 52, (255, 255, 255)), (int(bw / 2 + tw / 2 - 10), 29))
    place(c, btn, W / 2 - bw / 2, y, ba, .94 + .06 * espring(prog(lt, .5, .8)))
    a = eo(prog(lt, .9, .4))
    T(c, "+212 701 177 915", W / 2, y + 175, "sg6", 60, INK if light else "fg", a=a, track=1)
    T(c, "spotlightadz.ma", W / 2, y + 265, "it5", 42, INK2 if light else "muted", a=a, track=1)

# ================ R: 3 restaurant mistakes (dark) ================
def R_label(c, lt, D, n, title, gk):
    a = inout(lt, D)
    T(c, f"الغلطة {n}", W / 2, 270, "ar6", 54, "muted", a=a)
    TF(c, title, 350, "ar7", 104, gk, a)

def plate(d, cx, cy, r, b):
    k = lambda col: tuple(int(v * b) for v in col)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=k((236, 232, 225)))
    d.ellipse((cx - r * .78, cy - r * .78, cx + r * .78, cy + r * .78), fill=k((214, 120, 44)))
    for i, (dx, dy, s, col) in enumerate([(-.3, -.25, .22, (250, 196, 70)), (.28, -.2, .2, (70, 150, 70)), (.05, .3, .26, (200, 60, 40)),
                                          (-.32, .22, .15, (70, 150, 70)), (.36, .25, .15, (250, 196, 70))]):
        d.ellipse((cx + dx * r - s * r, cy + dy * r - s * r, cx + dx * r + s * r, cy + dy * r + s * r), fill=k(col))

def R1(c, lt, D):
    TF(c, "إلا عندك ريسطو", 400, "ar7", 124)
    TF(c, "هاد 3 غلطات", 570, "ar7", 150, "hot")
    TF(c, "كيخسروك الكليان", 770, "ar7", 112)
    lay = Image.new("RGBA", (W, 520), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    d.ellipse((290, 150, 790, 300), outline=(255, 255, 255, 150), width=7)
    d.line((540, 300, 540, 470), fill=(255, 255, 255, 150), width=9); d.line((440, 470, 640, 470), fill=(255, 255, 255, 150), width=9)
    for x in (180, 900):
        d.rounded_rectangle((x - 40, 230, x + 40, 400), 14, outline=(255, 255, 255, 80), width=6)
    place(c, lay, 0, 1010)
    T(c, "طبلة خاوية", W / 2, 1500, "ar6", 46, "muted", a=eo(prog(lt, .4, .4)))

def R2_(c, lt, D):
    R_label(c, lt, D, 1, "تصاور مضلمين", "hot")
    a = inout(lt, D); k = eo(prog(lt, D * .5, .5))
    for i, (x, b, lab, col) in enumerate([(300, .24, "مضلمة", RED), (780, 1., "واضحة", GREEN)]):
        ia = a if i == 0 else a * k
        lay = Image.new("RGBA", (440, 560), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
        d.rounded_rectangle((0, 0, 439, 559), 36, fill=(28, 26, 40, 255) if i == 0 else (66, 54, 44, 255), outline=(255, 255, 255, 60), width=2)
        plate(d, 220, 240, 170, b)
        place(c, lay, x - 220, 640, ia, .95 + .05 * ia)
        T(c, lab, x, 1100, "ar7", 54, col, a=ia)
    TF(c, "اللي ما تشهاش بعينيه", 1290, "ar6", 66, "fg", eo(prog(lt, D * .55, .4)) * a)
    TF(c, "ما غاديش يجي", 1390, "ar7", 80, "warm", eo(prog(lt, D * .68, .4)) * a)

def R3_(c, lt, D):
    R_label(c, lt, D, 2, "ما كاينش المنيو", "cool")
    a = inout(lt, D)
    darkbox(c, 110, 560, W - 220, 560, a)
    logo(c, 260, 700, 120, a, glow=.2)
    T(c, "الريسطو ديالك", W - 180, 625, "ar7", 54, "fg", a=a, anchor="r")
    T(c, "Restaurant · Martil", W - 180, 710, "sg6", 36, "muted", a=a, anchor="r", track=0)
    for i, nm in enumerate(["المنيو", "الثمن", "العنوان"]):
        x = W / 2 + (1 - i) * 280; ia = eo(prog(lt, .4 + i * .3, .4)) * a
        lay = Image.new("RGBA", (180, 180), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
        d.ellipse((6, 6, 174, 174), outline=(255, 255, 255, 120), width=5)
        place(c, lay, x - 90, 810, ia)
        T(c, "؟", x, 840, "ar7", 76, RED, a=ia)
        T(c, nm, x, 1010, "ar6", 38, GREY, a=ia)
    TF(c, "الكليان كيقلب… ما كيلقاش", 1230, "ar6", 66, "fg", eo(prog(lt, D * .4, .4)) * a)
    TF(c, "و كيمشي عند جارك", 1340, "ar7", 88, "hot", eo(prog(lt, D * .62, .4)) * a)

def R4_(c, lt, D):
    R_label(c, lt, D, 3, "الميساج بلا جواب", "warm")
    a = inout(lt, D)
    bw = 720; y = 620
    box = rrect_sprite(bw, 130, 40, (30, 30, 36, 240), (255, 255, 255, 40), 2)
    place(c, box, W - 110 - bw, y, a)
    T(c, "واش كاينة طبلة الليلة؟", W - 150, y + 32, "ar6", 48, "fg", a=a, anchor="r")
    p = clamp(lt / max(1, D - .6)); cx, cy, r = W / 2, 980, 120
    lay = Image.new("RGBA", (300, 300), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    d.ellipse((30, 30, 270, 270), outline=(255, 255, 255, 200), width=8)
    ang = p * 6.28 * 3 - 1.57
    d.line((150, 150, 150 + 95 * math.cos(ang), 150 + 95 * math.sin(ang)), fill=(255, 70, 90, 255), width=8)
    d.line((150, 150, 150 + 60 * math.cos(ang / 12), 150 + 60 * math.sin(ang / 12)), fill=(255, 255, 255, 255), width=8)
    place(c, lay, cx - 150, cy - 150, a)
    TF(c, "باغي الجواب دابا", 1250, "ar7", 96, "hot", eo(prog(lt, D * .5, .4)) * a)

def R5_(c, lt, D):
    a = inout(lt, D); k = eio(prog(lt, .2, 1.3))
    TF(c, "ريل وحدة مصورة مزيان", 560, "ar6", 76, "fg", a)
    soft_glow(c, W / 2, 860, 300, MAG, .5 * a)
    spr, pad = tsprite(f"{35.6 * k:.1f}K", "sg7", 250, "hot", -8.0, 100)
    place(c, spr, W / 2 - spr.width / 2, 700 - pad, a)
    T(c, "مشاهدة", W / 2, 1000, "ar7", 90, "fg", a=a)
    T(c, "Grillade Khay Ahmed", W / 2, 1140, "sg6", 60, "muted", a=eo(prog(lt, .6, .4)) * a, track=0)

def R6_(c, lt, D):
    TF(c, "سيفها و صيفطها", 480, "ar7", 112, "fg", eo(prog(lt, 0, .3)))
    TF(c, "لمول الريسطو", 630, "ar7", 124, "aurora", eo(prog(lt, .2, .3)))
    wa_cta(c, lt, 880)

# ================ B: Aboujoud keynote ================
def shop(c, x, y, s, a, col=(255, 255, 255)):
    if a <= 0: return
    lay = Image.new("RGBA", (s, s), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    q = s / 100; w = max(5, int(4 * q)); C = col + (255,)
    d.line((14 * q, 42 * q, 14 * q, 94 * q, 86 * q, 94 * q, 86 * q, 42 * q), fill=C, width=w, joint="curve")
    d.polygon(((14 * q, 10 * q), (86 * q, 10 * q), (98 * q, 42 * q), (2 * q, 42 * q)), outline=C, width=w)
    for k in range(1, 4): d.line((2 * q + k * 24 * q, 42 * q, 14 * q + k * 18 * q, 10 * q), fill=C, width=max(3, w // 2))
    d.rounded_rectangle((38 * q, 58 * q, 62 * q, 94 * q), 4, outline=C, width=w)
    place(c, lay, x - s / 2, y - s / 2, a)

def B1(c, lt, D):
    TF(c, "حانوت وحدة…", 420, "ar7", 130)
    k = eo(prog(lt, .9, .6))
    shop(c, W / 2 - 230 * k, 930, 300, 1.)
    shop(c, W / 2 + 230 * k, 930, 300, k, (255, 90, 150))
    soft_glow(c, W / 2 + 230, 930, 230, MAG, .4 * k)
    reveal(c, "ولات جوج.", 1190, lt, .9, D + 9, "ar7", 150, "aurora", dur=.6)

def B2(c, lt, D):
    reveal(c, "هادي قصة", 720, lt, .1, D - .5, "ar6", 90, GREY, dur=.6)
    reveal(c, "Aboujoud", 860, lt, .3, D - .5, "sg7", 190, "hot", dur=.7)

def B3(c, lt, D):
    reveal(c, "كان عندو", 500, lt, .05, D - .4, "ar6", 90, GREY, dur=.5)
    a = eo(prog(lt, .1, .5)) * (1 - eio(prog(lt, D - .4, .4)))
    soft_glow(c, W / 2, 880, 240, BLU, .35 * a); shop(c, W / 2, 880, 360, a)
    reveal(c, "حانوت وحدة.", 1160, lt, .3, D - .4, "ar7", 110, "fg", dur=.5)

def B4(c, lt, D):
    reveal(c, "خدمنا معاه…", 480, lt, .05, D - .5, "ar6", 90, GREY, dur=.5)
    st = D * .3; p = eo(prog(lt, st, .5)); q = eio(prog(lt, D - .5, .5)); a = p * (1 - q); k = eio(prog(lt, st, 1.6))
    soft_glow(c, W / 2, 860, 320, MAG, .55 * a)
    if a > 0:
        spr, pad = tsprite(f"+{int(400 * k)}%", "sg7", 270, "hot", -10.0, 100)
        place(c, spr, W / 2 - spr.width / 2, 700 - pad, a)
    reveal(c, "فالكليان", 1050, lt, st + .9, D - .5, "ar7", 110, "fg", dur=.6)

def B5(c, lt, D):
    reveal(c, "و النتيجة؟", 470, lt, .05, D * .35, "ar7", 120, "fg", dur=.5)
    k = eo(prog(lt, D * .3, .7)); a = k * (1 - eio(prog(lt, D - .4, .4)))
    shop(c, W / 2 - 220, 900, 300, a); shop(c, W / 2 + 220, 900, 300, a, (255, 90, 150))
    soft_glow(c, W / 2 + 220, 900, 240, MAG, .45 * a)
    reveal(c, "حانوت تانية.", 1170, lt, D * .35, D - .4, "ar7", 130, "aurora", dur=.6)

def B6(c, lt, D):
    reveal(c, "شنو الخطوة الجاية", 460, lt, .05, 99, "ar7", 96, "fg", dur=.5)
    reveal(c, "ديال البيزنس ديالك؟", 590, lt, .3, 99, "ar7", 96, "aurora", dur=.5)
    la = eo(prog(lt, .4, .8)); soft_glow(c, W / 2, 830, 160, MAG, .4 * la); logo(c, W / 2, 830, 150, la, glow=.3)
    wa_cta(c, lt, 980)

# ================ E: anatomy of a reel (light) ================
TRACKS = [("HOOK", MAG), ("SCRIPT", PUR), ("CUTS", BLU), ("TEXT + SOUND", ORA), ("DATA", GREEN)]
def E_win(c, lt, D, step, title, sub, body=None):
    a = inout(lt, D); da = env(lt, .0, D - .3, .3, .3)
    TF(c, title, 250, "ar7", 96, INK, a); TF(c, sub, 375, "ar5", 48, INK2, a)
    wx, wy, ww, wh = 70, 490, W - 140, 1010
    def content(im):
        d = ImageDraw.Draw(im)
        for i, col in enumerate(((255, 95, 87), (255, 189, 46), (40, 200, 64))): d.ellipse((30 + i * 34, 28, 54 + i * 34, 52), fill=col)
        T(im, "reel_final.mp4", ww / 2, 22, "sg6", 30, INK2, track=0)
        if body: body(im, d, ww)
        y0 = 640
        d.line((30, y0 - 20, ww - 30, y0 - 20), fill=(0, 0, 0, 22), width=2)
        for i, (nm, col) in enumerate(TRACKS):
            y = y0 + i * 70; on = i == step; done = i < step
            T(im, nm, 30, y + 4, "sg6", 26, INK if on else INK2, anchor="l", track=0)
            x0, x1 = 260, ww - 30
            d.rounded_rectangle((x0, y, x1, y + 50), 14, fill=(244, 242, 248))
            f = 1. if done else eo(prog(lt, .2, 1.2)) if on else 0.
            if i == 0: x1 = x0 + (x1 - x0) * .12
            if f > 0:
                d.rounded_rectangle((x0, y, x0 + (x1 - x0) * f, y + 50), 14, fill=col if (on or done) else (0, 0, 0))
            if i == 2 and f > 0:
                for k in range(1, 13):
                    x = x0 + (ww - 30 - x0) * k / 13
                    if x < x0 + (ww - 30 - x0) * f: d.line((x, y, x, y + 50), fill=(255, 255, 255), width=4)
    card(c, wx, wy, ww, wh, a, .95 + .05 * espring(prog(lt, 0, .7)), content=content)

def E1(c, lt, D):
    TF(c, "ريل ديال 30 ثانية", 330, "ar7", 112, INK)
    TF(c, "شوف شنو موراه", 480, "ar7", 104, "hot")
    a = 1 - eio(prog(lt, D - .3, .3)); pw, ph = 430, 760
    def content(im):
        d = ImageDraw.Draw(im)
        th = grad_img("aurora", pw - 40, ph - 40, 130).convert("RGBA")
        m = Image.new("L", th.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, th.width - 1, th.height - 1), 34, fill=255); th.putalpha(m)
        im.alpha_composite(th, (20, 20))
        d.polygon(((pw / 2 - 45, ph / 2 - 60), (pw / 2 - 45, ph / 2 + 60), (pw / 2 + 60, ph / 2)), fill=(255, 255, 255))
        s = int(clamp(lt / max(.1, D)) * 30)
        T(im, f"0:{s:02d}", pw / 2, ph - 120, "sg7", 60, (255, 255, 255), track=0)
    card(c, W / 2 - pw / 2, 680, pw, ph, a, 1., r=50, content=content)

def E2(c, lt, D):
    def body(im, d, ww):
        k = eo(prog(lt, .4, .6)); s = f"0:0{min(2, int(k * 2.99))}"
        T(im, s, ww / 2, 150, "sg7", 200, "hot", track=-6)
        T(im, "باش توقف السكرول", ww / 2, 420, "ar7", 62, INK)
    E_win(c, lt, D, 0, "1. الهوك", "أول حاجة كيشوفها اللي داز", body)

def E3(c, lt, D):
    full = ["جملة = فكرة واحدة", "بالدارجة، كيف كنهضرو", "بلا كلام زايد"]
    def body(im, d, ww):
        for i, ln in enumerate(full):
            n = int(len(ln) * clamp((lt - .3 - i * .8) / .7))
            if n: T(im, ln[:n], ww - 70, 150 + i * 130, "ar6", 58, INK, anchor="r")
            if lt > 1.1 + i * .8: check(d, 110, 195 + i * 130, 26, GREEN, 7)
    E_win(c, lt, D, 1, "2. السكريبت", "كل جملة عندها خدمة", body)

def E4(c, lt, D):
    def body(im, d, ww):
        n = 6; bw = (ww - 120) / n
        for i in range(n):
            q = eo(prog(lt, .3 + i * .22, .35)); x = 60 + i * bw + q * 0
            col = [MAG, PUR, BLU, ORA, GREEN, CYA][i]
            h = 300 * q
            if q > 0: d.rounded_rectangle((x + 6, 390 - h / 2, x + bw - 6, 390 + h / 2), 16, fill=col)
        T(im, "قطع كل 2 ثواني", ww / 2, 80, "ar7", 62, INK)
    E_win(c, lt, D, 2, "3. المونتاج", "باش العين ما تملش", body)

def E5(c, lt, D):
    def body(im, d, ww):
        for i in range(44):
            x = 70 + i * (ww - 140) / 43; h = (40 + 90 * abs(math.sin(i * .7 + lt * 4)) * abs(math.sin(i * .23))) * eo(prog(lt, .2, .5))
            d.line((x, 200 - h, x, 200 + h), fill=ORA, width=8)
        T(im, "كل كلمة مكتوبة فالشاشة", ww / 2, 400, "ar7", 60, INK, a=eo(prog(lt, .6, .4)))
    E_win(c, lt, D, 3, "4. الكتابة و الصوت", "بزاف كيتفرجو بلا صوت", body)

def E6(c, lt, D):
    def body(im, d, ww):
        vals = [.3, .5, .42, .68, .9]
        for i, v in enumerate(vals):
            x = 120 + i * 145; q = eo(prog(lt, .3 + i * .15, .6)); h = 360 * v * q
            d.rounded_rectangle((x, 530 - h, x + 100, 530), 18, fill=GREEN if i == 4 else (214, 232, 216))
        T(im, "مثال توضيحي", ww - 60, 90, "ar5", 34, INK2, anchor="r")
    E_win(c, lt, D, 4, "5. الأرقام", "و الريل الجاي كيولي أحسن", body)

def light_cta(c, lt, D, t1, t2):
    TF(c, t1, 400, "ar7", 96, INK, eo(prog(lt, 0, .3)))
    TF(c, t2, 530, "ar7", 104, "hot", eo(prog(lt, .15, .3)))
    logo(c, W / 2, 760, 170, eo(prog(lt, .3, .5)), glow=.15)

def E7(c, lt, D):
    light_cta(c, lt, D, "بغيتي هادشي", "للبراند ديالك؟")
    wa_cta(c, lt, 940, True, "كتب SPOT فالكومونتير")
    T(c, "الباكات كيبداو من 3.000 درهم/الشهر", W / 2, 1320, "ar5", 42, INK2, a=eo(prog(lt, 1.2, .4)))

# ================ C: POV cousin (dark) ================
def C1(c, lt, D):
    T(c, "POV", W / 2, 400, "sg7", 230, "hot", track=-6)
    TF(c, "ولد عمك هو اللي", 720, "ar7", 124)
    TF(c, "كيسير ليك الإنستغرام", 880, "ar7", 110, "aurora")
    k = lt * 7
    T(c, "؟", W / 2 + math.sin(k) * 16, 1140, "ar7", 200, YEL, a=eo(prog(lt, .5, .3)))

def C2(c, lt, D):
    a = inout(lt, D)
    TF(c, "فلاير بعشرة ديال الألوان", 260, "ar7", 88, "fg", a)
    lay = Image.new("RGBA", (620, 760), (255, 255, 255, 255)); d = ImageDraw.Draw(lay)
    cols = [(255, 0, 0), (255, 200, 0), (0, 200, 0), (0, 120, 255), (200, 0, 255), (255, 90, 0), (0, 230, 230), (255, 0, 140), (120, 255, 0), (90, 40, 255)]
    for i, col in enumerate(cols): d.rectangle((0, i * 76, 620, i * 76 + 76), fill=col)
    T(lay, "عرض خاص!!!", 310, 150, "ar7", 86, (255, 255, 0))
    T(lay, "عرض خاص!!!", 310, 310, "ar7", 80, (255, 255, 255))
    T(lay, "ما تفوتوش!!!", 310, 460, "ar7", 80, (0, 0, 0))
    lay = lay.rotate(math.sin(lt * 5) * 2.5, Image.BICUBIC, expand=True)
    place(c, lay, W / 2 - lay.width / 2, 480, a)
    ta = eo(prog(lt, D * .5, .3)) * a
    darkbox(c, W / 2 - 240, 1330, 480, 150, ta)
    T(c, "03:00", W / 2, 1345, "sg7", 100, RED, a=ta, track=0)

def C3(c, lt, D):
    a = inout(lt, D)
    TF(c, "الكابشن", 330, "ar7", 110, "hot", a)
    darkbox(c, 100, 540, W - 200, 520, a)
    for i, (s, st) in enumerate([("عرض خاص", .1), ("اتصل بنا", .5)]):
        T(c, s, W - 170, 610 + i * 130, "ar7", 80, "fg", a=a * eo(prog(lt, st, .3)), anchor="r")
    ka = eo(prog(lt, D * .6, .3)) * a
    T(c, "الرقم:", W - 170, 870, "ar6", 66, "muted", a=ka, anchor="r")
    place(c, rrect_sprite(420, 80, 16, (255, 60, 80, 60), (255, 60, 80, 255), 4), 200, 870, ka)
    TF(c, "بلا رقم", 1160, "ar7", 130, "warm", ka)

def C4(c, lt, D):
    a = inout(lt, D)
    TF(c, "الميساجات", 300, "ar7", 96, "muted", a)
    b1 = eo(prog(lt, .15, .3)) * a; b2 = eo(prog(lt, D * .52, .25)) * a
    y = 560; bw = 640
    place(c, rrect_sprite(bw, 150, 44, (40, 40, 50, 245), (255, 255, 255, 30), 2), W - 90 - bw, y, b1)
    T(c, "شحال الثمن؟", W - 130, y + 36, "ar7", 62, "fg", a=b1, anchor="r")
    y2 = 790; bw2 = 620
    g = grad_pill("hot", bw2, 150, 110); place(c, g, 90, y2, b2, .9 + .1 * espring(prog(lt, D * .52, .6)))
    T(c, "شوف الخاص", 90 + bw2 / 2, y2 + 36, "ar7", 66, (255, 255, 255), a=b2)
    TF(c, "و هو فالخاص أصلا", 1120, "ar7", 80, "cool", eo(prog(lt, D * .72, .3)) * a)

def C5(c, lt, D):
    a = inout(lt, D)
    TF(c, "و النتيجة؟", 300, "ar7", 110, "fg", a)
    lay = Image.new("RGBA", (W - 200, 460), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    d.line((30, 20, 30, 430, W - 230, 430), fill=(255, 255, 255, 90), width=5)
    p = eo(prog(lt, .2, 1.0))
    pts = [(30 + i * 12 * p * 6, 400 + math.sin(i * 1.3) * 5) for i in range(26)]
    d.line(pts, fill=(255, 60, 80, 255), width=9)
    place(c, lay, 100, 500, a)
    q = eo(prog(lt, D * .45, .35)) * a; s = .92 + .08 * espring(prog(lt, D * .45, .7))
    TF(c, "راه الألغوريتم", 1090 + math.sin(lt * 9) * 6, "ar7", 124, "hot", q)

def C6(c, lt, D):
    TF(c, "صيفطها", 400, "ar7", 124, "fg", eo(prog(lt, 0, .3)))
    TF(c, "لولد عمك", 560, "ar7", 150, "aurora", eo(prog(lt, .15, .3)))
    logo(c, W / 2, 830, 130, eo(prog(lt, .3, .5)), glow=.3)
    wa_cta(c, lt, 960, label="بغيتي خدمة ديال بصح؟")

# ================ Z: Caftan Zouhair, one system (light) ================
def Z1(c, lt, D):
    TF(c, "كلشي مفرق؟", 270, "ar7", 124, "hot")
    a = 1 - eio(prog(lt, D - .3, .3))
    for i, (s, x, y, rot) in enumerate([("الإنتاج فكناش", 330, 700, -5), ("الكاسة فكناش", 700, 960, 4), ("الطلبات فالواتساب", 400, 1240, -3)]):
        lay = Image.new("RGBA", (660, 220), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
        d.rounded_rectangle((0, 0, 659, 219), 28, fill=(255, 255, 255, 255), outline=(0, 0, 0, 30), width=2)
        for k in range(5): d.line((30, 40 + k * 36, 630, 40 + k * 36), fill=(205, 222, 240, 255), width=2)
        T(lay, s, 330, 62, "ar7", 62, INK)
        lay = lay.rotate(rot + math.sin(lt * 3 + i) * 1.2, Image.BICUBIC, expand=True)
        place(c, lay, x - lay.width / 2 + 0, y - lay.height / 2, a * eo(prog(lt, i * .35, .3) if i else 1.))

MODS = [("الإنتاج", MAG), ("الكاسة", ORA), ("المتجر", PUR), ("الطلبات", BLU)]
def Z2(c, lt, D):
    a = inout(lt, D)
    T(c, "Caftan Zouhair", W / 2, 300, "sg7", 110, INK, a=a, track=-3)
    TF(c, "دابا خدام بسيستام واحد", 450, "ar7", 86, "hot", a)
    cx, cy = W / 2, 980
    logo(c, cx, cy, 200, a, glow=.2)
    for i, (nm, col) in enumerate(MODS):
        k = eio(prog(lt, .3 + i * .1, .9)); ang = i * 1.57 + .78
        x = cx + math.cos(ang) * 330 * (1.5 - .5 * k); y = cy + math.sin(ang) * 330 * (1.5 - .5 * k)
        ia = eo(prog(lt, .3 + i * .1, .4)) * a
        def ch(im, nm=nm, col=col):
            ImageDraw.Draw(im).ellipse((22, 34, 50, 62), fill=col); T(im, nm, 200, 18, "ar7", 48, INK)
        card(c, x - 150, y - 48, 300, 96, ia, 1., r=48, content=ch)

def Z_screen(c, lt, D, title, sub, body):
    a = inout(lt, D)
    TF(c, title, 250, "ar7", 104, INK, a); TF(c, sub, 385, "ar5", 50, INK2, a)
    def content(im):
        body(im, ImageDraw.Draw(im), W - 160)
        T(im, "مثال توضيحي", W - 220, 800, "ar5", 32, INK2, anchor="r")
    card(c, 80, 510, W - 160, 880, a, .95 + .05 * espring(prog(lt, 0, .7)), content=content)

def Z3(c, lt, D):
    def body(im, d, w):
        rows = [("طلب 1", 3), ("طلب 2", 2), ("طلب 3", 1)]
        for i, st in enumerate(["جديد", "فالخدمة", "واجد"]): T(im, st, 170 + (2 - i) * 300 + 80, 50, "ar6", 40, INK2)
        for j, (nm, n) in enumerate(rows):
            y = 170 + j * 200
            T(im, nm, w - 50, y - 10, "ar6", 0 or 36, INK, anchor="r")
            for k in range(3):
                x = 190 + (2 - k) * 300 - 60; on = k < n and lt > .3 + k * .35 + j * .1
                d.ellipse((x, y + 50, x + 70, y + 120), fill=MAG if on else (240, 238, 245))
                if on: check(d, x + 35, y + 85, 16, (255, 255, 255), 6)
    Z_screen(c, lt, D, "الإنتاج", "كل طلب فين وصل", body)

def Z4(c, lt, D):
    def body(im, d, w):
        items = [("قفطان", "—"), ("تكشيطة", "—")]
        for i, (a_, b_) in enumerate(items):
            q = eo(prog(lt, .2 + i * .25, .3))
            if q > 0:
                T(im, a_, w - 60, 70 + i * 110, "ar6", 56, INK, anchor="r", a=q)
                d.rounded_rectangle((60, 90 + i * 110, 300, 130 + i * 110), 12, fill=(240, 238, 245))
        d.line((60, 320, w - 60, 320), fill=(0, 0, 0, 30), width=3)
        q = eo(prog(lt, .9, .4))
        d.rounded_rectangle((60, 360 + 0, w - 60, 520), 40, fill=ORA)
        T(im, "تم البيع", w / 2, 395, "ar7", 74, (255, 255, 255), a=q)
    Z_screen(c, lt, D, "الكاسة", "البيع فالحانوت", body)

def Z5(c, lt, D):
    def body(im, d, w):
        th = grad_img("aurora", w - 120, 340, 130).convert("RGBA")
        m = Image.new("L", th.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, th.width - 1, th.height - 1), 26, fill=255); th.putalpha(m)
        im.alpha_composite(th, (60, 50))
        T(im, "قفطان", w - 70, 420, "ar7", 64, INK, anchor="r")
        d.rounded_rectangle((60, 560, w - 60, 680), 60, fill=PUR)
        T(im, "طلب أونلاين", w / 2, 584, "ar7", 60, (255, 255, 255))
    Z_screen(c, lt, D, "المتجر", "البيع أونلاين", body)

def Z6(c, lt, D):
    def body(im, d, w):
        for i, (nm, col) in enumerate(MODS):
            x = 50 + (1 - i % 2) * (w / 2 - 25); y = 60 + (i // 2) * 370
            q = eo(prog(lt, .2 + i * .18, .4))
            d.rounded_rectangle((x, y, x + w / 2 - 75, y + 330), 30, fill=(247, 245, 250))
            d.rounded_rectangle((x + 40, y + 250, x + 40 + (w / 2 - 155) * (.5 + .1 * i) * q, y + 280), 14, fill=col)
            T(im, nm, x + (w / 2 - 75) / 2, y + 90, "ar7", 62, INK, a=q)
    Z_screen(c, lt, D, "داشبورد الطلبات", "كلشي فشاشة وحدة", body)

def Z7(c, lt, D):
    light_cta(c, lt, D, "بغيتي سيستام", "على قياسك؟")
    wa_cta(c, lt, 940, True)

# ================ timelines ================
DEF = {"R": ("dark", [R1, R2_, R3_, R4_, R5_, R6_]), "B": ("keynote", [B1, B2, B3, B4, B5, B6]),
       "E": ("light", [E1, E2, E3, E4, E5, E6, E7]), "C": ("dark", [C1, C2, C3, C4, C5, C6]),
       "Z": ("light", [Z1, Z2, Z3, Z4, Z5, Z6, Z7])}
VARIANTS = {}
for k, (mode, fns) in DEF.items():
    tm = TIMES[k]; cuts = tm["cuts"]; total = round(tm["dur"] + 1.5, 2)
    edges = [0.] + cuts + [total]
    VARIANTS[k] = dict(mode=mode, fns=fns, edges=edges, cuts=cuts, total=total)

def frame(var, t):
    V = VARIANTS[var]; e = V["edges"]; mode = V["mode"]
    i = min(len(V["fns"]) - 1, max(0, np.searchsorted(e, t, "right") - 1))
    lt, D, fn = t - e[i], e[i + 1] - e[i], V["fns"][i]
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if mode == "light": bg = R3.lbg(t); push = 1 + .03 * lt / D
    elif mode == "keynote": bg = R3.kbg(t); push = 1 + .025 * lt / D
    else: bg = R.background(t, 0.); R2.dust(lay, t, .8); push = 1 + .03 * lt / D
    fn(lay, lt, D)
    tr = 0.
    if mode == "dark":
        for cut in V["cuts"]:
            dd = t - cut
            if -.1 < dd < .22: tr = max(tr, 1 - abs(dd) / (.1 if dd < 0 else .22))
    sc = push + .06 * tr
    nw, nh = int(W * sc), int(H * sc)
    lay = lay.resize((nw, nh), Image.BILINEAR).crop(((nw - W) // 2, (nh - H) // 2, (nw - W) // 2 + W, (nh - H) // 2 + H))
    if mode == "dark" and t > 1.0:
        logo(lay, 110, 150, 64, .85, glow=.25); T(lay, "Spotlight Adz", 158, 128, "sg6", 36, "fg", a=.8, anchor="l")
    bg.alpha_composite(lay)
    arr = np.asarray(bg.convert("RGB")).astype(np.int16)
    if tr > .05:
        sh = int(14 * tr); arr[..., 0] = np.roll(arr[..., 0], sh, axis=1); arr[..., 2] = np.roll(arr[..., 2], -sh, axis=1)
        arr = arr + int(60 * tr ** 2)
    out = R3.grade_light(np.clip(arr, 0, 255).astype(np.uint8)) if mode == "light" else R2.grade(arr)
    T_ = V["total"]
    if t > T_ - .4: out = (out * (1 - eio((t - (T_ - .4)) / .4))).astype(np.uint8)
    return out

if __name__ == "__main__":
    var = sys.argv[1]
    if sys.argv[2] == "still":
        Image.fromarray(frame(var, float(sys.argv[3]))).save(sys.argv[4]); sys.exit()
    a, b = float(sys.argv[2]), float(sys.argv[3]); out = sys.argv[4]
    n0, n1 = int(round(a * FPS)), int(round(min(b, VARIANTS[var]["total"]) * FPS))
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
                          "-i", "-", "-c:v", "libx264", "-preset", "veryfast", "-crf", "17", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    for i in range(n0, n1): p.stdin.write(frame(var, i / FPS).tobytes())
    p.stdin.close(); sys.exit(p.wait())
