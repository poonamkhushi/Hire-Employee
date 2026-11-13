---
name: Executive Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#47464f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#787680'
  outline-variant: '#c8c5d0'
  surface-tint: '#5b598c'
  primary: '#070235'
  on-primary: '#ffffff'
  primary-container: '#1e1b4b'
  on-primary-container: '#8683ba'
  inverse-primary: '#c4c1fb'
  secondary: '#4b41e1'
  on-secondary: '#ffffff'
  secondary-container: '#645efb'
  on-secondary-container: '#fffbff'
  tertiary: '#000f07'
  on-tertiary: '#ffffff'
  tertiary-container: '#002819'
  on-tertiary-container: '#179c6e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c4c1fb'
  on-primary-fixed: '#181445'
  on-primary-fixed-variant: '#444173'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1rem
  margin-md: 1.25rem
  margin-lg: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system establishes an authoritative, high-performance career companion for modern jobseekers and interview candidates. The aesthetic merges corporate clarity with high-velocity product design: calm, disciplined, and relentlessly focused on forward momentum. It counters the anxiety of the job hunt through deliberate visual stability, high-contrast information hierarchies, and structured, tactile feedback.

Targeted at ambitious technology professionals, product managers, and knowledge workers, the visual tone balances deep structural slate tones with focused, luminous indicators for interview stages and offer milestones. 

The aesthetic is Modern Corporate Minimalism elevated by Tactile Soft-Layering:
- Ultra-crisp typography anchored by high legibility across mobile viewports.
- Subdued, low-contrast structural surfaces punctuated by purposeful semantic badges (offers, interviews, rejections).
- Ergonomically clustered touch targets engineered specifically for one-handed thumb navigation on mobile devices.
- Reassurance through structured progress tracking: Kanban stages, structured drill-down cards, and rehearsal coaching metrics.

## Colors

The palette establishes an intellectual, highly grounded foundation accented by high-clarity status cues:

- **Primary (`#1E1B4B` - Deep Midnight Indigo):** Serves as the anchor for structural chrome, top navigation headers, primary titles, and high-emphasis button fills. It evokes stability, authority, and permanence.
- **Secondary (`#4F46E5` - Electric Indigo/Violet):** Directs active interactive states, selected tab indicators, interview coach audio visualizations, and interactive step progressions.
- **Tertiary (`#059669` - Emerald Success):** Reserved exclusively for positive momentum: stage advances, signed offers, high interview score metrics, and salary increases.
- **Neutral Accent (`#64748B` - Slate Core):** Governs secondary body labels, inactive borders, and structural framing.

### Functional Status Anchors
- **Active Stage / Interview Round (`#D97706`):** Deep amber for pending rounds, upcoming calendar invites, and coaching action items.
- **Card & Canvas Backgrounds:** Main background is tinted `#F8FAFC`, stepping up to crisp `#FFFFFF` for primary application cards, nested within delicate `#E2E8F0` hairline borders.

## Typography

The typography uses **Plus Jakarta Sans** across all hierarchies to combine geometric precision with humanist open counters, ensuring rapid scanning on compact screens.

### Hierarchy & Usage
- **Headlines (`headline-xl`, `headline-lg`):** Reserved for high-level screen anchors (e.g., "Active Applications", "Offer Comparison") and stage-level summary tallies.
- **Section Headers (`headline-md`, `headline-sm`):** Anchor individual card titles, company names, and interview round designations.
- **Body (`body-lg`, `body-md`, `body-sm`):** Deliver job role descriptions, interview feedback notes, and contextual requirements.
- **Labels & Badges (`label-lg`, `label-md`, `label-sm`):** Paired with high-weight numeric readouts, pay bands (`$185,000 / yr`), stage chips, and timestamp flags. Always styled with clean tracking to preserve micro-legibility.

## Layout & Spacing

The layout model is built on an ergonomic 4-column mobile fluid grid that shifts to an 8-column layout on larger devices and tablets. Layout distance tokens strictly manage the visual cadence:

- **Horizontal Margins:** Set to `margin` (`1rem` / 16px) on compact mobile viewports to maximize data density, expanding to `margin-lg` (`1.5rem` / 24px) on tablets.
- **Grid Gutters:** Default to `gutter` (`1rem`) between side-by-side metric cards or segmented tracker columns.
- **Vertical Spacing:** Modules group related metadata using `space-xs` (4px) and `space-sm` (8px), while distinct application cards and coaching insights separate via `space-lg` (16px) and `space-xl` (24px).
- **Thumb Zone Ergonomics:** Critical controls (Quick Apply, Log Interview, Record Coach Response) reside exclusively in the bottom 40% of the viewport with a minimum tap target height of 48px.

## Elevation & Depth

Visual hierarchy uses low-contrast outlines combined with shallow, highly diffuse ambient shadows. This prevents heavy, cluttered stacks while keeping the interface feeling tangible:

- **Level 0 (Canvas Base):** Flat `#F8FAFC` base surface with no shadow or border.
- **Level 1 (Default Cards & Tracker Columns):** Solid `#FFFFFF` surface enclosed by a 1px border of `#E2E8F0`. Shadow is faint and diffuse: `0px 1px 3px rgba(15, 23, 42, 0.04)`.
- **Level 2 (Active Cards & Interview Drills):** Raised state on drag or active selection. Enclosed by `#CBD5E1` with a soft elevated shadow: `0px 8px 16px -4px rgba(30, 27, 75, 0.08)`.
- **Level 3 (Modals, Coach Drawers & Sticky Nav):** Full white background `#FFFFFF`, bordered on relevant edges with `#E2E8F0`, elevated via `0px 16px 24px -6px rgba(15, 23, 42, 0.12)`.

## Shapes

The design system employs a disciplined, balanced curvature model (Level 2 - Rounded):
- **Base Components (Inputs, Buttons, Cards):** Utilize `0.5rem` (8px) corner radii for a tailored, professional appearance.
- **Larger Modular Containers:** Surface cards and interview coaching panels scale to `rounded-lg` (`1rem` / 16px) to gracefully contain interior content.
- **Full-Pill Exceptions:** High-visibility stage status badges, compensation chips, and bottom navigational tab pills deliberately use `9999px` full pill shapes to stand out against structural cards.

## Components

### Buttons
- **Primary Action:** Solid `#1E1B4B` fill, `#FFFFFF` text (`label-lg`), 48px height, `0.5rem` radius. Interactive state transitions to `#312E81`.
- **Secondary / Action Accent:** `#4F46E5` fill with white text, or light variant using `rgba(79, 70, 229, 0.08)` surface with `#4F46E5` text.
- **Tertiary / Outline:** `#FFFFFF` fill, 1px `#E2E8F0` border, `#1E1B4B` text. Active press applies `#F1F5F9`.

### Chips & Badges
- **Pay Pill Tags:** Light gray background (`#F1F5F9`), bordered by `#E2E8F0`, typography `label-sm` in `#1E1B4B`.
- **Status Badges:** Fully rounded pill shapes (`9999px`) with muted contextual fills and vibrant text:
  - *Offer Stage:* Surface `#ECFDF5`, text `#059669`.
  - *Interview Round:* Surface `#FFFBEB`, text `#D97706`.
  - *Application Submitted:* Surface `#EEF2FF`, text `#4F46E5`.
  - *Archived / Rejected:* Surface `#F1F5F9`, text `#64748B`.

### Segmented Column Trackers
- Horizontal scroll container with column headers indicating total stage counts.
- Active stage column features an electric violet top accent rail (2px `#4F46E5`), with muted columns remaining neutral `#E2E8F0`.

### Cards (Application & Coach)
- Pure `#FFFFFF` background, 1px `#E2E8F0` border, `rounded-lg` corner radius.
- Padding: `space-lg` (16px).
- Internal layout cleanly splits header (Company & Role), middle row (Pay pill + location tag), and bottom footer (Current Stage chip + next event timestamp).

### Input Fields & Controls
- **Inputs:** 48px height, `#FFFFFF` background, 1px `#CBD5E1` border, 8px radius. Active focus shifts border to 2px `#4F46E5` with zero offset shadow.
- **Checkboxes & Radios:** 20px dimension, 4px radius for checkboxes, full circle for radios. Selected state uses `#4F46E5` with crisp white checkmark or center pip.

### Interview Coach Modules
- Audio feedback containers feature high-contrast playback wave bars using `#4F46E5` over `#EEF2FF`.
- Real-time confidence score dials feature a circular progress track using `#059669` over `#E2E8F0`.