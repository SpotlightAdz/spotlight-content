"""w4 caption post-fix: merge consecutive Latin words into one caption token and move a line-final "و" to the next line.
usage: python3 w4_postfix.py S1 S2 ...  (edits ../remotion/src/reels/<id>.json in place)"""
import json, re, sys, os
H = os.path.dirname(os.path.abspath(__file__))
lat = lambda w: re.match(r"^[A-Za-z]", w["t"])
for rid in sys.argv[1:]:
    p = f"{H}/../remotion/src/reels/{rid}.json"; d = json.load(open(p)); L = []
    for l in d["lines"]:
        out = []
        for w in l:
            if out and lat(w) and lat(out[-1]) and not out[-1]["t"].endswith(":"): out[-1] = {"t": out[-1]["t"] + " " + w["t"], "s": out[-1]["s"], "e": w["e"]}
            else: out.append(dict(w))
        L.append(out)
    for k in range(len(L) - 1):
        if len(L[k]) > 1 and L[k][-1]["t"] == "و": L[k + 1].insert(0, L[k].pop())
    d["lines"] = L; json.dump(d, open(p, "w"), ensure_ascii=False); print("fixed", rid)
