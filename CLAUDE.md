# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Be Mine... Or Else?" is a static front-end Valentine's Day visual novel game with a retro pixel-art aesthetic. It simulates a phone interface and features three endings (Good, Secret, Yandere) based on player choices.

## Running

No build tools required. Open `index.html` in a browser to start.

## Architecture

The app is split across three HTML pages that share one CSS file and one JS file:

- **index.html** — Intro/title screen (Street Fighter-inspired)
- **login.html** — Player login screen (RPG-styled, hardcoded password: `0811`)
- **visual.html** — Visual novel dialogue engine with branching choices

All pages load `style.css` and `functions.js`. Navigation between pages uses full page loads via the `navigateTo()` function (with a fade-out animation).

### functions.js Structure

The single JS file handles all three pages using DOM-based auto-detection at load time:
- Checks for `#login-particles` → runs `initLoginScreen()`
- Checks for `#vn-textbox` → runs `initVN()` + `startVN()`
- Intro screen code (particles, `goToLogin()`) runs unconditionally with null guards

Key systems:
- **VN Engine**: `vnLine()`, `vnChoice()`, `vnTypeText()` — async/await dialogue system with typewriter effect
- **Mood System**: `setMood(mood)` changes character portrait (SVG pixel art) and background gradient via `VAL_MOODS` map
- **Expressions**: Character faces are inline SVG composed from `HEAD_BASE` + expression-specific elements
- **State**: `sessionStorage` for `playerName` and `isMuted` (persists across page navigations)

### Audio

Sound files in `sounds/` are referenced via `<audio data-sound="...">` tags duplicated in each HTML file. Mute state is managed globally via `initGlobalMusicState()`.

### Assets

- `images/` — Character portrait image (`Moreno.png`)
- `sounds/` — Background music and SFX (click, transition, endings)
