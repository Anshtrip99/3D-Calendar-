# Everyday Studio — 2027 Desk Calendar

An interactive 3D presentation for a thoughtfully designed 2027 desk calendar. Explore the calendar in a browser, turn through the months, change the weather scene, and browse the illustrated card designs.

## Features

- Interactive 3D calendar with orbit and 360° rotation controls
- Twelve illustrated monthly cards with calendar dates and observances
- Day and night scenes that follow the local time
- Sunny, clear, rainy, and snowy background options, saved in the browser
- Responsive month showcase and maker story
- Keyboard navigation with the left and right arrow keys; press Escape to return a pulled card to the stack

## Getting started

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview a production build:

```bash
npm run build
npm run preview
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |

## Project structure

```text
public/                 Calendar artwork, weather scenes, and favicon
public/months/          Monthly card illustrations
src/components/         3D scene, month showcase, and studio story
src/data/months.js      Month names, colours, observances, and date grids
src/App.jsx             Main experience and interaction state
src/styles.css          Layout, responsive styles, and animation
```

The app is built with React, Vite, Three.js, React Three Fiber, Drei, and GSAP. Google Fonts are loaded from Google Fonts at runtime.
