<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Lumina Breath

A minimalist, rhythmic breathing app featuring Box, 4-7-8, and Coherent breathing techniques with animated geometric visual guides.

[View in AI Studio](https://ai.studio/apps/25a9a18b-27ba-4dd2-8b8b-327b55f28006)

## Overview

Lumina Breath is a modern React-based breathing exercise application designed to help users practice three popular breathing techniques through elegant, animated geometric shapes. The app provides visual feedback through shape scaling and progress animations that sync with each breathing phase.

### Features

- **Three Breathing Modes:**
  - **Box Breathing (4-4-4-4)**: Square shape visualization - Inhale 4s, Hold 4s, Exhale 4s, Hold 4s
  - **4-7-8 Breathing**: Triangle shape visualization - Inhale 4s, Hold 7s, Exhale 8s
  - **Coherent (6-6)**: Circle shape visualization - Inhale 6s, Exhale 6s

- **Interactive Visual Feedback:**
  - Animated geometric shapes that scale with breathing phases
  - Progress tracking with stroke animation along shape perimeter
  - Phase indicators (INHALE, HOLD, EXHALE)
  - Smooth transitions using Framer Motion

- **Clean, Minimalist UI:**
  - Nike-inspired design system with Anton display font
  - Responsive layout for mobile and desktop
  - Tap/click to start/stop breathing sessions
  - Bottom navigation for quick mode switching

## Animation & Interaction Details

### Shape Animations

Each breathing technique features unique geometric animations designed to guide your breathing rhythm:

#### **Box Breathing (Square)**
- **Shape**: Square with vertex at top-left
- **Scale Animation**: Expands during INHALE (1.0 → 1.3x), contracts during EXHALE (1.3x → 1.0), holds steady during HOLD phases
- **Stroke Animation**: Black progress stroke travels clockwise starting from top-left corner
- **Duration**: 16 seconds total (4s per phase × 4 phases)
- **Behavior**: Continuous stroke progression through all four phases

#### **4-7-8 Breathing (Triangle)**
- **Shape**: Upward-pointing triangle (vertex at top)
- **Scale Animation**: Expands during INHALE, contracts during EXHALE, holds at peak during HOLD
- **Stroke Animation**: Progress stroke travels clockwise starting from top vertex
- **Duration**: 19 seconds total (4s INHALE + 7s HOLD + 8s EXHALE)
- **Behavior**: Continuous progression through three phases

#### **Coherent Breathing (Circle)**
- **Shape**: Circle with starting point at 12 o'clock (top)
- **Scale Animation**: Expands during INHALE (1.0 → 1.3x), contracts during EXHALE (1.3x → 1.0)
- **Stroke Animation**: 
  - **INHALE (6s)**: Stroke fills the circle clockwise from top
  - **EXHALE (6s)**: Stroke clears/erases the circle, emptying back to start
- **Duration**: 12 seconds total (6s × 2 phases)
- **Behavior**: Fill-and-clear pattern creates a complete breathing rhythm

### Technical Implementation

**Stroke Animation Technique:**
- Uses SVG `stroke-dasharray` and `stroke-dashoffset` properties
- Path length calculated dynamically via `getTotalLength()`
- Smooth linear transitions with no easing for consistent timing
- All shapes rotated -90° to align starting points correctly

**Phase Timing:**
- `requestAnimationFrame` for precise animation synchronization
- Progress tracked per phase with automatic phase transitions
- Global progress calculated across all phases for continuous animations

### User Interaction

- **Tap/Click Shape**: Start or stop breathing session
- **Mode Selection**: Tap mode buttons in bottom navigation bar
- **Visual Feedback**: 
  - "TAP TO START" appears when idle
  - Current phase name displays during active session
  - Active mode highlighted in navigation with dark background

## Tech Stack

- **Framework**: React 19.0.1
- **Build Tool**: Vite 6.2.3
- **Styling**: Tailwind CSS 4.1.14
- **Animation**: Framer Motion 12.23.24
- **Icons**: Lucide React 0.546.0
- **AI Integration**: Google Generative AI (@google/genai 1.29.0)
- **Language**: TypeScript 5.8.2

## Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn**

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd lumina-breath
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   APP_URL="http://localhost:3000"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run clean` | Remove dist directory |
| `npm run lint` | Run TypeScript type checking |

## Project Structure

```
lumina-breath/
├── src/
│   ├── App.tsx          # Main application component with breathing logic
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles & Tailwind config
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies & scripts
├── metadata.json        # AI Studio app metadata
├── .env.example         # Environment variable template
└── .gitignore          # Git ignore rules
```

## Key Components

### App Component (`src/App.tsx`)

The main application component handles:
- Breathing mode selection and state management
- Animation timing and phase progression
- Visual shape rendering (square, circle, triangle)
- User interaction (tap to start/stop)

**Core States:**
- `activeMode`: Currently selected breathing technique
- `isActive`: Whether a breathing session is active
- `currentPhaseIndex`: Current phase in the breathing cycle
- `progress`: Animation progress (0-1) within current phase

### ShapeRenderer

Renders the animated geometric shapes with:
- Static guide stroke (gray outline)
- Animated progress stroke that follows shape perimeter
- Dynamic scaling based on breathing phase (INHALE expands, EXHALE contracts)

## Design System

The app uses a Nike-inspired design system with custom Tailwind colors:

```css
--color-nike-black: #111111
--color-nike-white: #FFFFFF
--color-light-gray: #F5F5F5
--color-hover-gray: #E5E5E5
--color-text-secondary: #707072
```

**Fonts:**
- Display: Anton (Google Fonts)
- Body: Hanken Grotesk (Google Fonts)

## AI Studio Integration

This app is designed to run in Google AI Studio with:
- Automatic GEMINI_API_KEY injection from user secrets
- Cloud Run deployment support
- HMR (Hot Module Replacement) configurable via `DISABLE_HMR` env var

## Browser Compatibility

- Modern browsers with ES2022 support
- Tested on Chrome, Firefox, Safari, Edge
- Requires JavaScript enabled

## Future Enhancements

Potential features for future releases:
- Session duration tracking
- Custom breathing patterns
- Sound/haptic feedback
- Progress statistics and history
- Dark mode support
- Accessibility improvements (keyboard navigation)

## License

Apache-2.0

## Contributing

Contributions are welcome! Please ensure:
- TypeScript compilation passes (`npm run lint`)
- Code follows existing style conventions
- Test on both mobile and desktop viewports

---

Built with ❤️ using React, Vite, and Tailwind CSS
