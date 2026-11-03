#!/usr/bin/env python3
"""Hollywood-style hybrid trailer score + SFX + VO mix for the Spotlight Adz services trailer."""
import sys, wave, subprocess
sys.path.insert(0, "/home/claude/spot")
import numpy as np
from audiolib import SR, tt, lp, hp, bp, note, reverb, kick, clap, hat, pad_chord, pluck, sub, whoosh, riser, impact, pop, ding, tick, shimmer
from audiolib import rng

stem = sys.argv[1] if len(sys.argv) > 1 else ""
BPM = 128; BEAT = 60 / BPM; BAR = BEAT * 4
TOTAL = 24 * BAR + 3.6 * BAR
N = int((TOTAL + .3) * SR)
SVC = [4 * BAR + i * 3 * BAR for i in range(6)]
PROOF, CTA = 22 * BAR, 24 * BAR
CUTS = [7.5] + SVC[1:] + [PROOF, CTA]

music = np.zeros((N, 2)); sfx = np.zeros((N, 2))
def add(buf, x, t, g=1.0, pan=0.0):
    i = int(t * SR)
    if i >= len(buf) or i < 0 and -i >= len(x): return
    if i < 0: x = x[-i:]; i = 0
    x = x[: len(buf) - i]
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        x = np.stack([x * l * 1.41, x * r * 1.41], 1)
    buf[i:i + len(x)] += x * g

# ---------- trailer instruments ----------
def braam(d=4.0, root=33):
    t = tt(d); x = np.zeros(len(t))
    for m, g in ((root, 1.), (root + 12, .7), (root + 7, .5), (root - 12, .6)):
        for det in (-.12, 0, .11):
            f = note(m) * 2 ** (det / 12); ph = rng.uniform(0, 6)
            x += (2 * ((f * t + ph) % 1) - 1) * g
    cutoff = 200 + 2600 * np.exp(-t * 1.4)
    out = np.zeros(len(t)); seg = 2048
    for i in range(0, len(t), seg):
        out[i:i + seg] = lp(x[i:i + seg], float(cutoff[i]), 2)
    env = np.minimum(1, t / .04) * np.exp(-t * .55)
    return np.tanh(out * env * .35) * .9

def taiko(f0=70):
    t = tt(1.2); f = f0 * (1 + .8 * np.exp(-t * 18))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.5)
    skin = bp(rng.normal(0, 1, len(t)), 200, 1800) * np.exp(-t * 30) * .5
    return np.tanh((body + skin) * 1.8) * .7

def snare():
    t = tt(.25); n = bp(rng.normal(0, 1, len(t)), 900, 8000) * np.exp(-t * 22)
    return (n + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * .4) * .6

def revcym(d=1.6):
    t = tt(d); x = hp(rng.normal(0, 1, len(t)), 3000) * (t / d) ** 3
    return x * .55

def tick2(hi=True):
    t = tt(.05); f = 2400 if hi else 1700
    return (np.sin(2 * np.pi * f * t) * np.exp(-t * 120) + hp(rng.normal(0, 1, len(t)), 4000) * np.exp(-t * 200) * .4) * .45

def subdrop(d=1.6):
    t = tt(d); f = 80 * np.exp(-t * 1.6) + 28
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.2) * .9

def metal_hit():
    t = tt(1.4); x = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * np.exp(-t * k) for f, k in ((523, 3), (1487, 5), (2311, 7), (3797, 9)))
    return x * .12 + impact()[: len(t)] * .5

def slam():
    return np.concatenate([kick() * 1.0, np.zeros(1)])[: int(.45 * SR)] * .8 + np.pad(snare(), (0, int(.45 * SR) - len(snare())))[: int(.45 * SR)] * .6

def lock():
    t = tt(.18); x = bp(rng.normal(0, 1, len(t)), 1200, 5000) * np.exp(-t * 50) + np.sin(2 * np.pi * 320 * t) * np.exp(-t * 40) * .6
    out = np.zeros(int(.3 * SR)); out[: len(x)] += x; out[int(.06 * SR):int(.06 * SR) + len(x)] += x * .6
    return out * .5

def click():
    t = tt(.04); return bp(rng.normal(0, 1, len(t)), 2000, 8000) * np.exp(-t * 200) * .6

def notif():
    out = np.zeros(int(.6 * SR))
    for k, f in enumerate((988, 1319)):
        x = np.sin(2 * np.pi * f * tt(.3)) * np.exp(-tt(.3) * 12) * .32; i = int(k * .1 * SR); out[i:i + len(x)] += x
    return out

def chime():
    out = np.zeros(int(1.2 * SR))
    for k, m in enumerate([76, 83, 88]):
        x = ding(note(m)); i = int(k * .07 * SR); out[i:i + len(x)] += x[: len(out) - i]
    return out * .8

def swish(d=.5):
    return whoosh(d, True) * .7

def saw(f, d):
    t = tt(d); return 2 * ((f * t) % 1) - 1

def bass_note(m, d):
    t = tt(d); x = saw(note(m - 24), d) * .6 + np.sin(2 * np.pi * note(m - 24) * t) * .8
    return lp(x, 420) * np.minimum(1, t / .005) * np.exp(-t * 3) * .55

def lead(m, d):
    t = tt(d); x = saw(note(m), d) + saw(note(m) * 1.005, d)
    return lp(x, 2600) * np.minimum(1, t / .01) * np.exp(-t * 4) * .07

# ---------- HOOK 0 - 3.75 ----------
add(music, lp(rng.normal(0, 1, int(3.8 * SR)), 120) * .25 * np.linspace(.2, 1, int(3.8 * SR)), 0, 1.)   # low rumble
for k in range(8):
    add(sfx, tick2(k % 2 == 0), k * BEAT, .9)
for i in range(6):
    st = BEAT * 2 + i * BEAT * .82
    add(sfx, slam(), st, .9); add(sfx, pop(400 + i * 60), st, .4)
add(sfx, revcym(1.2), 3.75 - 1.2, 1.0)
add(sfx, riser(.8), 3.75 - .8, .5)
# ---------- BRAAM 3.75 ----------
add(music, braam(4.2, 33), 3.75, .62)
add(sfx, impact(), 3.75, .75); add(sfx, subdrop(2.0), 3.75, .6)
# tension build 4.7 - 7.35 : ostinato + accelerating snare roll
t0 = 4.7
while t0 < 7.35:
    add(music, pluck(57 + (12 if int((t0 - 4.7) / (BEAT / 2)) % 4 == 3 else 0), .2), t0, .9)
    t0 += BEAT / 2
add(music, pad_chord([45, 52, 57, 60], 3.0) * .9, 4.6, 1.)
rt = 5.6; gap = BEAT / 2
while rt < 7.3:
    add(sfx, snare(), rt, .15 + .35 * (rt - 5.6) / 1.7); gap = max(.035, gap * .86); rt += gap
add(sfx, riser(1.9), 7.35 - 1.9, .55); add(sfx, revcym(1.0), 7.35 - 1.0, .55)
# (silence 7.35 - 7.5: pre-drop gap)

# ---------- DROP + SERVICES 7.5 - 41.25 ----------
prog = [(45, [57, 60, 64]), (41, [57, 60, 65]), (48, [55, 60, 64]), (43, [55, 59, 62])]  # Am F C G
t = 7.5; b = 0
while t < PROOF - 1e-6:
    root, ch = prog[b % 4]
    add(music, pad_chord([m - 12 for m in ch], BAR + .3) * .8, t, 1.)
    for k in range(4):
        bt = t + k * BEAT
        add(music, kick(), bt, 1.0)
        if k in (1, 3): add(music, clap(), bt, .55); add(music, snare(), bt, .35)
        for s in range(4):
            add(music, hat(s == 2), bt + s * BEAT / 4, .45 if s % 2 else .25, pan=.3 if s % 2 else -.3)
        for s in range(2):
            add(music, bass_note(root, BEAT / 2), bt + s * BEAT / 2, 1.)
        for s in range(2):
            add(music, pluck(ch[(k * 2 + s) % 3] + 12, .25), bt + s * BEAT / 2, .8, pan=(-.4 if s else .4))
    # lead hook phrase every 2 bars
    if b % 2 == 0:
        for k, m in enumerate([ch[2] + 12, ch[1] + 12, ch[0] + 12, ch[1] + 12]):
            add(music, lead(m, BEAT * .9), t + k * BEAT, 1.)
    b += 1; t += BAR
# tom fill in the last beat before each cut + riser, impact + whoosh at each cut
for c in CUTS:
    if c > 8:
        for k in range(4): add(sfx, taiko(90 - k * 8), c - BEAT + k * BEAT / 4, .55)
        add(sfx, riser(1.0), c - 1.0, .35)
    add(sfx, impact(), c, .75 if c < PROOF else .9); add(sfx, swish(.55), c - .3, .6)
add(sfx, subdrop(1.8), 7.5, 1.0); add(music, braam(3.0, 33), 7.5, .55)

# service-specific sound design (times mirror index.html)
s0, s1, s2, s3, s4, s5 = SVC
for i in range(14): add(sfx, pop(700 + (i % 5) * 90), s0 + .9 + i * .28 + .3, .25, pan=(i % 3 - 1) * .5)
add(sfx, shimmer(1.4), s0 + 1.0, .7)
for i in range(5): add(sfx, swish(.4), s1 + .5 + i * .12, .25, pan=(i % 2) * .8 - .4)
add(sfx, riser(1.8) * .5, s1 + 1.2, .5)
add(sfx, swish(.6), s2 + .25, .5); add(sfx, swish(.5), s2 + .8, .5)
add(sfx, click(), s2 + 2.6, 1.); add(sfx, chime(), s2 + 2.8, .8)
for i in range(3): add(sfx, pop(620 + i * 120), s2 + 1.4 + i * .3, .45)
for i in range(4):
    st = s3 + .3 + i * BEAT
    add(sfx, swish(.45), st, .45); add(sfx, lock(), st + .5, .9)
add(sfx, metal_hit(), s3 + 2.2, .6); add(sfx, shimmer(1.2), s3 + 2.3, .6)
add(sfx, swish(1.2) * .6, s4 + .3, .6)                    # pen stroke
for i in range(5): add(sfx, pop(560 + i * 110), s4 + 1.6 + i * .12, .5, pan=(i - 2) * .3)
add(sfx, swish(.5), s4 + 2.6, .4)
add(sfx, shimmer(1.6), s5 + .2, .8); add(sfx, notif(), s5 + .9, .9)
for k in range(8): add(sfx, click() * .5, s5 + 1.45 + k * .1, .5)
add(sfx, chime(), s5 + 2.3, .7)
for i in range(3): add(sfx, pop(700 + i * 120), s5 + 3.0 + i * .2, .45)

# ---------- PROOF 41.25 - 45 : double-time toms + slams ----------
t = PROOF
for k in range(16):
    add(music, taiko(80 if k % 2 == 0 else 110), t + k * BEAT / 2, .38, pan=(k % 2) * .6 - .3)
for k in range(8): add(music, kick(), t + k * BEAT, .9); add(music, hat(True), t + k * BEAT + BEAT / 2, .35)
add(music, pad_chord([45, 52, 57, 64], 2 * BAR) * .9, t, 1.)
for i in range(5):
    st = PROOF + .45 + i * BEAT * 1.25
    add(sfx, slam(), st, .6); add(sfx, metal_hit(), st, .2)
add(sfx, riser(1.6), CTA - 1.6, .8); add(sfx, revcym(1.2), CTA - 1.2, .8)

# ---------- CTA 45 - end : final braam, heroic chord ----------
add(music, braam(5.0, 33), CTA, 1.0); add(sfx, subdrop(2.2), CTA, 1.0)
add(music, pad_chord([45, 52, 57, 60, 64, 69], 6.5) * 1.2, CTA, 1.)
for k in range(8): add(music, taiko(70), CTA + k * BEAT, .35 * (1 - k / 10))
for i in range(6): add(sfx, pop(640 + i * 80), CTA + .4 + i * .08, .4)
add(sfx, shimmer(1.8), CTA + 1.2, .9); add(sfx, chime(), CTA + 1.9, .6)

music = reverb(music, 1.6, .18); sfx = reverb(sfx, 1.2, .12)

# ---------- voice ----------
VO = [("hook1", .25), ("hook2", 3.3), ("brand", 6.2), ("s_social", s0 + .8), ("s_ads", s1 + .4), ("s_web", s2 + .4),
      ("s_sys", s3 + .4), ("s_brand", s4 + .5), ("s_ai", s5 + .4), ("proof", PROOF + .05), ("cta", CTA + .35)]
vo = np.zeros((N, 2))
def load(p):
    raw = subprocess.check_output(["ffmpeg", "-loglevel", "error", "-i", p, "-af",
        "highpass=f=70,acompressor=threshold=-22dB:ratio=4:attack=4:release=90,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3800:t=q:w=1:g=3",
        "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"])
    return np.frombuffer(raw, np.float32).astype(np.float64)
for n, t0 in VO:
    x = load(f"/home/claude/trailer/vo/{n}.wav")
    x = x / (np.sqrt((x[np.abs(x) > .02] ** 2).mean()) + 1e-9) * .17
    add(vo, np.tanh(x * 1.3) / 1.3, t0, 1.)
vo = reverb(vo, .7, .08)

env = lp(np.abs(vo[:, 0]), 6, 1); env = env / (env.max() + 1e-9)
duck = 1 - .82 * np.clip(env * 3, 0, 1)
mg, sg, vg = .34, .55, 1.45
if stem == "bed": vg = 0.
if stem == "vo": mg = sg = 0.
mix = music * mg * duck[:, None] + sfx * sg * (1 - .72 * np.clip(env * 3, 0, 1))[:, None] + vo * vg
fo = int(1.2 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
if not stem:
    mix = np.tanh(mix * 1.15) / 1.15; mix /= np.max(np.abs(mix)) / .97
np.clip(mix, -1, 1, out=mix)
name = f"/home/claude/trailer/score{'_' + stem if stem else ''}"
with wave.open(name + "_raw.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
if not stem:
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", name + "_raw.wav", "-af", "loudnorm=I=-13:TP=-1:LRA=8",
                    "-ar", str(SR), name + ".wav"], check=True)
print("ok", stem, round(TOTAL, 2))
