# Spotlight Adz content toolkit

Everything needed to produce on-brand posts for @spotlightadzagency.

- `carousel.py` — 4:5 Instagram carousels (1080x1350) in the brand kit. Add a function per carousel, run `python3 carousel.py <name>`; output in `posts/`.
- `render.py`, `render2.py` — 9:16 motion reels (dark brand world, VFX, Darija text). `render2.py` holds the shared helpers (Arabic text `T`, `logo`, icons, `grade`).
- `render3.py` — Lovable-style launch (light UI) and keynote-style reveal reels.
- `render5.py`, `audio5.py`, `build5.sh` — voice-timed reels: VO first (`vo5/times.json` holds scene cuts), hook on screen from frame 0, no fade-in. `build5.sh R B E C Z` renders and muxes.
- `audiolib.py`, `audio3.py` — music bed, SFX and voiceover mixing (voice 10+ dB above music, -14 LUFS).
- `fonts/` — Space Grotesk, Inter Tight, Readex Pro (Arabic+Latin merged). `assets/logo.webp` — brand logo.

Brand: background #04030C, aurora gradient #FFB800 → #FF3D2E → #FF2D7A → #7B3CF2 → #22D3EE, text #FBF8F5.
Contact on every CTA: WhatsApp +212 701 177 915 · spotlightadz.ma.
Voiceover: Speko audio_synthesize, google-tts:gemini-3.8-flash-tts, language ar-MA, Moroccan Darija instructions.

Media for each week lives in `YYYY-MM-wN/`; Metricool publishes from the raw.githubusercontent.com links.
