# Audio assets

Played via Howler.js with a synth fallback for SFX if a file fails to load. Music has no fallback (silence if missing).

## Sound effects (`.ogg`)

| Filename | Plays when | Current source |
| --- | --- | --- |
| `hit-standard.ogg` | Tap a standard mole (+10) | Kenney Interface Sounds — `click_001.ogg` |
| `hit-golden.ogg` | Tap a golden mole (+50) | Kenney Casino Audio — `chips-stack-1.ogg` |
| `hit-speedy.ogg` | Tap a speedy mole (+20, triggers ×2 boost) | Kenney Interface Sounds — `click_005.ogg` |
| `miss.ogg` | Tap an empty hole | Kenney Interface Sounds — `error_001.ogg` |
| `bomb.ogg` | Tap a bomb (−1 life) | Kenney Impact Sounds — `impactMining_000.ogg` |
| `level-up.ogg` | Level rises (every 250 pts) | Kenney Music Jingles — `8-Bit jingles/jingles_NES01.ogg` |
| `game-over.mp3` | Round ends | Pixabay / Freesound — sad trombone (wah wah wah waah) |

To swap any of these for a different Kenney pick, just overwrite the `.ogg` with the file you prefer (same name).

## Music (`music-1.mp3` … `music-N.mp3`)

The game picks one randomly each time a round starts. Drop any number of tracks named `music-N.mp3` and edit `MUSIC_TRACKS` in `apps/web/src/game/audio.ts` to add/remove entries.

Current tracks (from Pixabay, CC0):

- `music-1.mp3` — apalonbeats summer tropical happy
- `music-2.mp3` — delosound summer tropical happy
- `music-3.mp3` — mepa_melson tropical reggae united
- `music-4.mp3` — paulyudin tropical (153104)
- `music-5.mp3` — paulyudin tropical (153476)
- `music-6.mp3` — the_mountain tropical music

## Free sources (CC0 — no attribution required)

- **Kenney.nl** — https://kenney.nl/assets/category:Audio
- **Pixabay Music** — https://pixabay.com/music/

## Format notes

- SFX use `.ogg` (Kenney's native format, smaller than MP3).
- Music uses `.mp3` (Pixabay default, universally supported).
- Howler loads on demand and caches per file.
