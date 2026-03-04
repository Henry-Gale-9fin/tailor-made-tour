

## Plan: Apply Animated Background & Fix Feature Reset Bug

### Problem 1: Animated background not showing
The CSS targets `.dark #root` but the `dark` class is placed on a `<div>` **inside** `#root` (line 107 of Index.tsx). The CSS pseudo-elements (`::before`, `::after`) never activate because `.dark` is not an ancestor of `#root` — it's a child.

**Fix:** Add `dark` class to the `<html>` element on mount (via a `useEffect` in App.tsx or Index.tsx), and remove the `dark` class from the wrapper div in Index.tsx.

### Problem 2: Feature counter not resetting
The `reviewedCount` in `FeatureExploration` counts feedback entries that match current features. When `clearUsage()` is called to go back, `featureFeedback` is **not** cleared — only `usage` is set to null. So when the user re-enters the feature step, old feedback persists.

**Fix:** Clear `featureFeedback` whenever `clearUsage` is called (since changing usage re-enters the feature flow). Also clear it in `clearFirmType` and `clearSeniority` since those affect which features are shown.

### Changes

1. **`src/pages/Index.tsx`**
   - Remove `dark` from the wrapper div's className
   - Add `useEffect` to set `document.documentElement.classList.add('dark')` on mount

2. **`src/hooks/useOnboardingState.ts`**
   - In `clearUsage`, also reset `featureFeedback: {}`
   - In `clearFirmType`, also reset `featureFeedback: {}`
   - In `clearSeniority`, also reset `featureFeedback: {}`

