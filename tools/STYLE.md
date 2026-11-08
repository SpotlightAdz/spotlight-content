# Spotlight Adz content standard

The bar: every post should look like it came from a top agency's own account, not from a template. If a frame would not survive a designer's critique, it does not ship.

## Engine

- **Reels and carousels are built in `tools/remotion/`** (React + Remotion, rendered in Chromium). Real web typography, proper Arabic shaping, springs, masks, blur, depth, grain. The old PIL renderers (`render*.py`, `carousel.py`) are legacy: use them only as a fallback.
- Shared look lives in `tools/remotion/src/brand.tsx`: `Stage` (soft black, moving aurora light, grain, vignette), `Chrome` (progress bar, brand chip, scene index), `Kinetic` (masked word-by-word type), `Captions` (voice-synced, active word lit), `Whip` + `Flash` (cut transitions), `Phone`, `Glass`, `Tag`, `WaButton`.
- Reference pieces: `src/reels/RestaurantMistakes.tsx` (dark editorial explainer) and `src/carousels/ReelIdeas.tsx` (editorial carousel, dark cover + paper inner slides).

## Reel recipe

1. **Script first, 20–32 s.** One idea. Hook line, 3–5 beats, proof, CTA. Each beat is one short spoken sentence.
2. **Voice first.** Synthesize the whole script in one call (blank line between beats), tighten pauses, then transcribe it with Speko `audio_transcribe` (`word_timestamps: true`, language `ar-MA`) from a raw GitHub link. Scene cuts sit on the pauses; every word gets a timestamp for captions.
3. **Frame 0 is the cover and the hook.** The hook text and the key visual are fully on screen at frame 0. No logo intro, no fade from black.
4. **One hero visual per scene**, not decoration: a phone with real-looking UI, a giant number, a before/after wipe, a chat, a dashboard. Give it depth (shadow, slight 3D tilt) and motion (spring in, slow push).
5. **Kinetic type**: words rise through a mask, timed to the voice. Big scale contrast (hero word 2–5x the body). One gradient word per line, never a whole paragraph in gradient.
6. **Captions on every spoken scene**, synced word by word, active word on an aurora pill, at y ≈ 1420. Hide them when the big headline already says the same words (hook, CTA).
7. **Cut every 2–5 s** with the whip (blur + push) and a warm flash. Something moves in every second; nothing moves without a reason.
8. **Proof beats claims.** Use client names, handles and numbers from the facts list. Label invented UI data "مثال توضيحي".
9. **End on one action**: save/share or WhatsApp, with the number. Hold the CTA about 2 s longer than feels necessary.
10. **Sound**: music bed ducked under the voice (voice 10+ dB above), whoosh on each cut, pops on reveals, -14 LUFS.

## Carousel recipe

- 1080x1350, 6–10 slides. Slide 1 sells the swipe: a number + a promise, huge type, dark aurora cover.
- Inner slides are editorial: kicker (`IDEA 01`), headline, gradient sub-line, rule, one short paragraph, a line icon. Paper background (`#F3EEE7`) with ink text for contrast against the dark cover. Header shows series name and `03 / 07`.
- Last slide: one CTA (comment keyword + WhatsApp). Never more than one ask.
- Arabic text goes in `dir="rtl"` blocks. Phone numbers, handles and Latin words go in their own `dir="ltr"` element, or they render reversed.

## Layout rules

- Safe zone for reels: x 80–1000, y 220–1480. Instagram UI covers the bottom ~420 px and the top ~200 px.
- Margins 70–90 px. Align to a center axis or a hard right edge (RTL), never both in one scene.
- Max 2 type sizes per scene plus captions. Readex Pro for Arabic, Space Grotesk for numbers and Latin.
- Brand colors only: #06050C, aurora #FFB800 → #FF3D2E → #FF2D7A → #7B3CF2 → #22D3EE, ink #FBF8F5, WhatsApp green only for chat/CTA.

## Quality gate (before the full render)

Render key frames with `node stills.mjs <Comp> <dir> <frames>` (first frame, mid-scene for every scene, CTA) and check:

- Frame 0 states the hook clearly with no sound.
- No overlap, no clipped or wrapped-under text, no reversed numbers, no lone "و" at a line end.
- Every scene has one obvious focal point; nothing important sits below y 1480.
- It looks finished next to a top agency's feed. If not, redesign the scene, don't polish it.

Then render: `npx remotion render src/index.ts <Comp> out/<file>.mp4 --concurrency=2 --crf=20 --audio-codec=aac` (≈20–40 min per 30 s reel on this machine; render reels in the background and work on carousels meanwhile). Carousels: `SCALE=1 FMT=jpeg node stills.mjs <Comp> <dir> 0,1,...`.

## Formats that work for an agency account

Rotate these, and mix in real footage whenever the owner provides it:

1. Mistakes / myths explainer (dark editorial, phone UI).
2. Client result story (keynote stage, giant number, client card).
3. Behind the scenes (real footage from shoots, edited with captions + the motion system).
4. Talking head by the owner or team, with kinetic captions and B-roll inserts. Real faces build the most trust; the motion system dresses them, it doesn't replace them.
5. Relatable POV / skit (fast cuts, chat UI, humor).
6. Product/service launch (light UI style, cursor, mockups).
7. Editorial carousels: lists, frameworks, pricing explained, case studies.
