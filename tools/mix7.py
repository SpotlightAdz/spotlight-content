#!/usr/bin/env python3
"""Soundtrack v7 for a Remotion reel: original music (no samples of songs), real CC0 UI/impact sounds,
risers that PEAK ON the cut, a hit on every cut, a short music drop-out before the CTA, sidechain-style
ducking + a mid-range "carve" under the voice, pedalboard mastering, -14 LUFS.

usage: mix7.py <id> <style> [--bpm N]
  styles: maghreb  (darbuka doum/tek + oud-like pluck in Hijaz + 808 sub: Moroccan, modern)  [default for Darija reels]
          afro     (afro-house: 4-on-floor, shaker, marimba-ish plucks, warm pad)
          keynote  (piano + pads, cinematic hits)                                          [result stories]
          dark     (minor trap-ish beat, plucks)                                           [mistakes explainers]
Reads remotion/src/reels/<id>.json (total, cuts) and vo6/<id>_f.wav; writes remotion/public/vo/<id>_mix.wav
"""
import sys, json, os, subprocess
import numpy as np
from scipy import signal
from audiolib import SR, tt, add, lp, hp, bp, note, kick, clap, hat, pad_chord, sub, whoosh, riser, impact, shimmer, rng
import pedalboard as pb
import pyloudnorm as pyln

H = os.path.dirname(os.path.abspath(__file__))
rid, style = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else "maghreb")
J = json.load(open(f"{H}/remotion/src/reels/{rid}.json")); total = J["total"]; cuts = J["cuts"]
BPM = float(sys.argv[sys.argv.index("--bpm") + 1]) if "--bpm" in sys.argv else {"maghreb": 96, "afro": 118, "keynote": 84, "dark": 100}[style]
beat = 60 / BPM; bar = 4 * beat; end = total - .05
N = int((total + .8) * SR)
music = np.zeros((N, 2)); sfx = np.zeros((N, 2))

def load(path, gain=1.0):
    raw = subprocess.check_output(["ffmpeg", "-loglevel", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"])
    x = np.frombuffer(raw, np.float32).astype(np.float64)
    return x / (np.max(np.abs(x)) + 1e-9) * gain
K = f"{H}/sfx/kenney"
UI = {n: load(f"{K}/{n}.ogg", .5) for n in ["ui_click_001", "ui_select_001", "ui_confirmation_001", "ui_drop_002", "ui_glass_001", "ui_pluck_001", "ui_switch_002"] if os.path.exists(f"{K}/{n}.ogg")}
HIT = load(f"{K}/hit_soft.ogg", .7) if os.path.exists(f"{K}/hit_soft.ogg") else impact()

# ---------- instruments ----------
def ks_pluck(m, dur=.9, bright=.5):
    """Karplus-Strong plucked string (oud-like)."""
    f = note(m); n = int(SR / f); L = int(dur * SR)
    buf = rng.uniform(-1, 1, n) * bright + rng.uniform(-1, 1, n) * (1 - bright) * .3
    out = np.zeros(L)
    for i in range(L):
        out[i] = buf[i % n]
        buf[i % n] = .5 * (buf[i % n] + buf[(i + 1) % n]) * .996
    return lp(out, 3800) * np.minimum(1, np.arange(L) / 40) * .5

def doum():  # darbuka low
    t = tt(.35); f = 95 + 60 * np.exp(-t * 40)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11) * .9
def tek():   # darbuka high/rim
    t = tt(.09); body = np.sin(2 * np.pi * 820 * t) * np.exp(-t * 70)
    return (bp(rng.normal(0, 1, len(t)), 2500, 9000) * np.exp(-t * 90) * .7 + body * .5)
def ka():    # soft slap
    return tek() * .45
def shaker():
    t = tt(.08); return hp(rng.normal(0, 1, len(t)), 6000) * np.sin(np.pi * t / .08) * .18
def k808(m, d):
    t = tt(d); f = note(m - 24) * (1 + .5 * np.exp(-t * 30))
    return np.tanh(np.sin(2 * np.pi * np.cumsum(f) / SR) * 1.8) * np.exp(-t * 1.6) * .55
def piano(m, d=2.5):
    t = tt(d); f = note(m)
    return sum(np.sin(2 * np.pi * f * h * t) * (.6 / h) * np.exp(-t * (1.6 + h * .9)) for h in (1, 2, 3, 4)) * np.minimum(1, t / .004) * .2
def rev_cymbal(d=1.1):
    """Untuned reversed cymbal swell: peaks at its END (place so the end lands on the cut)."""
    t = tt(d); x = hp(rng.normal(0, 1, len(t)), 4000) * np.exp(-t * 3.5)
    return x[::-1] * .5

# Hijaz on D: D Eb F# G A Bb C  (midi 62 63 66 67 69 70 72)
HIJAZ = [62, 63, 66, 67, 69, 70, 72, 74]
def grid():
    t = 0.; b = 0
    while t < end:
        yield b, t; t += bar; b += 1

if style == "maghreb":
    # Maqsoum-ish: D-T-_-T-D-_-T-_ over one bar of 8 eighths
    pat = ["D", "T", None, "T", "D", None, "T", None]
    motif = [[0, 2, 1, 0], [3, 2, 1, 2], [4, 3, 2, 1], [2, 1, 0, 0]]
    roots = [50, 50, 48, 50]  # D D C D
    for b, t0 in grid():
        add(music, k808(roots[b % 4], bar), t0, .9)
        add(music, pad_chord([62, 66, 69] if b % 4 != 2 else [60, 64, 67], bar + .3), t0, .5)
        for k, p in enumerate(pat):
            ts = t0 + k * beat / 2
            if ts >= end: break
            if p == "D": add(music, doum(), ts, .9)
            if p == "T": add(music, tek(), ts, .6)
            add(music, shaker(), ts + beat / 4, .5)
        if b % 2 == 1:  # call-and-answer oud phrase every other bar
            for k, deg in enumerate(motif[(b // 2) % 4]):
                ts = t0 + k * beat
                if ts < end: add(music, ks_pluck(HIJAZ[deg] + 12, .8), ts, .55)
        for q in (1, 3):
            ts = t0 + q * beat
            if ts < end: add(music, clap(), ts, .25)
    music = np.stack([music[:, 0] * 1.0, music[:, 1] * .92], 1)
elif style == "afro":
    prog = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]]
    for b, t0 in grid():
        ch = prog[b % 4]
        add(music, pad_chord(ch, bar + .3), t0, .7); add(music, sub(ch[0] - 12, bar), t0, .8)
        for k in range(4):
            ts = t0 + k * beat
            if ts >= end: break
            add(music, kick(), ts, .8); add(music, hat(), ts + beat / 2, .7)
            for s in range(4): add(music, shaker(), ts + s * beat / 4, .35)
            add(music, ks_pluck(ch[(k + b) % 3] + 12, .5, .8), ts + beat * .75, .4)
        add(music, tek(), t0 + 2.5 * beat, .4)
elif style == "keynote":
    chords = [[45, 52, 59, 64], [41, 48, 55, 60], [43, 50, 57, 62], [40, 47, 55, 59]]
    for b, t0 in grid():
        if b % 2 == 0:
            add(music, pad_chord(chords[(b // 2) % 4], 2 * bar + .5), t0, 1.0); add(music, sub(chords[(b // 2) % 4][0] + 12, 2 * bar), t0, .45)
    for c, m in zip([0.0] + cuts, [69, 72, 64, 76, 74, 81, 69, 72]): add(music, piano(m), c + .03, 1.); add(music, piano(m - 12), c + .03, .6)
else:  # dark
    prog = [(50, [62, 65, 69]), (46, [58, 62, 65]), (48, [60, 64, 67]), (45, [57, 61, 64])]
    for b, t0 in grid():
        root, ch = prog[b % 4]
        add(music, pad_chord(ch, bar + .3), t0, .8); add(music, k808(root + 12, bar), t0, .8)
        for k in range(4):
            ts = t0 + k * beat
            if ts >= end: break
            add(music, kick(), ts, .75 if k in (0, 2) else 0); add(music, hat(), ts + beat / 2, .6)
            if k in (1, 3): add(music, clap(), ts, .45)
            add(music, ks_pluck(ch[(2 * k) % 3] + 12, .35, .9), ts, .35)

# ---------- arrangement: drop-out before the CTA, a hit on every cut ----------
cta = cuts[-1] if cuts else total - 3
gate = np.ones(N)
a, b_ = int((cta - .35) * SR), int(cta * SR)
gate[a:b_] = np.linspace(1, .08, b_ - a)            # suck the music out right before the CTA...
music *= gate[:, None]
add(sfx, rev_cymbal(1.1), cta - 1.1, .55)           # ...riser peaks exactly on the cut...
add(sfx, HIT, cta, .8)                              # ...and it lands on a hit
add(sfx, impact(), 0, .45)                           # frame-0 hit under the hook
for i, c in enumerate(cuts[:-1]):
    add(sfx, whoosh(.5), c - .3, .45)                # air into the cut
    ui = list(UI.values())
    if ui: add(sfx, ui[i % len(ui)], c + .05, .55)    # real CC0 UI tick on the reveal
add(sfx, shimmer(), cta + .4, .9)

# ---------- voice ----------
raw = subprocess.check_output(["ffmpeg", "-loglevel", "error", "-i", f"{H}/vo6/{rid}_f.wav", "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"])
v = np.frombuffer(raw, np.float32).astype(np.float32)
vchain = pb.Pedalboard([pb.HighpassFilter(85), pb.Compressor(threshold_db=-20, ratio=3, attack_ms=5, release_ms=80),
                        pb.PeakFilter(3200, 2.5, .9), pb.Reverb(room_size=.12, wet_level=.05, dry_level=1.0)])
v = vchain(v, SR).astype(np.float64)
v = v / (np.sqrt((v[np.abs(v) > .02] ** 2).mean()) + 1e-9) * .16
vo = np.zeros((N, 2)); add(vo, v, 0, 1.)

# ---------- ducking + carve: music dips 9 dB and loses 1-4 kHz while the voice speaks ----------
env = lp(np.abs(vo[:, 0]), 6, 1); env = np.clip(env / (env.max() + 1e-9) * 3, 0, 1)
carved = bp(music, 1000, 4000)
music = music - carved * (.7 * env)[:, None]
music *= (1 - .65 * env)[:, None]
mchain = pb.Pedalboard([pb.Compressor(threshold_db=-18, ratio=2.5, attack_ms=10, release_ms=120), pb.Reverb(room_size=.35, wet_level=.12, dry_level=.95)])
music = mchain(music.T.astype(np.float32), SR).T.astype(np.float64)
music /= np.max(np.abs(music)) + 1e-9; sfx /= np.max(np.abs(sfx)) + 1e-9
mg, sg = {"maghreb": .30, "afro": .28, "keynote": .32, "dark": .27}[style], .32
mix = music * mg + sfx * sg * (1 - .5 * env)[:, None] + vo * 1.5
fo = int(.5 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]

master = pb.Pedalboard([pb.Compressor(threshold_db=-10, ratio=2, attack_ms=15, release_ms=150), pb.Limiter(threshold_db=-1.5, release_ms=80)])
mix = master(mix.T.astype(np.float32), SR).T.astype(np.float64)
meter = pyln.Meter(SR); lufs = meter.integrated_loudness(mix)
mix = pyln.normalize.loudness(mix, lufs, -14.0)
mix = np.clip(mix, -.98, .98)
os.makedirs(f"{H}/remotion/public/vo", exist_ok=True)
out = f"{H}/remotion/public/vo/{rid}_mix.wav"
import wave
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
sp = env > .25
vdb = 10 * np.log10((vo[sp, 0] * 1.5) .__pow__(2).mean() + 1e-12); mdb = 10 * np.log10((music[sp, 0] * mg) .__pow__(2).mean() + 1e-12)
print(f"ok {rid} {style} {BPM:.0f}bpm  voice-over-music {vdb - mdb:.1f} dB  final {meter.integrated_loudness(mix):.1f} LUFS")
