# Audio assets

Drop the following files in this folder. Names must match exactly (case-sensitive). The app uses Howler.js for playback and falls back to a synth bleep if a file is missing.

## Required files

### Sound effects

| Filename | Plays when | Suggested source |
| --- | --- | --- |
| `hit-standard.mp3` | Tap a standard mole (+10) | Kenney Interface Sounds — `pop_00x.mp3` or `click1.mp3` |
| `hit-golden.mp3` | Tap a golden mole (+50) | Kenney Casino Audio — `coin1.mp3` |
| `hit-speedy.mp3` | Tap a speedy mole (+20, triggers ×2 boost) | Kenney Interface Sounds — high-pitched click or pop |
| `miss.mp3` | Tap an empty hole | Kenney Interface Sounds — `switch1.mp3` or low click |
| `bomb.mp3` | Tap a bomb (−1 life) | Kenney Impact Sounds — `explosionCrunch_000.mp3` |
| `level-up.mp3` | Level rises (every 250 pts) | Kenney Music Jingles — ascending jingle |
| `game-over.mp3` | Round ends | Kenney Music Jingles — descending jingle |

### Music

| Filename | Plays when | Suggested source |
| --- | --- | --- |
| `music-loop.mp3` | Looping during gameplay, fades in/out at start/end | Pixabay Music — search "tropical chill" or "8bit happy" |

## Recommended free packs (CC0 — no attribution required)

- **Kenney.nl** — https://kenney.nl/assets/category:Audio
  - Interface Sounds — https://kenney.nl/assets/interface-sounds
  - Impact Sounds — https://kenney.nl/assets/impact-sounds
  - Casino Audio — https://kenney.nl/assets/casino-audio
  - Music Jingles — https://kenney.nl/assets/music-jingles
- **Pixabay Music** — https://pixabay.com/music/

## Format notes

- Use MP3 (universal, smaller than WAV).
- Keep SFX under 100 KB each; music can be up to a few MB.
- Music should be loopable (find a clean loop point or download a track that already loops).
