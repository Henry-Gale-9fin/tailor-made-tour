
# Report Page Redesign

## Layout Changes

The report page will be restructured into a new layout with these sections stacked vertically:

1. **Title + Subtitle** -- centered at top (unchanged)
2. **Score + Platform Maturity** -- side by side in a 1/3 + 2/3 grid
3. **Strengths + Blind Spots** -- side by side in a 50/50 grid
4. **Top 3 Recommendations** -- full width card
5. **CTA** -- closing section

## Detailed Changes

### 1. Data Model Update (`src/data/mockReport.ts`)

- Add a numeric `score` field (0-100) to the `ReportData` interface and `generateReport` function, calculated from used/seen counts and frequency
- Expand maturity summaries to be longer, more supportive, concise, and opinionated in tone -- each will be 3-4 sentences instead of 1-2

### 2. Report Page Layout (`src/components/report/ReportPage.tsx`)

- **Score + Maturity row**: A single Card with a `grid-cols-[1fr_2fr]` layout
  - Left third: Large score number displayed prominently (e.g. "72" with "/100" smaller beneath), color-coded by maturity level
  - Right two-thirds: Platform Maturity content -- label badge, expanded summary text, and peer comparison
- **Strengths + Blind Spots row**: Two Cards side by side in a `grid-cols-2` layout, each taking 50% width
- **Recommendations**: Full-width card below, unchanged in structure
- Widen the container from `max-w-3xl` to `max-w-5xl` to accommodate the side-by-side layouts

### 3. Background Gradient (`src/index.css`)

- Change the `.dark body` background from `linear-gradient(to top, ...)` to a stronger radial gradient
- Use more contrast between the bright center and dark edges to create a more dramatic glow effect

## Technical Details

### Score Calculation (mockReport.ts)
```
score = Math.min(100, Math.round(
  (usedCount / totalFeatures) * 50 +
  (seenCount / totalFeatures) * 20 +
  frequencyBonus * 6
))
```

### Gradient (index.css)
```css
.dark body {
  background: radial-gradient(
    ellipse at 50% 100%,
    hsl(217 60% 22%) 0%,
    hsl(222 42% 12%) 40%,
    hsl(222 45% 6%) 100%
  );
}
```

### Maturity Summary Tone
Each level's summary will be rewritten to be longer and more opinionated. For example, "Proficient" might read: "You've built a strong foundation and clearly know your way around the core tools. That said, you're leaving meaningful value on the table by not engaging with some of the platform's more powerful capabilities. The features you haven't explored yet are specifically designed for professionals at your level -- adopting even one could noticeably sharpen your edge."

### Files Modified
- `src/data/mockReport.ts` -- add `score` field, expand summaries
- `src/components/report/ReportPage.tsx` -- new grid layout
- `src/index.css` -- stronger radial gradient
