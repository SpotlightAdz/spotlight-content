"""Align script words (our spelling) to transcript word timings -> reel timing JSON.
usage: align.py <id>  (reads scripts.json[id] beats + trans/<id>.json words, writes ../remotion/src/reels/<id>.json)"""
import json, sys, re, difflib, subprocess, os
H = os.path.dirname(os.path.abspath(__file__))
rid = sys.argv[1]
beats = json.load(open(f"{H}/scripts.json"))[rid]
tw = json.load(open(f"{H}/trans/{rid}.json"))["words"]
norm = lambda w: re.sub(r"[^\w]", "", w).replace("ث", "ت").replace("ذ", "د").replace("ى", "ي").replace("أ", "ا").replace("إ", "ا").lower()
S = [(bi, w) for bi, b in enumerate(beats) for w in b.split()]
A = [norm(w) for _, w in S]; B = [norm(w["text"]) for w in tw]
n, m = len(A), len(B)
sim = lambda a, b: difflib.SequenceMatcher(None, a, b).ratio()
D = [[0.0] * (m + 1) for _ in range(n + 1)]; P = [[None] * (m + 1) for _ in range(n + 1)]
for i in range(1, n + 1): P[i][0] = "u"
for j in range(1, m + 1): P[0][j] = "l"
for i in range(1, n + 1):
    for j in range(1, m + 1):
        c = [(D[i-1][j-1] + sim(A[i-1], B[j-1]) - 0.35, "d"), (D[i-1][j], "u"), (D[i][j-1], "l")]
        D[i][j], P[i][j] = max(c)
i, j = n, m; match = {}
while i > 0 and j > 0:
    if P[i][j] == "d":
        if sim(A[i-1], B[j-1]) > 0.35: match[i-1] = j-1
        i -= 1; j -= 1
    elif P[i][j] == "u": i -= 1
    else: j -= 1
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"{H}/{rid}_f.wav"]))
st = [None] * n; en = [None] * n
for a, b in match.items(): st[a] = tw[b]["start_ms"] / 1000; en[a] = tw[b]["end_ms"] / 1000
# interpolate gaps
k = 0
while k < n:
    if st[k] is None:
        e = k
        while e < n and st[e] is None: e += 1
        t0 = en[k-1] + 0.08 if k > 0 else 0.1
        t1 = st[e] - 0.05 if e < n else dur - 0.2
        step = max(0.12, (t1 - t0) / (e - k))
        for q in range(k, e): st[q] = t0 + (q - k) * step; en[q] = st[q] + step * 0.9
        k = e
    else: k += 1
words = [{"t": w, "s": round(st[q], 3), "e": round(en[q], 3), "b": bi} for q, (bi, w) in enumerate(S)]
lines = []; cur = []
for w in words:
    if cur and (w["b"] != cur[-1]["b"] or len(cur) >= 4 or sum(len(x["t"]) + 1 for x in cur) + len(w["t"]) > 24): lines.append(cur); cur = []
    cur.append(w)
lines.append(cur)
bstart = [min(w["s"] for w in words if w["b"] == bi) for bi in range(len(beats))]
cuts = [round(s - 0.15, 2) for s in bstart[1:]]
out = {"total": round(dur + 1.6, 2), "cuts": cuts, "beats": [round(x, 2) for x in bstart], "lines": [[{k: w[k] for k in "tse"} for w in l] for l in lines]}
json.dump(out, open(f"{H}/../remotion/src/reels/{rid}.json", "w"), ensure_ascii=False)
print(rid, "unmatched:", [S[q][1] for q in range(n) if q not in match], "cuts", cuts, "total", out["total"])
