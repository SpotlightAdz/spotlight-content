#!/usr/bin/env python3
"""Spotlight Adz — Social Media Management reel, Moroccan Darija (45s, 1080x1920, 30fps).
Usage: render2.py <scene> out.mp4 | render2.py still <t> out.png
"""
import sys, os, math, random, functools, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
import render as R
from render import (W, H, FPS, FG, MUTED, YEL, ORA, RED, MAG, PINK, PUR, BLU, CYA, CORAL,
                    clamp, eo, eio, eback, prog, env, grad_img, glow_dot, place, with_alpha,
                    rrect_sprite, grad_pill, STOPS)

HERE = os.path.dirname(os.path.abspath(__file__))
LOGO_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "logo.webp")

FONTS = {
    "sg5": "space-grotesk-500", "sg6": "space-grotesk-600", "sg7": "space-grotesk-700",
    "it4": "inter-tight-400", "it5": "inter-tight-500", "it6": "inter-tight-600",
    "ar5": "readex-500", "ar6": "readex-600", "ar7": "readex-700",
}

@functools.lru_cache(None)
def FT(key, size):
    return ImageFont.truetype(f"{HERE}/fonts/{FONTS[key]}.ttf", size)

def is_ar(s): return any("؀" <= ch <= "ۿ" for ch in s)

@functools.lru_cache(None)
def tsprite(s, fk, size, fill="fg", track=0.0, gangle=100):
    f = FT(fk, size)
    kw = {}
    if is_ar(s): kw = dict(direction="rtl", language="ar")
    dummy = ImageDraw.Draw(Image.new("L", (4, 4)))
    pad = int(size * .35)
    if track and not is_ar(s):
        w = f.getlength(s) + track * (len(s) - 1)
    else:
        b = dummy.textbbox((0, 0), s, font=f, **kw); w = b[2] - min(0, b[0])
    asc, desc = f.getmetrics()
    tw, th = int(w) + pad * 2, asc + desc + pad * 2
    m = Image.new("L", (tw, th), 0); d = ImageDraw.Draw(m)
    if track and not is_ar(s):
        x = pad
        for i, ch in enumerate(s):
            d.text((x, pad), ch, font=f, fill=255)
            x += f.getlength(ch) + track
            if i + 1 < len(s): x += f.getlength(s[i:i+2]) - f.getlength(s[i]) - f.getlength(s[i+1])
    else:
        d.text((pad, pad), s, font=f, fill=255, **kw)
    if fill in STOPS: col = grad_img(fill, tw, th, gangle)
    else:
        rgb = FG if fill == "fg" else MUTED if fill == "muted" else fill
        col = Image.new("RGB", (tw, th), rgb)
    spr = col.convert("RGBA"); spr.putalpha(m)
    return spr, pad

def T(c, s, x, y, fk="ar7", size=96, fill="fg", a=1., scale=1., anchor="c", track=None, gangle=100):
    """anchor: c (center x), l (left x), r (right x). y is the text top."""
    if track is None: track = -0.03 * size if fk.startswith("sg") else 0
    spr, pad = tsprite(s, fk, size, fill, round(track, 2), gangle)
    if anchor == "c": px = x - spr.width / 2
    elif anchor == "l": px = x - pad
    else: px = x - spr.width + pad
    place(c, spr, px, y - pad, a, scale)
    return spr.width - 2 * pad

# ---------------- logo ----------------
@functools.lru_cache(None)
def logo_src():
    im = Image.open(LOGO_PATH).convert("RGBA")
    bb = im.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox()
    return im.crop(bb)

@functools.lru_cache(None)
def logo_at(d):
    return logo_src().resize((d, int(d * logo_src().height / logo_src().width)), Image.LANCZOS)

def logo(c, cx, cy, d, a=1., sweep=-1., glow=.6):
    d = int(d)
    if d < 6 or a <= .003: return
    g = glow_dot(max(10, d // 3), MAG, .9)
    place(c, g, cx - g.width / 2, cy - g.height / 2, a * glow)
    L = logo_at(d)
    if 0 <= sweep <= 1:  # specular light sweep masked to the logo
        L = L.copy()
        band = Image.new("L", L.size, 0); bd = ImageDraw.Draw(band)
        x = -L.width * .6 + sweep * L.width * 2.2
        bd.polygon([(x, 0), (x + L.width * .28, 0), (x + L.width * .05, L.height), (x - L.width * .23, L.height)], fill=170)
        band = band.filter(ImageFilter.GaussianBlur(d * .04))
        band = ImageChops.multiply(band, L.getchannel("A"))
        white = Image.new("RGBA", L.size, (255, 255, 255, 0)); white.putalpha(band)
        L.alpha_composite(white)
    place(c, L, cx - L.width / 2, cy - L.height / 2, a)

# ---------------- icons ----------------
def heart(d, x, y, s, col, fill=True, w=4):
    r = s * .27
    pts = []
    for k in range(60):
        t = k / 59 * 2 * math.pi
        hx = 16 * math.sin(t) ** 3
        hy = -(13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t))
        pts.append((x + hx * s / 34, y + hy * s / 34))
    if fill: d.polygon(pts, fill=col)
    else: d.line(pts + [pts[0]], fill=col, width=w, joint="curve")

def eye(d, x, y, s, col, w=4):
    d.ellipse((x - s * .55, y - s * .3, x + s * .55, y + s * .3), outline=col, width=w)
    d.ellipse((x - s * .15, y - s * .15, x + s * .15, y + s * .15), fill=col)

def bubble(d, x, y, s, col, w=4):
    d.rounded_rectangle((x - s * .5, y - s * .38, x + s * .5, y + s * .25), s * .2, outline=col, width=w)
    d.polygon([(x - s * .2, y + s * .22), (x - s * .32, y + s * .45), (x, y + s * .23)], fill=col)

def person_plus(d, x, y, s, col, w=4):
    d.ellipse((x - s * .38, y - s * .45, x - s * .02, y - s * .09), outline=col, width=w)
    d.arc((x - s * .55, y - s * .02, x + s * .15, y + s * .6), 180, 360, fill=col, width=w)
    d.line((x + s * .25, y - s * .15, x + s * .55, y - s * .15), fill=col, width=w)
    d.line((x + s * .4, y - s * .3, x + s * .4, y), fill=col, width=w)

def target(d, x, y, s, col, w=4):
    for k in (1, .62, .25):
        if k == .25: d.ellipse((x - s * k / 2, y - s * k / 2, x + s * k / 2, y + s * k / 2), fill=col)
        else: d.ellipse((x - s * k / 2, y - s * k / 2, x + s * k / 2, y + s * k / 2), outline=col, width=w)

def chat_icon(d, x, y, s, col):
    d.ellipse((x - s / 2, y - s / 2, x + s / 2, y + s / 2), outline=col, width=5)
    d.polygon([(x - s * .38, y + s * .25), (x - s * .5, y + s * .52), (x - s * .15, y + s * .43)], fill=col)
    # phone receiver
    d.arc((x - s * .22, y - s * .22, x + s * .22, y + s * .22), 100, 260, fill=col, width=7)

def icon_layer(w, h, fn, *args):
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); fn(ImageDraw.Draw(im), *args); return im

# ---------------- VFX ----------------
rng = np.random.default_rng(7)
DUST = [(rng.uniform(0, W), rng.uniform(0, H), rng.uniform(.4, 1.2), rng.uniform(2, 5), rng.uniform(0, 6.28))
        for _ in range(45)]

def dust(c, t, a=1.):
    for (x, y, sp, r, ph) in DUST:
        yy = (y - t * 40 * sp) % H
        xx = x + math.sin(t * .6 * sp + ph) * 30
        g = glow_dot(int(r), (255, 220, 235), .8)
        place(c, g, xx - g.width / 2, yy - g.height / 2, a * (.25 + .2 * math.sin(t * 2 + ph)))

@functools.lru_cache(None)
def streak(w, h, rgb):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    dx = (xx - w / 2) / (w / 2); dy = (yy - h / 2) / (h / 2)
    a = np.exp(-dy ** 2 * 6) * np.exp(-dx ** 2 * 2.5)
    core = np.exp(-dy ** 2 * 60) * np.exp(-dx ** 2 * 6)
    arr = np.zeros((h, w, 4), np.uint8)
    for k in range(3): arr[..., k] = np.clip(rgb[k] * (1 - core) + 255 * core, 0, 255)
    arr[..., 3] = np.clip((a * .8 + core) * 255, 0, 255)
    return Image.fromarray(arr, "RGBA")

def ring(c, cx, cy, r, width, col, a):
    if a <= .01 or r < 2: return
    lay = Image.new("RGBA", (int(r * 2 + 40), int(r * 2 + 40)), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    d.ellipse((20, 20, 20 + r * 2, 20 + r * 2), outline=col + (int(255 * a),), width=max(1, int(width)))
    lay = lay.filter(ImageFilter.GaussianBlur(2))
    c.alpha_composite(lay, (int(cx - r - 20), int(cy - r - 20)))

@functools.lru_cache(None)
def rays_sprite(size=1500, n=22):
    im = Image.new("L", (size, size), 0); d = ImageDraw.Draw(im)
    cx = cy = size / 2
    for k in range(n):
        a0 = k / n * 2 * math.pi; da = .045 + .03 * math.sin(k * 3.3)
        d.polygon([(cx, cy), (cx + math.cos(a0) * size, cy + math.sin(a0) * size),
                   (cx + math.cos(a0 + da) * size, cy + math.sin(a0 + da) * size)], fill=255)
    im = im.filter(ImageFilter.GaussianBlur(14))
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32)
    fall = np.clip(1 - np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / (size / 2), 0, 1) ** 1.6
    arr = (np.asarray(im, np.float32) * fall * .35).astype(np.uint8)
    out = Image.new("RGBA", (size, size), (255, 170, 200, 0)); out.putalpha(Image.fromarray(arr))
    return out

def rays(c, cx, cy, t, a):
    if a <= .01: return
    r = rays_sprite().rotate(t * 8, Image.BILINEAR)
    place(c, r, cx - r.width / 2, cy - r.height / 2, a)

GRAIN = [np.random.default_rng(k).normal(0, 7, (H // 2, W // 2)).astype(np.int16) for k in range(6)]

# ---------------- scenes ----------------
#            start, end
SC = {
    "a_logo":    (0.0, 3.5),
    "b_problem": (3.5, 9.5),
    "c_reveal":  (9.5, 13.0),
    "d_idea":    (13.0, 18.5),
    "e_prod":    (18.5, 24.0),
    "f_growth":  (24.0, 29.5),
    "g_proof":   (29.5, 34.5),
    "g2_clients": (100.0, 107.2),
    "h_plans":   (200.0, 208.9),
    "i_cta":     (39.5, 45.0),
}
CUTS = [3.5, 9.5, 13.0, 18.5, 24.0, 29.5, 34.5, 39.5]

def mood(t):  # 0 vivid, 1 = problem (dim)
    return eio(prog(t, 3.4, .5)) * (1 - eio(prog(t, 9.3, .4)))

# ---- A: logo VFX reveal
PARTS = [(rng.uniform(0, 6.28), rng.uniform(500, 1100), rng.uniform(.0, .35),
          [ORA, MAG, PUR, BLU, CYA, YEL][k % 6], rng.uniform(3, 7)) for k in range(110)]

def sc_a(c, t):
    lt = t; cx, cy = W / 2, 760
    hit = 1.15
    for (ang, dist, delay, col, r) in PARTS:  # spiral-in particles
        p = eio(prog(lt, delay, hit - delay))
        if p >= 1: continue
        aa = ang + (1 - p) * 2.4
        dd = dist * (1 - p)
        g = glow_dot(int(r), col, 1.)
        place(c, g, cx + math.cos(aa) * dd - g.width / 2, cy + math.sin(aa) * dd - g.height / 2,
              eo(prog(lt, delay, .3)) * (1 - p ** 6))
    # charge glow before hit
    ch = eio(prog(lt, .5, hit - .5)) * (1 - prog(lt, hit, .2))
    g = glow_dot(60, (255, 200, 220), 1.)
    place(c, g, cx - g.width / 2, cy - g.height / 2, ch * .9)
    # hit: shockwave + streak + logo
    if lt >= hit:
        k = lt - hit
        ring(c, cx, cy, 90 + k * 900, 10 * (1 - eo(k / .8)) + 1, (255, 190, 210), max(0, 1 - k / .8))
        ring(c, cx, cy, 60 + k * 520, 4, (140, 170, 255), max(0, .7 - k / .9))
        s = streak(1300, 70, (255, 140, 180))
        place(c, s, cx - s.width / 2, cy - s.height / 2, max(0, 1 - k / 1.0), 1 + k * .4)
        out = 1 - eio(prog(lt, 3.15, .35))
        logo(c, cx, cy, 330 * eback(prog(lt, hit, .7)), eo(k / .25) * out,
             sweep=prog(lt, 1.85, .7) if lt < 2.6 else -1, glow=.7)
        rays(c, cx, cy, t, .5 * eo(k / .4) * out)
    a1, d1 = env(lt, 1.55, 3.15)
    T(c, "Spotlight Adz", W / 2, 990 + d1, "sg7", 112, "fg", a=a1)
    a2, d2 = env(lt, 1.75, 3.2)
    T(c, "CREATIVE  ·  AI  ·  MARKETING", W / 2, 1135 + d2, "it5", 30, "muted", a=a2, track=6)
    a3, d3 = env(lt, 2.05, 3.25)
    T(c, "فين الذكاء كيتلاقى مع الخيال", W / 2, 1230 + d3, "ar6", 46, "aurora", a=a3)

# ---- B: problem — dead feed on a phone
def phone(c, x, y, w, h, a, content_fn, lt):
    """draws a phone frame and calls content_fn(screen_img, lt) to fill the screen"""
    if a <= .003: return
    sc = Image.new("RGBA", (w - 28, h - 28), (10, 9, 20, 255))
    content_fn(sc, lt)
    m = Image.new("L", sc.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, sc.width - 1, sc.height - 1), 44, fill=255)
    sc.putalpha(ImageChops.multiply(sc.getchannel("A"), m))
    body = rrect_sprite(w, h, 58, (28, 26, 44, 255), (255, 255, 255, 60), 3)
    sh = glow_dot(120, (0, 0, 0), 1.)
    place(c, body, x, y, a)
    place(c, sc, x + 14, y + 14, a)
    notch = rrect_sprite(130, 34, 17, (0, 0, 0, 255), (0, 0, 0, 255), 1)
    place(c, notch, x + w / 2 - 65, y + 28, a)

def dead_feed(sc, lt):
    d = ImageDraw.Draw(sc)
    w = sc.width
    off = (lt * 520) % 470  # fast mindless scrolling
    for k in range(-1, 4):
        y0 = 90 + k * 470 - off
        d.ellipse((24, y0, 70, y0 + 46), fill=(60, 58, 78))
        d.rounded_rectangle((84, y0 + 8, 250, y0 + 22), 7, fill=(60, 58, 78))
        d.rounded_rectangle((84, y0 + 30, 190, y0 + 40), 5, fill=(45, 43, 60))
        d.rounded_rectangle((20, y0 + 62, w - 20, y0 + 352), 18, fill=(36, 34, 50))
        # flat "generic post" glyph
        cx, cy = w / 2, y0 + 207
        d.polygon([(cx - 70, cy + 50), (cx - 15, cy - 20), (cx + 20, cy + 20), (cx + 45, cy - 5), (cx + 80, cy + 50)], fill=(54, 52, 70))
        d.ellipse((cx + 30, cy - 60, cx + 60, cy - 30), fill=(54, 52, 70))
        heart(d, 46, y0 + 392, 30, (110, 108, 128), fill=False, w=3)
        d.text((70, y0 + 378), "2", font=FT("it5", 26), fill=(110, 108, 128))
        eye(d, 130, y0 + 392, 34, (110, 108, 128), 3)
        d.text((155, y0 + 378), "14", font=FT("it5", 26), fill=(110, 108, 128))

def sc_b(c, t):
    lt = t - 3.5
    a1, d1 = env(lt, .15, 5.6)
    T(c, "كتبوسطي كل نهار…", W / 2, 285 + d1, "ar7", 92, "fg", a=a1)
    a2, d2 = env(lt, 1.7, 5.65)
    gl = 1 if 1.7 < lt < 2.05 else 0
    jx = (math.sin(lt * 90) * 14) * gl
    T(c, "وحتى واحد ما كيوقف؟", W / 2 + jx, 410 + d2, "ar7", 92, (255, 110, 110), a=a2)
    pa, pd = env(lt, .35, 5.5, din=.7)
    phone(c, W / 2 - 230, 580 + pd + (1 - eo(prog(lt, .35, .8))) * 200, 460, 820, pa, dead_feed, lt)
    # stat chips flanking the phone
    for i, (fn, txt, side, yy, st) in enumerate([(heart, "2 لايك", -1, 760, 2.3), (eye, "14 مشاهدة", 1, 960, 2.6),
                                                  (bubble, "0 تعليق", -1, 1160, 2.9)]):
        ca, cd = env(lt, st, 5.5, din=.35)
        if ca <= 0: continue
        cw, chh = 270, 92
        box = rrect_sprite(cw, chh, 46, (40, 14, 22, 235), (255, 90, 102, 140), 2)
        bx = W / 2 + side * 330 - cw / 2
        shake = math.sin(lt * 70 + i) * 6 * (1 - prog(lt, st, .4))
        place(c, box, bx + shake, yy + cd, ca)
        ic = icon_layer(60, 60, lambda d, f=fn: (f(d, 30, 30, 36, (255, 110, 120), False, 4) if f is heart else f(d, 30, 30, 40, (255, 110, 120), 4)))
        place(c, ic, bx + cw - 74 + shake, yy + cd + 16, ca)
        T(c, txt, bx + cw - 86 + shake, yy + cd + 18, "ar6", 38, (255, 200, 200), a=ca, anchor="r")
    a3, d3 = env(lt, 3.5, 5.7)
    T(c, "المشكل ماشي فيك…", W / 2, 1440 + d3, "ar6", 64, "muted", a=a3)
    a4, d4 = env(lt, 4.3, 5.75)
    T(c, "المشكل فالخطة.", W / 2, 1530 + d4, "ar7", 74, "warm", a=a4)

# ---- C: reveal — Social media as a system
def sc_c(c, t):
    lt = t - 9.5; cx, cy = W / 2, 640
    out = 1 - eio(prog(lt, 3.1, .4))
    rays(c, cx, cy, t, .8 * eo(prog(lt, 0, .5)) * out)
    for k in range(3):
        ring(c, cx, cy, 150 + k * 70 + math.sin(t * 2 + k) * 6, 2, (255, 255, 255), .12 * out * eo(prog(lt, .2 + k * .1, .5)))
    # orbiting format chips
    for i, name in enumerate(["Reels", "Stories", "Posts", "Ads"]):
        ang = t * .9 + i * math.pi / 2
        ox, oy = cx + math.cos(ang) * 290, cy + math.sin(ang) * 120
        ca = eo(prog(lt, .5 + i * .12, .4)) * out
        T(c, name, ox, oy - 22, "sg6", 36, ["warm", "hot", "aurora", "cool"][i], a=ca * (.65 + .35 * math.sin(ang)))
    logo(c, cx, cy, 240 * eback(prog(lt, .05, .6)), eo(prog(lt, .05, .3)) * out, sweep=prog(lt, .5, .7))
    a0, d0 = env(lt, .4, 3.05)
    R.pill_label(c, "SOCIAL MEDIA MANAGEMENT", W / 2, 900 + d0, a0, dot=ORA, size=28)
    a1, d1 = env(lt, .6, 3.1)
    T(c, "مع سبوتلايت، السوشيال ميديا ديالك", W / 2, 1050 + d1, "ar6", 54, "fg", a=a1)
    a2, d2 = env(lt, .85, 3.15)
    T(c, "كتولي سيستام كامل", W / 2, 1140 + d2, "ar7", 104, "aurora", a=a2, scale=1 + .03 * eo(prog(lt, .85, 1.5)))

def step_header(c, lt, num, title, sub, gkey, outt):
    a0, d0 = env(lt, .05, outt)
    T(c, num, W / 2, 255 + d0, "sg7", 64, gkey, a=a0, gangle=90)
    a1, d1 = env(lt, .2, outt + .05)
    T(c, title, W / 2, 335 + d1, "ar7", 120, "fg", a=a1)
    a2, d2 = env(lt, .4, outt + .1)
    T(c, sub, W / 2, 495 + d2, "ar5", 44, "muted", a=a2)

# ---- D: idea — monthly calendar + hook library
CAL_TYPES = [(MAG, "ريلز"), (ORA, "بوست"), (BLU, "ستوري"), (PUR, "كاروسيل")]
CAL = [(r, col, (r * 7 + col) % 4) for r in range(4) for col in range(7) if (r * 7 + col) % 3 != 2]

def sc_d(c, t):
    lt = t - 13.0
    step_header(c, lt, "01", "الفكرة", "خطة شهرية · هوكس قوية · ستايل واحد", "warm", 5.1)
    ca, cd = env(lt, .5, 5.15, din=.6)
    x0, y0, cw, ch = 80, 600, W - 160, 560
    place(c, rrect_sprite(cw, ch, 36, (14, 12, 30, 225), (255, 255, 255, 30), 2), x0, y0 + cd, ca)
    T(c, "خطة نونبر", x0 + cw - 40, y0 + 34 + cd, "ar7", 46, "fg", a=ca, anchor="r")
    T(c, "28 / 28 ✓".replace("✓", ""), x0 + 40, y0 + 40 + cd, "sg6", 38, "warm", a=ca, anchor="l")
    gx, gy, gw, gh = x0 + 36, y0 + 120, cw - 72, 330
    cellw, cellh = gw / 7, gh / 4
    lay = Image.new("RGBA", (cw, ch), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    for r in range(4):
        for col in range(7):
            X = gx - x0 + col * cellw; Y = gy - y0 + r * cellh
            d.rounded_rectangle((X + 5, Y + 5, X + cellw - 5, Y + cellh - 5), 12, fill=(255, 255, 255, 10),
                                outline=(255, 255, 255, 22), width=1)
    for i, (r, col, ty) in enumerate(CAL):
        p = eback(prog(lt, .9 + i * .09, .35))
        if p <= 0: continue
        X = gx - x0 + (6 - col) * cellw + cellw / 2; Y = gy - y0 + r * cellh + cellh / 2
        rr = 20 * p
        colr = CAL_TYPES[ty][0]
        d.rounded_rectangle((X - rr * 1.6, Y - rr, X + rr * 1.6, Y + rr), rr * .5, fill=colr + (230,))
    c.alpha_composite(with_alpha(lay, ca), (x0, int(y0 + cd)))
    # legend
    lx = x0 + cw - 40
    for i, (colr, name) in enumerate(CAL_TYPES):
        la = ca * eo(prog(lt, 1.2 + i * .1, .3))
        wtxt = T(c, name, lx, y0 + ch - 70 + cd, "ar5", 32, "muted", a=la, anchor="r")
        dot = rrect_sprite(30, 20, 8, colr + (255,), colr + (255,), 1)
        place(c, dot, lx - wtxt - 44, y0 + ch - 58 + cd, la)
        lx -= wtxt + 80
    # hook library
    hooks = ["هوك: 3 غلطات كيخسروك الكليان", "هوك: الكواليس ديال الخدمة", "هوك: قبل / من بعد"]
    for i, hk in enumerate(hooks):
        st = 2.6 + i * .45
        ha, hd = env(lt, st, 5.1 + i * .05, din=.45)
        sx = (1 - eo(prog(lt, st, .55))) * -160
        bw, bh = W - 220, 100
        bx, by = 110 + sx, 1205 + i * 118 + hd
        place(c, rrect_sprite(bw, bh, 50, (255, 255, 255, 14), (255, 140, 100, 90), 2), bx, by, ha)
        ic = icon_layer(70, 70, target, 35, 35, 46, (255, 150, 90), 4)
        place(c, ic, bx + bw - 88, by + 15, ha)
        T(c, hk, bx + bw - 104, by + 22, "ar6", 40, "fg", a=ha, anchor="r")

# ---- E: production — viewfinder, reel, edit timeline
def reel_content(sc, lt):
    w, h = sc.size
    g = grad_img("aurora", 240, 400, 135 + int(lt * 25) % 360).resize((w, h), Image.BILINEAR)
    sc.paste(g.convert("RGBA"), (0, 0))
    d = ImageDraw.Draw(sc)
    # subject silhouette
    cx = w / 2 + math.sin(lt * 1.3) * 18
    d.ellipse((cx - 60, h * .3, cx + 60, h * .3 + 120), fill=(20, 12, 30, 200))
    d.rounded_rectangle((cx - 120, h * .3 + 130, cx + 120, h + 40), 90, fill=(20, 12, 30, 200))
    # reel UI
    for k, yy in enumerate((h * .55, h * .65, h * .75)):
        x = w - 50
        if k == 0: heart(d, x, yy, 44, (255, 255, 255, 235))
        elif k == 1: bubble(d, x, yy, 44, (255, 255, 255, 235), 4)
        else: d.polygon([(x - 20, yy - 16), (x + 22, yy), (x - 20, yy + 16)], outline=(255, 255, 255, 235), width=4)
    d.rounded_rectangle((24, h - 120, 240, h - 96), 10, fill=(255, 255, 255, 200))
    d.rounded_rectangle((24, h - 84, 330, h - 66), 9, fill=(255, 255, 255, 140))
    pr = (lt * .3) % 1
    d.rectangle((0, h - 8, w * pr, h), fill=(255, 255, 255, 240))

def sc_e(c, t):
    lt = t - 18.5
    step_header(c, lt, "02", "الإنتاج", "تصوير · مونتاج · موشن ديزاين", "hot", 5.1)
    va = eo(prog(lt, .45, .5)) * (1 - eio(prog(lt, 5.15, .4)))
    vx0, vy0, vx1, vy1 = 90, 600, W - 90, 1330
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    L = 70; col = (255, 255, 255, 210)
    sp = (1 - eo(prog(lt, .45, .6))) * 60
    for (x, y, sx, sy) in [(vx0 - sp, vy0 - sp, 1, 1), (vx1 + sp, vy0 - sp, -1, 1),
                           (vx0 - sp, vy1 + sp, 1, -1), (vx1 + sp, vy1 + sp, -1, -1)]:
        d.line((x, y, x + L * sx, y), fill=col, width=6); d.line((x, y, x, y + L * sy), fill=col, width=6)
    for k in (1, 2):  # rule of thirds
        X = vx0 + (vx1 - vx0) * k / 3; Y = vy0 + (vy1 - vy0) * k / 3
        d.line((X, vy0 + 20, X, vy1 - 20), fill=(255, 255, 255, 22), width=2)
        d.line((vx0 + 20, Y, vx1 - 20, Y), fill=(255, 255, 255, 22), width=2)
    c.alpha_composite(with_alpha(lay, va))
    blink = 1 if int(lt * 2.2) % 2 == 0 else .25
    fr = int(lt * 30) % 30; ss = int(lt)
    rw = T(c, f"REC  00:00:{ss:02d}:{fr:02d}", vx1 - 40, vy0 + 26, "sg6", 32, "fg", a=va, anchor="r", track=1)
    g = glow_dot(9, (255, 50, 60), 1.)
    place(c, g, vx1 - 40 - rw - 30 - g.width / 2, vy0 + 46 - g.height / 2, va * blink)
    T(c, "4K · 60FPS", vx0 + 40, vy0 + 26, "sg6", 32, "muted", a=va, anchor="l", track=2)
    pa = eo(prog(lt, .7, .6)) * (1 - eio(prog(lt, 5.1, .4)))
    phone(c, W / 2 - 185, 690 + (1 - eo(prog(lt, .7, .7))) * 120, 370, 600, pa, reel_content, lt)
    # edit timeline
    ta = eo(prog(lt, 1.4, .5)) * (1 - eio(prog(lt, 5.1, .4)))
    tx0, ty0, tw = 110, 1345, W - 220
    place(c, rrect_sprite(tw, 120, 24, (14, 12, 30, 230), (255, 255, 255, 30), 2), tx0, ty0, ta)
    clips = [(.0, .22, MAG), (.23, .41, ORA), (.42, .66, PUR), (.67, .82, BLU), (.83, 1., CYA)]
    lay2 = Image.new("RGBA", (tw, 120), (0, 0, 0, 0)); d2 = ImageDraw.Draw(lay2)
    for i, (a0, a1, colr) in enumerate(clips):
        p = eo(prog(lt, 1.6 + i * .15, .4))
        if p <= 0: continue
        x0 = 20 + a0 * (tw - 40); x1 = 20 + a1 * (tw - 40)
        d2.rounded_rectangle((x0, 22, x0 + (x1 - x0 - 6) * p, 62), 10, fill=colr + (220,))
        d2.rounded_rectangle((x0, 72, x0 + (x1 - x0 - 6) * p * .7, 98), 8, fill=colr + (90,))
    ph = 20 + ((lt - 1.6) * .28 % 1) * (tw - 40)
    d2.line((ph, 10, ph, 110), fill=(255, 255, 255, 255), width=4)
    c.alpha_composite(with_alpha(lay2, ta), (tx0, ty0))
    # format chips
    for i, (name, gk) in enumerate([("Reels", "hot"), ("Stories", "aurora"), ("Carousels", "cool")]):
        st = 2.6 + i * .25
        ca, cd = env(lt, st, 5.1, din=.35)
        cw = 270; cx = W / 2 + (i - 1) * 300
        place(c, rrect_sprite(cw, 84, 42, (255, 255, 255, 16), (255, 255, 255, 50), 2), cx - cw / 2, 1500 + cd, ca,
              .8 + .2 * eback(prog(lt, st, .4)))
        T(c, name, cx, 1515 + cd, "sg6", 40, gk, a=ca)

# ---- F: growth — chart + notifications
def sc_f(c, t):
    lt = t - 24.0
    step_header(c, lt, "03", "النمو", "نشر · تفاعل · تحليل كل شهر", "cool", 5.1)
    ca, cd = env(lt, .45, 5.15, din=.6)
    x0, y0, cw, ch = 80, 600, W - 160, 480
    place(c, rrect_sprite(cw, ch, 36, (14, 12, 30, 225), (255, 255, 255, 30), 2), x0, y0 + cd, ca)
    T(c, "التفاعل", x0 + cw - 40, y0 + 30 + cd, "ar7", 44, "fg", a=ca, anchor="r")
    T(c, "30 يوم", x0 + 40, y0 + 38 + cd, "ar5", 34, "muted", a=ca, anchor="l")
    p = eio(prog(lt, .9, 2.0))
    gx0, gy0, gw, gh = 40, 130, cw - 80, 300
    pts = []
    N = 60
    for k in range(N + 1):
        u = k / N
        v = .08 + .78 * (u ** 1.7) + .05 * math.sin(u * 13) * (1 - u * .6)
        pts.append((gx0 + u * gw, gy0 + gh - v * gh))
    n = max(2, int(p * N) + 1)
    vis = pts[:n]
    lay = Image.new("RGBA", (cw, ch), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    for k in range(4):
        Y = gy0 + gh * k / 3
        d.line((gx0, Y, gx0 + gw, Y), fill=(255, 255, 255, 18), width=2)
    # area fill
    m = Image.new("L", (cw, ch), 0); dm = ImageDraw.Draw(m)
    dm.polygon(vis + [(vis[-1][0], gy0 + gh), (vis[0][0], gy0 + gh)], fill=90)
    fill = grad_img("cool", cw, ch, 180).convert("RGBA"); fill.putalpha(m)
    lay.alpha_composite(fill)
    lm = Image.new("L", (cw, ch), 0); ImageDraw.Draw(lm).line(vis, fill=255, width=8, joint="curve")
    line = grad_img("aurora", cw, ch, 90).convert("RGBA"); line.putalpha(lm)
    lay.alpha_composite(line)
    c.alpha_composite(with_alpha(lay, ca), (x0, int(y0 + cd)))
    ex, ey = vis[-1]
    g = glow_dot(14, CYA, 1.)
    place(c, g, x0 + ex - g.width / 2, y0 + cd + ey - g.height / 2, ca)
    # notifications
    notes = [(heart, "عجبهم الريل ديالك", (255, 80, 120), 2.0),
             (bubble, "تعليق جديد: فين جات البلاصة؟", (255, 170, 60), 2.55),
             (bubble, "رسالة: شحال الثمن؟", (90, 170, 255), 3.1),
             (person_plus, "متابعين جداد تزادو", (34, 211, 238), 3.65)]
    for i, (fn, txt, colr, st) in enumerate(notes):
        na, nd = env(lt, st, 5.1 + i * .04, din=.35)
        if na <= 0: continue
        sx = (1 - eback(prog(lt, st, .45))) * 220
        bw, bh = W - 200, 92
        bx, by = 100 + sx, 1130 + i * 106 + nd
        place(c, rrect_sprite(bw, bh, 30, (22, 20, 40, 240), (255, 255, 255, 40), 2), bx, by, na)
        circ = icon_layer(64, 64, lambda d: d.ellipse((0, 0, 63, 63), fill=colr + (255,)))
        place(c, circ, bx + bw - 82, by + 14, na)
        ic = icon_layer(64, 64, lambda d, f=fn: (f(d, 32, 34, 30, (255, 255, 255)) if f is heart else f(d, 32, 32, 34, (255, 255, 255), 4)))
        place(c, ic, bx + bw - 82, by + 14, na)
        T(c, txt, bx + bw - 104, by + 20, "ar6", 38, "fg", a=na, anchor="r")
        T(c, "دابا", bx + 34, by + 26, "ar5", 30, "muted", a=na, anchor="l")

# ---- G: proof
def sc_g(c, t):
    lt = t - 29.5
    a0, d0 = env(lt, .05, 4.6)
    T(c, "النتائج كتهضر", W / 2, 290 + d0, "ar7", 100, "fg", a=a0)
    k1 = eio(prog(lt, .4, 1.6))
    a1, d1 = env(lt, .3, 4.65)
    T(c, f"{151.2 * k1:.1f}K", W / 2, 470 + d1, "sg7", 220, "hot", a=a1, track=-8)
    T(c, "مشاهدة فريل وحدة", W / 2, 735 + d1, "ar6", 52, "muted", a=a1)
    k2 = eio(prog(lt, 1.0, 1.6))
    a2, d2 = env(lt, .9, 4.7)
    T(c, f"{101.1 * k2:.1f}K", W / 2, 880 + d2, "sg7", 220, "aurora", a=a2, track=-8)
    T(c, "متابع لـ Happy Fitness", W / 2, 1145 + d2, "ar6", 52, "muted", a=a2)
    a3, d3 = env(lt, 2.2, 4.75)
    bw = 600
    place(c, rrect_sprite(bw, 100, 50, (255, 184, 0, 22), (255, 184, 0, 120), 2), W / 2 - bw / 2, 1300 + d3, a3)
    st = icon_layer(60, 60, lambda d: d.polygon([(30 + (26 if k % 2 == 0 else 11) * math.cos(math.radians(-90 + k * 36)),
                                                   31 + (26 if k % 2 == 0 else 11) * math.sin(math.radians(-90 + k * 36))) for k in range(10)], fill=(255, 184, 0)))
    place(c, st, W / 2 + bw / 2 - 90, 1320 + d3, a3)
    T(c, "5.0 فتقييمات Google", W / 2 - 30, 1320 + d3, "ar6", 44, (255, 210, 120), a=a3)

# ---- H: plans (3 packs)
PLANS = [("Basic", "3.000", ["6 ريلز احترافية", "ستوري تيلينغ · ستوريز"], False, .4),
         ("Advanced", "6.000", ["12 ريلز + ريبورتينغ", "كلشي اللي فالـ Basic"], False, 1.5),
         ("VIP", "9.000", ["24 ريلز + إعلانات فجميع المنصات", "ستراتيجية كاملة + كلشي اللي فالـ Advanced"], True, 3.3)]

def sc_h(c, t):
    lt = t - 200.0; D = 8.9
    a0, d0 = env(lt, .05, D - .45)
    T(c, "باكاج على قدّك", W / 2, 255 + d0, "ar7", 100, "fg", a=a0)
    for i, (nm, price, feats, hot, st) in enumerate(PLANS):
        pa, pd = env(lt, st, D - .45 + i * .04, din=.5)
        if pa <= 0: continue
        sx = (1 - eo(prog(lt, st, .55))) * (160 if i % 2 else -160)
        sc = 1. if not hot else 1 + .025 * eback(prog(lt, st + .4, .5)) * (1 + .3 * math.sin(max(0, lt - st - 1) * 5)) 
        bw, bh = W - 140, 268
        bx, by = 70 + sx, 420 + i * 292 + pd
        if hot:
            g = glow_dot(140, MAG, .7); place(c, g, W / 2 - g.width / 2, by + bh / 2 - g.height / 2, pa * .5)
        card = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
        card.alpha_composite(rrect_sprite(bw, bh, 36, (16, 14, 34, 240), (255, 111, 105, 230) if hot else (255, 255, 255, 40), 4 if hot else 2))
        T(card, nm, 44, 34, "sg7", 66, "aurora" if hot else "fg", anchor="l", track=-1)
        pw = T(card, price, bw - 44, 30, "sg7", 74, "hot" if hot else "fg", anchor="r", track=-2)
        T(card, "درهم / الشهر", bw - 44, 118, "ar5", 30, "muted", anchor="r")
        for j, f in enumerate(feats):
            yy = 158 + j * 50
            T(card, f, bw - 44, yy, "ar6" if j == 0 else "ar5", 36 if j == 0 else 31, "fg" if j == 0 else (190, 190, 212), anchor="r")
            dot = glow_dot(5, CORAL if hot else MAG, 1.)
            card.alpha_composite(with_alpha(dot, .9), (int(bw - 44 - T.__defaults__[0] if False else 0), 0)) if False else None
        place(c, card, bx, by, pa, sc)
        if hot:
            bwp = 290
            place(c, grad_pill("hot", bwp, 58), bx + bw / 2 - bwp / 2, by - 29, pa)
            T(c, "الباكاج الكامل", bx + bw / 2, by - 25, "ar7", 32, (255, 255, 255), a=pa)
    oa, od = env(lt, 5.6, D - .3)
    ow = W - 200; pulse = 1 + .02 * math.sin(max(0, lt - 6.2) * 6)
    place(c, grad_pill("warm", ow, 116, 100), W / 2 - ow / 2, 1330 + od, oa, pulse)
    T(c, "عرض: 6 شهور + شهر هدية", W / 2, 1349 + od, "ar7", 54, (24, 10, 4), a=oa, scale=pulse)
    a3, d3 = env(lt, 6.0, D - .25)
    T(c, "أو 12 شهر + 3 شهور هدية", W / 2, 1480 + d3, "ar5", 38, "muted", a=a3)

# ---- I: CTA
def sc_i(c, t):
    lt = t - 39.5; cx, cy = W / 2, 560
    rays(c, cx, cy, t, .55 * eo(prog(lt, 0, .6)))
    ring(c, cx, cy, 60 + lt * 900, 8 * max(0, 1 - lt / .7) + 1, (255, 190, 210), max(0, 1 - lt / .7))
    logo(c, cx, cy, 300 * eback(prog(lt, .05, .7)), eo(prog(lt, .05, .3)), sweep=prog(lt, .7, .8), glow=.8)
    a1, d1 = env(lt, .4, 9)
    T(c, "يلاه نبنيو", W / 2, 760 + d1, "ar7", 116, "fg", a=a1)
    a2, d2 = env(lt, .6, 9)
    T(c, "حضور كيتفكّر", W / 2, 900 + d2, "ar7", 116, "aurora", a=a2)
    a3, d3 = env(lt, .95, 9)
    T(c, "سوشيال ميديا · سيستيمات مخصصة · AI", W / 2, 1065 + d3, "ar5", 40, "muted", a=a3)
    ba = eo(prog(lt, 1.3, .5)); bs = .9 + .1 * eback(prog(lt, 1.3, .6))
    pulse = 1 + .025 * math.sin(max(0, lt - 2) * 5)
    bw, bh = 640, 128
    g = glow_dot(80, (37, 211, 102), .6)
    place(c, g, W / 2 - g.width / 2, 1170 + bh / 2 - g.height / 2, ba * .45)
    btn = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    btn.alpha_composite(grad_pill("hot", bw, bh))
    tw = T(btn, "صيفط لينا فواتساب", bw / 2 - 40, 26, "ar7", 54, (255, 255, 255))
    ic = icon_layer(70, 70, chat_icon, 35, 35, 52, (255, 255, 255))
    btn.alpha_composite(ic, (int(bw / 2 + tw / 2 - 10), 29))
    place(c, btn, W / 2 - bw / 2, 1170, ba, bs * pulse)
    a4, d4 = env(lt, 1.7, 9)
    T(c, "+212 701 177 915", W / 2, 1350 + d4, "sg6", 60, "fg", a=a4, track=1)
    a5, d5 = env(lt, 1.95, 9)
    T(c, "spotlightadz.ma", W / 2, 1440 + d5, "it5", 42, "muted", a=a5, track=1)

# ---- G2: clients wall
CLIENTS = [("Happy Fitness", "@happy_fitness_martil", "صالة رياضة · مرتيل", "101K", "متابع", "hot", ("HF", MAG, ORA), .35),
           ("Grillade Khay Ahmed", "@restokhayahmed", "ريسطو · مرتيل", "35.6K", "مشاهدة فريل", "warm", ("KA", ORA, YEL), 1.75),
           ("Aboujoud", "بوتيك · حانوت ثاني تحلّ", "", "+400%", "كليان جداد", "cool", ("AJ", PUR, CYA), 3.0)]

@functools.lru_cache(None)
def monogram(txt, c1, c2, d=120):
    g = Image.new("RGBA", (d, d), (0, 0, 0, 0))
    gr = Image.new("RGB", (d, d))
    arr = np.zeros((d, d, 3), np.uint8)
    yy, xx = np.mgrid[0:d, 0:d] / d
    u = (xx + yy) / 2
    for k in range(3): arr[..., k] = (c1[k] * (1 - u) + c2[k] * u).astype(np.uint8)
    gr = Image.fromarray(arr, "RGB").convert("RGBA")
    m = Image.new("L", (d, d), 0); ImageDraw.Draw(m).ellipse((0, 0, d - 1, d - 1), fill=255)
    gr.putalpha(m)
    spr, pad = tsprite(txt, "sg7", int(d * .38), (255, 255, 255), round(-1.0, 2), 100)
    gr.alpha_composite(spr, (int(d / 2 - spr.width / 2), int(d / 2 - spr.height / 2 - d * .03)))
    return gr

def sc_g2(c, t):
    lt = t - 100.0; D = 7.2
    a0, d0 = env(lt, .05, D - .45)
    T(c, "كيتيقو فينا", W / 2, 265 + d0, "ar7", 104, "fg", a=a0)
    a1, d1 = env(lt, .2, D - .4)
    T(c, "براندات حقيقية · نتائج حقيقية", W / 2, 410 + d1, "ar5", 42, "muted", a=a1)
    for i, (nm, handle, sub, stat, lab, gk, mono, st) in enumerate(CLIENTS):
        ca, cd = env(lt, st, D - .45 + i * .04, din=.5)
        if ca <= 0: continue
        sc = .86 + .14 * eback(prog(lt, st, .55))
        bw, bh = W - 140, 250
        bx, by = 70, 520 + i * 285 + cd
        g = glow_dot(110, mono[1], .5)
        place(c, g, bx + 100 - g.width / 2, by + bh / 2 - g.height / 2, ca * .45)
        card = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
        card.alpha_composite(rrect_sprite(bw, bh, 36, (16, 14, 34, 238), mono[1] + (150,), 2))
        card.alpha_composite(monogram(*mono), (36, bh // 2 - 60))
        T(card, nm, 186, 52, "sg7", 50 if len(nm) < 16 else 44, "fg", anchor="l", track=-1)
        T(card, handle, 186, 128, "it5" if handle.startswith("@") else "ar5", 32, "muted", anchor="l")
        if sub: T(card, sub, 186, 176, "ar5", 30, (190, 190, 210), anchor="l")
        T(card, stat, bw - 40, 54, "sg7", 84, gk, anchor="r", track=-3, gangle=90)
        T(card, lab, bw - 40, 160, "ar6", 34, "muted", anchor="r")
        place(c, card, bx, by, ca, sc)
    a4, d4 = env(lt, 4.3, D - .3)
    pw = 520
    place(c, rrect_sprite(pw, 92, 46, (255, 255, 255, 16), (255, 255, 255, 60), 2), W / 2 - pw / 2, 1395 + d4, a4,
          .9 + .1 * eback(prog(lt, 4.3, .5)))
    T(c, "+ بزاف ديال البراندات", W / 2, 1410 + d4, "ar6", 44, "aurora", a=a4)

DRAW = {"a_logo": sc_a, "b_problem": sc_b, "c_reveal": sc_c, "d_idea": sc_d, "e_prod": sc_e,
        "f_growth": sc_f, "g_proof": sc_g, "g2_clients": sc_g2, "h_plans": sc_h, "i_cta": sc_i}

def watermark(c, t):
    a = eo(prog(t, 3.8, .5)) * (1 - eo(prog(t, NSC["i_cta"][0] - .3, .4))) * .9
    if a <= 0: return
    logo(c, 110, 150, 64, a, glow=.25)
    T(c, "Spotlight Adz", 158, 128, "sg6", 36, "fg", a=a * .85, anchor="l")

NEW_LEN = {"a_logo": 3.5, "b_problem": 6.6, "c_reveal": 4.6, "d_idea": 6.1, "e_prod": 6.3,
           "f_growth": 7.9, "g_proof": 7.8, "g2_clients": 7.2, "h_plans": 8.9, "i_cta": 5.6}
ORDER = list(SC.keys())
NSC = {}
_acc = 0.
for k in ORDER:
    NSC[k] = (_acc, _acc + NEW_LEN[k]); _acc += NEW_LEN[k]
TOTAL = _acc
NCUTS = [NSC[k][0] for k in ORDER[1:]]
VO_OFFSET = .3   # voice starts this long after each scene begins

def design_time(t):
    for k in ORDER:
        a, b = NSC[k]
        if t < b or k == ORDER[-1]:
            oa, ob = SC[k]
            return k, oa + (t - a) * (ob - oa) / (b - a)

def frame(t):
    k, dt = design_time(t)
    m = mood(dt)
    bg = R.background(t, 0.)
    if m > 0:  # dim + desaturate the problem scene
        arr = np.asarray(bg.convert("RGB"), np.float32)
        gray = arr.mean(axis=2, keepdims=True)
        arr = (arr * (1 - .6 * m) + gray * .6 * m) * (1 - .35 * m)
        bg = Image.fromarray(arr.astype(np.uint8), "RGB").convert("RGBA")
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dust(lay, t, .8)
    DRAW[k](lay, dt)
    a, b = NSC[k]
    push = 1 + .03 * (t - a) / (b - a)  # slow camera push-in
    watermark(lay, t)
    tr = 0.
    for cut in NCUTS:
        d = t - cut
        if -.12 < d < .25: tr = max(tr, (1 - abs(d) / (.12 if d < 0 else .25)))
    sc = push + .07 * tr
    if abs(sc - 1) > 1e-3:
        nw, nh = int(W * sc), int(H * sc)
        big = lay.resize((nw, nh), Image.BILINEAR)
        lay = big.crop(((nw - W) // 2, (nh - H) // 2, (nw - W) // 2 + W, (nh - H) // 2 + H))
    bg.alpha_composite(lay)
    arr = np.asarray(bg.convert("RGB")).astype(np.int16)
    if tr > .05:
        sh = int(16 * tr)
        arr[..., 0] = np.roll(arr[..., 0], sh, axis=1)
        arr[..., 2] = np.roll(arr[..., 2], -sh, axis=1)
        arr = arr + int(70 * tr ** 2)
    if t < .35: arr = arr * eo(t / .35)
    if t > TOTAL - .45: arr = arr * (1 - eio((t - (TOTAL - .45)) / .45))
    return grade(arr)

def grade(arr):
    x = np.clip(arr, 0, 255).astype(np.float32)
    # bloom: blur the bright parts at quarter size and add them back
    small = Image.fromarray(x.astype(np.uint8)).resize((W // 4, H // 4), Image.BILINEAR)
    sa = np.asarray(small, np.float32)
    br = np.clip(sa - 140, 0, None) * 1.6
    bl = Image.fromarray(np.clip(br, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(9))
    bl = np.asarray(bl.resize((W, H), Image.BILINEAR), np.float32)
    x = x + bl * .55
    # vibrance + contrast
    lum = (x * np.array([.2126, .7152, .0722], np.float32)).sum(2, keepdims=True)
    x = lum + (x - lum) * 1.28
    x = (x - 118) * 1.08 + 118
    return np.clip(x, 0, 255).astype(np.uint8)

def render_scene(name, out):
    a, b = NSC[name]
    n = int(round((b - a) * FPS))
    tmp = out[:-4] + ".part.mp4"
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                          "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "veryfast",
                          "-crf", "17", "-pix_fmt", "yuv420p", tmp], stdin=subprocess.PIPE)
    for i in range(n):
        p.stdin.write(frame(a + i / FPS).tobytes())
    p.stdin.close()
    if p.wait() == 0: os.replace(tmp, out)
    else: sys.exit(f"ffmpeg failed on {name}")

if __name__ == "__main__":
    if sys.argv[1] == "still":
        Image.fromarray(frame(float(sys.argv[2]))).save(sys.argv[3])
    else:
        render_scene(sys.argv[1], sys.argv[2])
