#!/usr/bin/env python3
"""Two more Spotlight Adz reels (Darija, 1080x1920, 30fps):
   L = Lovable-style product launch (light UI world)
   K = Apple-keynote-style reveal (black stage)
Usage: render3.py <L|K> <scene> out.mp4  |  render3.py <L|K> still <t> out.png
"""
import sys, os, math, functools, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import render2 as R2
from render2 import (T, tsprite, FT, logo, logo_at, icon_layer, heart, bubble, person_plus, chat_icon, monogram, grade)
from render import (W, H, FPS, FG, MUTED, YEL, ORA, RED, MAG, PINK, PUR, BLU, CYA, CORAL, clamp, eo, eio, eback,
                    prog, env, grad_img, glow_dot, place, with_alpha, rrect_sprite, grad_pill)

INK = (13, 10, 20)          # dark text on light
INK2 = (88, 84, 104)        # secondary text on light
GREEN = (34, 170, 90)

def espring(x, k=7.0, w=11.0):
    x = clamp(x); return 1 - math.exp(-k * x) * math.cos(w * x) if x < 1 else 1.0

# ======================= shared UI pieces =======================
@functools.lru_cache(None)
def shadow(w, h, r, blur=40, alpha=70, dy=24):
    pad = blur * 2
    im = Image.new("RGBA", (w + pad * 2, h + pad * 2 + dy), (0, 0, 0, 0))
    m = Image.new("L", im.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((pad, pad + dy, pad + w, pad + h + dy), r, fill=alpha)
    m = m.filter(ImageFilter.GaussianBlur(blur))
    im = Image.new("RGBA", im.size, (40, 20, 60, 255)); im.putalpha(m)
    return im, pad

def card(c, x, y, w, h, a=1., scale=1., fill=(255, 255, 255, 255), border=(0, 0, 0, 18), r=36, content=None):
    """white card with soft shadow; content(img) draws into the card"""
    w, h = int(w), int(h)
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    im.alpha_composite(rrect_sprite(w, h, r, fill, border, 2))
    if content: content(im)
    sh, pad = shadow(w, h, r)
    if abs(scale - 1) > 1e-3:
        place(c, sh, x - pad - (w * (scale - 1)) / 2, y - pad - (h * (scale - 1)) / 2, a * .9, scale)
    else:
        place(c, sh, x - pad, y - pad, a * .9)
    place(c, im, x, y, a, scale)

def cursor(c, x, y, a=1., press=0.):
    if a <= 0: return
    im = Image.new("RGBA", (60, 70), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    pts = [(6, 4), (6, 52), (18, 40), (27, 60), (35, 56), (26, 37), (44, 37)]
    d.polygon(pts, fill=(255, 255, 255)); d.line(pts + [pts[0]], fill=INK, width=4, joint="curve")
    d.polygon([(10, 12), (10, 44), (19, 35), (28, 54), (31, 52), (22, 33), (36, 33)], fill=INK)
    s = 1 - .15 * press
    place(c, im, x - 6, y - 4, a, s)

def click_ring(c, x, y, k):
    if 0 <= k <= 1:
        R2.ring(c, x, y, 18 + 70 * eo(k), 5 * (1 - k) + 1, MAG, (1 - k) * .8)

def check(d, x, y, s, col, w=6):
    d.line((x - s * .4, y, x - s * .1, y + s * .3, x + s * .45, y - s * .35), fill=col, width=w, joint="curve")

# ======================= VARIANT L: Lovable-style launch =======================
LW, LH = 270, 480
_yy, _xx = np.mgrid[0:LH, 0:LW].astype(np.float32)

def lbg(t):
    base = np.zeros((LH, LW, 3), np.float32) + np.array((251, 248, 245), np.float32)
    s = math.sin
    def blob(cx, cy, r, col, k):
        a = np.exp(-(((_xx - cx) ** 2 + (_yy - cy) ** 2) / r ** 2) * 2.0) * k
        return a[..., None], np.array(col, np.float32)
    acc = base
    for (cx, cy, r, col, k) in [
        (70 + 25 * s(t * .4), 360 + 20 * s(t * .3), 170, ORA, .55),
        (200 + 20 * s(t * .35 + 1), 340 + 25 * s(t * .27), 170, (255, 70, 150), .55),
        (140 + 30 * s(t * .3 + 2), 430, 190, (120, 90, 255), .45),
        (135, 300 + 20 * s(t * .5), 120, (255, 140, 120), .35)]:
        a, cc = blob(cx, cy, r, col, k)
        acc = acc * (1 - a) + cc * a
    img = Image.fromarray(np.clip(acc, 0, 255).astype(np.uint8), "RGB").resize((W, H), Image.BICUBIC)
    return img.convert("RGBA")

def L_hook(c, lt, D):
    a0, d0 = env(lt, .1, D - .5)
    T(c, "شنو بغيتي تبني اليوم؟", W / 2, 520 + d0, "ar7", 84, INK, a=a0)
    a1, d1 = env(lt, .25, D - .45)
    T(c, "Spotlight Social", W / 2, 420 + d1, "sg6", 40, INK2, a=a1, track=0)
    bx, by, bw, bh = 80, 720, W - 160, 340
    ba = eo(prog(lt, .2, .5)) * (1 - eio(prog(lt, D - .45, .4)))
    sc = .92 + .08 * espring(prog(lt, .2, .9))
    full = "بغيت البراند ديالي يولّي كيتشاف…"
    n = int(len(full) * clamp((lt - .5) / 2.3))
    typed = full[:n]
    sent = lt > 3.55
    glow = eo(prog(lt, 3.55, .3)) * (1 - eo(prog(lt, 4.2, .8)))
    if glow > 0:
        g = grad_pill("hot", bw + 30, bh + 30, 110)
        g = g.filter(ImageFilter.GaussianBlur(18))
        place(c, g, bx - 15, by - 15, ba * glow, sc)
    def content(im):
        d = ImageDraw.Draw(im)
        if typed:
            tw = T(im, typed, bw - 50, 50, "ar6", 52, INK, anchor="r")
            if int(lt * 2.4) % 2 == 0 and not sent:
                d.rectangle((bw - 50 - tw - 10, 58, bw - 50 - tw - 6, 122), fill=MAG)
        else:
            T(im, "قولها بكلماتك…", bw - 50, 50, "ar5", 52, (170, 166, 180), anchor="r")
            if int(lt * 2.4) % 2 == 0: d.rectangle((bw - 44, 58, bw - 40, 122), fill=MAG)
        # bottom toolbar
        d.rounded_rectangle((40, bh - 100, 150, bh - 40), 30, outline=(0, 0, 0, 40), width=2)
        T(im, "+ ملف", 95, bh - 96, "ar5", 30, INK2)
        sx, sy = 120 + 0, 0
        cx, cy = 230, bh - 70
        col = INK if not sent else MAG
        d.ellipse((cx - 36, cy - 36, cx + 36, cy + 36), fill=col)
        d.line((cx, cy + 16, cx, cy - 16), fill=(255, 255, 255), width=6)
        d.line((cx - 13, cy - 3, cx, cy - 16, cx + 13, cy - 3), fill=(255, 255, 255), width=6)
        chips = ["ريلز", "ستوريز", "إعلانات"]
        x = bw - 40
        for ch in chips:
            spr, pad = tsprite(ch, "ar5", 30, INK2, 0.0, 100)
            cw = spr.width - 2 * pad + 40
            d.rounded_rectangle((x - cw, bh - 100, x, bh - 40), 30, fill=(245, 242, 248))
            T(im, ch, x - 20, bh - 96, "ar5", 30, INK2, anchor="r")
            x -= cw + 14
    card(c, bx, by, bw, bh, ba, sc, content=content)
    # cursor travels to send button
    p = eio(prog(lt, 2.7, .8))
    cx0, cy0 = W * .78, 1500
    cx1, cy1 = bx + 230, by + bh - 70
    ca = eo(prog(lt, 2.5, .3)) * (1 - eo(prog(lt, 4.3, .4)))
    press = 1 if 3.45 < lt < 3.65 else 0
    cursor(c, cx0 + (cx1 - cx0) * p, cy0 + (cy1 - cy0) * p, ca, press)
    click_ring(c, cx1, cy1, (lt - 3.5) / .5)
    # sent bubble
    sa, sd = env(lt, 3.8, D - .4, din=.4)
    if sa > 0:
        T(c, "تمّ ✓  خليه علينا", W / 2, 1140 + sd, "ar6", 46, MAG, a=sa)

FLOAT_CHIPS = [("Reels", -330, -260, ORA), ("Calendar", 320, -200, MAG), ("Analytics", -290, 590, PUR), ("Portal", 300, 640, BLU)]

def L_intro(c, lt, D):
    cx, cy = W / 2, 800
    a0, d0 = env(lt, .1, D - .45)
    T(c, "Introducing", W / 2, 470 + d0, "sg6", 46, INK2, a=a0, track=1)
    s = espring(prog(lt, .25, 1.0))
    la = eo(prog(lt, .25, .3)) * (1 - eio(prog(lt, D - .45, .4)))
    logo(c, cx, cy, 250 * max(.01, s), la, sweep=prog(lt, 1.0, .8), glow=.35)
    for i, (nm, dx, dy, col) in enumerate(FLOAT_CHIPS):
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
    T(c, "Spotlight Social", W / 2, 1010 + d1, "sg7", 120, INK, a=a1, track=-4)
    a2, d2 = env(lt, 1.3, D - .35)
    T(c, "السوشيال ميديا ديالك،", W / 2, 1180 + d2, "ar6", 54, INK2, a=a2)
    a3, d3 = env(lt, 1.6, D - .3)
    T(c, "مسيّرة من الألف للياء", W / 2, 1265 + d3, "ar7", 64, "hot", a=a3)

CAL_T = [(MAG, "ريلز"), (ORA, "بوست"), (BLU, "ستوري"), (PUR, "كاروسيل")]

def L_calendar(c, lt, D):
    a0, d0 = env(lt, .05, D - .45)
    T(c, "خطة · ريلز · ستوري تيلينغ", W / 2, 250 + d0, "ar7", 60, INK, a=a0)
    a1, d1 = env(lt, .2, D - .4)
    T(c, "كلشي واجد قبل ما يبدا الشهر", W / 2, 345 + d1, "ar5", 40, INK2, a=a1)
    wx, wy, ww, wh = 60, 470, W - 120, 900
    wa = eo(prog(lt, .25, .4)) * (1 - eio(prog(lt, D - .45, .4)))
    ws = .9 + .1 * espring(prog(lt, .25, 1.0))
    drop_p = eio(prog(lt, 3.0, 1.1))
    dropped = lt > 4.1
    def content(im):
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((0, 0, ww - 1, 80), 36, fill=(247, 244, 250)); d.rectangle((0, 40, ww - 1, 80), fill=(247, 244, 250))
        for i, col in enumerate([(255, 95, 87), (254, 188, 46), (40, 200, 64)]):
            d.ellipse((30 + i * 34, 28, 52 + i * 34, 50), fill=col)
        T(im, "Content Calendar", ww / 2, 22, "sg6", 32, INK2, track=0)
        gx, gy, cw, ch = 30, 120, (ww - 60) / 7, 128
        days = ["ح", "ن", "ث", "ر", "خ", "ج", "س"]
        for k, dd in enumerate(days):
            T(im, dd, ww - 30 - (k + .5) * cw, gy - 6, "ar5", 28, INK2)
        for r in range(4):
            for col in range(7):
                X = ww - 30 - (col + 1) * cw; Y = gy + 40 + r * ch
                d.rounded_rectangle((X + 5, Y + 5, X + cw - 5, Y + ch - 5), 16, fill=(249, 247, 251), outline=(0, 0, 0, 14))
                T(im, str(r * 7 + col + 1), X + cw - 16, Y + 12, "sg5", 22, (170, 166, 180), anchor="r", track=0)
        k = 0
        for r in range(4):
            for col in range(7):
                if (r * 7 + col) % 3 == 2 or (r == 1 and col == 3): continue
                st = .6 + k * .07; k += 1
                p = espring(prog(lt, st, .7))
                if p <= 0: continue
                X = ww - 30 - (col + 1) * cw; Y = gy + 40 + r * ch
                ty = (r * 7 + col) % 4; colr = CAL_T[ty][0]
                tw2, th2 = (cw - 22) * p, 50 * p
                cxx, cyy = X + cw / 2, Y + ch / 2 + 14
                d.rounded_rectangle((cxx - tw2 / 2, cyy - th2 / 2, cxx + tw2 / 2, cyy + th2 / 2), 12, fill=colr)
                if p > .9 and (r + col) % 3 == 0:
                    check(d, cxx, cyy, 22, (255, 255, 255), 5)
        if dropped:
            r, col = 1, 3
            X = ww - 30 - (col + 1) * cw; Y = gy + 40 + r * ch
            p = espring(prog(lt, 4.1, .6))
            cxx, cyy = X + cw / 2, Y + ch / 2 + 14
            d.rounded_rectangle((cxx - (cw - 22) / 2 * p, cyy - 25 * p, cxx + (cw - 22) / 2 * p, cyy + 25 * p), 12, fill=MAG)
        # legend + tray
        ly = gy + 40 + 4 * ch + 30
        x = ww - 40
        for colr, nm in CAL_T:
            spr, pad = tsprite(nm, "ar5", 30, INK2, 0.0, 100)
            T(im, nm, x, ly, "ar5", 30, INK2, anchor="r")
            d.rounded_rectangle((x - spr.width + 2 * pad - 44, ly + 12, x - spr.width + 2 * pad - 14, ly + 32), 6, fill=colr)
            x -= spr.width - 2 * pad + 80
        d.rounded_rectangle((30, ly + 70, ww - 30, ly + 170), 24, fill=(247, 244, 250))
        T(im, "ريل جديد: الكواليس ديال الخدمة", ww - 60, ly + 98, "ar6", 34, INK, anchor="r")
        if not dropped and drop_p < .05:
            d.rounded_rectangle((60, ly + 92, 200, ly + 148), 12, fill=MAG)
    card(c, wx, wy, ww, wh, wa, ws, content=content)
    # dragged tile + cursor
    gx, gy, cw, ch = 30, 120, (ww - 60) / 7, 128
    ly = gy + 40 + 4 * ch + 30
    sx, sy = wx + 130, wy + ly + 120
    tx = wx + ww - 30 - 4 * cw + cw / 2; ty = wy + gy + 40 + ch + ch / 2 + 14
    if .0 < drop_p < 1 and not dropped:
        px, py = sx + (tx - sx) * drop_p, sy + (ty - sy) * drop_p - math.sin(drop_p * math.pi) * 120
        tile = rrect_sprite(140, 56, 12, MAG + (255,), MAG + (255,), 1)
        sh, pad = shadow(140, 56, 12, 20, 90, 18)
        place(c, sh, px - 70 - pad, py - 28 - pad, wa)
        place(c, tile, px - 70, py - 28, wa, 1.08)
        cursor(c, px + 30, py + 10, wa, 1)
    else:
        ca = eo(prog(lt, 2.4, .3)) * (1 - eo(prog(lt, 4.8, .4)))
        if lt < 3.0:
            p = eio(prog(lt, 2.4, .6)); cursor(c, W * .8 + (sx + 30 - W * .8) * p, 1700 + (sy + 10 - 1700) * p, ca)
        else:
            cursor(c, tx + 30, ty + 10, ca)
    a3, d3 = env(lt, 4.5, D - .3, din=.4)
    T(c, "بلا ما تتعب ✓".replace("✓", ""), W / 2, 1450 + d3, "ar7", 56, "hot", a=a3)

def L_portal(c, lt, D):
    a0, d0 = env(lt, .05, D - .45)
    T(c, "بورطال خاص بيك", W / 2, 250 + d0, "ar7", 76, INK, a=a0)
    a1, d1 = env(lt, .2, D - .4)
    T(c, "موافقة · ريبورتينغ · كلشي فبلاصة وحدة", W / 2, 365 + d1, "ar5", 40, INK2, a=a1)
    wx, wy, ww, wh = 60, 480, W - 120, 930
    wa = eo(prog(lt, .25, .4)) * (1 - eio(prog(lt, D - .45, .4)))
    ws = .9 + .1 * espring(prog(lt, .25, 1.0))
    approved = lt > 3.35
    def content(im):
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((0, 0, ww - 1, 80), 36, fill=(247, 244, 250)); d.rectangle((0, 40, ww - 1, 80), fill=(247, 244, 250))
        for i, col in enumerate([(255, 95, 87), (254, 188, 46), (40, 200, 64)]):
            d.ellipse((30 + i * 34, 28, 52 + i * 34, 50), fill=col)
        T(im, "Spotlight Portal", ww / 2, 22, "sg6", 32, INK2, track=0)
        im.alpha_composite(logo_at(46), (ww - 76, 18))
        # KPI tiles
        kp = [("مشاهدات", MAG), ("تفاعل", ORA), ("متابعين", PUR)]
        tw = (ww - 80) / 3
        for i, (nm, col) in enumerate(kp):
            p = espring(prog(lt, .6 + i * .15, .7))
            X = ww - 30 - (i + 1) * tw - i * 10 + 10; Y = 110
            d.rounded_rectangle((X, Y, X + tw, Y + 170), 22, fill=(249, 247, 251), outline=(0, 0, 0, 14))
            T(im, nm, X + tw - 24, Y + 20, "ar6", 32, INK2, anchor="r")
            pts = [(X + 24 + k * (tw - 48) / 7, Y + 140 - (k ** 1.4) * 9 * p - math.sin(k * 1.7 + i) * 6 * p) for k in range(8)]
            d.line(pts, fill=col, width=6, joint="curve")
            d.polygon([(X + 24, Y + 60), (X + 40, Y + 44), (X + 56, Y + 60)], fill=GREEN)
        # bar chart
        T(im, "ريبورتينغ نونبر", ww - 40, 320, "ar7", 40, INK, anchor="r")
        bx0, by0, bh0 = 40, 400, 220
        g = grad_img("hot", 60, bh0, 180)
        for k in range(8):
            p = eo(prog(lt, 1.0 + k * .08, .6))
            hh = (.3 + .6 * (k / 7) ** 1.3 + .08 * math.sin(k * 2.1)) * bh0 * p
            X = bx0 + k * ((ww - 80) / 8) + 10
            if hh > 2:
                bar = g.resize((60, int(hh))).convert("RGBA")
                m = Image.new("L", bar.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, 59, int(hh) - 1), 12, fill=255)
                bar.putalpha(m); im.alpha_composite(bar, (int(X), int(by0 + bh0 - hh)))
        # approval row
        ry = 670
        d.rounded_rectangle((30, ry, ww - 30, ry + 200), 24, fill=(249, 247, 251), outline=(0, 0, 0, 14))
        th = grad_img("aurora", 110, 160, 140).convert("RGBA")
        m = Image.new("L", th.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, 109, 159), 16, fill=255); th.putalpha(m)
        im.alpha_composite(th, (ww - 170, ry + 20))
        d.polygon([(ww - 128, ry + 78), (ww - 128, ry + 122), (ww - 92, ry + 100)], fill=(255, 255, 255))
        T(im, "ريل: الكواليس ديال الخدمة", ww - 196, ry + 36, "ar6", 34, INK, anchor="r")
        T(im, "كيتسنى الموافقة ديالك" if not approved else "تمّت الموافقة", ww - 196, ry + 96, "ar5", 30,
          INK2 if not approved else GREEN, anchor="r")
        bw2 = 210
        if approved:
            d.rounded_rectangle((50, ry + 66, 50 + bw2, ry + 136), 35, fill=GREEN)
            check(d, 50 + bw2 / 2, ry + 100, 30, (255, 255, 255), 6)
        else:
            d.rounded_rectangle((50, ry + 66, 50 + bw2, ry + 136), 35, fill=INK)
            T(im, "وافق", 50 + bw2 / 2, ry + 76, "ar7", 34, (255, 255, 255))
    card(c, wx, wy, ww, wh, wa, ws, content=content)
    bxc, byc = wx + 50 + 105, wy + 670 + 101
    p = eio(prog(lt, 2.3, .9))
    ca = eo(prog(lt, 2.1, .3)) * (1 - eo(prog(lt, 4.6, .4)))
    cursor(c, W * .85 + (bxc - W * .85) * p, 1750 + (byc - 1750) * p, ca, 1 if 3.25 < lt < 3.45 else 0)
    click_ring(c, bxc, byc, (lt - 3.3) / .5)
    if approved:
        for k in range(10):
            ang = k / 10 * 6.28; q = eo(prog(lt, 3.35, .7))
            g = glow_dot(5, [MAG, ORA, PUR, CYA, YEL][k % 5], 1.)
            place(c, g, bxc + math.cos(ang) * 120 * q - g.width / 2, byc + math.sin(ang) * 120 * q - g.height / 2, 1 - q)

def L_clients(c, lt, D):
    a0, d0 = env(lt, .05, D - .45)
    T(c, "كيخدمو معانا", W / 2, 300 + d0, "ar7", 96, INK, a=a0)
    for i, (nm, handle, sub, stat, lab, gk, mono, st) in enumerate(R2.CLIENTS):
        st = .35 + i * .45
        pa = eo(prog(lt, st, .3)) * (1 - eio(prog(lt, D - .45 + i * .04, .4)))
        ps = .7 + .3 * espring(prog(lt, st, .9))
        bw, bh = W - 140, 250
        def content(im, nm=nm, handle=handle, sub=sub, stat=stat, lab=lab, gk=gk, mono=mono):
            im.alpha_composite(monogram(*mono), (36, bh // 2 - 60))
            T(im, nm, 186, 52, "sg7", 50 if len(nm) < 16 else 44, INK, anchor="l", track=-1)
            T(im, handle, 186, 128, "it5" if handle.startswith("@") else "ar5", 32, INK2, anchor="l")
            if sub: T(im, sub, 186, 176, "ar5", 30, INK2, anchor="l")
            T(im, stat, bw - 40, 54, "sg7", 84, gk, anchor="r", track=-3, gangle=90)
            T(im, lab, bw - 40, 160, "ar6", 34, INK2, anchor="r")
        card(c, 70, 500 + i * 300, bw, bh, pa, ps, content=content)

L_PLANS = [("Basic", "3.000", ["6 ريلز احترافية", "ستوري تيلينغ · ستوريز"]),
           ("Advanced", "6.000", ["12 ريلز + ريبورتينغ", "كلشي اللي فالـ Basic"]),
           ("VIP", "9.000", ["24 ريلز + إعلانات فجميع المنصات", "ستراتيجية كاملة + كلشي اللي فالـ Advanced"])]

def L_pricing(c, lt, D):
    a0, d0 = env(lt, .05, D - .45)
    T(c, "اختار الباكاج ديالك", W / 2, 250 + d0, "ar7", 84, INK, a=a0)
    picked = lt > 4.75
    for i, (nm, price, feats) in enumerate(L_PLANS):
        st = .3 + i * .3
        dark = i == 2
        pa = eo(prog(lt, st, .3)) * (1 - eio(prog(lt, D - .45 + i * .04, .4)))
        ps = .75 + .25 * espring(prog(lt, st, .9))
        if dark and picked: ps *= 1 + .03 * espring(prog(lt, 4.75, .6))
        bw, bh = W - 140, 300
        def content(im, nm=nm, price=price, feats=feats, dark=dark):
            d = ImageDraw.Draw(im)
            txt = (255, 255, 255) if dark else INK
            sub = (190, 186, 210) if dark else INK2
            T(im, nm, 44, 34, "sg7", 64, "aurora" if dark else INK, anchor="l", track=-1)
            T(im, price, bw - 44, 30, "sg7", 74, "hot" if dark else INK, anchor="r", track=-2)
            T(im, "درهم / الشهر", bw - 44, 116, "ar5", 30, sub, anchor="r")
            for j, f in enumerate(feats):
                T(im, f, bw - 44, 160 + j * 50, "ar6" if j == 0 else "ar5", 36 if j == 0 else 31, txt if j == 0 else sub, anchor="r")
            if dark:
                bc = GREEN if picked else (255, 255, 255)
                d.rounded_rectangle((40, bh - 96, 250, bh - 36), 30, fill=bc)
                if picked: check(d, 145, bh - 66, 26, (255, 255, 255), 6)
                else: T(im, "اختار", 145, bh - 92, "ar7", 32, INK)
        fill = (16, 13, 26, 255) if dark else (255, 255, 255, 255)
        y = 400 + i * 330
        card(c, 70, y, bw, bh, pa, ps, fill=fill, border=(255, 111, 105, 255) if dark else (0, 0, 0, 18), content=content)
        if dark:
            pw = 290
            place(c, grad_pill("hot", pw, 58), W / 2 - pw / 2, y - 29, pa)
            T(c, "الباكاج الكامل", W / 2, y - 25, "ar7", 32, (255, 255, 255), a=pa)
    bxc, byc = 70 + 145, 400 + 2 * 330 + 300 - 66
    p = eio(prog(lt, 3.6, 1.0))
    ca = eo(prog(lt, 3.4, .3)) * (1 - eo(prog(lt, D - .6, .3)))
    cursor(c, W * .8 + (bxc - W * .8) * p, 1800 + (byc - 1800) * p, ca, 1 if 4.65 < lt < 4.85 else 0)
    click_ring(c, bxc, byc, (lt - 4.7) / .5)

def L_cta(c, lt, D):
    s = espring(prog(lt, .1, 1.0))
    logo(c, W / 2, 560, 240 * max(.01, s), eo(prog(lt, .1, .3)), sweep=prog(lt, .8, .8), glow=.3)
    a1, d1 = env(lt, .4, 99)
    T(c, "بدا اليوم.", W / 2, 750 + d1, "ar7", 140, INK, a=a1)
    a2, d2 = env(lt, .7, 99)
    T(c, "السوشيال ميديا ديالك علينا", W / 2, 975 + d2, "ar6", 56, "hot", a=a2)
    ba = eo(prog(lt, 1.0, .4)); bs = .8 + .2 * espring(prog(lt, 1.0, .9))
    bw, bh = 660, 130
    def content(im):
        tw = T(im, "صيفط لينا فواتساب", bw / 2 - 40, 28, "ar7", 54, (255, 255, 255))
        im.alpha_composite(icon_layer(70, 70, chat_icon, 35, 35, 52, (255, 255, 255)), (int(bw / 2 + tw / 2 - 10), 30))
    card(c, W / 2 - bw / 2, 1110, bw, bh, ba, bs, fill=INK + (255,), border=INK + (255,), r=65, content=content)
    a4, d4 = env(lt, 1.4, 99)
    T(c, "+212 701 177 915", W / 2, 1300 + d4, "sg7", 66, INK, a=a4, track=0)
    a5, d5 = env(lt, 1.6, 99)
    T(c, "spotlightadz.ma", W / 2, 1395 + d5, "it5", 42, INK2, a=a5, track=1)

# ======================= VARIANT K: keynote reveal =======================
@functools.lru_cache(maxsize=4000)
def blurred(s, fk, size, fill, r):
    spr, pad = tsprite(s, fk, size, fill, round(-0.03 * size if fk.startswith("sg") else 0, 2), 100)
    if r <= 0: return spr, pad
    big = Image.new("RGBA", (spr.width + r * 4, spr.height + r * 4), (0, 0, 0, 0))
    big.alpha_composite(spr, (r * 2, r * 2))
    return big.filter(ImageFilter.GaussianBlur(r)), pad + r * 2

def reveal(c, s, y, lt, t0, t1=99, fk="ar7", size=110, fill="fg", x=W / 2, dur=1.0, out=.6):
    """keynote text reveal: blur -> sharp, slight scale-down, fade; fades out at t1"""
    p = eo(prog(lt, t0, dur))
    q = eio(prog(lt, t1, out))
    a = p * (1 - q)
    if a <= .003: return
    r = int(round((1 - p) * 22 + q * 14))
    spr, pad = blurred(s, fk, size, fill, r)
    sc = 1.06 - .06 * p + .03 * q
    place(c, spr, x - spr.width / 2, y - pad - q * 20, a, sc)

def soft_glow(c, x, y, rad, col, a):
    if a <= 0: return
    g = glow_dot(rad, col, .6)
    place(c, g, x - g.width / 2, y - g.height / 2, a)

def K1(c, lt, D):
    reveal(c, "اليوم…", 860, lt, .5, 1.7, "ar7", 150)
    reveal(c, "غادي نبدلو الطريقة", 800, lt, 1.75, D - .7, "ar7", 96)
    reveal(c, "اللي كيبان بيها البراند ديالك.", 940, lt, 2.15, D - .7, "ar6", 74, (200, 200, 214))

def K2(c, lt, D):
    # horizontal light beam sweeping before the logo
    bp = prog(lt, .0, 1.0)
    if 0 < bp < 1:
        s = R2.streak(1400, 60, (255, 160, 200))
        place(c, s, W / 2 - 700 + (bp - .5) * 400, 760 - 30, math.sin(bp * math.pi) * .9)
    la = eo(prog(lt, .5, 1.2)) * (1 - eio(prog(lt, D - .7, .6)))
    soft_glow(c, W / 2, 760, 220, MAG, la * .5)
    if la > 0:
        r = int((1 - eo(prog(lt, .5, 1.2))) * 26)
        L = logo_at(340)
        if r > 0:
            big = Image.new("RGBA", (L.width + r * 4, L.height + r * 4), (0, 0, 0, 0)); big.alpha_composite(L, (r * 2, r * 2))
            L = big.filter(ImageFilter.GaussianBlur(r))
        place(c, L, W / 2 - L.width / 2, 760 - L.height / 2, la, 1.08 - .08 * eo(prog(lt, .5, 1.6)))
    reveal(c, "Spotlight Adz", 1010, lt, 1.3, D - .7, "sg6", 104)
    reveal(c, "السوشيال ميديا…", 1180, lt, 2.4, D - .7, "ar6", 70, (200, 200, 214))
    reveal(c, "بطريقة جديدة.", 1280, lt, 3.2, D - .7, "ar7", 90, "aurora")

def K3(c, lt, D):
    words = [("ريلز.", "احترافية", "hot", .3), ("ستوري تيلينغ.", "كل فيديو عندو قصة", "aurora", 1.75),
             ("ريبورتينغ.", "كل شهر، بالأرقام", "cool", 3.15)]
    for i, (w_, sub, gk, st) in enumerate(words):
        end = words[i + 1][3] if i + 1 < len(words) else D - .7
        soft_glow(c, W / 2, 900, 200, [MAG, PUR, BLU][i], .35 * eo(prog(lt, st, .8)) * (1 - eio(prog(lt, end, .5))))
        reveal(c, w_, 800, lt, st, end, "ar7", 170, gk, out=.45)
        reveal(c, sub, 1030, lt, st + .4, end, "ar5", 54, (190, 190, 205), out=.45)

def K4(c, lt, D):
    k = eio(prog(lt, .5, 1.8))
    soft_glow(c, W / 2, 820, 260, MAG, .45 * eo(prog(lt, .5, 1)) * (1 - eio(prog(lt, 3.3, .6))))
    p = eo(prog(lt, .5, 1.0)); q = eio(prog(lt, 3.3, .6)); a = p * (1 - q)
    if a > 0:
        spr, pad = tsprite(f"{151.2 * k:.1f}K", "sg7", 260, "hot", -10.0, 100)
        r = int((1 - p) * 20)
        if r: spr = spr.filter(ImageFilter.GaussianBlur(r))
        place(c, spr, W / 2 - spr.width / 2, 680 - pad - q * 30, a, 1.05 - .05 * p)
    reveal(c, "مشاهدة… فريل وحدة.", 1000, lt, 1.6, 3.3, "ar6", 64, (200, 200, 214))
    names = ["Happy Fitness", "Grillade Khay Ahmed", "Aboujoud"]
    for i, nm in enumerate(names):
        reveal(c, nm, 700 + i * 150, lt, 3.7 + i * .45, D - .7, "sg6", 74)
    reveal(c, "كيتيقو فينا.", 1200, lt, 5.2, D - .7, "ar7", 84, "aurora")

def K5(c, lt, D):
    reveal(c, "و الثمن؟", 760, lt, .35, 1.6, "ar7", 120)
    ga = eo(prog(lt, 1.7, 1.0)) * (1 - eio(prog(lt, D - .7, .6)))
    soft_glow(c, W / 2, 900, 280, ORA, .6 * ga)
    if 1.6 < lt < 2.6:
        s = R2.streak(1300, 70, (255, 170, 120))
        place(c, s, W / 2 - 650, 870, math.sin(prog(lt, 1.6, 1.0) * math.pi) * .8)
    reveal(c, "كيبدا غير من", 660, lt, 1.7, D - .7, "ar6", 60, (200, 200, 214))
    reveal(c, "3.000", 760, lt, 1.9, D - .7, "sg7", 300, "warm", dur=1.2)
    reveal(c, "درهم / الشهر", 1100, lt, 2.5, D - .7, "ar6", 64, (200, 200, 214))

def K6(c, lt, D):
    reveal(c, "و حاجة وحدة أخرى…", 860, lt, .4, 2.7, "ar7", 104)
    ga = eo(prog(lt, 3.0, 1.0)) * (1 - eio(prog(lt, D - .7, .6)))
    soft_glow(c, W / 2, 660, 300, PUR, .55 * ga)
    soft_glow(c, W / 2, 660, 200, MAG, .45 * ga * (.8 + .2 * math.sin(lt * 3)))
    reveal(c, "VIP", 520, lt, 3.0, D - .7, "sg7", 320, "aurora", dur=1.3)
    lines = [("24 ريل احترافي", 4.2), ("إعلانات فجميع المنصات", 4.9), ("ستراتيجية كاملة", 5.7)]
    for i, (ln, st) in enumerate(lines):
        reveal(c, ln, 960 + i * 110, lt, st, D - .7, "ar6", 66)
    reveal(c, "9.000 درهم / الشهر", 1340, lt, 7.0, D - .7, "ar6", 56, (200, 200, 214))

def K7(c, lt, D):
    la = eo(prog(lt, .3, 1.2))
    soft_glow(c, W / 2, 700, 230, MAG, .5 * la)
    if la > 0:
        r = int((1 - eo(prog(lt, .3, 1.2))) * 24)
        L = logo_at(300)
        if r:
            big = Image.new("RGBA", (L.width + r * 4, L.height + r * 4), (0, 0, 0, 0)); big.alpha_composite(L, (r * 2, r * 2))
            L = big.filter(ImageFilter.GaussianBlur(r))
        place(c, L, W / 2 - L.width / 2, 700 - L.height / 2, la)
    reveal(c, "Spotlight Adz", 920, lt, .9, 99, "sg6", 96)
    reveal(c, "صيفط لينا فواتساب", 1080, lt, 1.4, 99, "ar6", 60, (200, 200, 214))
    reveal(c, "+212 701 177 915", 1180, lt, 1.8, 99, "sg6", 76, "aurora")
    reveal(c, "spotlightadz.ma", 1310, lt, 2.3, 99, "it5", 40, (150, 150, 168))

# ======================= timelines =======================
VARIANTS = {
    "L": dict(
        scenes=[("l1_hook", 5.6, "L1", 0.35, L_hook), ("l2_intro", 6.4, "L2", 0.4, L_intro),
                ("l3_calendar", 7.0, "L3", 0.4, L_calendar), ("l4_portal", 6.6, "L4", 0.4, L_portal),
                ("l5_clients", 5.2, "L5", 0.4, L_clients), ("l6_pricing", 6.8, "L6", 0.35, L_pricing),
                ("l7_cta", 4.8, "L7", 0.5, L_cta)],
        light=True),
    "K": dict(
        scenes=[("k1_today", 5.0, "K1", 0.6, K1), ("k2_reveal", 6.4, "K2", 0.5, K2), ("k3_features", 6.4, "K3", 0.3, K3),
                ("k4_proof", 8.0, "K4", 0.4, K4), ("k5_price", 5.8, "K5", 0.3, K5), ("k6_onemore", 10.0, "K6", 0.4, K6),
                ("k7_end", 5.8, "K7", 0.5, K7)],
        light=False),
}
for v in VARIANTS.values():
    acc = 0.; v["times"] = {}
    for (k, d, *_rest) in v["scenes"]:
        v["times"][k] = (acc, acc + d); acc += d
    v["total"] = acc

def kbg(t):
    """keynote stage: black with a faint cool center lift"""
    return _kbg().copy()

@functools.lru_cache(None)
def _kbg():
    yy, xx = np.mgrid[0:LH, 0:LW].astype(np.float32)
    d = np.sqrt(((xx - LW / 2) / LW) ** 2 + ((yy - LH * .45) / LH) ** 2)
    v = np.clip(1 - d * 1.6, 0, 1) ** 2
    arr = np.zeros((LH, LW, 3), np.float32)
    arr[..., 0] = 2 + 10 * v; arr[..., 1] = 2 + 8 * v; arr[..., 2] = 5 + 18 * v
    return Image.fromarray(arr.astype(np.uint8), "RGB").resize((W, H), Image.BICUBIC).convert("RGBA")

def grade_light(arr):
    x = arr.astype(np.float32)
    lum = (x * np.array([.2126, .7152, .0722], np.float32)).sum(2, keepdims=True)
    x = lum + (x - lum) * 1.12
    return np.clip(x, 0, 255).astype(np.uint8)

def frame(var, t):
    V = VARIANTS[var]
    for (k, D, vo, off, fn) in V["scenes"]:
        a, b = V["times"][k]
        if t < b or k == V["scenes"][-1][0]: break
    lt = t - a
    if V["light"]:
        bg = lbg(t)
        lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        fn(lay, lt, D)
        push = 1 + .035 * lt / D
        # quick dissolve between scenes
        fa = min(1, eo(lt / .3), eo((D - lt) / .25)) if k != V["scenes"][0][0] else min(1, eo((D - lt) / .25))
        if k == V["scenes"][-1][0]: fa = eo(lt / .3)
    else:
        bg = kbg(t)
        lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        fn(lay, lt, D)
        push = 1 + .025 * lt / D
        fa = 1.
    if abs(push - 1) > 1e-3:
        nw, nh = int(W * push), int(H * push)
        lay = lay.resize((nw, nh), Image.BILINEAR).crop(((nw - W) // 2, (nh - H) // 2, (nw - W) // 2 + W, (nh - H) // 2 + H))
    if fa < .999: lay = with_alpha(lay, fa)
    bg.alpha_composite(lay)
    arr = np.asarray(bg.convert("RGB"))
    if V["light"]:
        out = grade_light(arr)
    else:
        out = grade(arr.astype(np.int16))
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
