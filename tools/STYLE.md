# Spotlight Adz content standard

The bar: every post should look like it came from a top agency's own account, not from a template. If a frame would not survive a designer's critique, it does not ship.

## Engine

- **Reels and carousels are built in `tools/remotion/`** (React + Remotion, rendered in Chromium). Real web typography, proper Arabic shaping, springs, masks, blur, depth, grain. The old PIL renderers (`render*.py`, `carousel.py`) are legacy: use them only as a fallback.
- Shared look lives in `tools/remotion/src/brand.tsx`: `Stage` (Sunlit cream studio, moving aurora light, 3D backdrop, grain, soft vignette), `Chrome` (progress bar, brand chip, scene index), `Kinetic` (masked word-by-word type), `Captions` (voice-synced, active word lit), `Whip` + `Flash` (cut transitions), `Phone`, `Glass`, `Tag`, `WaButton`.
- Reference pieces: `src/reels/RestaurantMistakes.tsx` (dark editorial explainer) and `src/carousels/ReelIdeas.tsx` (editorial carousel, dark cover + paper inner slides).
- **v2 kit (Nov 2026, in `brand.tsx`)** — use these instead of re-writing scaffolding:
  - `ReelShell` — a whole reel from `{data, audio, scenes[]}`: stage, VO mix, whip cuts on `data.cuts`, flash, synced captions (`capHide(t, scene)`), chrome with optional per-scene index. A new reel is now just its scene components (see `src/reels/BrandMistakes.tsx`, `HappyFitnessSystem.tsx`, `ShootDay.tsx`, `PovBchhal.tsx`, `FollowersMyth.tsx`).
  - `SceneHead` + `Num` (kicker chip "01 الغلطة" + kinetic headline), `Counter` (count-up gradient number; wrap it in a positioned div to move it off-center), `LineIcon` + `ICON` (one icon set for reels and carousels: add new paths there), `Bubble` (chat bubble, in/out), `CommentCta` (comment-keyword pill + WhatsApp), `Illustrative` ("مثال توضيحي" label), `sec()`.
  - `ShootDay.tsx` has a `Viewfinder` overlay (REC, timecode, thirds) for BTS pieces; `PovBchhal.tsx` has a message-flood hook.
  - Carousels: `src/carousels/editorial.tsx` (`Dark`, `PaperStep`, `Header`, `Footer`, `CtaPill`, `nbsp()`), see `W3Carousels.tsx` (steps carousel, quiz → pricing carousel).
- **Voice pipeline** (`tools/vo6/`): `extract.py` pulls the WAV out of a saved Speko result; tighten pauses with ffmpeg `silenceremove` (stop_duration 0.32); `align.py <id>` aligns our script spelling (`scripts.json`) to the Speko transcript timings (`trans/<id>.json`) and writes `src/reels/<id>.json` (cuts on beat starts, caption lines ≤ 4 words / 24 chars). `tools/mix6.py <id> <dark|light|keynote|pov>` builds the original music bed + SFX, ducks under the voice, prints voice-over-music dB and normalises to -14 LUFS.

- **v3 kit (14 Nov 2026)**: `ReelShell` now adds `LeakCuts` (a warm WebGL light leak blooming over every cut, hue 0 amber / 60 pink, from `@remotion/effects`) and `LoopBack` (the last 0.45 s cross-fades into the hook's first frame so the replay is seamless). Turn them off with `leaks={false}` / `loop={false}`. New components: `FitLine` (one headline line auto-sized with `fitText`, never wraps), `SendCta` ("صيفطها ل…" send ask). Installed: `@remotion/transitions`, `@remotion/effects` (100+ effects: lightLeak, glow, shine, chromaticAberration, zoomBlur, halftone, lut, vignette…), `@remotion/layout-utils`, `@remotion/motion-blur`, `@remotion/shapes`, `@remotion/paths`, all pinned to 4.0.541.
- **Renders need WebGL2**: `remotion.config.ts` and `stills.mjs` use `--gl=angle-egl` (swangle has no WebGL2 → effects throw "No supported implementation").
- **Sound v7** (`tools/mix7.py <id> <maghreb|afro|keynote|dark>`): original music generated in code (no song samples): `maghreb` = darbuka doum/tek in a maqsoum feel + oud-like Karplus-Strong plucks in Hijaz on D + 808 sub, the brand's signature bed for Darija reels; `afro` = afro-house; `keynote` = piano/pads; `dark` = minor trap. Real CC0 sounds from Kenney (`tools/sfx/kenney`, licence inside) for UI ticks and the CTA hit. Arrangement: impact under the frame-0 hook, whoosh + UI tick on every cut, music sucked out 0.35 s before the CTA, an untuned reversed cymbal that **peaks exactly on the CTA cut**, then a hit. Voice chain and mastering with Spotify's `pedalboard` (HPF, compressor, presence, limiter); the music ducks 9 dB **and loses 1–4 kHz** while the voice speaks; `pyloudnorm` sets exactly -14 LUFS. `mix6.py` is the previous version.
- **Reference skills**: the official Remotion agent skills are not vendored (no licence file). At the start of a run: `git clone --depth 1 https://github.com/remotion-dev/skills /tmp/remotion-skills` and read `skills/remotion-best-practices/remotion-markup/{arabic-text,transitions,effects,light-leaks,motion-blur,text-highlights,audio-visualization}.md` when you use those features. `tools/skills/color-expert` is vendored (meodai/skill.color-expert, CC BY 4.0): read its `SKILL.md` when building palettes, ramps or gradients.
- **Licence note**: Remotion is free for individuals and companies of up to 3 people; bigger companies need a Remotion company licence (remotion.dev/license).

## Mixed-media montage (owner's direction, 15 Nov 2026): switch medium every scene

The owner wants reels where the viewer never gets bored: **each scene uses a different medium**, all inside the Sunlit look. Reference: `src/reels/BchhalMontage.tsx`.

- **Character animation** (`src/mixed/Character.tsx`): flat editorial person with thick plum outline. Props: `mood` tired/happy/shocked/neutral (eyes, brows, mouth, sweat drop), `pose` phone/wave/walk/idle/coffee (arms and legs animate from the frame; blinks and breathing are automatic), `shirt`, `hairStyle` short/cap/scarf, `flip`. Use it for the business owner, the customer, the neighbour. Place it inside an `<svg width=1080 height=1920>`.
- **Paper cut-out / stop-motion** (`src/mixed/paper.tsx`): `PaperDesk` (fibre paper background), `Scrap` (torn-edge paper with grain, shadow, optional tape), `CutoutWords` (ransom-note words, each on its own scrap), `useStep(3)` (10 fps stop-motion timing) + `jitter()` (hand-placed wobble).
- **Editorial page**: paper `#F3EEE7`, header rule, kicker, giant type (200+ px), one gradient word, a stamp or one icon.
- **Real 3D**: `Stage3D` + `Phone3D` with a live canvas screen, `Hero3DText`, floating glossy shapes.
- **UI/phone, kinetic type, 3D map (`animation-skills/map-route`), graphs**: the rest of the toolbox.

Rules: never two scenes in a row in the same medium; 4–6 scenes per 20 s; the hook scene is the character or 3D (faces and objects stop the scroll); the medium matches the beat (problem = character, process = paper, product = 3D phone, proof/principle = editorial, CTA = character happy + send). The voice, captions, palette and grain stay constant so it still feels like one film.

## v4 (15 Nov 2026): Sunlit Studio, real 3D, 4K

**Look: Sunlit Studio** (chosen by the owner; no more black backgrounds). Warm cream studio backdrop `radial-gradient(#FFF8F0 → #F6EADF → #EBD9C9)`, deep plum ink `#1A1222`, muted `#6D5F6E`, glossy aurora accents (pink `#FF2D7A`, amber `#FFB800`, violet `#7B3CF2`, cyan `#22D3EE` sparingly). `C` in `brand.tsx` now holds these values (`C.night` keeps the old black for phone screens and dark UI). Glass = white 60–88% with soft warm shadows; captions = plum words, active word white on the aurora pill. Phones stay dark devices (they pop on cream). Contrast: plum on cream is 15:1; pink/red on cream is display-size only.

**Real 3D** (`src/three/kit3d.tsx`, React Three Fiber via `@remotion/three`, three 0.170):
- `Stage` now renders `Backdrop3D` by default: glossy torus/spheres/gem/capsule drifting at the frame edges (pass `three={false}` to turn off).
- `Hero3DText` — big extruded 3D number or Latin word (our Space Grotesk TTF) for hooks and results ("10K", "151.2K", "+400%"). `Text3D`, `Phone3D` (rounded 3D phone, screen = a canvas you draw with `useCanvasTexture`, Arabic works there), `Float`, `Floor` (shadow catcher), materials `gloss()`, `chrome()`, `glass()`, studio reflections from `RoomEnvironment` (no HDR files). `THEMES` has the three looks the owner was shown (sunlit is the one in use).
- Rules: Arabic always as HTML on top (TextGeometry can't shape Arabic). Any component that uses `Text3D` must call `useTTF()` in the DOM tree and render its `<Stage3D>` only once the font is loaded (R3F does not redraw after a late state change). Shadows are off by default (`<Stage3D shadows>` to enable): they cost render time.
- Lab: `Look3D` composition (`--props='{"theme":"sunlit"}'`) is the reference frame.

**4K**: final reels render at `--scale=2` (2160×3840): `npx remotion render src/index.ts <Comp> out/<file>.mp4 --scale=2 --concurrency=2 --crf=20 --audio-codec=aac --timeout=180000`. On this 2-core machine that is ≈7 s per frame (≈80 min for a 25 s reel) vs ≈0.9 s at 1080p, so: lock stills first, then queue every reel **sequentially in the background right away** and do carousels/captions while they render. Background processes are stopped when the session's turn ends, so keep polling and finish (commit/push) every render inside the same run. ≈1.8 MB per second of video at crf 20 (GitHub's limit is 100 MB per file; above ~45 s use crf 23). Carousels: `SCALE=2 FMT=jpeg node stills.mjs …` gives 2160×2700. Instagram displays Reels at 1080×1920; the 4K master still gives a cleaner encode and is reusable for ads and the portfolio.

**Independent jury before the full render** (from `tools/skills/mg-styles/rubric.md`, MIT): after the key-frame stills look right, start a sub-agent that did not make the reel, give it the stills/contact sheet and the jury prompt from `rubric.md` (adapted: 9:16, Darija copy, our STYLE rules), get scores (style, concept/hook, motion, design & type, finish, sound, technical) and the top fixes, apply them, then render. `tools/skills/mg-styles/prompts/` has 15 award-level style prompts (flat vector, isometric, 3D render, liquid, morph, Bauhaus, aurora glass, HUD…) to borrow techniques from for new formats.

**Ready-made 3D animation skills** (`tools/skills/animation-skills`, MIT, artemnovitckii): `map-route` (white 3D city, route draws itself, pin + ETA: great for "how to find us" and local delivery), `breakdown` (3D exploded phone with labels: "what's inside our system"), `graph` (growth line + counting number), `minimalistic-graphics`, `stick-figure` and `zach-d-films` (3D cartoon "what if" explainers). They render with HyperFrames: `cd tools/skills/animation-skills/kit && npm install && npm i --no-save gsap@3.12.5 && mkdir -p vendor && cp node_modules/gsap/dist/gsap.min.js vendor/`, then `export HYPERFRAMES_BROWSER_PATH=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux64/chrome | head -1)` and follow each `skills/<name>/SKILL.md`. Restyle them to Sunlit (accent `#FF2D7A`, cream backgrounds) and add our Darija captions/VO in Remotion, or use their mp4 as a scene inside a reel (`<OffthreadVideo>`).

## What viral Reels and carousels have in common (research, Nov 2026)

Instagram's own statements (Mosseri, Jan 2025): the top three ranking signals are **watch time, likes per reach and sends per reach**. Likes weigh a bit more with followers; **sends (DM shares) weigh more with non-followers**, so sends are how a small account reaches new people. Instagram favours the original creator over reposts, keeps watermarked videos (TikTok/CapCut) out of Explore, uses caption text for search, and recommends Reels of up to 3 minutes to non-followers. A carousel nobody swiped is shown again later, starting at the first unseen slide. Buffer's 4M-post study: Reels reach about 36% more people, while carousels get about 12% more engagement. Saves count, but Instagram says "high saves, low shares" means useful but not shareable. Blog statistics about hooks and audio vary widely; treat them as hints, not rules.

What we do with that:

1. **Design every reel to be sent.** Pick a topic where the viewer thinks of a specific person ("صيفطها لمول الريسطو", "لشريكك", "لصاحبك اللي عندو حانوت"). Most reels end with `SendCta`; comment-keyword CTAs at most twice a week.
2. **Watch time**: frame-0 hook (text + visual, readable with no sound), a pattern break every 2–3 s, payoff held back until the end ("…و التالتة هي اللي كتخسرك بزاف"), and a seamless loop (`LoopBack`). 20–35 s is our default; one longer (60–90 s) story reel a week to test, since Buffer's data favours longer reels for reach.
3. **One idea, said three ways**: hook text on screen, the same line spoken, the same keywords in the caption's first line (search).
4. **Original only**: no watermarks, no reposted clips, no AI-generated people. Real faces (owner/team talking to camera) are the next big upgrade.
5. **Caption**: first line repeats the hook, Darija keywords people search for (اسم الخدمة + المدينة), short value, one CTA. Mosseri says hashtags don't drive reach; keep 3–6 relevant ones unless the owner asks for more.
6. **Carousels**: 7–10 slides (Instagram allows 20). Slide 1 = number + promise. **Slide 2 must work as a second cover**, because non-swipers get the post again from the first slide they didn't see: headline + why it matters, never "intro" filler. ≤ 35 words a slide, body ≥ 44 px, one idea per slide, a "save" cue near the end, last slide one CTA. Mixed carousels (images + a short video slide) score highest in Socialinsider's 2025 data: add a looping video slide when there's footage.
7. **Sound**: Reels need music + voice; for a trend moment, schedule the Reel with Instagram's licensed audio through Metricool's `audioConfiguration` (VO-only mix, `videoVolume` 100, `audioVolume` ~15). Never copyrighted songs baked into the video.
8. **Test with Trial Reels** (Metricool `TRIAL_REEL`) for hooks: shown to non-followers first, they don't hurt the main grid.

## Color system

- 60-30-10: 60% cream studio (or paper `#F3EEE7` on carousels), 30% plum ink/white glass, 10% aurora accent. One gradient word per line.
- Contrast is checked with `python3 tools/contrast.py`: ink, muted, amber, red, pink and cyan pass AA on night; **violet `#7B3CF2` on night is display-size only**; red/pink on paper are display-size only (headlines ≥ 60 px, never body). **White on WhatsApp green `#25D366` fails (1.98:1)**: buttons with white text use `C.waDeep` `#0E7A43`; keep `#25D366` for icons and checkmarks.
- Gradients run in OKLCH-like order (amber → red → pink → violet → cyan); never put cyan next to amber without the pink/violet between (muddy midpoint).
- Each reel may pick one **signature accent** for its hero (amber for money/results, pink for social, cyan for tech/AI, green only for WhatsApp), so the feed reads as a varied but coherent grid.

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
10. **Sound**: `mix7.py` (default style `maghreb`; `keynote` for result stories). Voice 10+ dB above the music, a whoosh + tick on each cut, riser peaking on the CTA cut, -14 LUFS.
11. **Loop + send**: end on `SendCta` (or a comment keyword) and let `LoopBack` blend into the hook.

## Carousel recipe

- 1080x1350, 7–10 slides. Slide 1 sells the swipe: a number + a promise, huge type, dark aurora cover. **Slide 2 is a second cover** (it is what non-swipers see when Instagram re-serves the post): a strong headline that makes sense alone.
- Inner slides are editorial: kicker (`IDEA 01`), headline, gradient sub-line, rule, one short paragraph, a line icon. Paper background (`#F3EEE7`) with ink text for contrast against the dark cover. Header shows series name and `03 / 07`.
- Last slide: one CTA (comment keyword + WhatsApp). Never more than one ask.
- Arabic text goes in `dir="rtl"` blocks. Phone numbers, handles and Latin words go in their own `dir="ltr"` element, or they render reversed.

## Layout rules

- Safe zone for reels: x 80–1000, y 220–1480. Instagram UI covers the bottom ~420 px and the top ~200 px.
- Margins 70–90 px. Align to a center axis or a hard right edge (RTL), never both in one scene.
- Keep a lone "و" glued to the next word (`nbsp()` or a non-breaking space) so it never ends a line. Don't use «» around Arabic words in RTL blocks: they mirror and read backwards.
- Max 2 type sizes per scene plus captions. Readex Pro for Arabic, Space Grotesk for numbers and Latin.
- Brand colors only (Sunlit Studio): cream backdrop, plum ink #1A1222, aurora accents #FFB800 → #FF3D2E → #FF2D7A → #7B3CF2 → #22D3EE, WhatsApp green only for chat/CTA. The old black #06050C is only for device screens and dark UI inside phones.

## Quality gate (before the full render)

Render key frames with `node stills.mjs <Comp> <dir> <frames>` (first frame, mid-scene for every scene, CTA) and check:

- Frame 0 states the hook clearly with no sound.
- No overlap, no clipped or wrapped-under text, no reversed numbers, no lone "و" at a line end.
- Every scene has one obvious focal point; nothing important sits below y 1480.
- It looks finished next to a top agency's feed. If not, redesign the scene, don't polish it.

Then render: `npx remotion render src/index.ts <Comp> out/<file>.mp4 --concurrency=2 --crf=20 --audio-codec=aac --timeout=120000` (the long timeout lets WebGL light-leak shaders compile on the first leak frame) (≈20–40 min per 30 s reel on this machine; render reels in the background and work on carousels meanwhile). Carousels: `SCALE=1 FMT=jpeg node stills.mjs <Comp> <dir> 0,1,...`.

## Formats that work for an agency account

Rotate these, and mix in real footage whenever the owner provides it:

1. Mistakes / myths explainer (dark editorial, phone UI).
2. Client result story (keynote stage, giant number, client card).
3. Behind the scenes (real footage from shoots, edited with captions + the motion system).
4. Talking head by the owner or team, with kinetic captions and B-roll inserts. Real faces build the most trust; the motion system dresses them, it doesn't replace them.
5. Relatable POV / skit (fast cuts, chat UI, humor).
6. Product/service launch (light UI style, cursor, mockups).
7. Editorial carousels: lists, frameworks, pricing explained, case studies.
