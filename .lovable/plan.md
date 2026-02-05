

## Product Personalisation Prototype

A guided, premium onboarding experience that personalises feature recommendations based on user profile.

---

### Step 1: Firm Type Selection

**Screen:** Full-screen dark themed layout with horizontal chip/card selector

**Content:**
- Header: "What type of firm do you work for?"
- Step indicator: "Step 1 of 3"
- Selection chips arranged in horizontal rows with icons and labels:
  - Markets, Banks, Buyside, Law firms, Advisors

**Behavior:**
- Clicking a chip stores `firm_type` in local storage
- Auto-advances to Step 2

---

### Step 2: Seniority Selection

**Screen:** Same layout as Step 1

**Content:**
- Header: "What seniority are you?"
- Step indicator: "Step 2 of 3"
- Dynamic chip options based on firm type:
  - **Markets/Banks**: Analyst, Associate, Vice President, Director, Managing Director
  - **Buyside**: Analyst, Associate, Vice President/Principal, Director, Partner/Portfolio Manager
  - **Law firms**: Trainee/Junior Associate, Associate, Senior Associate, Counsel, Partner
  - **Advisors**: Analyst, Associate, Vice President, Director, Partner

**Behavior:**
- Stores `seniority` in local storage
- Auto-advances to Step 3

---

### Step 3: Usage/Intent Selection

**Screen:** Same layout

**Content:**
- Header: "How often do you use the platform?"
- Step indicator: "Step 3 of 3"
- Chips: Daily, Weekly, Monthly, Yearly, Never

**Behavior:**
- Stores `usage` in local storage
- Auto-advances to Feature Exploration

---

### Shared Onboarding UI Elements

- **Bottom-left panel:** Shows current selections (Firm, Seniority, Usage) with ability to clear individual selections or "Clear all"
- **Step dots:** Visual indicator of progress (3 dots)
- **Back button:** Navigate to previous step
- **Dark theme:** Deep navy/blue background matching reference screenshots

---

### Step 4: Feature Exploration (Carousel)

**Screen:** "Explore Features" review experience

**Content:**
- Header: "Explore Features"
- Subheader: "Tell us which features you use, have seen, or unknown"
- 5 personalised features displayed one at a time in a card format:
  - Feature title
  - Short description
  - Static placeholder image/visual
  - Value proposition text

**Feature Selection Logic:**
- Static mapping of firm types to relevant features
- Exactly 5 features shown per firm type

**Interaction:**
- Three action buttons per feature: "Used", "Seen", "Unknown"
- Clicking any button records the response and advances to next feature
- Progress indicator: "X of 5" + "X features reviewed"
- Colored dot carousel indicators at bottom

---

### Step 5: Feature Detail Modal

**When:** User clicks "Explore" on any feature card (if applicable)

**Content:**
- Large hero image at top
- Feature name and detailed description
- Primary CTA button

---

### Data Structure (Static/Local)

**Feature Catalog:** ~15-20 features with names, descriptions, images, and value props

**Firm Type Mapping:** Each firm type maps to 5 specific features

**Local Storage Keys:**
- `firm_type`
- `seniority`
- `usage`
- `feature_feedback` (object with feature responses)

---

### Design System

- **Theme:** Dark mode with deep navy (#0f172a style) background
- **Accent:** Blue glow effects, blue selection states
- **Cards:** Subtle borders, rounded corners, glass-morphism hints
- **Typography:** Clean, modern, high contrast white text
- **Interactions:** Smooth transitions between steps, hover states on chips

