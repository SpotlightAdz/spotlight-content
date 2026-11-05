#!/usr/bin/env python3
"""Soundtracks for render5 variants. Usage: audio5.py <var> [bed|vo]"""
import sys, wave, subprocess
import numpy as np
from audiolib import *
import render5 as V5
var = sys.argv[1]; stem = sys.argv[2] if len(sys.argv) > 2 else ""
VAR = V5.VARIANTS[var]; mode = VAR["mode"]; total = VAR["total"]; cuts = VAR["cuts"]; end = total - .1
N = int((total + .6) * SR)
music = np.zeros((N, 2)); sfx = np.zeros((N, 2))
def piano(m, d=2.5):
    t = tt(d); f = note(m)
    return sum(np.sin(2 * np.pi * f * h * t) * (.6 / h) * np.exp(-t * (1.6 + h * .9)) for h in (1, 2, 3, 4)) * np.minimum(1, t / .004) * .2
def keyhit():
    t = tt(3.0); f = 34 + 30 * np.exp(-t * 6)
    return np.tanh((np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6) + lp(rng.normal(0, 1, len(t)), 1200) * np.exp(-t * 5) * .25) * 1.3) * .75
def beatbed(BPM, prog_, oct_=0):
    global music
    beat = 60 / BPM; bar = beat * 4; t = 0.; b = 0
    while t < end:
        root, ch = prog_[b % 4]
        add(music, pad_chord([m + oct_ for m in ch], bar + .3), t, .9); add(music, sub(root, bar), t, .9)
        for k in range(4):
            bt = t + k * beat
            if bt >= end: break
            add(music, kick(), bt, .85); add(music, hat(), bt + beat / 2, .75)
            if k in (1, 3): add(music, clap(), bt, .5)
            for s in range(2): add(music, pluck(ch[(k * 2 + s) % 3] + 12), bt + s * beat / 2, .8)
        b += 1; t += bar
    music = reverb(music, 1.7, .2)
if mode == "dark":
    beatbed(112 if var == "C" else 100, [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [55, 60, 64]), (55, [55, 59, 62])] if var == "R"
            else [(50, [62, 65, 69]), (55, [59, 62, 67]), (48, [60, 64, 67]), (53, [60, 65, 69])])
    add(sfx, impact(), 0, .55); add(sfx, glitch(), .05, .7)
    for c in cuts: add(sfx, whoosh(.6), c - .35, .7); add(sfx, pop(760), c + .2, .5)
    add(sfx, shimmer(), cuts[-2] + .3, 1.)
elif mode == "light":
    beatbed(120, [(45, [57, 60, 64]), (41, [57, 60, 65]), (48, [55, 60, 64]), (43, [55, 59, 62])], -12)
    add(sfx, pop(900), 0, .7)
    for i, c in enumerate(cuts): add(sfx, whoosh(.45), c - .25, .35); add(sfx, pop(700 + i * 60), c + .25, .6); add(sfx, ding(1250), c + .9, .35)
    add(sfx, shimmer(), cuts[-1] + .3, 1.)
else:
    chords = [[45, 52, 59, 64], [41, 48, 55, 60], [43, 50, 57, 62], [40, 47, 55, 59]]
    t = 0.; i = 0
    while t < total:
        add(music, pad_chord(chords[i % 4], 7.5), t, 1.1); add(music, sub(chords[i % 4][0] + 12, 6.), t, .5); t += 6.; i += 1
    music = lp(music, 3000)
    add(music, piano(69), 0, 1.); add(music, piano(76), .9, 1.)
    notes = [72, 64, 76, 74, 81, 69]
    for c, m in zip(cuts, notes): add(music, piano(m), c + .05, 1.); add(music, piano(m - 12), c + .05, .6)
    add(sfx, keyhit(), 0, .6)
    for c in (cuts[2] + (cuts[3] - cuts[2]) * .3, cuts[3] + (cuts[4] - cuts[3]) * .3):
        add(sfx, keyhit(), c, .6); add(sfx, shimmer(1.6), c + .1, .6)
    music = reverb(music, 3.2, .4); sfx = reverb(sfx, 2.4, .25)
raw = subprocess.check_output(["ffmpeg", "-loglevel", "error", "-i", f"{HERE}/vo5/{var}_f.wav", "-af",
    "highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,equalizer=f=3500:t=q:w=1:g=2", "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"])
x = np.frombuffer(raw, np.float32).astype(np.float64)
x = x / (np.sqrt((x[np.abs(x) > .02] ** 2).mean()) + 1e-9) * .16
vo = np.zeros((N, 2)); add(vo, np.tanh(x * 1.2) / 1.2, .02, 1.)
vo = reverb(vo, .9 if mode == "keynote" else .5, .1 if mode == "keynote" else .06)
envl = lp(np.abs(vo[:, 0]), 6, 1); envl = envl / (envl.max() + 1e-9)
duck = 1 - .72 * np.clip(envl * 3, 0, 1)
mg, sg, vg = {"light": (.24, .45, 1.4), "keynote": (.34, .5, 1.4), "dark": (.24, .42, 1.4)}[mode]
if stem == "bed": vg = 0.
if stem == "vo": mg = sg = 0.
mix = music * mg * duck[:, None] + sfx * sg * (1 - .5 * np.clip(envl * 3, 0, 1))[:, None] + vo * vg
fo = int(.6 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
if not stem: mix = np.tanh(mix * 1.1) / 1.1; mix /= np.max(np.abs(mix)) / .95
np.clip(mix, -1, 1, out=mix)
name = f"{HERE}/mix5{var}{'_' + stem if stem else ''}"
with wave.open(name + "_raw.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
if not stem:
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", name + "_raw.wav", "-af", "loudnorm=I=-14:TP=-1:LRA=9", "-ar", str(SR), name + ".wav"], check=True)
print("ok", var, stem)
