#!/usr/bin/env python3
"""WCAG contrast + OKLCH lightness for brand color pairs. usage: contrast.py [fg bg ...]  (no args = check the brand system)
Rule: body/caption text >= 4.5:1, big display type (>= 60px) >= 3:1."""
import sys
def lin(c): c /= 255; return c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4
def rgb(h): h = h.lstrip("#"); return [int(h[i:i + 2], 16) for i in (0, 2, 4)]
def lum(h): r, g, b = map(lin, rgb(h)); return .2126 * r + .7152 * g + .0722 * b
def ratio(a, b): la, lb = sorted([lum(a), lum(b)], reverse=True); return (la + .05) / (lb + .05)
def oklch_L(h):
    r, g, b = map(lin, rgb(h))
    l = (.4122214708 * r + .5363325363 * g + .0514459929 * b) ** (1 / 3); m = (.2119034982 * r + .6806995451 * g + .1073969566 * b) ** (1 / 3); s = (.0883024619 * r + .2817188376 * g + .6299787005 * b) ** (1 / 3)
    return .2104542553 * l + .7936177850 * m - .0040720468 * s
PAIRS = [("#FBF8F5", "#06050C", "ink on night"), ("#9C9CB1", "#06050C", "muted on night"), ("#FFB800", "#06050C", "amber on night"), ("#FF3D2E", "#06050C", "red on night"),
         ("#FF2D7A", "#06050C", "pink on night"), ("#7B3CF2", "#06050C", "violet on night"), ("#22D3EE", "#06050C", "cyan on night"), ("#121018", "#F3EEE7", "ink on paper"),
         ("#6E6A75", "#F3EEE7", "soft on paper"), ("#FF3D2E", "#F3EEE7", "red on paper"), ("#FF2D7A", "#F3EEE7", "pink on paper"), ("#FFFFFF", "#FF2D7A", "white on pink pill"),
         ("#FFFFFF", "#25D366", "white on WhatsApp green"), ("#FFFFFF", "#1f6f4a", "white on chat green")]
args = sys.argv[1:]
pairs = [(args[i], args[i + 1], "") for i in range(0, len(args), 2)] if args else PAIRS
for fg, bg, name in pairs:
    r = ratio(fg, bg); tag = "AA body" if r >= 4.5 else ("display only" if r >= 3 else "FAIL")
    print(f"{fg} on {bg}  {r:5.2f}:1  {tag:12s} L(fg)={oklch_L(fg):.2f}  {name}")
