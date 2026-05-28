# Light / Dark Mode Toggle — Design Spec

**Date:** 2026-05-28
**Status:** Approved

## Overview

Add a light/dark mode toggle to zuchka.dev. Light mode is the default. Users can toggle to dark and their preference persists via `localStorage`. The existing dark theme tokens are preserved exactly; a new light token set is introduced as the `:root` default.

---

## Architecture

### CSS strategy

- `:root` holds **light mode** tokens (new default)
- `[data-theme="dark"]` on `<html>` holds **dark mode** tokens (current values, moved to override block)
- No `data-theme` attribute = light mode; attribute present with value `"dark"` = dark mode

### Anti-flash inline script

Each page's `<head>` gets a synchronous inline script placed **before** the `<link rel="stylesheet">`. It reads `localStorage` and sets `data-theme="dark"` on `<html>` before any paint, preventing a light flash on dark-preference pages:

```html
<script>if(localStorage.getItem('theme')==='dark')document.documentElement.setAttribute('data-theme','dark');</script>
```

### theme.js

New file at `site/theme.js`, loaded via `<script src="/theme.js"></script>` at the bottom of `<body>` on every page.

Responsibilities:
- On load: set the toggle button label to match the current theme
- On click: flip `data-theme` between `""` (light) and `"dark"`; write to `localStorage`; update button label

### Toggle button

Added to every page's sidebar, just above `.sb-foot`:

```html
<button class="theme-toggle" id="theme-toggle" aria-label="Toggle color theme">◑ dark mode</button>
```

CSS: no border, no background, monospace font, `--fg-label` color, `cursor: pointer`, matches sidebar label aesthetic. Label reads "◑ dark mode" in light mode and "◑ light mode" in dark mode.

---

## Light Mode Token Values

All defined in `:root` (replaces current dark-only `:root` block).

| Token | Light value | Notes |
|---|---|---|
| `--bg` | `#ffffff` | |
| `--bg-aside` | `#f5f5f5` | |
| `--bg-panel` | `#f9f9f9` | |
| `--bg-inset` | `#f0f0f0` | |
| `--bg-call` | `#f5f5f5` | |
| `--fg` | `#111111` | |
| `--fg-strong` | `#000000` | |
| `--fg-muted` | `#444444` | |
| `--fg-dim` | `#555555` | |
| `--fg-faint` | `#666666` | |
| `--fg-label` | `#777777` | |
| `--fg-ghost` | `#888888` | |
| `--fg-vapor` | `#999999` | |
| `--accent` | `#7ee787` | Unchanged by request. Low contrast on white (~2.5:1) — visible as color signal, not WCAG-compliant for body text. |
| `--string` | `#0550ae` | Adjusted for light bg (was light blue `#a5d6ff`) |
| `--num` | `#953800` | Adjusted for light bg (was orange `#f0883e`) |
| `--border` | `#e8e8e8` | |
| `--border-2` | `#e0e0e0` | |
| `--border-3` | `#d8d8d8` | |
| `--border-4` | `#cccccc` | |

Non-color tokens (`--font-mono`, `--radius`, `--sidebar-w`) are unchanged and stay in `:root`.

## Dark Mode Token Values

Moved from `:root` into `[data-theme="dark"]` — values unchanged:

```css
[data-theme="dark"] {
  --bg: #0e0e0e;
  --bg-aside: #0c0c0c;
  --bg-panel: #141414;
  --bg-inset: #1a1a1a;
  --bg-call: #111;
  --fg: #e8e8e8;
  --fg-strong: #fff;
  --fg-muted: #bbb;
  --fg-dim: #b0b0b0;
  --fg-faint: #9a9a9a;
  --fg-label: #8a8a8a;
  --fg-ghost: #7a7a7a;
  --fg-vapor: #6e6e6e;
  --accent: #7ee787;
  --string: #a5d6ff;
  --num: #f0883e;
  --border: #1c1c1c;
  --border-2: #222;
  --border-3: #2a2a2a;
  --border-4: #333;
}
```

---

## Files to Modify

### `site/styles.css`
- Restructure `:root` block: light tokens become the default
- Add `[data-theme="dark"]` block with existing dark values
- Add `.theme-toggle` button styles

### `site/theme.js` (new file)
- Toggle logic + localStorage persistence + label update

### All 13 HTML pages (sidebar markup is duplicated across all):
- `site/index.html`
- `site/about.html`
- `site/now.html`
- `site/404.html`
- `site/projects/index.html`
- `site/projects/ding.html`
- `site/projects/remove-markdown.html`
- `site/projects/obsidian-readability.html`
- `site/projects/pegs.html`
- `site/writing/index.html`
- `site/writing/2026-05-06-the-site-is-the-message.html`
- `site/_post-template.html`
- `site/_project-template.html`

Each page needs:
1. Inline anti-flash `<script>` in `<head>` (before stylesheet link)
2. `<script src="/theme.js"></script>` at bottom of `<body>`
3. `<button class="theme-toggle" id="theme-toggle" ...>` just above `.sb-foot` in the sidebar

---

## Verification

1. Load `site/index.html` in browser — page should render in **light mode** by default
2. Click the toggle — page switches to dark; label changes to "◑ light mode"
3. Refresh — page stays in dark mode (localStorage persisted)
4. Click toggle again — back to light; refresh stays light
5. Open a different page (e.g. `about.html`) after setting dark — should load in dark without flash
6. Open browser devtools, clear `localStorage`, refresh — reverts to light default
7. Check all token-using elements in both modes: sidebar bg, main bg, links (accent), stat panels, table, code blocks, callout box
