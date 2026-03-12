# MobilePro — Extension Developer Guide

> **Version:** 1.0.0  
> **Based on:** prosilver (phpBB 3.3+)  
> **CSS Framework:** Tailwind CSS 3.4  
> **Icon Font:** Material Symbols Outlined  
> **Typography:** Plus Jakarta Sans

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Architecture Overview](#2-architecture-overview)
3. [Design System](#3-design-system)
   - 3.1 [Color Palette](#31-color-palette)
   - 3.2 [Typography](#32-typography)
   - 3.3 [Spacing & Layout](#33-spacing--layout)
   - 3.4 [Dark Mode](#34-dark-mode)
   - 3.5 [Icons](#35-icons)
4. [Component Reference](#4-component-reference)
   - 4.1 [Cards](#41-cards)
   - 4.2 [Buttons](#42-buttons)
   - 4.3 [Form Inputs](#43-form-inputs)
   - 4.4 [Badges & Labels](#44-badges--labels)
   - 4.5 [Alerts & Notices](#45-alerts--notices)
   - 4.6 [Pagination](#46-pagination)
   - 4.7 [Navigation Elements](#47-navigation-elements)
5. [Page Layout Patterns](#5-page-layout-patterns)
   - 5.1 [Overall Page Structure](#51-overall-page-structure)
   - 5.2 [Sticky Header](#52-sticky-header)
   - 5.3 [Fixed Bottom Navigation](#53-fixed-bottom-navigation)
   - 5.4 [Side Drawer Navigation](#54-side-drawer-navigation)
   - 5.5 [Content Area](#55-content-area)
6. [Template Integration](#6-template-integration)
   - 6.1 [File Structure](#61-file-structure)
   - 6.2 [Template Events](#62-template-events)
   - 6.3 [Creating Extension Templates](#63-creating-extension-templates)
7. [Tailwind CSS Build Process](#7-tailwind-css-build-process)
8. [Best Practices](#8-best-practices)
9. [Checklist for Extension Authors](#9-checklist-for-extension-authors)

---

## 1. Introduction

**MobilePro** is a mobile-first phpBB style built entirely with Tailwind CSS. Unlike traditional phpBB themes that attempt to be responsive, MobilePro is designed from the ground up for touch devices (320px–480px primary viewport) and scales upward to tablets and desktops.

If you develop phpBB extensions, this guide will help you produce templates that blend seamlessly into MobilePro's design language — matching its card-based layouts, dark mode support, and touch-optimized interactions.

### Key Differences from prosilver

| Feature | prosilver | MobilePro |
|---|---|---|
| CSS Framework | Custom CSS + responsive patches | Tailwind CSS 3.4 |
| Layout Model | Float/table-based | Flexbox + CSS Grid |
| Color System | Hardcoded hex values | CSS custom properties + Tailwind tokens |
| Dark Mode | None | Full dark mode via `class` strategy |
| Navigation | Top navbar | Sticky header + fixed bottom bar + side drawer |
| Icon System | Font Awesome / sprites | Material Symbols Outlined |
| Typography | Verdana / system fonts | Plus Jakarta Sans (Google Fonts) |
| Component Style | Flat panels with borders | Rounded cards with subtle shadows |
| Bottom Padding | None | `pb-24` to accommodate fixed footer nav |

---

## 2. Architecture Overview

```
MobilePro/
├── style.cfg                  # Style metadata (name, version, parent)
├── package.json               # npm / Tailwind dependencies
├── tailwind.config.js         # Tailwind configuration & design tokens
├── contrib/
│   ├── custom_event.MD        # Custom event documentation (this file's companion)
│   └── developer_guide.MD     # ← You are here
├── template/
│   ├── overall_header.html    # <head>, sticky header, drawer include
│   ├── overall_footer.html    # Footer, cookie consent, bottom nav include
│   ├── navbar_footer.html     # Fixed bottom navigation bar
│   ├── navbar_mobile.html     # Slide-out side drawer
│   ├── navbar_header.html     # (Empty — replaced by overall_header.html)
│   ├── index_body.html        # Board index with statistics cards
│   ├── forumlist_body.html    # Forum/category listing
│   ├── viewforum_body.html    # Topic listing in a forum
│   ├── viewtopic_body.html    # Topic view with posts
│   ├── login_body.html        # Login page
│   ├── pagination.html        # Pagination component
│   ├── quickreply_editor.html # Quick reply form
│   └── ...                    # All other templates
└── theme/
    ├── stylesheet.css         # CSS custom properties & phpBB overrides
    ├── tailwind.css           # Compiled Tailwind output (DO NOT EDIT)
    ├── tailwind-input.css     # Tailwind directives (@tailwind base/components/utilities)
    ├── fonts.css              # @font-face rules for Plus Jakarta Sans
    └── fonts/                 # .woff2 font files
```

### Parent Style

MobilePro inherits from **prosilver**. This means any template not explicitly overridden in `template/` will fall back to prosilver's version. Extension developers can target MobilePro specifically by placing templates under:

```
styles/MobilePro/template/event/
```

---

## 3. Design System

### 3.1 Color Palette

Colors are defined in two layers: a CSS custom property for the brand color and Tailwind's slate palette for neutrals.

**CSS Custom Property** (defined in `theme/stylesheet.css`):

```css
:root {
    --color-primary: #6366f1;  /* Indigo-500 */
}
```

**Tailwind config** (`tailwind.config.js`):

```js
colors: {
    primary: 'var(--color-primary)',        // Resolves to #6366f1
    'background-light': '#f1f5f9',          // slate-100
    'background-dark': '#0f172a',           // slate-900
}
```

**Color Usage Reference:**

| Purpose | Light Mode | Dark Mode |
|---|---|---|
| Page background | `bg-background-light` | `dark:bg-background-dark` |
| Card / panel | `bg-white` | `dark:bg-slate-800` |
| Card border | `border-slate-200` or `border-transparent` | `dark:border-slate-700` |
| Primary actions | `bg-primary` | `bg-primary` (same) |
| Heading text | `text-slate-900` / `text-slate-800` | `dark:text-white` / `dark:text-slate-200` |
| Body text | `text-slate-600` | `dark:text-slate-400` |
| Muted text | `text-slate-500` / `text-slate-400` | `dark:text-slate-500` |
| Link text | `text-primary` | `text-primary` |

### 3.2 Typography

MobilePro uses **Plus Jakarta Sans** as its display font and system sans-serif as fallback.

```js
// tailwind.config.js
fontFamily: {
    display: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
}
```

**Typography Scale:**

| Element | Classes |
|---|---|
| Page title (h1) | `text-2xl sm:text-3xl font-bold tracking-tight` |
| Section heading | `text-base font-bold` or `text-sm font-bold uppercase tracking-wider` |
| Body text | `text-sm` (14px) |
| Caption / meta | `text-xs` (12px) |
| Legend / footer text | `text-xs italic opacity-80` |
| Bold emphasis | `font-bold` or `font-medium` |

### 3.3 Spacing & Layout

MobilePro uses consistent spacing tokens:

| Token | Value | Typical Use |
|---|---|---|
| `px-4` | 16px | Horizontal page padding |
| `p-4` | 16px | Card internal padding |
| `gap-4` | 16px | Grid/flex gap between cards |
| `gap-2` | 8px | Inline element spacing |
| `mt-4` / `mt-6` | 16px / 24px | Section vertical spacing |
| `mb-2` / `mb-3` / `mb-4` | 8px / 12px / 16px | Element bottom margins |
| `pb-24` | 96px | Bottom padding to clear fixed nav |

**Grid System:**

```html
<!-- Responsive grid for statistics/cards -->
<div class="px-4 mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- cards here -->
</div>
```

### 3.4 Dark Mode

MobilePro uses Tailwind's `class` strategy for dark mode (toggled via JavaScript in `navbar_mobile.html`). Every visual element **must** include `dark:` variants.

```js
// tailwind.config.js
darkMode: 'class',
```

**Pattern:** Always pair light and dark classes together:

```html
<!-- ✅ Correct -->
<div class="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700">

<!-- ❌ Wrong — missing dark variants -->
<div class="bg-white text-slate-900 border-slate-200">
```

### 3.5 Icons

MobilePro loads **Material Symbols Outlined** via the `overall_header.html`. Use them as inline elements:

```html
<span class="material-symbols-outlined text-[18px] text-primary">forum</span>
```

**Common size tokens:**

| Size Class | Pixels | Use Case |
|---|---|---|
| `text-[16px]` | 16px | Small inline icons (pagination, badges) |
| `text-[18px]` | 18px | Standard inline icons (buttons, labels) |
| `text-[22px]` | 22px | Header action icons |
| `text-[24px]` | 24px | Stat block icons, alerts |
| `text-lg` | 18px | Card header icons |

---

## 4. Component Reference

### 4.1 Cards

The card is the foundational UI component. Almost everything — forum entries, statistics blocks, forms, alerts — lives inside a card.

**Standard Card:**

```html
<div class="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800 border border-transparent dark:border-slate-700">
    <!-- Content -->
</div>
```

**Card with External Padding** (for page-level cards):

```html
<div class="px-4 mt-4">
    <div class="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800 border border-transparent dark:border-slate-700">
        <!-- Content -->
    </div>
</div>
```

**Card with Border** (explicit light border):

```html
<div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <!-- Content -->
</div>
```

**Card Header Pattern** (icon + heading):

```html
<div class="flex items-center gap-2 mb-3">
    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
        <span class="material-symbols-outlined text-lg">public</span>
    </div>
    <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">Section Title</h3>
</div>
```

**Card Header Icon Color Variants:**

| Context | Background | Icon Color |
|---|---|---|
| Online / Active | `bg-green-100` / `dark:bg-green-900/30` | `text-green-600` / `dark:text-green-400` |
| Birthdays | `bg-pink-100` / `dark:bg-pink-900/30` | `text-pink-600` / `dark:text-pink-400` |
| Statistics | `bg-blue-100` / `dark:bg-blue-900/30` | `text-blue-600` / `dark:text-blue-400` |
| Warnings / Rules | `bg-red-100` / `dark:bg-red-900/30` | `text-red-600` / `dark:text-red-400` |
| Primary actions | `bg-primary/10` | `text-primary` |

### 4.2 Buttons

**Primary Button (filled):**

```html
<button class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-transform active:scale-95 dark:focus:ring-offset-slate-800 cursor-pointer">
    <span class="material-symbols-outlined text-[18px]">send</span>
    Submit
</button>
```

**Secondary Button (outlined):**

```html
<button class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-800 cursor-pointer">
    <span class="material-symbols-outlined text-[18px]">open_in_full</span>
    Full Editor
</button>
```

**Small Pill Button (action):**

```html
<a href="#" class="flex items-center gap-1 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors">
    <span class="material-symbols-outlined text-[16px]">done_all</span>
    Mark Read
</a>
```

**Icon-Only Button (header actions):**

```html
<a href="#" class="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
    <span class="material-symbols-outlined text-[22px]">search</span>
</a>
```

### 4.3 Form Inputs

**Text Input:**

```html
<input type="text" class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-900/50 dark:text-white transition-colors" />
```

**Textarea:**

```html
<textarea class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-900/50 dark:text-white min-h-[120px] resize-y transition-colors"></textarea>
```

**Label:**

```html
<label class="text-xs font-bold uppercase tracking-wider text-slate-500">Field Label:</label>
```

**Checkbox / Radio (inline):**

```html
<label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
    <input type="checkbox" class="rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700" />
    Remember me
</label>
```

### 4.4 Badges & Labels

**Notification Badge:**

```html
<span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">3</span>
```

**Topic Status Badges:**

```html
<!-- Locked -->
<span class="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400">
    <span class="material-symbols-outlined text-[14px]">lock</span>
    Locked
</span>
```

### 4.5 Alerts & Notices

**Warning / Rules Alert:**

```html
<div class="mx-4 mb-6 flex items-start gap-4 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-900/40 dark:bg-red-900/10">
    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
        <span class="material-symbols-outlined text-[24px]">gavel</span>
    </div>
    <div class="flex-1 text-sm text-red-800 dark:text-red-200">
        <strong class="block mb-1 text-red-900 dark:text-red-100">Forum Rules</strong>
        <div>Rule content here.</div>
    </div>
</div>
```

### 4.6 Pagination

The standard pagination component uses rounded pill buttons:

```html
<div class="flex flex-wrap items-center justify-center gap-1">
    <!-- Previous -->
    <a href="#" class="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors">
        <span class="material-symbols-outlined text-[16px]">chevron_left</span>
    </a>
    <!-- Active Page -->
    <span class="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-sm">1</span>
    <!-- Inactive Page -->
    <a href="#" class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors">2</a>
    <!-- Next -->
    <a href="#" class="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors">
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
    </a>
</div>
```

### 4.7 Navigation Elements

**Drawer Menu Link:**

```html
<a href="#" class="flex items-center gap-4 px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
    <span class="material-symbols-outlined text-[22px] text-primary">forum</span>
    <span class="text-sm font-medium">Forum Index</span>
</a>
```

**Bottom Nav Icon:**

```html
<a href="#" class="flex flex-col items-center gap-0.5 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
    <span class="material-symbols-outlined text-[26px]">home</span>
    <span class="text-[10px] font-medium">Home</span>
</a>
```

---

## 5. Page Layout Patterns

### 5.1 Overall Page Structure

Every page in MobilePro follows this structure:

```html
<!-- overall_header.html -->
<html class="dark"> <!-- or no class for light mode -->
<body class="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white pb-24">

    <!-- Sticky Header (included in overall_header.html) -->
    <header class="sticky top-0 z-50 ...">...</header>

    <!-- Side Drawer (included via INCLUDE navbar_mobile.html) -->
    <div id="sideMenu">...</div>

    <!-- Main Content Area -->
    <main>
        <div class="px-4 mt-4">
            <!-- Page-specific content -->
        </div>
    </main>

    <!-- Footer (included in overall_footer.html) -->
    <footer>...</footer>

    <!-- Fixed Bottom Nav (included via INCLUDE navbar_footer.html) -->
    <nav class="fixed bottom-0 left-0 right-0 z-50 ...">...</nav>

</body>
</html>
```

> **Important:** The `pb-24` on `<body>` ensures content is never hidden behind the fixed bottom navigation.

### 5.2 Sticky Header

The header is sticky (`sticky top-0 z-50`) and contains:
- A hamburger menu toggle (left)
- The site name (center)
- Quick action icons (right) — Search, Notifications, Theme Toggle

The header background: `bg-white/95 backdrop-blur-md dark:bg-slate-900/95` gives a frosted glass effect.

### 5.3 Fixed Bottom Navigation

The bottom bar is `fixed bottom-0 left-0 right-0 z-50` and renders three icon slots:
1. **Home** — links to the forum index
2. **Center** — user avatar (logged in) or login icon (guest)
3. **Settings** — links to UCP (logged in) or registration (guest)

### 5.4 Side Drawer Navigation

Opened by the hamburger icon. Uses a dark overlay backdrop and a `translate-x` CSS transition for the slide effect. Navigation links are grouped into three sections:
- **Main Nav** — Forum Index, Active Topics, New Posts, Unanswered
- **User Nav** — Profile, PMs, ACP/MCP (if admin)
- **Info Nav** — Search, FAQ, Terms, Privacy

### 5.5 Content Area

Content should always be wrapped inside a `<main>` tag. Top-level content blocks should use `px-4` for horizontal padding and appropriate `mt-*` classes for vertical spacing.

---

## 6. Template Integration

### 6.1 File Structure

To create MobilePro-specific templates for your extension, place your files at:

```
ext/vendor/extension/styles/MobilePro/template/
```

For event listeners:

```
ext/vendor/extension/styles/MobilePro/template/event/
```

### 6.2 Template Events

MobilePro supports its own custom events documented in [`custom_event.MD`](custom_event.MD).

**Custom MobilePro events** — see [`custom_event.MD`](custom_event.MD) for the full list, including:
- `overall_header_quick_actions_*` — Header action bar
- `navbar_footer_*` — Bottom navigation bar
- `navbar_mobile_*` — Side drawer

### 6.3 Creating Extension Templates

When building a template for your extension to work with MobilePro:

**Step 1: Use the card pattern for your main content block:**

```html
<div class="px-4 mt-4 mb-6">
    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 class="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <span class="material-symbols-outlined text-[18px] text-primary">extension</span>
            My Extension Title
        </h2>
        <!-- Your content here -->
    </div>
</div>
```

**Step 2: Use consistent form patterns for inputs:**

```html
<fieldset class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
        <label for="my_field" class="text-xs font-bold uppercase tracking-wider text-slate-500">
            Field Label:
        </label>
        <input type="text" name="my_field" id="my_field"
            class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-900/50 dark:text-white transition-colors" />
    </div>
</fieldset>
```

**Step 3: Use the standard button patterns for actions:**

```html
<div class="mt-4 flex flex-col sm:flex-row items-center gap-3">
    <button type="submit" class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-transform active:scale-95 cursor-pointer">
        <span class="material-symbols-outlined text-[18px]">save</span>
        Save
    </button>
</div>
```

---

## 7. Tailwind CSS Build Process

MobilePro uses Tailwind CSS 3.4. The compiled output lives at `theme/tailwind.css`.

### Content Scanning

The `tailwind.config.js` scans these paths for class usage:

```js
content: [
    './template/**/*.html',
]
```

> **Key point for extension developers:** If your extension adds MobilePro-specific templates, the Tailwind classes within them will **not** be automatically compiled into `tailwind.css` unless the style maintainer adds your extension's path to the `content` array, or the classes you use already exist in the compiled CSS.

### Safe Strategy: Use Existing Classes

The safest approach is to **only use Tailwind classes that are already present** in MobilePro's templates. Since MobilePro's templates already use a comprehensive set of utility classes, most common patterns are already compiled:

- All spacing utilities (`px-*`, `py-*`, `mt-*`, `mb-*`, `gap-*`, `p-*`)
- All color utilities for the slate palette and primary color
- `rounded-lg`, `rounded-xl`, `rounded-full`
- `shadow-sm`, `shadow-md`
- `flex`, `grid`, `items-center`, `justify-between`, `justify-center`
- `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`
- `font-bold`, `font-medium`, `tracking-wider`, `uppercase`
- All `dark:` variants for the above
- `transition-colors`, `transition-transform`

### Plugins

MobilePro includes these Tailwind plugins:

| Plugin | Purpose |
|---|---|
| `@tailwindcss/forms` | Resets for form elements |
| `@tailwindcss/typography` | Prose styling for user-generated content |
| `@tailwindcss/container-queries` | Container-based responsive queries |

---

## 8. Best Practices

### DO ✅

1. **Always provide dark mode classes.** Every background, text, and border should have a `dark:` variant.
2. **Use the card wrapper** for your main content blocks. This ensures visual consistency.
3. **Use Material Symbols Outlined** for icons. The font is already loaded.
4. **Include `px-4`** horizontal padding for page-level content.
5. **Include `pb-24`** if your page has a scrollable bottom area (the main `<body>` already has it, but custom modals/overlays may not).
6. **Test at 375px width.** This is the most common mobile viewport.
7. **Use `text-sm`** as your default font size. It's consistent with the rest of the UI.
8. **Reuse class patterns** from existing templates. Copy the exact class strings from `viewtopic_body.html`, `index_body.html`, etc.
9. **Use `transition-colors`** for hover effects and `transition-transform active:scale-95` for tap feedback on buttons.

### DON'T ❌

1. **Don't use custom CSS files** if avoidable. Stick to Tailwind utility classes already compiled in `tailwind.css`.
2. **Don't use Font Awesome** or other icon fonts. Use Material Symbols Outlined.
3. **Don't hardcode colors.** Use `text-primary`, `bg-primary`, or the slate palette.
4. **Don't use `position: fixed`** for custom elements without considering the existing fixed header (z-50) and footer (z-50).
5. **Don't add large `padding-bottom`** to the body — it's already handled.
6. **Don't use `table` elements** for layout. Use Flexbox (`flex`) or Grid (`grid`).
7. **Don't forget `[&_a]:text-primary`** on containers with user-generated links (phpBB generates `<a>` tags for usernames, links, etc.).

---

## 9. Checklist for Extension Authors

Before releasing your extension with MobilePro support:

- [ ] All content blocks use the card pattern (`rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800`)
- [ ] All text elements have `dark:` color variants
- [ ] All borders have `dark:` variants
- [ ] Icons use `material-symbols-outlined` (not Font Awesome)
- [ ] Forms use the standard input/label patterns
- [ ] Buttons follow the primary/secondary patterns
- [ ] Page content wraps in `px-4` horizontal padding
- [ ] Content is readable at 320px–480px viewport widths
- [ ] No horizontal scrolling at mobile widths
- [ ] Links inside user-generated content use `[&_a]:text-primary hover:[&_a]:underline`
- [ ] Event listener templates use only pre-existing Tailwind classes
- [ ] Tested in both light and dark mode
- [ ] Tested with the fixed bottom navigation visible

---

*This guide is maintained alongside the MobilePro style. For questions or contributions, refer to the project repository.*
