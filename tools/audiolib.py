#!/usr/bin/env python3
"""Music bed + sound design + Darija VO mix for the Spotlight Adz reel."""
import numpy as np, subprocess, os
from scipy import signal

SR = 48000
rng = np.random.default_rng(3)
HERE = os.path.dirname(os.path.abspath(__file__))

def tt(d): return np.arange(int(d * SR)) / SR
def add(buf, x, t, g=1.0):
    i = int(t * SR)
    if i >= len(buf): return
    x = x[: len(buf) - i]
    if x.ndim == 1 and buf.ndim == 2: x = np.stack([x, x], 1)
    buf[i:i + len(x)] += x * g
def lp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, "low", fs=SR, output="sos"), x, axis=0)
def hp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, "high", fs=SR, output="sos"), x, axis=0)
def bp(x, lo, hi, o=2): return signal.sosfilt(signal.butter(o, [lo, hi], "band", fs=SR, output="sos"), x, axis=0)
def note(m): return 440 * 2 ** ((m - 69) / 12)

def reverb(x, secs=2.2, mix=.25):
    ir_n = int(secs * SR)
    ir = rng.normal(0, 1, (ir_n, 2)) * np.exp(-np.linspace(0, 7, ir_n))[:, None]
    ir = lp(ir, 6000)
    wet = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], 1)
    wet *= np.max(np.abs(x)) / (np.max(np.abs(wet)) + 1e-9)
    return x * (1 - mix) + wet * mix

# ---------------- instruments ----------------
def kick():
    t = tt(.45); f = 45 + 95 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) + .3 * np.exp(-t * 90) * rng.normal(0, 1, len(t)) * .3

def clap():
    t = tt(.3); n = rng.normal(0, 1, len(t))
    env = np.exp(-t * 18) + .6 * np.exp(-np.maximum(0, t - .012) * 40) * (t > .012)
    return bp(n, 900, 3500) * env * .9

def hat(open_=False):
    t = tt(.25 if open_ else .06); n = rng.normal(0, 1, len(t))
    return hp(n, 7000) * np.exp(-t * (14 if open_ else 70)) * .35

def pad_chord(midis, dur):
    t = tt(dur); x = np.zeros((len(t), 2))
    for m in midis:
        for det, pan in ((-.08, .2), (.0, .5), (.08, .8)):
            f = note(m) * 2 ** (det / 12)
            saw = signal.sawtooth(2 * np.pi * f * t + rng.uniform(0, 6))
            x[:, 0] += saw * (1 - pan); x[:, 1] += saw * pan
    a = np.minimum(1, t / .5) * np.minimum(1, (dur - t) / .6)
    return lp(x, 1400) * a[:, None] * .05

def pluck(m, dur=.35):
    t = tt(dur); f = note(m)
    x = signal.square(2 * np.pi * f * t, .3) * np.exp(-t * 9)
    return lp(x, 2500) * .12

def sub(m, dur):
    t = tt(dur); f = note(m - 24)
    return np.sin(2 * np.pi * f * t) * np.minimum(1, t / .02) * np.minimum(1, (dur - t) / .05) * .35

# ---------------- SFX ----------------
def whoosh(d=.7, up=True):
    t = tt(d); n = rng.normal(0, 1, len(t))
    env = np.sin(np.pi * t / d) ** 2
    out = np.zeros(len(t)); seg = 1024
    for i in range(0, len(t), seg):
        u = i / len(t); fc = 400 + (u if up else 1 - u) * 5000
        out[i:i + seg] = bp(n[i:i + seg], fc * .6, min(fc * 1.6, 20000))
    return out * env * .55

def riser(d=1.2):
    t = tt(d); n = rng.normal(0, 1, len(t))
    env = (t / d) ** 2.2
    tone = np.sin(2 * np.pi * np.cumsum(200 + 1400 * (t / d) ** 2) / SR) * .25
    return (hp(n, 1500) * .5 + tone) * env * .6

def impact():
    t = tt(2.2); f = 30 + 70 * np.exp(-t * 9)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    crack = lp(rng.normal(0, 1, len(t)), 3000) * np.exp(-t * 14) * .6
    return np.tanh((boom + crack) * 1.6) * .8

def pop(f=900):
    t = tt(.16); ff = f * (1 + .6 * np.exp(-t * 60))
    return np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t * 32) * .45

def ding(f=1320):
    t = tt(1.0)
    return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 2.01 * t)) * np.exp(-t * 6) * .22

def tick():
    t = tt(.025); return hp(rng.normal(0, 1, len(t)), 3000) * np.exp(-t * 300) * .4

def shutter():
    a = tick() * 2; t = tt(.09); b = bp(rng.normal(0, 1, len(t)), 1500, 6000) * np.exp(-t * 60) * .5
    out = np.zeros(int(.16 * SR)); out[:len(a)] += a; out[int(.07 * SR):int(.07 * SR) + len(b)] += b
    return out

def beep():
    t = tt(.18); return np.sin(2 * np.pi * 2000 * t) * (t < .16) * .18

def glitch(d=.35):
    t = tt(d); x = signal.square(2 * np.pi * 180 * t) * (rng.random(len(t)) > .5)
    x = x * np.repeat(rng.random(int(d * 40) + 1) > .4, int(SR / 40) + 1)[: len(t)]
    return bp(x.astype(float), 300, 5000) * .3

def shimmer(d=1.4):
    t = tt(d); x = np.zeros(len(t))
    for k, m in enumerate([81, 84, 88, 91, 93]):
        st = k * .08; sel = t >= st
        x[sel] += np.sin(2 * np.pi * note(m) * (t[sel] - st)) * np.exp(-(t[sel] - st) * 4)
    return x * .07

def drone(d):
    t = tt(d); x = np.zeros(len(t))
    for f in (55, 55.4, 82.4):
        x += signal.sawtooth(2 * np.pi * f * t)
    env = np.minimum(1, t / 1.2) * np.minimum(1, (d - t) / .8)
    return lp(x, 380) * env * .09

