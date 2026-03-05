

## Plan: Fix Animated Background by Applying to `body` Instead of `#root`

### Root Cause
The current CSS applies the animated background to `.dark #root` using pseudo-elements. This doesn't work because `#root` has `overflow: hidden` which clips the pseudo-elements positioned with `inset: -25%`, and the `.dark` class dependency adds complexity. The user's working version applies everything directly to `body` using CSS custom properties and `position: fixed` pseudo-elements — a simpler, proven approach.

### Changes

**`src/index.css`** — Replace the current `@layer base` block and keyframes with the user's working version:
- Add aurora CSS custom properties (`--bg-base`, `--bg-mid`, `--blob-1`, `--blob-2`, `--blob-3`) to both `:root` and `.dark`
- Move animated background from `.dark #root` / `.dark #root::before/after` to `body` / `body::before` / `body::after`
- Use `position: fixed` and `z-index: -1` on pseudo-elements (works with scrolling, no overflow clipping)
- Remove all `.dark #root` related background rules
- Update `@media (prefers-reduced-motion)` to target `body` pseudo-elements

**`src/pages/Index.tsx`** — Keep the existing `useEffect` that adds `dark` class to `<html>` (still needed for dark mode CSS variables).

