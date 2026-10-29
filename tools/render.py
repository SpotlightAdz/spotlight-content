#!/usr/bin/env python3
"""Spotlight Adz — 30s vertical motion graphic (1080x1920, 30fps).
Usage: render.py <scene> [out.mp4]   |   render.py still <time_s> out.png
"""
import sys, math, os, subprocess, functools
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

W, H, FPS = 1080, 1920, 30
HERE = os.path.dirname(os.path.abspath(__file__))
FD = os.path.join(HERE, "fonts")

def font(fam, w, size):
    return ImageFont.truetype(f"{FD}/{fam}-{w}.ttf", size)

@functools.lru_cache(None)
def F(fam, w, size): return font(fam, w, size)

# ---------- brand tokens ----------
BG = (4, 3, 12)
FG = (251, 248, 245)
MUTED = (156, 156, 177)
YEL, ORA, RED, MAG = (255,184,0), (255,122,26), (255,61,46), (255,45,122)
PINK, PUR, BLU, CYA = (217,38,179), (123,60,242), (47,123,255), (34,211,238)
CORAL = (255,111,105)
AURORA = [(0,YEL),(.30,RED),(.55,MAG),(.80,PUR),(1,CYA)]
WARM = [(0,YEL),(.5,ORA),(1,RED)]
COOL = [(0,PUR),(.6,BLU),(1,CYA)]
HOT = [(0,(255,106,61)),(.38,(255,61,122)),(.72,(177,75,255)),(1,(95,109,255))]

# ---------- easing ----------
def clamp(x, a=0., b=1.): return max(a, min(b, x))
def eo(x): x = clamp(x); return 1 - (1 - x) ** 3
def eio(x): x = clamp(x); return 4*x*x*x if x < .5 else 1 - (-2*x+2)**3/2
def eback(x):
    x = clamp(x); c1 = 1.4; c3 = c1 + 1
    return 1 + c3*(x-1)**3 + c1*(x-1)**2
def prog(t, start, dur): return clamp((t - start) / dur)

def env(t, tin, tout, din=.55, dout=.4):
    """returns (alpha, dy) for slide-up-in / fade-up-out"""
    a_in = eo(prog(t, tin, din)); a_out = 1 - eio(prog(t, tout, dout))
    dy = (1 - a_in) * 60 - (1 - a_out) * 40
    return a_in * a_out, dy

# ---------- gradients ----------
def ramp(stops, n):
    xs = np.linspace(0, 1, n); out = np.zeros((n, 3))
    for c in range(3):
        out[:, c] = np.interp(xs, [s[0] for s in stops], [s[1][c] for s in stops])
    return out

@functools.lru_cache(None)
def grad_img(stops_key, w, h, angle=135):
    stops = STOPS[stops_key]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    a = math.radians(angle - 90)
    d = xx * math.cos(a) + yy * math.sin(a)
    d = (d - d.min()) / max(1e-6, d.max() - d.min())
    lut = ramp(stops, 512)
    arr = lut[(d * 511).astype(int)].astype(np.uint8)
    return Image.fromarray(arr, "RGB")

STOPS = {"aurora": AURORA, "warm": WARM, "cool": COOL, "hot": HOT}

# ---------- text sprites ----------
def text_w(s, f, track=0):
    return f.getlength(s) + track * max(0, len(s) - 1)

@functools.lru_cache(None)
def text_sprite(s, fam, w, size, fill="fg", track=0.0, gangle=100):
    """RGBA sprite. fill = 'fg' | 'muted' | gradient key | rgb tuple"""
    f = F(fam, w, size)
    asc, desc = f.getmetrics()
    pad = int(size * .25)
    tw = int(math.ceil(text_w(s, f, track))) + pad * 2
    th = asc + desc + pad * 2
    mask = Image.new("L", (tw, th), 0)
    d = ImageDraw.Draw(mask)
    if track == 0:
        d.text((pad, pad), s, font=f, fill=255)
    else:
        x = pad
        for i, ch in enumerate(s):
            d.text((x, pad), ch, font=f, fill=255)
            x += f.getlength(ch) + track
            if i + 1 < len(s):  # keep kerning-ish via pair length
                x += f.getlength(s[i:i+2]) - f.getlength(s[i]) - f.getlength(s[i+1])
    if fill in STOPS:
        col = grad_img(fill, tw, th, gangle)
    else:
        rgb = FG if fill == "fg" else MUTED if fill == "muted" else fill
        col = Image.new("RGB", (tw, th), rgb)
    spr = col.convert("RGBA"); spr.putalpha(mask)
    return spr, pad

def with_alpha(img, a):
    if a >= .999: return img
    im = img.copy()
    al = im.getchannel("A").point(lambda v: int(v * a))
    im.putalpha(al); return im

def place(canvas, spr, x, y, a=1.0, scale=1.0):
    if a <= 0.003: return
    if abs(scale - 1) > 1e-3:
        nw, nh = max(1, int(spr.width * scale)), max(1, int(spr.height * scale))
        cx, cy = x + spr.width / 2, y + spr.height / 2
        spr = spr.resize((nw, nh), Image.BICUBIC)
        x, y = cx - nw / 2, cy - nh / 2
    canvas.alpha_composite(with_alpha(spr, a), (int(round(x)), int(round(y))))

def draw_text(canvas, s, cx, y, fam="space-grotesk", w=600, size=96, fill="fg",
              track=None, a=1., scale=1., anchor="c", gangle=100):
    if track is None: track = -0.03 * size if fam == "space-grotesk" else 0
    spr, pad = text_sprite(s, fam, w, size, fill, round(track, 2), gangle)
    if anchor == "c": x = cx - spr.width / 2
    elif anchor == "l": x = cx - pad
    else: x = cx - spr.width + pad
    place(canvas, spr, x, y - pad, a, scale)
    return spr.width - 2 * pad

# ---------- shapes ----------
@functools.lru_cache(None)
def rrect_sprite(w, h, r, fill, border, bw=2):
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w - 1, h - 1), r, fill=fill, outline=border, width=bw)
    return im

@functools.lru_cache(None)
def grad_pill(key, w, h, angle=110):
    g = grad_img(key, w, h, angle).convert("RGBA")
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, w - 1, h - 1), h // 2, fill=255)
    g.putalpha(m); return g

@functools.lru_cache(None)
def glow_dot(r, rgb, strength=1.0):
    s = r * 6
    yy, xx = np.mgrid[0:s, 0:s].astype(np.float32) - s / 2
    d = np.sqrt(xx**2 + yy**2) / r
    a = np.clip(np.exp(-d**2 * .5) * strength, 0, 1)
    core = np.clip(1.2 - d, 0, 1)
    arr = np.zeros((s, s, 4), np.uint8)
    for c in range(3):
        arr[..., c] = np.clip(rgb[c] * (1 - core) + 255 * core, 0, 255)
    arr[..., 3] = (np.maximum(a, core) * 255).astype(np.uint8)
    return Image.fromarray(arr, "RGBA")

@functools.lru_cache(None)
def conic(size):
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32) - size / 2
    ang = (np.arctan2(yy, xx) / (2 * math.pi)) % 1
    lut = ramp([(0,YEL),(.2,ORA),(.4,RED),(.55,MAG),(.72,PUR),(.86,BLU),(1,YEL)], 1024)
    rgb = lut[(ang * 1023).astype(int)]
    r = np.sqrt(xx**2 + yy**2) / (size / 2)
    # soft inner highlight
    hl = np.clip(1 - np.sqrt((xx + size*.15)**2 + (yy + size*.18)**2) / (size*.38), 0, 1) ** 1.5
    rgb = rgb * (1 - hl[..., None] * .55) + 255 * hl[..., None] * .55
    a = np.clip((1 - r) * size / 3, 0, 1)
    arr = np.dstack([np.clip(rgb, 0, 255), a * 255]).astype(np.uint8)
    return Image.fromarray(arr, "RGBA")

def orb(canvas, cx, cy, d, t, a=1., spin=1.):
    if d < 4 or a <= 0.003: return
    big = conic(512).rotate(-t * 70 * spin, Image.BICUBIC)
    # glow
    gl = glow_dot(max(8, int(d * .35)), MAG, .9)
    place(canvas, gl, cx - gl.width / 2, cy - gl.height / 2, a * .55)
    o = big.resize((int(d), int(d)), Image.LANCZOS)
    place(canvas, o, cx - d / 2, cy - d / 2, a)

# ---------- background (continuous across scenes) ----------
LW, LH = 270, 480
_yy, _xx = np.mgrid[0:LH, 0:LW].astype(np.float32)

def blob(cx, cy, rad, rgb, k):
    d2 = ((_xx - cx) ** 2 + (_yy - cy) ** 2) / (rad ** 2)
    a = np.exp(-d2 * 2.2) * k
    return a[..., None] * np.array(rgb, np.float32)[None, None, :]

@functools.lru_cache(None)
def grid_overlay():
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    step = 90
    for x in range(0, W, step): d.line((x, 0, x, H), fill=(255, 255, 255, 9))
    for y in range(0, H, step): d.line((0, y, W, y), fill=(255, 255, 255, 9))
    # fade grid toward bottom
    m = Image.linear_gradient("L").resize((W, H)).point(lambda v: 255 - int(v * .85))
    al = ImageChops.multiply(im.getchannel("A"), m); im.putalpha(al)
    return im

@functools.lru_cache(None)
def vignette():
    yy, xx = np.mgrid[0:LH, 0:LW].astype(np.float32)
    d = np.sqrt(((xx - LW/2) / (LW/2)) ** 2 + ((yy - LH/2) / (LH/2)) ** 2)
    a = np.clip((d - .7) / .7, 0, 1) * 150
    arr = np.zeros((LH, LW, 4), np.uint8); arr[..., 3] = a.astype(np.uint8)
    return Image.fromarray(arr, "RGBA").resize((W, H), Image.BILINEAR)

def background(t, mood=0.):
    """mood 0 = warm/social, 1 = cool/systems"""
    s = math.sin
    base = np.zeros((LH, LW, 3), np.float32) + np.array(BG, np.float32)
    w = 1 - mood
    base += blob(40 + 30*s(t*.31), 40 + 25*s(t*.23), 210, ORA, .36 * (.5 + .5*w))
    base += blob(240 + 25*s(t*.27+1), 70 + 30*s(t*.19+2), 200, MAG, .34)
    base += blob(150 + 40*s(t*.21+3), 420 + 25*s(t*.29), 230, BLU, .26 + .14*mood)
    base += blob(60 + 30*s(t*.17+4), 300 + 40*s(t*.25+1), 170, PUR, .16 + .12*mood)
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), "RGB").resize((W, H), Image.BICUBIC).convert("RGBA")
    img.alpha_composite(grid_overlay())
    img.alpha_composite(vignette())
    return img

# ---------- small components ----------
def pill_label(canvas, text, cx, y, a=1., dot=MAG, size=30):
    f = F("inter-tight", 500, size); track = size * .18
    tw = text_w(text, f, track); h = int(size * 2.1); w = int(tw + size * 2.6)
    box = rrect_sprite(w, h, h // 2, (255, 255, 255, 10), (255, 255, 255, 40), 2)
    x0 = cx - w / 2
    place(canvas, box, x0, y, a)
    dg = glow_dot(6, dot, 1.)
    place(canvas, dg, x0 + size * .95 - dg.width/2, y + h/2 - dg.height/2, a)
    draw_text(canvas, text, x0 + size * 1.7, y + (h - size * 1.2) / 2, "inter-tight", 500, size,
              (230, 225, 235), track=track, a=a, anchor="l")
    return h

def card(canvas, x, y, w, h, num, title, body, a, gkey="aurora"):
    box = rrect_sprite(w, h, 34, (14, 12, 30, 200), (255, 255, 255, 26), 2)
    place(canvas, box, x, y, a)
    draw_text(canvas, num, x + 44, y + 40, "space-grotesk", 700, 54, gkey, a=a, anchor="l", gangle=90)
    draw_text(canvas, title, x + 150, y + 38, "space-grotesk", 600, 56, "fg", a=a, anchor="l")
    draw_text(canvas, body, x + 150, y + 112, "inter-tight", 400, 34, "muted", a=a, anchor="l")

def fmt_k(v, dec=1):
    return f"{v:.{dec}f}K"

# ================= SCENES =================
# (start, end) in global seconds
SCENES = {
    "s1": (0.0, 4.0), "s2": (4.0, 7.5), "s3": (7.5, 13.5), "s4": (13.5, 17.0),
    "s5": (17.0, 23.5), "s6": (23.5, 26.0), "s7": (26.0, 30.0),
}

def mood_at(t):
    return eio(prog(t, 16.2, 1.6)) * (1 - eio(prog(t, 25.6, 1.2)))

def scene_s1(c, t):  # intro: orb + wordmark + tagline
    lt = t
    s = eback(prog(lt, .15, .9))
    a = eo(prog(lt, .15, .5)) * (1 - eio(prog(lt, 3.55, .45)))
    orb(c, W/2, 760, 300 * s, t, a, spin=2.2 - 1.2 * eo(prog(lt, 0, 1.6)))
    al, dy = env(lt, .8, 3.55)
    draw_text(c, "Spotlight Adz", W/2, 975 + dy, "space-grotesk", 700, 118, "fg", a=al)
    al2, dy2 = env(lt, 1.05, 3.6)
    draw_text(c, "CREATIVE  ·  AI  ·  MARKETING", W/2, 1125 + dy2, "inter-tight", 500, 32, "muted",
              track=6, a=al2)
    al3, dy3 = env(lt, 1.7, 3.65)
    pill_label(c, "WHERE INTELLIGENCE MEETS IMAGINATION", W/2, 1260 + dy3, al3, size=27)

def scene_s2(c, t):  # hook
    lt = t - 4.0
    lines = [("Your brand needs", "fg", 0.0), ("attention.", "warm", .35),
             ("And a system", "fg", 1.15), ("to keep it.", "cool", 1.5)]
    y0 = 690
    for i, (txt, fill, d) in enumerate(lines):
        al, dy = env(lt, .1 + d, 3.05 + i * .05)
        y = y0 + i * 150 + (40 if i >= 2 else 0)
        draw_text(c, txt, W/2, y + dy, "space-grotesk", 600 if fill == "fg" else 700, 118, fill, a=al)

def scene_s3(c, t):  # social media management
    lt = t - 7.5
    al, dy = env(lt, .05, 5.55)
    pill_label(c, "01  ·  SOCIAL MEDIA MANAGEMENT", W/2, 300 + dy, al, dot=ORA)
    a1, d1 = env(lt, .3, 5.6)
    draw_text(c, "Don't just show up.", W/2, 445 + d1, "space-grotesk", 600, 98, "fg", a=a1)
    a2, d2 = env(lt, .55, 5.65)
    draw_text(c, "Stay with them.", W/2, 565 + d2, "space-grotesk", 700, 112, "aurora", a=a2)
    cards = [("01", "Direction", "A monthly idea people recognize"),
             ("02", "Production", "Reels, Stories & carousels, one world"),
             ("03", "Growth", "Publish, engage, learn, repeat")]
    for i, (n, ti, bo) in enumerate(cards):
        ca, cd = env(lt, 1.3 + i * .55, 5.4 + i * .06, din=.6)
        slide = (1 - eo(prog(lt, 1.3 + i * .55, .7))) * 140
        card(c, 70 + slide, 790 + i * 250 + cd, W - 140, 210, n, ti, bo, ca)
    # platform row
    pa, pd = env(lt, 3.3, 5.7)
    draw_text(c, "Instagram  ·  TikTok  ·  Facebook", W/2, 1570 + pd, "inter-tight", 500, 36,
              "muted", track=2, a=pa)

def scene_s4(c, t):  # social proof counters
    lt = t - 13.5
    al, dy = env(lt, .05, 3.05)
    draw_text(c, "Real results, in motion.", W/2, 470 + dy, "space-grotesk", 600, 80, "fg", a=al)
    k = eio(prog(lt, .35, 1.5))
    a1, d1 = env(lt, .25, 3.1)
    draw_text(c, fmt_k(151.2 * k), W/2, 640 + d1, "space-grotesk", 700, 230, "hot", a=a1, track=-8)
    draw_text(c, "views on a single Reel", W/2, 905 + d1, "inter-tight", 500, 42, "muted", a=a1)
    k2 = eio(prog(lt, .9, 1.4))
    a2, d2 = env(lt, .8, 3.15)
    draw_text(c, fmt_k(101.1 * k2), W/2, 1060 + d2, "space-grotesk", 700, 230, "aurora", a=a2, track=-8)
    draw_text(c, "followers built for Happy Fitness", W/2, 1325 + d2, "inter-tight", 500, 42,
              "muted", a=a2)

NODES = [("POS", -90), ("E-commerce", -30), ("Dashboards", 30),
         ("AI on WhatsApp", 90), ("CRM", 150), ("Client Portal", 210)]

def scene_s5(c, t):  # custom systems hub
    lt = t - 17.0
    al, dy = env(lt, .05, 6.05)
    pill_label(c, "02  ·  CUSTOM SYSTEMS", W/2, 300 + dy, al, dot=CYA)
    a1, d1 = env(lt, .3, 6.1)
    draw_text(c, "One system.", W/2, 445 + d1, "space-grotesk", 600, 104, "fg", a=a1)
    a2, d2 = env(lt, .55, 6.15)
    draw_text(c, "Your whole business.", W/2, 565 + d2, "space-grotesk", 700, 100, "cool", a=a2)
    out = 1 - eio(prog(lt, 6.0, .45))
    cx, cy, R = W/2, 1180, 350
    # lines + nodes
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    pts = []
    for i, (name, ang) in enumerate(NODES):
        st = 1.2 + i * .28
        p = eo(prog(lt, st, .6))
        rot = math.radians(ang + lt * 4)
        nx, ny = cx + math.cos(rot) * R, cy + math.sin(rot) * R * .92
        pts.append((name, nx, ny, st, p))
        if p > 0:
            ex, ey = cx + (nx - cx) * p, cy + (ny - cy) * p
            d.line((cx, cy, ex, ey), fill=(255, 255, 255, int(70 * out)), width=3)
    c.alpha_composite(layer)
    # pulses travelling hub -> node
    cols = [ORA, MAG, PUR, BLU, CYA, CORAL]
    for i, (name, nx, ny, st, p) in enumerate(pts):
        if p >= 1:
            for k in range(2):
                ph = ((lt - st) * .7 + k * .5) % 1
                px, py = cx + (nx - cx) * ph, cy + (ny - cy) * ph
                g = glow_dot(7, cols[i], 1.)
                place(c, g, px - g.width/2, py - g.height/2, out * math.sin(ph * math.pi))
    # hub
    hs = eback(prog(lt, .8, .8))
    orb(c, cx, cy, 190 * hs, t, eo(prog(lt, .8, .4)) * out, spin=.8)
    # nodes
    for i, (name, nx, ny, st, p) in enumerate(pts):
        na = eo(prog(lt, st + .35, .4)) * out
        if na <= 0: continue
        f = F("space-grotesk", 600, 38)
        w = int(f.getlength(name) + 64); h = 84
        sc = .85 + .15 * eback(prog(lt, st + .35, .5))
        box = rrect_sprite(w, h, h // 2, (16, 14, 34, 235), (255, 255, 255, 60), 2)
        place(c, box, nx - w/2, ny - h/2, na, sc)
        draw_text(c, name, nx, ny - 24, "space-grotesk", 600, 38, "fg", a=na, scale=sc, track=-.5)

def scene_s6(c, t):  # tagline
    lt = t - 23.5
    a1, d1 = env(lt, .1, 2.05)
    draw_text(c, "Beautiful outside.", W/2, 790 + d1, "space-grotesk", 600, 104, "fg", a=a1)
    a2, d2 = env(lt, .6, 2.1)
    draw_text(c, "Brilliant underneath.", W/2, 930 + d2, "space-grotesk", 700, 98, "aurora", a=a2)

def scene_s7(c, t):  # CTA
    lt = t - 26.0
    s = eback(prog(lt, .1, .8))
    orb(c, W/2, 560, 200 * s, t, eo(prog(lt, .1, .4)))
    a1, d1 = env(lt, .4, 9)
    draw_text(c, "Let's build", W/2, 730 + d1, "space-grotesk", 600, 120, "fg", a=a1)
    a2, d2 = env(lt, .6, 9)
    draw_text(c, "your world.", W/2, 860 + d2, "space-grotesk", 700, 130, "aurora", a=a2)
    # button
    ba = eo(prog(lt, 1.0, .5)); bs = .9 + .1 * eback(prog(lt, 1.0, .6))
    bw, bh = 560, 124
    pulse = 1 + .025 * math.sin(max(0, lt - 1.8) * 5)
    gl = glow_dot(70, MAG, .7)
    place(c, gl, W/2 - gl.width/2, 1100 + bh/2 - gl.height/2, ba * .5)
    place(c, grad_pill("hot", bw, bh), W/2 - bw/2, 1100, ba, bs * pulse)
    btn = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    tw = draw_text(btn, "Start a project", 70, 30, "space-grotesk", 600, 52, (255, 255, 255),
                   track=-1, anchor="l")
    ax, ay = 70 + tw + 28, bh / 2
    bd = ImageDraw.Draw(btn)
    bd.line((ax, ay, ax + 46, ay), fill=(255, 255, 255, 255), width=6)
    bd.line((ax + 28, ay - 17, ax + 46, ay), fill=(255, 255, 255, 255), width=6)
    bd.line((ax + 28, ay + 17, ax + 46, ay), fill=(255, 255, 255, 255), width=6)
    place(c, btn, W/2 - (tw + 74) / 2 - 70, 1100, ba, bs * pulse)
    a3, d3 = env(lt, 1.4, 9)
    draw_text(c, "WhatsApp  +212 538 977 316", W/2, 1300 + d3, "inter-tight", 500, 44, "fg", a=a3)
    a4, d4 = env(lt, 1.6, 9)
    draw_text(c, "spotlightadz.ma", W/2, 1375 + d4, "inter-tight", 500, 40, "muted", a=a4, track=1)
    a5, d5 = env(lt, 1.9, 9)
    sw = draw_text(c, "5.0  ·  MARTIL, MOROCCO  ·  WORLDWIDE", W/2 + 22, 1500 + d5, "inter-tight", 500, 28,
              (255, 184, 0), track=4, a=a5)
    star = Image.new("RGBA", (40, 40), (0, 0, 0, 0)); sd = ImageDraw.Draw(star)
    pts = [(20 + (17 if k % 2 == 0 else 7) * math.cos(math.radians(-90 + k * 36)),
            21 + (17 if k % 2 == 0 else 7) * math.sin(math.radians(-90 + k * 36))) for k in range(10)]
    sd.polygon(pts, fill=(255, 184, 0, 255))
    place(c, star, W/2 + 22 - sw / 2 - 46, 1500 + d5 - 2, a5)

DRAW = {"s1": scene_s1, "s2": scene_s2, "s3": scene_s3, "s4": scene_s4,
        "s5": scene_s5, "s6": scene_s6, "s7": scene_s7}

def frame(t):
    c = background(t, mood_at(t))
    for k, (a, b) in SCENES.items():
        if a - 1e-6 <= t < b + 1e-6:
            DRAW[k](c, t)
    if t < .4:  # fade from black
        c = Image.blend(Image.new("RGBA", (W, H), BG + (255,)), c, eo(t / .4))
    return c.convert("RGB")

def render_scene(name, out):
    a, b = SCENES[name]
    n = int(round((b - a) * FPS))
    tmp = out[:-4] + ".part.mp4"
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                          "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264",
                          "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p",
                          "-movflags", "+faststart", tmp], stdin=subprocess.PIPE)
    for i in range(n):
        p.stdin.write(frame(a + i / FPS).tobytes())
    p.stdin.close()
    if p.wait() == 0: os.replace(tmp, out)
    else: sys.exit(f"ffmpeg failed on {name}")

if __name__ == "__main__":
    if sys.argv[1] == "still":
        frame(float(sys.argv[2])).save(sys.argv[3])
    else:
        render_scene(sys.argv[1], sys.argv[2])
