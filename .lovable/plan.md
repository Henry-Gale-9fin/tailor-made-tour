## Plan: Add directional Framer Motion transitions

### Install

- Add `framer-motion` package

### Changes

`**src/pages/Index.tsx**` — Directional step transitions

- Track navigation direction with a `direction` state (`1` = forward, `-1` = back)
- Set direction before each `setScreen` call (forward for select handlers, back for back handlers)
- Use `useReducedMotion()` from framer-motion to conditionally disable animations
- Wrap all screen content (except `SelectionSummary`) in `<AnimatePresence mode="wait" custom={direction}>`
- Each screen wrapped in a `motion.div` keyed by `screen` with variants:
  - **Enter:** `translateX(direction * 40px), opacity: 0, scale: 0.98` → `translateX(0), opacity: 1, scale: 1` — 300ms ease-out
  - **Exit:** `translateX(direction * -40px), opacity: 0, scale: 0.98` — 200ms ease-in
- If `reducedMotion`, all values set to static (no translate/scale, instant opacity)

`**src/components/features/FeatureExploration.tsx**` — Feature card transitions

- Wrap the `FeatureCard` + feedback buttons area in `<AnimatePresence mode="wait">`
- Key by `currentIndex`
- Horizontal slide + crossfade: entering slides from right (`x: 30, opacity: 0` → `0, 1`), exiting slides left (`x: -30, opacity: 0`) — 250ms
- Back/progress UI stays outside the animated wrapper (already fixed-positioned)
- Respect `useReducedMotion`

### What stays untouched

- All state/routing logic unchanged
- Back button, step indicator, selection summary — not animated
- Glass panel outer dimensions stay fixed (animation is inside it)  
  
Animate only the inner content container, not the full page wrapper, so the background and fixed UI remain stable.