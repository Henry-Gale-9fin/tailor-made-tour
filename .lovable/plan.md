

## Problem

Line 54: `<div className="h-screen overflow-hidden relative px-6">` — this clips the animated card at the viewport edge, creating a visible hard line as the card slides out.

## Fix

Remove `overflow-hidden` from the outer wrapper (line 54). Instead, apply `overflow-x: hidden` on the `<body>` or `<html>` element via CSS (`src/index.css`) to prevent horizontal scrollbars without creating a visible clip boundary right at the content edge.

### Changes

**1. `src/components/features/FeatureExploration.tsx` (line 54)**
- Change `className="h-screen overflow-hidden relative px-6"` → `className="h-screen relative px-6"`

**2. `src/index.css`**
- Add `overflow-x: hidden` to `html` or `body` so the 160px slide doesn't cause a horizontal scrollbar, but the clip happens at the actual screen edge (invisible) rather than at the content container edge (visible).

This way the card fades to opacity 0 while sliding, and any remaining visibility at the edges is clipped by the full-width viewport — not by a narrower padded container with `px-6` inset.

