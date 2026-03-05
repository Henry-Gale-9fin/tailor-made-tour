

## Problem

The slide animation fades out too quickly (opacity hits 0 before the card has moved far enough off-screen), creating a visible "hard line" where the card abruptly disappears. The 40px travel distance isn't enough room for the fade to look natural.

## Fix

Edit `src/components/features/FeatureExploration.tsx` — animation variants and transition only:

1. **Increase travel distance** from `40px` / `-40px` to `160px` / `-160px` so the card moves further before fully fading, giving the eye more time to perceive the swipe.

2. **Slow the duration** from `0.3s` to `0.42s` — enough for the fade to feel gradual rather than abrupt.

3. **Stagger opacity** using Framer Motion's `transition` per-property config so `x` and `opacity` don't finish at the same time:
   - `x`: `0.42s`, easeOut
   - `opacity`: `0.38s`, easeIn (slightly faster so it fades toward the end of the slide, not at the start)

4. **Add `overflow-hidden` to the page-level wrapper** (`h-screen` div) — it's already there, so no visible clip edge. This just ensures the extra travel distance doesn't cause a horizontal scrollbar.

### Updated variants:
```ts
enter: { x: 160, opacity: 0 }
center: { x: 0, opacity: 1 }
exit: { x: -160, opacity: 0 }
```

### Updated transition:
```ts
transition={{
  duration: 0.42,
  ease: [0.25, 0.46, 0.45, 0.94],
  opacity: { duration: 0.38, ease: "easeIn" }
}}
```

No other files or styling changes needed.

