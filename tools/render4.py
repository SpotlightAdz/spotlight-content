#!/usr/bin/env python3
"""Three fresh reels in the three proven styles (Darija, 1080x1920, 30fps).
   A = keynote reveal: Spotlight AI (WhatsApp lead response)
   S = Lovable-style launch: Spotlight Store (websites & e-commerce for Moroccan buyers)
   P = dark VFX: Performance Ads (sales, not likes)
Usage: render4.py <A|S|P> <scene> out.mp4 | render4.py <A|S|P> still <t> out.png
"""
import sys, os, math, subprocess, functools
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import render as R
import render2 as R2
import render3 as R3
from render2 import T, tsprite, FT, logo, logo_at, icon_layer, heart, bubble, person_plus, chat_icon, monogram
from render import (W, H, FPS, FG, MUTED, YEL, ORA, RED, MAG, PINK, PUR, BLU, CYA, CORAL, clamp, eo, eio, eback,
                    prog, env, grad_img, glow_dot, place, with_alpha, rrect_sprite, grad_pill)
from render3 import (reveal, soft_glow, card, cursor, click_ring, check, espring, shadow, INK, INK2, GREEN)

# ======================= A: keynote — Spotlight AI =======================
def A1(c, lt, D):
    reveal(c, "23:00", 640, lt, .3, 2.9, "sg7", 260, "fg", dur=1.1)
    # incoming WhatsApp-style notification
    na = eo(prog(lt, 1.2, .5)) * (1 - eio(prog(lt, 2.9, .5)))
    if na > 0:
        bw, bh = 820, 150
        y = 1000 + (1 - eo(prog(lt, 1.2, .5))) * 40
        box = rrect_sprite(bw, bh, 40, (30, 30, 36, 235), (255, 255, 255, 40), 2)
        place(c, box, W / 2 - bw / 2, y, na)
        g = icon_layer(80, 80, lambda d: d.ellipse((0, 0, 79, 79), fill=(37, 211, 102)))
        place(c, g, W / 2 + bw / 2 - 120, y + 35, na)
        place(c, icon_layer(80, 80, chat_icon, 40, 40, 46, (255, 255, 255)), W / 2 + bw / 2 - 120, y + 35, na)
        T(c, "كليان جديد", W / 2 + bw / 2 - 150, y + 26, "ar7", 40, "fg", a=na, anchor="r")
        T(c, "السلام، واش هادشي باقي متوفر؟", W / 2 + bw / 2 - 150, y + 84, "ar5", 36, (200, 200, 214), a=na, anchor="r")
    reveal(c, "وحتى واحد ما جاوبو.", 840, lt, 3.3, D - .7, "ar7", 96)

def A2(c, lt, D):
    bp = prog(lt, 0, 1.0)
    if 0 < bp < 1:
        s = R2.streak(1400, 60, (140, 170, 255))
        place(c, s, W / 2 - 700 + (bp - .5) * 400, 730, math.sin(bp * math.pi) * .9)
    la = eo(prog(lt, .45, 1.2)) * (1 - eio(prog(lt, D - .7, .6)))
    soft_glow(c, W / 2, 760, 220, BLU, la * .5)
    if la > 0:
        r = int((1 - eo(prog(lt, .45, 1.2))) * 26)
        L = logo_at(320)
        if r:
            big = Image.new("RGBA", (L.width + r * 4, L.height + r * 4), (0, 0, 0, 0)); big.alpha_composite(L, (r * 2, r * 2))
            L = big.filter(ImageFilter.GaussianBlur(r))
        place(c, L, W / 2 - L.width / 2, 760 - L.height / 2, la)
    reveal(c, "Spotlight AI", 990, lt, 1.2, D - .7, "sg6", 120, "cool")
    reveal(c, "الذكاء الاصطناعي…", 1180, lt, 2.2, D - .7, "ar6", 70, (200, 200, 214))
    reveal(c, "خدام عندك.", 1280, lt, 2.9, D - .7, "ar7", 96, "aurora")

def A3(c, lt, D):
    words = [("جواب فدقايق.", "ليل و نهار، بالدارجة و بالفرنسية", "cool", .3),
             ("متابعة بلا توقف.", "حتى كيجاوبك الكليان", "aurora", 2.0),
             ("ريبورتات أوتوماتيك.", "بلا ما تحل حتى إكسل", "hot", 3.7)]
    for i, (w_, sub, gk, st) in enumerate(words):
        end = words[i + 1][3] if i + 1 < len(words) else D - .7
        soft_glow(c, W / 2, 900, 200, [BLU, PUR, MAG][i], .35 * eo(prog(lt, st, .8)) * (1 - eio(prog(lt, end, .5))))
        reveal(c, w_, 800, lt, st, end, "ar7", 130 if len(w_) < 15 else 108, gk, out=.45)
        reveal(c, sub, 1000, lt, st + .4, end, "ar5", 52, (190, 190, 205), out=.45)

def A4(c, lt, D):
    reveal(c, "ماشي الإعلانات…", 820, lt, .4, 2.8, "ar7", 110)
    ga = eo(prog(lt, 3.0, 1.0)) * (1 - eio(prog(lt, D - .7, .6)))
    soft_glow(c, W / 2, 760, 260, MAG, .5 * ga)
    reveal(c, "60", 560, lt, 3.0, D - .7, "sg7", 330, "hot", dur=1.2)
    reveal(c, "دقيقة.", 940, lt, 3.4, D - .7, "ar7", 96)
    reveal(c, "هي اللي كتفرق بين كليان… و كليان ضايع.", 1110, lt, 4.2, D - .7, "ar5", 52, (200, 200, 214))

def lock_icon(d, x, y, s, col):
    d.rounded_rectangle((x - s * .5, y - s * .05, x + s * .5, y + s * .6), s * .12, fill=col)
    d.arc((x - s * .32, y - s * .6, x + s * .32, y + s * .15), 180, 360, fill=col, width=int(s * .12))
    d.line((x - s * .32, y - s * .22, x - s * .32, y), fill=col, width=int(s * .12))
    d.line((x + s * .32, y - s * .22, x + s * .32, y), fill=col, width=int(s * .12))

def A5(c, lt, D):
    reveal(c, "و البيانات ديالك؟", 820, lt, .3, 1.9, "ar7", 110)
    la = eo(prog(lt, 2.0, .9)) * (1 - eio(prog(lt, D - .7, .6)))
    soft_glow(c, W / 2, 700, 200, CYA, .45 * la)
    if la > 0:
        ic = icon_layer(260, 260, lock_icon, 130, 140, 200, (255, 255, 255))
        r = int((1 - eo(prog(lt, 2.0, .9))) * 18)
        if r: ic = ic.filter(ImageFilter.GaussianBlur(r))
        place(c, ic, W / 2 - 130, 560, la, 1.06 - .06 * eo(prog(lt, 2.0, .9)))
    reveal(c, "كتبقى عندك.", 900, lt, 2.3, D - .7, "ar7", 120, "cool")
    reveal(c, "فمساحة خاصة بيك", 1080, lt, 2.9, D - .7, "ar5", 56, (200, 200, 214))

def A6(c, lt, D):
    reveal(c, "و حاجة وحدة أخرى…", 860, lt, .4, 2.7, "ar7", 104)
    ga = eo(prog(lt, 3.0, 1.0)) * (1 - eio(prog(lt, D - .7, .6)))
    soft_glow(c, W / 2, 640, 260, PUR, .5 * ga)
    if ga > 0:
        ic = icon_layer(300, 300, person_plus, 170, 160, 240, (255, 255, 255), 14)
        place(c, ic, W / 2 - 150, 480, ga)
    reveal(c, "كاين ديما بنادم", 860, lt, 3.3, D - .7, "ar7", 110, "aurora")
    reveal(c, "مسؤول على كل ميساج", 1020, lt, 4.0, D - .7, "ar6", 70)
    reveal(c, "كيخرج باسمك.", 1120, lt, 4.5, D - .7, "ar6", 70)

def A7(c, lt, D):
    la = eo(prog(lt, .3, 1.2))
    soft_glow(c, W / 2, 700, 230, BLU, .5 * la)
    if la > 0:
        r = int((1 - eo(prog(lt, .3, 1.2))) * 24)
        L = logo_at(300)
        if r:
            big = Image.new("RGBA", (L.width + r * 4, L.height + r * 4), (0, 0, 0, 0)); big.alpha_composite(L, (r * 2, r * 2))
            L = big.filter(ImageFilter.GaussianBlur(r))
        place(c, L, W / 2 - L.width / 2, 700 - L.height / 2, la)
    reveal(c, "Spotlight AI", 920, lt, .9, 99, "sg6", 96, "cool")
    reveal(c, "جرب بنفسك… صيفط لينا فواتساب", 1080, lt, 1.4, 99, "ar6", 56, (200, 200, 214))
    reveal(c, "+212 701 177 915", 1180, lt, 1.8, 99, "sg6", 76, "aurora")
    reveal(c, "spotlightadz.ma", 1310, lt, 2.3, 99, "it5", 40, (150, 150, 168))

# ======================= S: launch — Spotlight Store =======================
def S1(c, lt, D):
    a0, d0 = env(lt, .1, D - .5)
    T(c, "شنو بغيتي تبيع اليوم؟", W / 2, 520 + d0, "ar7", 84, INK, a=a0)
    a1, d1 = env(lt, .25, D - .45)
    T(c, "Spotlight Store", W / 2, 420 + d1, "sg6", 40, INK2, a=a1, track=0)
    bx, by, bw, bh = 80, 720, W - 160, 340
    ba = eo(prog(lt, .2, .5)) * (1 - eio(prog(lt, D - .45, .4)))
    sc = .92 + .08 * espring(prog(lt, .2, .9))
    full = "بغيت متجر أونلاين بالدفع عند الاستلام"
    n = int(len(full) * clamp((lt - .45) / 2.2))
    typed = full[:n]; sent = lt > 3.35
    glow = eo(prog(lt, 3.35, .3)) * (1 - eo(prog(lt, 4.0, .8)))
    if glow > 0:
        g = grad_pill("hot", bw + 30, bh + 30, 110).filter(ImageFilter.GaussianBlur(18))
        place(c, g, bx - 15, by - 15, ba * glow, sc)
    def content(im):
        d = ImageDraw.Draw(im)
        if typed:
            tw = T(im, typed, bw - 50, 50, "ar6", 50, INK, anchor="r")
            if int(lt * 2.4) % 2 == 0 and not sent:
                d.rectangle((bw - 50 - tw - 10, 58, bw - 50 - tw - 6, 120), fill=MAG)
        cx, cy = 230, bh - 70
        d.ellipse((cx - 36, cy - 36, cx + 36, cy + 36), fill=INK if not sent else MAG)
        d.line((cx, cy + 16, cx, cy - 16), fill=(255, 255, 255), width=6)
        d.line((cx - 13, cy - 3, cx, cy - 16, cx + 13, cy - 3), fill=(255, 255, 255), width=6)
        x = bw - 40
        for ch in ["متجر", "واتساب", "التوصيل"]:
            spr, pad = tsprite(ch, "ar5", 30, INK2, 0.0, 100)
            cw = spr.width - 2 * pad + 40
            d.rounded_rectangle((x - cw, bh - 100, x, bh - 40), 30, fill=(245, 242, 248))
            T(im, ch, x - 20, bh - 96, "ar5", 30, INK2, anchor="r")
            x -= cw + 14
    card(c, bx, by, bw, bh, ba, sc, content=content)
    p = eio(prog(lt, 2.5, .8))
    cx0, cy0, cx1, cy1 = W * .78, 1500, bx + 230, by + bh - 70
    ca = eo(prog(lt, 2.3, .3)) * (1 - eo(prog(lt, 4.1, .4)))
    cursor(c, cx0 + (cx1 - cx0) * p, cy0 + (cy1 - cy0) * p, ca, 1 if 3.25 < lt < 3.45 else 0)
    click_ring(c, cx1, cy1, (lt - 3.3) / .5)

S_CHIPS = [("Cash on delivery", -320, -250, ORA), ("WhatsApp", 330, -190, GREEN), ("AR · FR · EN", -300, 590, PUR), ("Analytics", 310, 640, BLU)]

def S2(c, lt, D):
    cx, cy = W / 2, 800
    a0, d0 = env(lt, .1, D - .45)
    T(c, "Introducing", W / 2, 470 + d0, "sg6", 46, INK2, a=a0, track=1)
    s = espring(prog(lt, .25, 1.0))
    la = eo(prog(lt, .25, .3)) * (1 - eio(prog(lt, D - .45, .4)))
    logo(c, cx, cy, 250 * max(.01, s), la, sweep=prog(lt, 1.0, .8), glow=.35)
    for i, (nm, dx, dy, col) in enumerate(S_CHIPS):
        st = .8 + i * .18
        pa = eo(prog(lt, st, .3)) * (1 - eio(prog(lt, D - .45, .4)))
        ps = espring(prog(lt, st, .9))
        fx = cx + dx + math.sin(lt * 1.3 + i) * 8; fy = cy + dy + math.cos(lt * 1.1 + i) * 10
        def chip(im, nm=nm, col=col):
            d = ImageDraw.Draw(im); d.ellipse((22, 22, 50, 50), fill=col)
            T(im, nm, 66, 18, "sg6", 34, INK, anchor="l", track=0)
        w = int(FT("sg6", 34).getlength(nm) + 100)
        card(c, fx - w / 2, fy - 36, w, 72, pa, max(.05, ps), r=36, content=chip)
    a1, d1 = env(lt, .9, D - .4)
    T(c, "Spotlight Store", W / 2, 1010 + d1, "sg7", 120, INK, a=a1, track=-4)
    a2, d2 = env(lt, 1.3, D - .35)
    T(c, "مواقع و متاجر", W / 2, 1180 + d2, "ar6", 58, INK2, a=a2)
    a3, d3 = env(lt, 1.6, D - .3)
    T(c, "مبنية للكليان المغاربة", W / 2, 1270 + d3, "ar7", 66, "hot", a=a3)

def S3(c, lt, D):
    a0, d0 = env(lt, .05, D - .45)
    T(c, "الطلب فثانية", W / 2, 250 + d0, "ar7", 84, INK, a=a0)
    a1, d1 = env(lt, .2, D - .4)
    T(c, "الدفع عند الاستلام · واتساب · التوصيل", W / 2, 360 + d1, "ar5", 40, INK2, a=a1)
    pw, ph = 600, 1060
    px, py = W / 2 - pw / 2, 470
    wa = eo(prog(lt, .25, .4)) * (1 - eio(prog(lt, D - .45, .4)))
    ws = .9 + .1 * espring(prog(lt, .25, 1.0))
    ordered = lt > 3.7
    cod = lt > 2.0
    def content(im):
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((pw / 2 - 70, 22, pw / 2 + 70, 50), 14, fill=(20, 18, 28))
        T(im, "متجر", pw - 40, 80, "ar7", 42, INK, anchor="r")
        im.alpha_composite(logo_at(54), (40, 76))
        th = grad_img("aurora", 520, 300, 130).convert("RGBA")
        m = Image.new("L", th.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, 519, 299), 26, fill=255); th.putalpha(m)
        im.alpha_composite(th, (40, 160))
        T(im, "قفطان مطرز", pw - 40, 480, "ar7", 44, INK, anchor="r")
        T(im, "متوفر · التوصيل لكل المدن", pw - 40, 545, "ar5", 30, INK2, anchor="r")
        opts = [("الدفع عند الاستلام", cod), ("بطاقة بنكية", False)]
        for i, (nm, on) in enumerate(opts):
            y = 620 + i * 96
            d.rounded_rectangle((40, y, pw - 40, y + 80), 22, fill=(249, 247, 251), outline=MAG if on else (0, 0, 0, 30), width=3 if on else 2)
            d.ellipse((pw - 90, y + 24, pw - 58, y + 56), outline=MAG if on else INK2, width=4)
            if on: d.ellipse((pw - 82, y + 32, pw - 66, y + 48), fill=MAG)
            T(im, nm, pw - 110, y + 16, "ar6", 34, INK, anchor="r")
        by = 840
        d.rounded_rectangle((40, by, pw - 40, by + 110), 55, fill=GREEN)
        if ordered:
            check(d, pw / 2 + 120, by + 55, 34, (255, 255, 255), 7)
            T(im, "تم الطلب", pw / 2 - 20, by + 26, "ar7", 44, (255, 255, 255))
        else:
            T(im, "اطلب فواتساب", pw / 2 - 30, by + 26, "ar7", 44, (255, 255, 255))
            im.alpha_composite(icon_layer(70, 70, chat_icon, 35, 35, 46, (255, 255, 255)), (int(pw / 2 + 120), by + 20))
    card(c, px, py, pw, ph, wa, ws, r=60, content=content)
    # cursor: tap COD, then the order button
    ca = eo(prog(lt, 1.2, .3)) * (1 - eo(prog(lt, D - .7, .3)))
    t1 = (px + pw - 74, py + 620 + 40); t2 = (W / 2, py + 840 + 55)
    if lt < 2.0:
        p = eio(prog(lt, 1.2, .7)); x, y = W * .85 + (t1[0] - W * .85) * p, 1750 + (t1[1] - 1750) * p
    else:
        p = eio(prog(lt, 2.6, .9)); x, y = t1[0] + (t2[0] - t1[0]) * p, t1[1] + (t2[1] - t1[1]) * p
    cursor(c, x, y, ca, 1 if (1.9 < lt < 2.1 or 3.6 < lt < 3.8) else 0)
    click_ring(c, *t1, (lt - 1.95) / .5)
    click_ring(c, *t2, (lt - 3.65) / .5)
    if ordered:
        for k in range(10):
            ang = k / 10 * 6.28; q = eo(prog(lt, 3.7, .7))
            g = glow_dot(5, [MAG, ORA, PUR, CYA, YEL][k % 5], 1.)
            place(c, g, t2[0] + math.cos(ang) * 160 * q - g.width / 2, t2[1] + math.sin(ang) * 160 * q - g.height / 2, 1 - q)

def S4(c, lt, D):
    a0, d0 = env(lt, .05, D - .45)
    T(c, "سريع · و بثلاث لغات", W / 2, 250 + d0, "ar7", 84, INK, a=a0)
    a1, d1 = env(lt, .2, D - .4)
    T(c, "مبني باش يتحل دغيا فالتيليفون", W / 2, 360 + d1, "ar5", 42, INK2, a=a1)
    wa = eo(prog(lt, .3, .4)) * (1 - eio(prog(lt, D - .45, .4)))
    ws = .9 + .1 * espring(prog(lt, .3, 1.0))
    p = eio(prog(lt, .8, 1.4))
    def gauge(im):
        d = ImageDraw.Draw(im)
        cx, cy, r = 460, 250, 160
        d.arc((cx - r, cy - r, cx + r, cy + r), 135, 405, fill=(236, 233, 242), width=26)
        if p > 0: d.arc((cx - r, cy - r, cx + r, cy + r), 135, 135 + 270 * p, fill=GREEN, width=26)
        T(im, "4G", cx, cy - 60, "sg7", 90, INK)
        T(im, "كيتحل دغيا" if p >= 1 else "كيتحل…", cx, cy + 115, "ar6", 40, GREEN if p >= 1 else INK2)
    card(c, 80, 470, W - 160, 500, wa, ws, content=gauge)
    langs = [("العربية", "ar7"), ("Français", "sg6"), ("English", "sg6")]
    act = int(max(0, lt - 2.0) / .9) % 3
    la = eo(prog(lt, 1.6, .4)) * (1 - eio(prog(lt, D - .45, .4)))
    def toggle(im):
        d = ImageDraw.Draw(im)
        seg = (W - 200) / 3
        for i, (nm, fk) in enumerate(langs):
            on = i == act
            x0 = 20 + i * seg
            if on: d.rounded_rectangle((x0, 20, x0 + seg - 20, 120), 50, fill=INK)
            T(im, nm, x0 + (seg - 20) / 2, 44, fk, 40, (255, 255, 255) if on else INK2, track=0)
    card(c, 80, 1030, W - 160, 140, la, .9 + .1 * espring(prog(lt, 1.6, .9)), r=70, content=toggle)
    hello = ["مرحبا بيك", "Bienvenue", "Welcome"]
    a3 = la
    T(c, hello[act], W / 2, 1230, "ar7" if act == 0 else "sg7", 70, "hot", a=a3, track=0)

def S5(c, lt, D):
    a0, d0 = env(lt, .05, D - .45)
    T(c, "منين جاو المبيعات؟", W / 2, 250 + d0, "ar7", 84, INK, a=a0)
    a1, d1 = env(lt, .2, D - .4)
    T(c, "تراكينغ واجد من نهار اللول", W / 2, 360 + d1, "ar5", 42, INK2, a=a1)
    wa = eo(prog(lt, .3, .4)) * (1 - eio(prog(lt, D - .45, .4)))
    ws = .9 + .1 * espring(prog(lt, .3, 1.0))
    rows = [("Instagram", .82, MAG), ("WhatsApp", .68, GREEN), ("TikTok", .55, PUR), ("Google", .4, BLU)]
    def content(im):
        d = ImageDraw.Draw(im)
        for i, (nm, v, col) in enumerate(rows):
            y = 70 + i * 140
            T(im, nm, 40, y, "sg6", 40, INK, anchor="l", track=0)
            q = eo(prog(lt, .7 + i * .2, .8))
            d.rounded_rectangle((300, y + 6, 300 + (W - 160 - 360) * v * q, y + 56), 25, fill=col)
        T(im, "مثال توضيحي", W - 200, 640, "ar5", 28, INK2, anchor="r")
    card(c, 80, 470, W - 160, 720, wa, ws, content=content)

def S6(c, lt, D):
    a0, d0 = env(lt, .05, D - .45)
    T(c, "خدامين بيه دابا", W / 2, 300 + d0, "ar7", 90, INK, a=a0)
    items = [("Aboujoud", "بوتيك · حانوت ثاني تحل", "+400%", "كليان جداد", "cool", ("AJ", PUR, CYA), .35),
             ("Caftan Zouhair", "إنتاج · POS · متجر أونلاين", "All-in-1", "سيستام واحد", "hot", ("CZ", MAG, ORA), 1.6)]
    for i, (nm, sub, stat, lab, gk, mono, st) in enumerate(items):
        pa = eo(prog(lt, st, .3)) * (1 - eio(prog(lt, D - .45 + i * .04, .4)))
        ps = .7 + .3 * espring(prog(lt, st, .9))
        bw, bh = W - 140, 260
        def content(im, nm=nm, sub=sub, stat=stat, lab=lab, gk=gk, mono=mono):
            im.alpha_composite(monogram(*mono), (36, bh // 2 - 60))
            T(im, nm, 186, 62, "sg7", 52, INK, anchor="l", track=-1)
            T(im, sub, 186, 140, "ar5", 32, INK2, anchor="l")
            T(im, stat, bw - 40, 54, "sg7", 90, gk, anchor="r", track=-3, gangle=90)
            T(im, lab, bw - 40, 168, "ar6", 34, INK2, anchor="r")
        card(c, 70, 520 + i * 320, bw, bh, pa, ps, content=content)

def S7(c, lt, D):
    s = espring(prog(lt, .1, 1.0))
    logo(c, W / 2, 560, 240 * max(.01, s), eo(prog(lt, .1, .3)), sweep=prog(lt, .8, .8), glow=.3)
    a1, d1 = env(lt, .4, 99)
    T(c, "بغيتي المتجر ديالك؟", W / 2, 760 + d1, "ar7", 100, INK, a=a1)
    a2, d2 = env(lt, .7, 99)
    T(c, "Spotlight Store", W / 2, 920 + d2, "sg7", 70, "hot", a=a2, track=-2)
    ba = eo(prog(lt, 1.0, .4)); bs = .8 + .2 * espring(prog(lt, 1.0, .9))
    bw, bh = 660, 130
    def content(im):
        tw = T(im, "صيفط لينا فواتساب", bw / 2 - 40, 28, "ar7", 54, (255, 255, 255))
        im.alpha_composite(icon_layer(70, 70, chat_icon, 35, 35, 52, (255, 255, 255)), (int(bw / 2 + tw / 2 - 10), 30))
    card(c, W / 2 - bw / 2, 1090, bw, bh, ba, bs, fill=INK + (255,), border=INK + (255,), r=65, content=content)
    a4, d4 = env(lt, 1.4, 99)
    T(c, "+212 701 177 915", W / 2, 1290 + d4, "sg7", 66, INK, a=a4, track=0)
    a5, d5 = env(lt, 1.6, 99)
    T(c, "spotlightadz.ma", W / 2, 1385 + d5, "it5", 42, INK2, a=a5, track=1)

# ======================= P: dark VFX — Performance Ads =======================
def ads_dash(sc, lt):
    d = ImageDraw.Draw(sc); w = sc.width
    T(sc, "Ads dashboard", 40, 90, "sg6", 36, (200, 200, 214), anchor="l", track=0)
    tiles = [("Likes", "2.4K", MAG), ("Views", "80K", PUR), ("Sales", "?", RED)]
    for i, (nm, v, col) in enumerate(tiles):
        y = 180 + i * 220
        d.rounded_rectangle((30, y, w - 30, y + 190), 26, fill=(28, 26, 44))
        T(sc, nm, 70, y + 30, "sg6", 36, (170, 170, 190), anchor="l", track=0)
        jit = (math.sin(lt * 70) * 8) if (nm == "Sales" and int(lt * 3) % 2 == 0) else 0
        T(sc, v, w - 70 + jit, y + 50, "sg7", 90, "hot" if nm != "Sales" else (255, 90, 100), anchor="r", track=-2)

def P1(c, lt, D):
    a1, d1 = env(lt, .15, D - .4)
    T(c, "كتصرف على الإعلانات…", W / 2, 270 + d1, "ar7", 86, "fg", a=a1)
    pa, pd = env(lt, .35, D - .5, din=.7)
    R2.phone(c, W / 2 - 230, 470 + pd + (1 - eo(prog(lt, .35, .8))) * 200, 460, 860, pa, ads_dash, lt)
    a3, d3 = env(lt, 2.6, D - .3)
    gl = 1 if 2.6 < lt < 2.95 else 0
    T(c, "شحال بعتي بصح؟", W / 2 + math.sin(lt * 90) * 14 * gl, 1420 + d3, "ar7", 96, (255, 110, 110), a=a3)

def P2(c, lt, D):
    cx, cy = W / 2, 640
    out = 1 - eio(prog(lt, D - .4, .4))
    R2.rays(c, cx, cy, lt, .8 * eo(prog(lt, 0, .5)) * out)
    for k in range(3):
        R2.ring(c, cx, cy, 150 + k * 70 + math.sin(lt * 2 + k) * 6, 2, (255, 255, 255), .12 * out * eo(prog(lt, .2 + k * .1, .5)))
    logo(c, cx, cy, 240 * eback(prog(lt, .05, .6)), eo(prog(lt, .05, .3)) * out, sweep=prog(lt, .5, .7))
    a0, d0 = env(lt, .4, D - .45)
    R.pill_label(c, "PERFORMANCE ADS", W / 2, 900 + d0, a0, dot=ORA, size=28)
    a1, d1 = env(lt, .6, D - .4)
    T(c, "الإعلانات ديالك", W / 2, 1050 + d1, "ar6", 70, "fg", a=a1)
    a2, d2 = env(lt, .85, D - .35)
    T(c, "كتحسب المبيعات", W / 2, 1160 + d2, "ar7", 116, "aurora", a=a2)

PLAT = [("Meta", -90), ("Google", 0), ("TikTok", 90), ("Snapchat", 180)]

def P3(c, lt, D):
    a0, d0 = env(lt, .05, D - .45)
    T(c, "خطة وحدة · 4 منصات", W / 2, 300 + d0, "ar7", 90, "fg", a=a0)
    out = 1 - eio(prog(lt, D - .45, .45))
    cx, cy, Rr = W / 2, 1000, 330
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    pts = []
    for i, (nm, ang) in enumerate(PLAT):
        st = .6 + i * .3; p = eo(prog(lt, st, .6))
        rot = math.radians(ang + lt * 5)
        nx, ny = cx + math.cos(rot) * Rr, cy + math.sin(rot) * Rr
        pts.append((nm, nx, ny, st, p))
        if p > 0: d.line((cx, cy, cx + (nx - cx) * p, cy + (ny - cy) * p), fill=(255, 255, 255, int(70 * out)), width=3)
    c.alpha_composite(lay)
    cols = [BLU, YEL, MAG, YEL]
    for i, (nm, nx, ny, st, p) in enumerate(pts):
        if p >= 1:
            for k in range(2):
                ph = ((lt - st) * .7 + k * .5) % 1
                g = glow_dot(7, cols[i], 1.)
                place(c, g, cx + (nx - cx) * ph - g.width / 2, cy + (ny - cy) * ph - g.height / 2, out * math.sin(ph * math.pi))
    logo(c, cx, cy, 180 * eback(prog(lt, .3, .8)), eo(prog(lt, .3, .4)) * out, glow=.6)
    for nm, nx, ny, st, p in pts:
        na = eo(prog(lt, st + .35, .4)) * out
        if na <= 0: continue
        w = int(FT("sg6", 42).getlength(nm) + 70); hh = 90
        sc = .85 + .15 * eback(prog(lt, st + .35, .5))
        place(c, rrect_sprite(w, hh, hh // 2, (16, 14, 34, 235), (255, 255, 255, 70), 2), nx - w / 2, ny - hh / 2, na, sc)
        T(c, nm, nx, ny - 27, "sg6", 42, "fg", a=na, scale=sc, track=0)

def P4(c, lt, D):
    a0, d0 = env(lt, .05, D - .45)
    T(c, "كنتبعو كل بيعة", W / 2, 260 + d0, "ar7", 96, "fg", a=a0)
    a1, d1 = env(lt, .2, D - .4)
    T(c, "حتى اللي ما كتدوزش من السيت", W / 2, 400 + d1, "ar5", 44, "muted", a=a1)
    out = 1 - eio(prog(lt, D - .45, .45))
    srcs = [("واتساب", GREEN, 1.0), ("الدفع عند الاستلام", ORA, 1.9), ("الحانوت", PUR, 2.8)]
    tx, ty = W / 2, 1330
    for i, (nm, col, st) in enumerate(srcs):
        y = 560 + i * 170
        ca, cd = env(lt, st, D - .45, din=.4)
        if ca <= 0: continue
        bw, bh = 600, 120
        place(c, rrect_sprite(bw, bh, 60, (16, 14, 34, 235), col + (200,), 3), W / 2 - bw / 2, y + cd, ca)
        T(c, nm, W / 2, y + 28 + cd, "ar7", 50, "fg", a=ca)
        # flowing pulse down to the sales card
        for k in range(3):
            ph = ((lt - st) * .6 + k / 3) % 1
            if lt - st < .3: continue
            sx, sy = W / 2 + (i - 1) * 180, y + bh
            g = glow_dot(8, col, 1.)
            place(c, g, sx + (tx - sx) * ph - g.width / 2, sy + (ty - sy) * ph - g.height / 2, out * math.sin(ph * math.pi) * .9)
    sa = eo(prog(lt, 3.6, .5)) * out
    bw = 720
    place(c, grad_pill("hot", bw, 150), W / 2 - bw / 2, ty, sa, .9 + .1 * eback(prog(lt, 3.6, .6)))
    T(c, "مبيعات حقيقية", W / 2, ty + 32, "ar7", 64, (255, 255, 255), a=sa)

def P5(c, lt, D):
    a0, d0 = env(lt, .05, D - .45)
    T(c, "كرياتيف جديد كل شهر", W / 2, 250 + d0, "ar7", 90, "fg", a=a0)
    a1, d1 = env(lt, .2, D - .4)
    T(c, "بالدارجة · العربية · الفرنسية", W / 2, 385 + d1, "ar5", 44, "muted", a=a1)
    out = 1 - eio(prog(lt, D - .45, .45))
    keys = ["hot", "aurora", "cool", "warm", "aurora", "hot"]
    tw, th = 280, 420
    for i in range(6):
        col, row = i % 3, i // 3
        st = .5 + i * .15
        ta = eo(prog(lt, st, .4)) * out
        if ta <= 0: continue
        x = W / 2 - 1.5 * tw - 20 + col * (tw + 20); y = 520 + row * (th + 30)
        shift = int((lt * 40 + i * 50)) % 360
        g = grad_img(keys[(i + int(lt * 1.5)) % 6], 140, 210, (135 + shift) % 360).resize((tw, th), Image.BILINEAR).convert("RGBA")
        m = Image.new("L", (tw, th), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, tw - 1, th - 1), 28, fill=255); g.putalpha(m)
        dd = ImageDraw.Draw(g)
        dd.polygon([(tw / 2 - 26, th / 2 - 34), (tw / 2 - 26, th / 2 + 34), (tw / 2 + 34, th / 2)], fill=(255, 255, 255, 230))
        place(c, g, x, y, ta, .85 + .15 * eback(prog(lt, st, .5)))
        T(c, f"V{i + 1}", x + 24, y + 20, "sg7", 34, (255, 255, 255), a=ta, anchor="l", track=0)
    a3, d3 = env(lt, 2.6, D - .3)
    T(c, "الإعلان اللي كيعيا… هو اللي كيغلى", W / 2, 1450 + d3, "ar6", 52, "warm", a=a3)

def P6(c, lt, D):
    a0, d0 = env(lt, .05, D - .45)
    T(c, "تقرير كل سيمانة", W / 2, 270 + d0, "ar7", 96, "fg", a=a0)
    a1, d1 = env(lt, .2, D - .4)
    T(c, "بلغة واضحة، بلا تعقيد", W / 2, 405 + d1, "ar5", 44, "muted", a=a1)
    out = 1 - eio(prog(lt, D - .45, .45))
    ca = eo(prog(lt, .4, .5)) * out
    bw, bh = W - 160, 760
    place(c, rrect_sprite(bw, bh, 40, (14, 12, 30, 230), (255, 255, 255, 34), 2), 80, 540, ca)
    rows = [("شحال صرفتي", ORA, .9), ("شحال رجع ليك", GREEN, 1.8), ("شنو جاي", BLU, 2.7)]
    for i, (nm, col, st) in enumerate(rows):
        ra = eo(prog(lt, st, .4)) * out
        if ra <= 0: continue
        y = 600 + i * 220
        lay = icon_layer(110, 110, lambda d, col=col: d.ellipse((0, 0, 109, 109), fill=col))
        place(c, lay, W - 230, y + 20, ra, .8 + .2 * eback(prog(lt, st, .5)))
        place(c, icon_layer(110, 110, check, 55, 58, 46, (255, 255, 255), 8), W - 230, y + 20, ra)
        T(c, nm, W - 260, y + 40, "ar7", 62, "fg", a=ra, anchor="r")
        lw = (bw - 360) * eo(prog(lt, st + .2, .8))
        if lw > 4: place(c, rrect_sprite(int(lw), 14, 7, (255, 255, 255, 50), (255, 255, 255, 50), 1), 130, y + 140, ra)

def P7(c, lt, D):
    cx, cy = W / 2, 560
    R2.rays(c, cx, cy, lt, .55 * eo(prog(lt, 0, .6)))
    R2.ring(c, cx, cy, 60 + lt * 900, 8 * max(0, 1 - lt / .7) + 1, (255, 190, 210), max(0, 1 - lt / .7))
    logo(c, cx, cy, 300 * eback(prog(lt, .05, .7)), eo(prog(lt, .05, .3)), sweep=prog(lt, .7, .8), glow=.8)
    a1, d1 = env(lt, .4, 9)
    T(c, "إعلانات", W / 2, 760 + d1, "ar7", 116, "fg", a=a1)
    a2, d2 = env(lt, .6, 9)
    T(c, "كتبيع بصح", W / 2, 900 + d2, "ar7", 116, "aurora", a=a2)
    ba = eo(prog(lt, 1.0, .5)); bs = .9 + .1 * eback(prog(lt, 1.0, .6))
    bw, bh = 640, 128
    btn = Image.new("RGBA", (bw, bh), (0, 0, 0, 0)); btn.alpha_composite(grad_pill("hot", bw, bh))
    tw = T(btn, "صيفط لينا فواتساب", bw / 2 - 40, 26, "ar7", 54, (255, 255, 255))
    btn.alpha_composite(icon_layer(70, 70, chat_icon, 35, 35, 52, (255, 255, 255)), (int(bw / 2 + tw / 2 - 10), 29))
    place(c, btn, W / 2 - bw / 2, 1110, ba, bs * (1 + .025 * math.sin(max(0, lt - 1.8) * 5)))
    a4, d4 = env(lt, 1.4, 9)
    T(c, "+212 701 177 915", W / 2, 1290 + d4, "sg6", 60, "fg", a=a4, track=1)
    a5, d5 = env(lt, 1.6, 9)
    T(c, "spotlightadz.ma", W / 2, 1380 + d5, "it5", 42, "muted", a=a5, track=1)

# ======================= timelines =======================
VARIANTS = {
    "A": dict(mode="keynote", scenes=[("a1", 6.8, "A1", .5, A1), ("a2", 6.0, "A2", .45, A2), ("a3", 7.2, "A3", .3, A3),
                                      ("a4", 8.0, "A4", .4, A4), ("a5", 5.8, "A5", .3, A5), ("a6", 8.2, "A6", .4, A6),
                                      ("a7", 6.2, "A7", .5, A7)]),
    "S": dict(mode="light", scenes=[("s1", 4.8, "S1", .35, S1), ("s2", 6.4, "S2", .4, S2), ("s3", 6.4, "S3", .4, S3),
                                    ("s4", 6.6, "S4", .4, S4), ("s5", 4.8, "S5", .4, S5), ("s6", 6.0, "S6", .4, S6),
                                    ("s7", 4.6, "S7", .5, S7)]),
    "P": dict(mode="dark", scenes=[("p1", 6.2, "P1", .35, P1), ("p2", 5.8, "P2", .35, P2), ("p3", 5.0, "P3", .35, P3),
                                   ("p4", 6.8, "P4", .35, P4), ("p5", 6.5, "P5", .35, P5), ("p6", 6.5, "P6", .35, P6),
                                   ("p7", 5.2, "P7", .4, P7)]),
}
for v in VARIANTS.values():
    acc = 0.; v["times"] = {}
    for (k, d, *_r) in v["scenes"]:
        v["times"][k] = (acc, acc + d); acc += d
    v["total"] = acc
    v["cuts"] = [v["times"][s[0]][0] for s in v["scenes"][1:]]

def frame(var, t):
    V = VARIANTS[var]
    for (k, D, vo, off, fn) in V["scenes"]:
        a, b = V["times"][k]
        if t < b or k == V["scenes"][-1][0]: break
    lt = t - a
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    mode = V["mode"]
    if mode == "light":
        bg = R3.lbg(t); fn(lay, lt, D); push = 1 + .035 * lt / D
        fa = min(1, eo(lt / .3), eo((D - lt) / .25))
        if k == V["scenes"][0][0]: fa = min(1, eo((D - lt) / .25))
        if k == V["scenes"][-1][0]: fa = eo(lt / .3)
    elif mode == "keynote":
        bg = R3.kbg(t); fn(lay, lt, D); push = 1 + .025 * lt / D; fa = 1.
    else:
        bg = R.background(t, 0.)
        R2.dust(lay, t, .8); fn(lay, lt, D); push = 1 + .03 * lt / D; fa = 1.
        R2.watermark if False else None
    tr = 0.
    if mode == "dark":
        for cut in V["cuts"]:
            dd = t - cut
            if -.12 < dd < .25: tr = max(tr, 1 - abs(dd) / (.12 if dd < 0 else .25))
    sc = push + .07 * tr
    if abs(sc - 1) > 1e-3:
        nw, nh = int(W * sc), int(H * sc)
        lay = lay.resize((nw, nh), Image.BILINEAR).crop(((nw - W) // 2, (nh - H) // 2, (nw - W) // 2 + W, (nh - H) // 2 + H))
    if fa < .999: lay = with_alpha(lay, fa)
    if mode == "dark" and t > 1.0:  # small brand watermark
        logo(lay, 110, 150, 64, .85, glow=.25)
        T(lay, "Spotlight Adz", 158, 128, "sg6", 36, "fg", a=.8, anchor="l")
    bg.alpha_composite(lay)
    arr = np.asarray(bg.convert("RGB")).astype(np.int16)
    if tr > .05:
        sh = int(16 * tr)
        arr[..., 0] = np.roll(arr[..., 0], sh, axis=1); arr[..., 2] = np.roll(arr[..., 2], -sh, axis=1)
        arr = arr + int(70 * tr ** 2)
    out = R3.grade_light(np.clip(arr, 0, 255).astype(np.uint8)) if mode == "light" else R2.grade(arr)
    T_ = V["total"]
    if t < .3: out = (out * eo(t / .3)).astype(np.uint8)
    if t > T_ - .5: out = (out * (1 - eio((t - (T_ - .5)) / .5))).astype(np.uint8)
    return out

def render_scene(var, name, out):
    V = VARIANTS[var]; a, b = V["times"][name]
    n = int(round((b - a) * FPS))
    tmp = out[:-4] + ".part.mp4"
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                          "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "veryfast", "-crf", "17",
                          "-pix_fmt", "yuv420p", tmp], stdin=subprocess.PIPE)
    for i in range(n):
        p.stdin.write(frame(var, a + i / FPS).tobytes())
    p.stdin.close()
    if p.wait() == 0: os.replace(tmp, out)
    else: sys.exit(f"ffmpeg failed on {name}")

if __name__ == "__main__":
    var = sys.argv[1]
    if sys.argv[2] == "still":
        Image.fromarray(frame(var, float(sys.argv[3]))).save(sys.argv[4])
    else:
        render_scene(var, sys.argv[2], sys.argv[3])
