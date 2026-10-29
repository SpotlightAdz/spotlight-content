#!/usr/bin/env python3
"""Brand-kit Instagram carousels, 1080x1350 (4:5). Usage: carousel.py <name>"""
import sys, os, math
import numpy as np
from PIL import Image, ImageDraw
import render as R
import render2 as R2
from render2 import T, logo, tsprite, FT, monogram
from render import W, MAG, ORA, PUR, BLU, CYA, YEL, CORAL, glow_dot, place, rrect_sprite, grad_pill

CW, CH = 1080, 1350
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "posts")
os.makedirs(OUT, exist_ok=True)

def base(seed, mood=0.):
    bg = R.background(seed * 3.7, mood)
    bg = bg.crop((0, (1920 - CH) // 2, CW, (1920 - CH) // 2 + CH))
    return bg

def finish(c, idx, total, name):
    # footer: handle + page dots
    logo(c, 78, CH - 74, 52, .95, glow=.2)
    T(c, "@spotlightadzagency", 118, CH - 94, "sg6", 32, "fg", anchor="l", track=0)
    for i in range(total):
        on = i == idx
        w = 30 if on else 12
        x = CW - 70 - (total - i) * 22 - (18 if on else 0)
        place(c, rrect_sprite(w, 12, 6, (255, 255, 255, 255 if on else 90), (255, 255, 255, 0), 1), x, CH - 80)
    arr = np.asarray(c.convert("RGB")).astype(np.int16)
    out = cgrade(arr)
    Image.fromarray(out).save(f"{OUT}/{name}_{idx + 1:02d}.jpg", quality=94)

def cgrade(arr):
    from PIL import ImageFilter
    x = np.clip(arr, 0, 255).astype(np.float32)
    h, w = x.shape[:2]
    sa = np.asarray(Image.fromarray(x.astype(np.uint8)).resize((w // 4, h // 4), Image.BILINEAR), np.float32)
    bl = Image.fromarray(np.clip(np.clip(sa - 140, 0, None) * 1.6, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(9))
    x = x + np.asarray(bl.resize((w, h), Image.BILINEAR), np.float32) * .55
    lum = (x * np.array([.2126, .7152, .0722], np.float32)).sum(2, keepdims=True)
    x = lum + (x - lum) * 1.28
    x = (x - 118) * 1.08 + 118
    return np.clip(x, 0, 255).astype(np.uint8)

def swipe(c):
    tw = T(c, "سوايب", CW - 70, CH - 170, "ar6", 36, "muted", anchor="r")
    d = ImageDraw.Draw(c)
    x = CW - 70 - tw - 24; y = CH - 170 + 30
    d.line((x, y, x - 34, y), fill=(156, 156, 177), width=5)
    d.line((x - 34, y, x - 20, y - 12), fill=(156, 156, 177), width=5)
    d.line((x - 34, y, x - 20, y + 12), fill=(156, 156, 177), width=5)

def num_badge(c, n, gk):
    T(c, str(n), 90, 150, "sg7", 220, gk, anchor="l", track=-8, gangle=90)

def bio():
    name, total = "bio", 7
    slides = [
        ("1", "شنو كتدير", "فجملة وحدة واضحة", "مثال: صالة رياضة فمرتيل · كوتشينغ و سباحة", "hot"),
        ("2", "فين كاين", "المدينة ولا الحومة", "الناس كيقلبو على اللي قريب ليهم", "warm"),
        ("3", "علاش نتا", "ماشي غيرك", "رقم، نتيجة، ولا حاجة خاصة غير بيك", "aurora"),
        ("4", "كيفاش", "يتواصلو معاك", "واتساب مباشرة، ماشي غير الميساجات", "cool"),
        ("5", "لينك واحد", "واضح", "ماشي عشرة ديال الروابط فبلاصة وحدة", "hot"),
    ]
    # cover
    c = base(1)
    g = glow_dot(160, MAG, .6); place(c, g, CW / 2 - g.width / 2, 470 - g.height / 2, .6)
    T(c, "البيو ديالك", CW / 2, 300, "ar7", 130, "fg")
    T(c, "كيطرد الكليان؟", CW / 2, 470, "ar7", 130, "hot")
    T(c, "5 حوايج خاصو يقولهم", CW / 2, 700, "ar6", 64, "fg")
    T(c, "فـ 3 ثواني", CW / 2, 800, "ar6", 64, "aurora")
    swipe(c); finish(c, 0, total, name)
    for i, (n, h1, h2, ex, gk) in enumerate(slides):
        c = base(2 + i)
        num_badge(c, n, gk)
        T(c, h1, CW - 90, 470, "ar7", 120, "fg", anchor="r")
        T(c, h2, CW - 90, 630, "ar7", 96, gk, anchor="r")
        bw = CW - 180
        place(c, rrect_sprite(bw, 170, 34, (14, 12, 30, 225), (255, 255, 255, 40), 2), 90, 860)
        T(c, ex, CW - 130, 912, "ar5", 44, (215, 212, 228), anchor="r")
        if i < len(slides) - 1: swipe(c)
        finish(c, i + 1, total, name)
    # CTA
    c = base(9)
    logo(c, CW / 2, 330, 230, 1., glow=.7)
    T(c, "بغيتي نشوفو", CW / 2, 520, "ar7", 104, "fg")
    T(c, "البيو ديالك؟", CW / 2, 660, "ar7", 104, "aurora")
    pw, ph = 760, 130
    place(c, grad_pill("hot", pw, ph), CW / 2 - pw / 2, 880)
    T(c, "كتب AUDIT فالكومونتير", CW / 2, 906, "ar7", 54, (255, 255, 255))
    T(c, "مجاني · كنجاوبوك بريل", CW / 2, 1060, "ar5", 42, "muted")
    finish(c, 6, total, name)

def packs():
    name, total = "packs", 6
    c = base(11)
    T(c, "شحال كتخلص", CW / 2, 280, "ar7", 120, "fg")
    T(c, "السوشيال ميديا", CW / 2, 430, "ar7", 120, "hot")
    T(c, "فالمغرب؟", CW / 2, 580, "ar7", 120, "fg")
    T(c, "الباكاجات ديالنا بالواضح، بلا تخبية", CW / 2, 820, "ar5", 48, "muted")
    swipe(c); finish(c, 0, total, name)
    plans = [("Basic", "3.000", ["6 ريلز احترافية", "ستوري تيلينغ", "ستوريز"], "fg"),
             ("Advanced", "6.000", ["12 ريلز احترافية", "ريبورتينغ كل شهر", "كلشي اللي فالـ Basic"], "aurora"),
             ("VIP", "9.000", ["24 ريلز احترافية", "إعلانات فجميع المنصات", "ستراتيجية كاملة", "كلشي اللي فالـ Advanced"], "hot")]
    for i, (nm, price, feats, gk) in enumerate(plans):
        c = base(12 + i)
        T(c, nm, CW / 2, 170, "sg7", 120, gk, track=-4)
        if nm == "VIP":
            pw = 340; place(c, grad_pill("hot", pw, 66), CW / 2 - pw / 2, 345)
            T(c, "الباكاج الكامل", CW / 2, 352, "ar7", 38, (255, 255, 255))
        T(c, price, CW / 2, 440, "sg7", 230, "warm" if nm != "Advanced" else "aurora", track=-8)
        T(c, "درهم / الشهر", CW / 2, 720, "ar6", 48, "muted")
        for j, f in enumerate(feats):
            y = 830 + j * 92
            T(c, f, CW - 200, y, "ar6", 48, "fg", anchor="r")
            d = glow_dot(8, CORAL, 1.); place(c, d, CW - 165 - d.width / 2, y + 32 - d.height / 2)
        swipe(c); finish(c, 1 + i, total, name)
    c = base(16)
    T(c, "النتائج كتهضر", CW / 2, 170, "ar7", 104, "fg")
    rows = [("101K", "متابع · Happy Fitness", "hot"), ("35.6K", "مشاهدة فريل · Grillade Khay Ahmed", "warm"),
            ("+400%", "كليان جداد · Aboujoud", "cool")]
    for i, (st, lab, gk) in enumerate(rows):
        y = 360 + i * 270
        T(c, st, CW / 2, y, "sg7", 150, gk, track=-6)
        T(c, lab, CW / 2, y + 180, "ar5", 40, "muted")
    swipe(c); finish(c, 4, total, name)
    c = base(17)
    logo(c, CW / 2, 330, 230, 1., glow=.7)
    T(c, "بدا اليوم", CW / 2, 520, "ar7", 120, "fg")
    pw, ph = 800, 130
    place(c, grad_pill("hot", pw, ph), CW / 2 - pw / 2, 760)
    T(c, "صيفط لينا فواتساب", CW / 2, 786, "ar7", 56, (255, 255, 255))
    T(c, "+212 701 177 915", CW / 2, 960, "sg7", 80, "fg", track=0)
    T(c, "spotlightadz.ma", CW / 2, 1080, "it5", 44, "muted", track=1)
    finish(c, 5, total, name)

def hooks():
    name, total = "hooks", 7
    c = base(21)
    T(c, "10 هوكس", CW / 2, 300, "ar7", 150, "hot")
    T(c, "بالدارجة", CW / 2, 480, "ar7", 120, "fg")
    T(c, "خودهم و ستعملهم فالريلز ديالك", CW / 2, 720, "ar6", 56, "fg")
    T(c, "كيوقفو السكرول فـ 2 ثواني", CW / 2, 820, "ar5", 48, "muted")
    swipe(c); finish(c, 0, total, name)
    pairs = [
        [("إلا عندك ريسطو فمرتيل، شوف هادي", "كتعيّط على اللي كيتفرج"), ("3 غلطات كيخسروك الكليان", "الخوف من الخسارة")],
        [("ريل وحدة جابت 151 ألف مشاهدة. هاكيفاش", "الرقم الكبير الأول"), ("هادا الحساب قبل… و هادا من بعد", "قبل و من بعد")],
        [("شحال كيخلص البراند على السوشيال ميديا؟", "الثمن كيهم الكل"), ("ماشي خاصك الفلوس باش تولي ڤايرال", "كتهرس فكرة غالطة")],
        [("هادا اللي ما كيقولوهش ليك", "سر من الداخل"), ("عطيني 30 ثانية ونبدل ليك البيو ديالك", "وعد قصير")],
        [("ملي الكليان كيقولك: غير دير شي فيديو زوين", "كيصيفطوها لصحابهم"), ("عندك غير 3 ثواني باش توقّف السكرول", "كيشبه كيفاش كنتفرجو")],
    ]
    gk = ["hot", "warm", "aurora", "cool", "hot"]
    for i, pr in enumerate(pairs):
        c = base(22 + i)
        for j, (h, why) in enumerate(pr):
            n = i * 2 + j + 1
            y = 150 + j * 520
            T(c, f"{n:02d}", 90, y, "sg7", 120, gk[i], anchor="l", track=-4, gangle=90)
            bw = CW - 180
            place(c, rrect_sprite(bw, 230, 34, (14, 12, 30, 225), (255, 255, 255, 40), 2), 90, y + 170)
            T(c, h, CW - 130, y + 214, "ar7", 52 if len(h) < 26 else (42 if len(h) < 34 else 36), "fg", anchor="r")
            T(c, why, CW - 130, y + 300, "ar5", 38, "muted", anchor="r")
        swipe(c); finish(c, 1 + i, total, name)
    c = base(28)
    logo(c, CW / 2, 330, 230, 1., glow=.7)
    T(c, "سيف البوست", CW / 2, 520, "ar7", 110, "fg")
    T(c, "و جرّب هوك واحد اليوم", CW / 2, 670, "ar7", 80, "aurora")
    pw, ph = 820, 130
    place(c, grad_pill("hot", pw, ph), CW / 2 - pw / 2, 880)
    T(c, "بغيتي نكتبو ليك الريلز؟ صيفط لينا", CW / 2, 908, "ar7", 48, (255, 255, 255))
    T(c, "+212 701 177 915", CW / 2, 1070, "sg7", 64, "fg", track=0)
    finish(c, 6, total, name)

def hf():
    name, total = "happyfitness", 6
    c = base(31)
    T(c, "صالة رياضة فمرتيل", CW / 2, 250, "ar7", 100, "fg")
    T(c, "وصلات لـ", CW / 2, 400, "ar7", 100, "fg")
    T(c, "101K", CW / 2, 520, "sg7", 300, "hot", track=-10)
    T(c, "متابع. هاكيفاش", CW / 2, 880, "ar7", 90, "aurora")
    swipe(c); finish(c, 0, total, name)
    steps = [("1", "ريلز كل نهار", "ماشي غير بوسطات و تصاور", "hot"),
             ("2", "الناس هوما النجوم", "الأعضاء و الكوتشات قدام الكاميرا", "warm"),
             ("3", "ريل وحدة", "151.2K مشاهدة… و جات معاها الكليان", "aurora"),
             ("4", "سيستام ماشي حظ", "خطة، إنتاج، و تحليل كل شهر", "cool")]
    for i, (n, h1, sub, gk) in enumerate(steps):
        c = base(32 + i)
        num_badge(c, n, gk)
        T(c, h1, CW - 90, 500, "ar7", 110, "fg", anchor="r")
        bw = CW - 180
        place(c, rrect_sprite(bw, 190, 34, (14, 12, 30, 225), (255, 255, 255, 40), 2), 90, 760)
        T(c, sub, CW - 130, 816, "ar6", 44, (215, 212, 228), anchor="r")
        swipe(c); finish(c, 1 + i, total, name)
    c = base(37)
    logo(c, CW / 2, 330, 230, 1., glow=.7)
    T(c, "بغيتي نفس الشي", CW / 2, 520, "ar7", 100, "fg")
    T(c, "للبراند ديالك؟", CW / 2, 660, "ar7", 100, "aurora")
    pw, ph = 760, 130
    place(c, grad_pill("hot", pw, ph), CW / 2 - pw / 2, 880)
    T(c, "كتب SPOT فالكومونتير", CW / 2, 906, "ar7", 54, (255, 255, 255))
    T(c, "+212 701 177 915", CW / 2, 1070, "sg7", 64, "fg", track=0)
    finish(c, 5, total, name)

if __name__ == "__main__":
    {"bio": bio, "packs": packs, "hooks": hooks, "hf": hf}[sys.argv[1]]()
