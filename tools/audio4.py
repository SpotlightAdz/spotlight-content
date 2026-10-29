#!/usr/bin/env python3
"""Soundtracks for render4 variants. Usage: audio4.py A|S|P [bed|vo]"""
import sys, wave, subprocess
import numpy as np
from audiolib import *
import render4 as V4

var = sys.argv[1]; stem = sys.argv[2] if len(sys.argv) > 2 else ""
VAR = V4.VARIANTS[var]; TM = VAR["times"]
N = int((VAR["total"] + .6) * SR)
def at(k, lt): return TM[k][0] + lt

def keyclick():
    t = tt(.04); return bp(rng.normal(0, 1, len(t)), 1800, 7000) * np.exp(-t * 160) * .35 + np.sin(2 * np.pi * 180 * t) * np.exp(-t * 120) * .15
def mclick():
    t = tt(.05); return bp(rng.normal(0, 1, len(t)), 2000, 8000) * np.exp(-t * 200) * .5
def chime():
    out = np.zeros(int(1.2 * SR))
    for k, m in enumerate([76, 83, 88]):
        x = ding(note(m)); i = int(k * .07 * SR); out[i:i + len(x)] += x[: len(out) - i]
    return out * .8
def piano(m, d=2.5):
    t = tt(d); f = note(m)
    return sum(np.sin(2 * np.pi * f * h * t) * (.6 / h) * np.exp(-t * (1.6 + h * .9)) for h in (1, 2, 3, 4)) * np.minimum(1, t / .004) * .2
def keyhit():
    t = tt(3.0); f = 34 + 30 * np.exp(-t * 6)
    return np.tanh((np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6) + lp(rng.normal(0, 1, len(t)), 1200) * np.exp(-t * 5) * .25) * 1.3) * .75
def swell(d=1.6):
    t = tt(d); return lp(rng.normal(0, 1, len(t)), 2500) * (t / d) ** 3 * .35
def notif():
    out = np.zeros(int(.5 * SR))
    for k, f in enumerate((988, 1319)):
        x = np.sin(2 * np.pi * f * tt(.25)) * np.exp(-tt(.25) * 14) * .3
        i = int(k * .09 * SR); out[i:i + len(x)] += x
    return out

music = np.zeros((N, 2)); sfx = np.zeros((N, 2))
mode = VAR["mode"]; end = VAR["total"] - .1

if mode == "light":
    BPM = 120; beat = 60 / BPM; bar = beat * 4
    prog_ = [(45, [57, 60, 64]), (41, [57, 60, 65]), (48, [55, 60, 64]), (43, [55, 59, 62])]  # Am F C G, bright plucks
    drop = TM["s2"][0]; t = 0.; b = 0
    while t < end:
        root, ch = prog_[b % 4]
        add(music, pad_chord([m - 12 for m in ch], bar + .3), t, .7)
        full = t >= drop - 1e-6
        for k in range(4):
            bt = t + k * beat
            if bt >= end: break
            for s in range(2): add(music, pluck(ch[(k * 2 + s) % 3] + 12, .3), bt + s * beat / 2, .9)
            if full:
                add(music, kick(), bt, .75); add(music, hat(), bt + beat / 2, .7)
                if k in (1, 3): add(music, clap(), bt, .5)
        if full: add(music, sub(root + 12, bar), t, .9)
        b += 1; t += bar
    music = reverb(music, 1.5, .18)
    full_txt = "بغيت متجر أونلاين بالدفع عند الاستلام"
    for i in range(len(full_txt)): add(sfx, keyclick(), at("s1", .45 + 2.2 * i / len(full_txt)), .8)
    add(sfx, mclick(), at("s1", 3.32), 1.); add(sfx, whoosh(.5), at("s1", 3.35), .6); add(sfx, chime(), at("s1", 3.6), .7)
    add(sfx, riser(1.0), drop - 1.0, .5); add(sfx, impact(), drop + .2, .45); add(sfx, shimmer(), at("s2", 1.0), 1.)
    for i in range(4): add(sfx, pop(700 + i * 90), at("s2", .8 + i * .18), .6)
    add(sfx, mclick(), at("s3", 1.95), 1.); add(sfx, mclick(), at("s3", 3.65), 1.); add(sfx, chime(), at("s3", 3.72), .9)
    add(sfx, chime(), at("s4", 2.2), .5)
    for k in range(3): add(sfx, pop(640 + k * 120), at("s4", 2.0 + k * .9), .5)
    for i in range(4): add(sfx, pop(700 + i * 100), at("s5", .7 + i * .2), .5)
    for i in range(2): add(sfx, pop(720 + i * 120), at("s6", .35 + i * 1.25), .7)
    add(sfx, pop(900), at("s7", .15), .8); add(sfx, shimmer(), at("s7", .8), 1.)
    for c in VAR["cuts"]: add(sfx, whoosh(.45), c - .25, .35)
elif mode == "keynote":
    chords = [[45, 52, 59, 64], [41, 48, 55, 60], [43, 50, 57, 62], [40, 47, 55, 59]]
    seg = 6.0; t = 0.; i = 0
    while t < VAR["total"]:
        add(music, pad_chord(chords[i % 4], seg + 1.5), t, 1.1); add(music, sub(chords[i % 4][0] + 12, seg), t, .5)
        t += seg; i += 1
    music = lp(music, 3000)
    hits = [("a1", .3, False), ("a1", 1.2, False), ("a1", 3.3, False), ("a2", .45, True), ("a2", 1.2, False),
            ("a3", .3, False), ("a3", 2.0, False), ("a3", 3.7, False), ("a4", .4, False), ("a4", 3.0, True),
            ("a5", .3, False), ("a5", 2.0, True), ("a6", .4, False), ("a6", 3.0, True), ("a7", .3, True)]
    notes = [69, 72, 64, 76, 74, 72, 76, 79, 69, 81, 72, 76, 69, 81, 74]
    for (k, lt, big), m in zip(hits, notes):
        t0 = at(k, lt)
        if big:
            add(sfx, swell(1.6), t0 - 1.55, .7); add(sfx, keyhit(), t0, .62); add(sfx, shimmer(1.6), t0 + .1, .6)
        add(music, piano(m), t0, 1.); add(music, piano(m - 12), t0, .6)
    add(sfx, notif(), at("a1", 1.25), .9)
    music = reverb(music, 3.2, .4); sfx = reverb(sfx, 2.4, .25)
    add(music, piano(57, 4.0) + piano(64, 4.0) * .8 + piano(69, 4.0) * .7, VAR["total"] - 3.6, 1.)
else:  # dark VFX beat
    BPM = 100; beat = 60 / BPM; bar = beat * 4
    prog_ = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [55, 60, 64]), (55, [55, 59, 62])]
    start = TM["p2"][0]
    add(music, drone(start + .2), 0, 1.); add(music, pad_chord([57, 60, 64], start + .4) * .5, 0, 1.)
    t0 = .4
    while t0 < start - .8: add(music, lp(kick(), 300), t0, .45); add(music, lp(kick(), 300), t0 + .28, .3); t0 += 1.2
    t = start; b = 0
    while t < end:
        root, ch = prog_[b % 4]
        add(music, pad_chord(ch, bar + .3), t, 1.); add(music, sub(root, bar), t, 1.)
        for k in range(4):
            bt = t + k * beat
            if bt >= end: break
            add(music, kick(), bt, .9); add(music, hat(), bt + beat / 2, .8)
            if k in (1, 3): add(music, clap(), bt, .55)
            for s in range(2): add(music, pluck(ch[(k * 2 + s) % 3] + 12), bt + s * beat / 2, .8)
        b += 1; t += bar
    music = reverb(music, 1.8, .22)
    add(sfx, glitch(), at("p1", 2.6), 1.); add(sfx, glitch(.25), at("p1", 1.2), .6)
    add(sfx, riser(1.3), start - 1.3, .9); add(sfx, impact(), start - .05, .6); add(sfx, shimmer(), at("p2", .5), 1.)
    for i in range(4): add(sfx, pop(600 + i * 120), at("p3", .95 + i * .3), .7)
    for st in (1.0, 1.9, 2.8): add(sfx, pop(700), at("p4", st), .7)
    add(sfx, impact(), at("p4", 3.6), .35); add(sfx, chime(), at("p4", 3.7), .6)
    for i in range(6): add(sfx, pop(560 + i * 80), at("p5", .5 + i * .15), .4)
    for st in (.9, 1.8, 2.7): add(sfx, ding(1250), at("p6", st), .5)
    add(sfx, impact(), at("p7", 0), .6); add(sfx, shimmer(), at("p7", .7), 1.2)
    for c in VAR["cuts"]: add(sfx, whoosh(.6), c - .35, .7)

vo = np.zeros((N, 2))
def load(p):
    raw = subprocess.check_output(["ffmpeg", "-loglevel", "error", "-i", p, "-af",
                                   "highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,equalizer=f=3500:t=q:w=1:g=2",
                                   "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"])
    return np.frombuffer(raw, np.float32).astype(np.float64)
for (k, D, vofile, off, fn) in VAR["scenes"]:
    x = load(f"{HERE}/vo4/{vofile}.wav")
    x = x / (np.sqrt((x[np.abs(x) > .02] ** 2).mean()) + 1e-9) * .16
    add(vo, np.tanh(x * 1.2) / 1.2, TM[k][0] + off, 1.)
vo = reverb(vo, .9 if mode == "keynote" else .5, .1 if mode == "keynote" else .06)
env = lp(np.abs(vo[:, 0]), 6, 1); env = env / (env.max() + 1e-9)
duck = 1 - .72 * np.clip(env * 3, 0, 1)
mg, sg, vg = {"light": (.26, .5, 1.4), "keynote": (.34, .5, 1.4), "dark": (.26, .48, 1.4)}[mode]
if stem == "bed": vg = 0.
if stem == "vo": mg = sg = 0.
mix = music * mg * duck[:, None] + sfx * sg * (1 - .5 * np.clip(env * 3, 0, 1))[:, None] + vo * vg
fo = int(.6 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
if not stem:
    mix = np.tanh(mix * 1.1) / 1.1; mix /= np.max(np.abs(mix)) / .95
np.clip(mix, -1, 1, out=mix)
name = f"{HERE}/mix4{var}{'_' + stem if stem else ''}"
with wave.open(name + "_raw.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
if not stem:
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", name + "_raw.wav", "-af", "loudnorm=I=-14:TP=-1:LRA=9",
                    "-ar", str(SR), name + ".wav"], check=True)
print("ok", var, stem)
