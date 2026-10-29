#!/usr/bin/env python3
"""Soundtracks for render3 variants. Usage: audio3.py L|K [bed|vo]"""
import sys, os, wave, subprocess
import numpy as np
from audiolib import *
import render3 as V3

var = sys.argv[1]; stem = sys.argv[2] if len(sys.argv) > 2 else ""
VAR = V3.VARIANTS[var]
TOT = VAR["total"] + .6
N = int(TOT * SR)
TM = VAR["times"]
def at(scene, lt): return TM[scene][0] + lt

def keyclick():
    t = tt(.04); n = rng.normal(0, 1, len(t))
    return bp(n, 1800, 7000) * np.exp(-t * 160) * .35 + np.sin(2 * np.pi * 180 * t) * np.exp(-t * 120) * .15

def mclick():
    t = tt(.05); return bp(rng.normal(0, 1, len(t)), 2000, 8000) * np.exp(-t * 200) * .5

def chime():
    out = np.zeros(int(1.2 * SR))
    for k, m in enumerate([76, 83, 88]):
        x = ding(note(m)); i = int(k * .07 * SR); out[i:i + len(x)] += x[: len(out) - i]
    return out * .8

def piano(m, d=2.5):
    t = tt(d); f = note(m)
    x = sum(np.sin(2 * np.pi * f * h * t) * (.6 / h) * np.exp(-t * (1.6 + h * .9)) for h in (1, 2, 3, 4))
    return x * np.minimum(1, t / .004) * .2

def keyhit():
    t = tt(3.0); f = 34 + 30 * np.exp(-t * 6)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    air = lp(rng.normal(0, 1, len(t)), 1200) * np.exp(-t * 5) * .25
    return np.tanh((boom + air) * 1.3) * .75

def swell(d=1.6):
    t = tt(d); n = rng.normal(0, 1, len(t))
    return lp(n, 2500) * (t / d) ** 3 * .35

music = np.zeros((N, 2)); sfx = np.zeros((N, 2))

if var == "L":
    BPM = 118; beat = 60 / BPM; bar = beat * 4
    prog = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [57, 60, 64]), (41, [57, 60, 65])]  # C G Am F
    drop = TM["l2_intro"][0]
    t = 0.; b = 0; end = VAR["total"] - .1
    while t < end:
        root, ch = prog[b % 4]
        add(music, pad_chord([m - 12 for m in ch], bar + .3), t, .7)
        full = t >= drop - 1e-6
        for k in range(4):
            bt = t + k * beat
            if bt >= end: break
            for s in range(2):
                add(music, pluck(ch[(k * 2 + s) % 3] + 12, .3), bt + s * beat / 2, .9)
            if full:
                add(music, kick(), bt, .75)
                add(music, hat(), bt + beat / 2, .7); add(music, hat(), bt + beat * .75, .35)
                if k in (1, 3): add(music, clap(), bt, .5)
        if full: add(music, sub(root + 12, bar), t, .9)
        b += 1; t += bar
    music = reverb(music, 1.5, .18)
    # SFX
    full = "بغيت البراند ديالي يولّي كيتشاف…"
    for i in range(len(full)):
        add(sfx, keyclick(), at("l1_hook", .5 + 2.3 * i / len(full)) + rng.uniform(-.01, .01), .8)
    add(sfx, mclick(), at("l1_hook", 3.52), 1.); add(sfx, whoosh(.5), at("l1_hook", 3.55), .6)
    add(sfx, chime(), at("l1_hook", 3.8), .8)
    add(sfx, riser(1.0), drop - 1.0, .5); add(sfx, impact(), drop + .2, .45)
    add(sfx, shimmer(), at("l2_intro", 1.0), 1.)
    for i in range(4): add(sfx, pop(700 + i * 90), at("l2_intro", .8 + i * .18), .6)
    for k in range(18): add(sfx, pop(600 + (k % 5) * 80), at("l3_calendar", .6 + k * .07), .3)
    add(sfx, mclick(), at("l3_calendar", 3.0), .8); add(sfx, whoosh(.6), at("l3_calendar", 3.3), .4)
    add(sfx, pop(520), at("l3_calendar", 4.1), .8)
    for i in range(3): add(sfx, pop(760 + i * 100), at("l4_portal", .6 + i * .15), .5)
    add(sfx, mclick(), at("l4_portal", 3.3), 1.); add(sfx, chime(), at("l4_portal", 3.35), .9)
    for i in range(3): add(sfx, pop(700 + i * 110), at("l5_clients", .35 + i * .45), .7)
    for i in range(3): add(sfx, pop(680 + i * 110), at("l6_pricing", .3 + i * .3), .6)
    add(sfx, mclick(), at("l6_pricing", 4.72), 1.); add(sfx, chime(), at("l6_pricing", 4.78), .9)
    add(sfx, pop(900), at("l7_cta", .15), .8); add(sfx, shimmer(), at("l7_cta", .8), 1.); add(sfx, pop(980), at("l7_cta", 1.05), .7)
    for k, _d, *_ in VAR["scenes"][1:]:
        add(sfx, whoosh(.45), TM[k][0] - .25, .35)
else:
    # ambient keynote score: evolving pads in D minor + soft piano on reveals
    chords = [[50, 57, 64, 65], [46, 53, 60, 62], [48, 55, 62, 64], [45, 52, 60, 64]]
    seg = 6.0; t = 0.; i = 0
    while t < VAR["total"]:
        add(music, pad_chord(chords[i % 4], seg + 1.5), t, 1.1)
        add(music, sub(chords[i % 4][0] + 12, seg), t, .5)
        t += seg; i += 1
    music = lp(music, 3000)
    hits = [("k1_today", .5, False), ("k2_reveal", .5, True), ("k2_reveal", 1.3, False), ("k3_features", .3, False),
            ("k3_features", 1.75, False), ("k3_features", 3.15, False), ("k4_proof", .5, True), ("k4_proof", 3.7, False),
            ("k5_price", .35, False), ("k5_price", 1.9, True), ("k6_onemore", .4, False), ("k6_onemore", 3.0, True),
            ("k6_onemore", 7.0, False), ("k7_end", .3, True)]
    notes = [69, 72, 76, 74, 77, 81, 79, 76, 72, 74, 69, 81, 79, 74]
    for (k, lt, big), m in zip(hits, notes):
        tt0 = at(k, lt)
        if big:
            add(sfx, swell(1.6), tt0 - 1.55, .7)
            add(sfx, keyhit(), tt0, .62)
            add(sfx, shimmer(1.6), tt0 + .1, .6)
        add(music, piano(m), tt0, 1.)
        add(music, piano(m - 12), tt0, .6)
    music = reverb(music, 3.2, .4)
    sfx = reverb(sfx, 2.4, .25)
    add(music, piano(62, 4.0) + piano(69, 4.0) * .8 + piano(74, 4.0) * .7, VAR["total"] - 3.6, 1.)

# voice
vo = np.zeros((N, 2))
def load(p):
    raw = subprocess.check_output(["ffmpeg", "-loglevel", "error", "-i", p, "-af",
                                   "highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,"
                                   "equalizer=f=3500:t=q:w=1:g=2", "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"])
    return np.frombuffer(raw, np.float32).astype(np.float64)
for (k, D, vofile, off, fn) in VAR["scenes"]:
    x = load(f"{HERE}/vo3/{vofile}.wav")
    x = x / (np.sqrt((x[np.abs(x) > .02] ** 2).mean()) + 1e-9) * .16
    x = np.tanh(x * 1.2) / 1.2
    add(vo, x, TM[k][0] + off, 1.)
vo = reverb(vo, .5 if var == "L" else .9, .06 if var == "L" else .1)

env = lp(np.abs(vo[:, 0]), 6, 1); env = env / (env.max() + 1e-9)
duck = 1 - .72 * np.clip(env * 3, 0, 1)
mg, sg, vg = (.26, .5, 1.4) if var == "L" else (.34, .5, 1.4)
if stem == "bed": vg = 0.
if stem == "vo": mg = sg = 0.
mix = music * mg * duck[:, None] + sfx * sg * (1 - .5 * np.clip(env * 3, 0, 1))[:, None] + vo * vg
fo = int(.6 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
if not stem:
    mix = np.tanh(mix * 1.1) / 1.1
    mix /= np.max(np.abs(mix)) / .95
np.clip(mix, -1, 1, out=mix)
name = f"{HERE}/mix{var}{'_' + stem if stem else ''}"
with wave.open(name + "_raw.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
if not stem:
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", name + "_raw.wav", "-af", "loudnorm=I=-14:TP=-1:LRA=9",
                    "-ar", str(SR), name + ".wav"], check=True)
print("ok", var, stem, TOT)
