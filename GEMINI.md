# GEMINI.md - Project Overview

## Project Type
This is a **front-end web application**, structured as a single HTML page (`index.html`) with accompanying CSS (`style.css`) and inline JavaScript.

## Project Overview
This project is an interactive, Valentine's Day themed visual novel game titled "Be Mine... Or Else?". It presents a story with choices that lead to different endings (Good, Secret, and a humorous "Yandere" ending).

The application is designed with a retro/pixel art aesthetic, inspired by classic fighting games (like Street Fighter for the intro screen) and old-school RPGs (for the login screen). It simulates a phone interface.

**Key Features:**
*   **Multi-screen Interface:** Transitions between an intro screen, a login/player select screen, and the visual novel dialogue screen.
*   **Interactive Dialogue:** Uses a custom "Visual Novel Engine" implemented in JavaScript to manage dialogue flow, character moods, and player choices.
*   **Particle Effects & Animations:** Includes various particle effects (hearts, embers, stars) and animations (love meter, glitches, screen shakes) to enhance the retro game feel.
*   **Hardcoded Login:** The login screen requires a specific code (`0811`) which is hinted as an "anniversary" date.

## Technologies Used
*   **HTML5:** For structuring the content.
*   **CSS3:** For styling, including advanced layouts, animations, and responsive design.
*   **JavaScript (ES6+):** For all interactive logic, game state management, animations, and the visual novel engine.
*   **Google Fonts:** Specifically "Press Start 2P" for the retro pixel font.

## Building and Running
This project is a static web application and does not require any build tools or complex setup.

To run the application:
1.  Simply open the `index.html` file in any modern web browser (e.g., Chrome, Firefox, Edge, Safari).

## Development Conventions
*   **Structure:** All HTML content is contained within `index.html`. CSS rules are defined in `style.css`. JavaScript logic is primarily inline within a `<script>` tag at the end of `index.html`.
*   **Styling:** Relies heavily on CSS for visual effects, animations, and creating the retro aesthetic.
*   **Scripting:** The JavaScript code is organized into functions for different game components (e.g., `updateClocks`, `typeWriter`, `startVN`).
*   **Hardcoded Values:** The login password (`0811`) is hardcoded directly in the JavaScript.
*   **UI/UX:** Designed to mimic a mobile phone interface.
