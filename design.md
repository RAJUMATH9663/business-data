# LeadSetu — Design System & UI/UX Guidelines

## 1. Design Philosophy
LeadSetu follows a modern, high-contrast, data-centric interface designed for maximum legibility and speed. It delivers an intuitive, conversion-optimized flow whether viewed on a mobile device or desktop browser.

---

## 2. Color System & Semantic Variables

LeadSetu uses CSS Custom Properties to ensure flawless contrast across both light mode and dark mode, preventing dark-mode flattening and browser-forced color inversions.

```css
:root {
  color-scheme: light dark;
  --bg-page: #F8FAFC;        /* Slate-50 background */
  --bg-card: #FFFFFF;        /* Pure white elevated cards */
  --bg-input: #FFFFFF;       /* Input container background */
  --bg-mist: #F1F5F9;        /* Soft slate container */
  --bg-brand-light: #EFF6FF; /* Pale brand accent */
  --border-card: #CBD5E1;    /* Slate-300 crisp card border */
  --border-input: #94A3B8;   /* Slate-400 input border */
  --text-main: #0F172A;      /* Slate-900 primary text */
  --text-muted: #64748B;     /* Slate-500 secondary text */
  --header-bg: rgba(255, 255, 255, 0.9);
  --header-border: #E2E8F0;
  --tile-bg: #FFFFFF;
  --tile-hover: #F8FAFC;
}

[data-theme="dark"],
@media (prefers-color-scheme: dark) {
  --bg-page: #0A0F1D;        /* Deep obsidian/navy page background */
  --bg-card: #151F32;        /* Elevated dark navy card surface */
  --bg-input: #0D1526;       /* Recessed dark input background */
  --bg-mist: #1E293B;        /* Slate-800 container */
  --bg-brand-light: rgba(37, 99, 235, 0.22);
  --border-card: #334766;    /* High-contrast slate card border */
  --border-input: #4B6382;   /* High-contrast input border */
  --text-main: #FFFFFF;      /* High-legibility crisp white text */
  --text-muted: #94A3B8;     /* Slate-400 muted text */
  --header-bg: rgba(10, 15, 29, 0.94);
  --header-border: #28374E;
  --tile-bg: #151F32;
  --tile-hover: #1E2D48;
}
```

---

## 3. Typography Hierarchy
- **Font Stack**: System sans-serif (`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", sans-serif`).
- **Headings**:
  - `h1`: 2.5rem – 3.75rem (`text-4xl` to `text-6xl`), `font-extrabold`, letter-spacing `-0.02em`.
  - `h2`: 1.5rem – 2rem (`text-2xl` to `text-3xl`), `font-bold`.
  - `h3`: 1.125rem – 1.25rem (`text-lg` to `text-xl`), `font-bold`.
- **Body & Captions**:
  - Regular Text: 0.875rem – 1rem (`text-sm` to `text-base`), `font-normal` or `font-medium`.
  - Labels & Badges: 0.75rem (`text-xs`), `font-semibold` / `font-bold`, uppercase with `0.05em` tracking.

---

## 4. Component Standards

### 4.1 Cards (`.card`)
- **Border**: `1.5px solid var(--border-card) !important`
- **Radius**: `1rem` (`rounded-2xl`)
- **Shadow**: `0 4px 20px -2px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)` (subtle ambient ring for dark mode definition).

### 4.2 Buttons (`.btn`, `.btn-primary`, `.btn-ghost`)
- **Primary Button (`.btn-primary`)**:
  - Background: `#2563EB !important` (Electric Blue)
  - Color: `#FFFFFF !important`
  - Border: `1px solid #3B82F6 !important`
  - Shadow: `0 4px 14px 0 rgba(37, 99, 235, 0.4)`
  - Attribute: `forced-color-adjust: none !important;` (Prevents browser accessibility inverters from stripping color).
- **Ghost/Secondary Button (`.btn-ghost`)**:
  - Background: `var(--tile-bg)`
  - Border: `1.5px solid var(--border-card)`
  - Color: `var(--text-main)`

### 4.3 Form Inputs (`.input`)
- Height: `42px` min height.
- Border: `1.5px solid var(--border-input) !important`.
- Focus State: Bright electric blue ring (`#3B82F6`) with `0 0 0 4px rgba(59, 130, 246, 0.25)`.

### 4.4 Selection Tiles (`.tile`)
- Interactive cards for selecting districts and categories.
- Hover Effect: `-2px translateY` with `border-color: #3B82F6` and background elevation.

---

## 5. Responsive Design Breakpoints
- **Mobile (<640px)**: Single column layouts, fixed bottom navigation bar, full-width touch targets.
- **Tablet (640px – 1024px)**: 2-column grids for districts, categories, and contact cards.
- **Desktop (>1024px)**: 3-column / 4-column responsive grid with sticky header navigation.
