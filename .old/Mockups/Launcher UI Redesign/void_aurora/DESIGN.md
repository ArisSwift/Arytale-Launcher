---
name: Void & Aurora
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2eb'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e1e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#849495'
  outline-variant: '#3a494b'
  surface-tint: '#00dbe7'
  primary: '#e1fdff'
  on-primary: '#00363a'
  primary-container: '#00f2ff'
  on-primary-container: '#006a71'
  inverse-primary: '#00696f'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#e4ffe2'
  on-tertiary: '#003915'
  tertiary-container: '#63f789'
  on-tertiary-container: '#006f30'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#74f5ff'
  primary-fixed-dim: '#00dbe7'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#10131a'
  on-background: '#e1e2eb'
  surface-variant: '#32353c'
  void-bg: '#10131a'
  glass-surface: rgba(29, 32, 38, 0.6)
  aurora-glow: hsla(185, 100%, 10%, 1)
  nebula-glow: hsla(280, 100%, 5%, 1)
typography:
  display-hero:
    fontFamily: Lexend
    fontSize: 20vw
    fontWeight: '900'
    lineHeight: '1'
    letterSpacing: -0.05em
  headline-lg:
    fontFamily: Lexend
    fontSize: 72px
    fontWeight: '900'
    lineHeight: '1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.5'
  technical-label:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.2em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding: 40px
  element-gap: 16px
  section-margin: 32px
  sidebar-width: 280px
  play-bar-height: 120px
---

## Brand & Style
The brand identity, "Arytale," evokes a sense of futuristic mysticism where high-technology meets ethereal cosmic phenomena. It is designed for a tech-savvy gaming audience that appreciates high-performance tools with a "developer-chic" aesthetic.

The visual style is a sophisticated **Glassmorphism** mixed with **Cyberpunk Minimalism**. It relies on deep, atmospheric backgrounds, vibrant cyan accents (the Aurora), and translucent UI layers that create a sense of depth without overwhelming the user. The interface should feel "lightweight" despite its dark theme, utilizing high-end typography and subtle motion to convey a premium, responsive experience.

## Colors
The palette is centered on "The Void" (deep charcoal and black neutrals) contrasted against "The Aurora" (electric cyan). 

- **Primary (#00f2ff):** Used for core actions, branding, and active states. It should always appear to "glow" against the dark background.
- **Secondary (#a855f7):** An accent for experimental or "beta" features, providing a warm-cool contrast to the primary cyan.
- **Tertiary (#4ae176):** Strictly for success states, online indicators, and system health.
- **Backgrounds:** Utilize a 4-point radial gradient using the `aurora-glow` and `nebula-glow` colors at the corners to prevent the dark theme from feeling flat.

## Typography
The typographic system uses a hierarchy of three distinct typefaces to separate branding, content, and data.

- **Lexend** is the primary display face. It should be used in all-caps for high-level branding and section headers to maintain an athletic, modern feel.
- **Inter** handles all standard UI text and body copy, chosen for its extreme legibility in dark mode interfaces.
- **JetBrains Mono** is the "Technical Label" font. Use this for status indicators, version numbers, and metadata to reinforce the launcher's technical utility.

## Layout & Spacing
The layout follows a **Safe Zone** model rather than a strict column grid. Content is anchored to the corners of the screen, leaving the center open for large-scale branding or environmental art.

- **Desktop:** Uses a fixed 40px outer margin. Key interactive panels are floating "Glass" cards anchored to the corners.
- **Mobile:** Elements reflow into a single-column stack. Hero typography scales down significantly, and the "Launch" button becomes a fixed-bottom persistent element.
- **Rhythm:** Use an 8px base grid for internal component padding, with 16px (element-gap) used between related items.

## Elevation & Depth
Depth is created through **Layered Glassmorphism** rather than traditional shadows.

1.  **Level 0 (Background):** Subtle radial gradients with moving "Aurora" light.
2.  **Level 1 (Sub-surface):** Large, low-opacity "ghost" typography at 5% opacity.
3.  **Level 2 (Glass Panels):** `backdrop-blur(24px)` with a 60% opaque surface color and a 5% white border.
4.  **Level 3 (Interactive):** Elements that are active or hovered gain a primary-colored glow (`box-shadow: 0 0 20px rgba(0, 242, 255, 0.3)`).

## Shapes
The shape language is "Hyper-Rounded," emphasizing a friendly, futuristic feel that offsets the coldness of the dark theme.

- **Standard Cards:** 1rem (rounded-lg) to 1.5rem (rounded-xl) for large containers.
- **Modals:** 2rem for a distinct "windowed" look.
- **Buttons:** 0.75rem to 1rem. The primary "Launch" button uses a 1rem radius to feel substantial.
- **Status Pills:** Fully rounded (Pill-shaped) for tag-like elements.

## Components
- **Buttons:**
    - *Primary (Launch):* Large, high-contrast (Cyan background, Dark text), with a persistent "soft pulse" animation.
    - *Secondary (Ghost):* Transparent background with white/5% borders and white/10% hover states.
- **Cards:**
    - Must use `.glass-panel` styling: blur, thin border, and subtle shadow.
    - News cards feature an image top-section with a 500ms scale-up transition on hover.
- **Inputs & Selects:**
    - Use `bg-white/5` with `border-white/10`. On focus, transition border to `primary` with a 1px ring.
- **Switches:**
    - Custom track-and-thumb style. Active state uses `primary/20` for the track and `primary` for the thumb to simulate a glowing light.
- **Status Indicators:**
    - Small 6px-8px circles. Use `animate-pulse` for live updates and `tertiary` for online status.