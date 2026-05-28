# Light / Dark Mode Toggle — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent light/dark mode toggle to every page, with light mode as the default and dark mode opt-in via a sidebar button backed by `localStorage`.

**Architecture:** CSS custom properties in `:root` define the light (default) theme; a `[data-theme="dark"]` override block on `<html>` activates dark. A synchronous inline script in `<head>` reads `localStorage` before first paint to avoid flicker. A single `theme.js` handles the toggle click and persistence. All 13 HTML pages receive identical three-point surgery: inline anti-flash script, toggle button in sidebar, and `theme.js` script tag.

**Tech Stack:** Vanilla HTML, CSS custom properties, vanilla JavaScript (no build step, no framework)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `site/styles.css` | Modify | Replace `:root` with light tokens; add `[data-theme="dark"]` block; add `.theme-toggle` styles; fix hardcoded `#ccc` in `pre code` |
| `site/theme.js` | Create | Toggle `data-theme` on `<html>`, persist to `localStorage`, update button label |
| `site/index.html` | Modify | Anti-flash script in `<head>`, toggle button in sidebar, `theme.js` at end of `<body>` |
| `site/about.html` | Modify | Same as index.html |
| `site/now.html` | Modify | Same as index.html |
| `site/404.html` | Modify | Same as index.html |
| `site/projects/index.html` | Modify | Same as index.html |
| `site/projects/ding.html` | Modify | Same as index.html |
| `site/projects/remove-markdown.html` | Modify | Same as index.html |
| `site/projects/obsidian-readability.html` | Modify | Same as index.html |
| `site/projects/pegs.html` | Modify | Same as index.html |
| `site/writing/index.html` | Modify | Same as index.html |
| `site/writing/2026-05-06-the-site-is-the-message.html` | Modify | Same as index.html |
| `site/_post-template.html` | Modify | Same as index.html |
| `site/_project-template.html` | Modify | Same as index.html |

---

## Task 1: Restructure `site/styles.css` — token blocks + toggle styles

**Files:**
- Modify: `site/styles.css` (lines 6–35 replaced; new block appended after line 35; two lines changed in `pre` section)

- [ ] **Step 1: Replace the `:root` block (lines 6–35) with the light-mode defaults**

Replace the entire `:root { ... }` block (currently lines 6–35) with:

```css
:root {
  --bg:        #ffffff;
  --bg-aside:  #f5f5f5;
  --bg-panel:  #f9f9f9;
  --bg-inset:  #f0f0f0;
  --bg-call:   #f5f5f5;

  --fg:         #111111;
  --fg-strong:  #000000;
  --fg-muted:   #444444;
  --fg-dim:     #555555;
  --fg-faint:   #666666;
  --fg-label:   #777777;
  --fg-ghost:   #888888;
  --fg-vapor:   #999999;

  --accent:    #00A94F;
  --string:    #0550ae;
  --num:       #953800;

  --border:    #e8e8e8;
  --border-2:  #e0e0e0;
  --border-3:  #d8d8d8;
  --border-4:  #cccccc;

  --font-mono: "Courier New", Courier, monospace;
  --radius:    6px;
  --sidebar-w: 280px;
}
```

- [ ] **Step 2: Add `[data-theme="dark"]` block immediately after the `:root` block**

Insert this block directly after the closing `}` of `:root`:

```css
[data-theme="dark"] {
  --bg:        #0e0e0e;
  --bg-aside:  #0c0c0c;
  --bg-panel:  #141414;
  --bg-inset:  #1a1a1a;
  --bg-call:   #111;

  --fg:         #e8e8e8;
  --fg-strong:  #fff;
  --fg-muted:   #bbb;
  --fg-dim:     #b0b0b0;
  --fg-faint:   #9a9a9a;
  --fg-label:   #8a8a8a;
  --fg-ghost:   #7a7a7a;
  --fg-vapor:   #6e6e6e;

  --accent:    #00A94F;
  --string:    #a5d6ff;
  --num:       #f0883e;

  --border:    #1c1c1c;
  --border-2:  #222;
  --border-3:  #2a2a2a;
  --border-4:  #333;
}
```

- [ ] **Step 3: Fix hardcoded `#ccc` values in the `pre` section**

These two lines use a hardcoded light-gray that becomes invisible on the white light-mode background. Find and replace them:

Line currently reading:
```css
pre code { color: #ccc; }
```
Change to:
```css
pre code { color: var(--fg-muted); }
```

Line currently reading:
```css
pre .flag { color: #ccc; }
```
Change to:
```css
pre .flag { color: var(--fg-muted); }
```

- [ ] **Step 4: Add `.theme-toggle` styles**

Append this block at the very end of `site/styles.css`:

```css
/* ── Theme toggle ── */

.theme-toggle {
  display: block;
  background: none;
  border: none;
  padding: 0;
  margin-top: 20px;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--fg-label);
  cursor: pointer;
  text-align: left;
  letter-spacing: 0.5px;
}
.theme-toggle:hover { color: var(--fg-muted); }
```

- [ ] **Step 5: Open `site/index.html` in a browser (file:// is fine)**

Expected: page renders in **light mode** — white background, dark text, green accent. Nothing should be broken. The sidebar and main content should look like the "Clean White" mockup from the design session.

- [ ] **Step 6: Commit**

```bash
git add site/styles.css
git commit -m "Add light/dark mode CSS tokens and toggle button styles"
```

---

## Task 2: Create `site/theme.js`

**Files:**
- Create: `site/theme.js`

- [ ] **Step 1: Create `site/theme.js` with the following content**

```javascript
(function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
    btn.textContent = theme === 'dark' ? '◑ light mode' : '◑ dark mode';
  }

  btn.textContent = getTheme() === 'dark' ? '◑ light mode' : '◑ dark mode';

  btn.addEventListener('click', function () {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });
})();
```

(`◑` is the `◑` character — half-filled circle.)

- [ ] **Step 2: Commit**

```bash
git add site/theme.js
git commit -m "Add theme.js toggle logic with localStorage persistence"
```

---

## Task 3: Update `site/index.html` — wire everything up and verify end-to-end

**Files:**
- Modify: `site/index.html`

This is the smoke-test page. Get it working here before touching the other 12 pages.

- [ ] **Step 1: Add the anti-flash script to `<head>` — before the stylesheet link**

Find this line in `<head>`:
```html
        <link rel="stylesheet" href="/styles.css" />
```

Insert this line **immediately before** it:
```html
        <script>if(localStorage.getItem('theme')==='dark')document.documentElement.setAttribute('data-theme','dark');</script>
```

Result:
```html
        <script>if(localStorage.getItem('theme')==='dark')document.documentElement.setAttribute('data-theme','dark');</script>
        <link rel="stylesheet" href="/styles.css" />
```

- [ ] **Step 2: Add the toggle button to the sidebar — just above `.sb-foot`**

Find this block in the sidebar:
```html
                <div class="sb-foot">
```

Insert the button immediately before it:
```html
                <button class="theme-toggle" id="theme-toggle" aria-label="Toggle color theme">◑ dark mode</button>

                <div class="sb-foot">
```

- [ ] **Step 3: Add `theme.js` script tag at the bottom of `<body>` — after `</div>` closing `.layout`, before `</body>`**

Find the closing structure at the bottom:
```html
        </div>
    </body>
</html>
```

Insert the script after `</div>`:
```html
        </div>
        <script src="/theme.js"></script>
    </body>
</html>
```

- [ ] **Step 4: Open `site/index.html` in a browser and verify**

Checklist:
- [ ] Page loads in light mode (white bg, dark text)
- [ ] Sidebar shows "◑ dark mode" button near the bottom
- [ ] Clicking the button switches to dark mode instantly
- [ ] Button label changes to "◑ light mode"
- [ ] Refreshing the page stays in dark mode
- [ ] Clicking again returns to light mode
- [ ] Refreshing after that stays in light mode
- [ ] Open DevTools → Application → Local Storage: key `theme` set to `"dark"` or absent/`"light"`

- [ ] **Step 5: Commit**

```bash
git add site/index.html
git commit -m "Wire theme toggle into index.html"
```

---

## Task 4: Update remaining 12 HTML pages

**Files:**
- Modify: all files listed below

The three changes are identical to Task 3. Apply them to each file.

**The three snippets to add (same as Task 3):**

**A) In `<head>`, immediately before `<link rel="stylesheet" href="/styles.css" />`:**
```html
        <script>if(localStorage.getItem('theme')==='dark')document.documentElement.setAttribute('data-theme','dark');</script>
```

**B) In the sidebar, immediately before `<div class="sb-foot">`:**
```html
                <button class="theme-toggle" id="theme-toggle" aria-label="Toggle color theme">◑ dark mode</button>

```

**C) At the bottom of `<body>`, after the closing `</div>` of `.layout` and before `</body>`:**
```html
        <script src="/theme.js"></script>
```

- [ ] **Step 1: Apply all three changes to `site/about.html`**
- [ ] **Step 2: Apply all three changes to `site/now.html`**
- [ ] **Step 3: Apply all three changes to `site/404.html`**
- [ ] **Step 4: Apply all three changes to `site/projects/index.html`**
- [ ] **Step 5: Apply all three changes to `site/projects/ding.html`**
- [ ] **Step 6: Apply all three changes to `site/projects/remove-markdown.html`**
- [ ] **Step 7: Apply all three changes to `site/projects/obsidian-readability.html`**
- [ ] **Step 8: Apply all three changes to `site/projects/pegs.html`**
- [ ] **Step 9: Apply all three changes to `site/writing/index.html`**
- [ ] **Step 10: Apply all three changes to `site/writing/2026-05-06-the-site-is-the-message.html`**
- [ ] **Step 11: Apply all three changes to `site/_post-template.html`**
- [ ] **Step 12: Apply all three changes to `site/_project-template.html`**

- [ ] **Step 13: Spot-check in browser**

Open `site/about.html` and `site/projects/ding.html`. Set dark mode on one, navigate to the other — theme should persist. Verify the toggle button appears and functions on both pages.

- [ ] **Step 14: Commit**

```bash
git add site/about.html site/now.html site/404.html \
  site/projects/index.html site/projects/ding.html \
  site/projects/remove-markdown.html site/projects/obsidian-readability.html \
  site/projects/pegs.html \
  site/writing/index.html \
  "site/writing/2026-05-06-the-site-is-the-message.html" \
  site/_post-template.html site/_project-template.html
git commit -m "Wire theme toggle into remaining 12 pages"
```

---

## Verification (full end-to-end)

Run through all seven checks from the spec:

1. Load `site/index.html` — renders in **light mode** by default
2. Click toggle — switches to dark; label changes to "◑ light mode"
3. Refresh — stays dark
4. Click toggle — back to light; refresh stays light
5. Set dark, navigate to `site/about.html` — loads dark without flash
6. DevTools → Application → Local Storage → clear — refresh reverts to light
7. Visually inspect both modes: sidebar bg, main bg, green accent links, stat panels, table rows, callout box left-border, code blocks
