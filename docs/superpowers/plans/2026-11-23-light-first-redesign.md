# A light-first redesign for zuchka.dev

Keep Matt Abrams and his work at the center of the homepage. Borrow the warm off-white canvas, oversized system type, and single elevated panel from the Ding brief. Ding already occupies the “Building now” slot, so use that panel to show how to try it. Give the project archive and writing pages a quieter layout for reading.

## What the homepage looks like

| Area | Design |
| --- | --- |
| Header | Put the zuchka.dev wordmark at left, Projects, Writing, About, and Now in the middle, and a quiet theme button at right. Use the page background and one bottom rule. On phones, let the links wrap onto a second line. |
| Hero, left | Set “Matt Abrams” as the H1, with a flat green highlight behind “Abrams.” Follow with the existing developer advocate, open-source maintainer, and community builder introduction. Pair a green **View projects** button with an **About me →** text link. |
| Hero, right | Move “Building now” here. Use the existing Ding mark, its one-sentence description, and its actual three-line quick start from the project page. Link to the Ding write-up and local setup guide. Render the commands as selectable HTML. This panel gets the only shadow, a 12px radius, and 32px of interior space. |
| Below the hero | Keep the three portfolio metrics in a flat row with hairline dividers. Follow with the five projects as a scannable list of names, descriptions, and links. Let PEGS keep its direct play link. Put GitHub, LinkedIn, email, RSS, and the source link in the footer. |

Use roughly 98px outer gutters on wide screens, shrinking to 20px on phones. Stack the hero introduction, actions, and Ding panel in that order when the columns get tight. Keep code, titles, and navigation within the viewport.

## Theme and type

| Role | Light default |
| --- | --- |
| Page and surfaces | Warm canvas `#f7f6f2`, white panels `#ffffff`, hairline rules `#e5e4e0` |
| Text | Primary `#222b25`, muted metadata `#62695f`. Use an underline for links embedded in prose. |
| Accent | Electric green `#7ee787` for the primary action, hero highlight, and active markers. Pair green fills with dark ink `#17251c`. Reserve amber for actual warnings, such as the PEGS load failure. |
| Type | Native system sans for navigation and reading. Use monospace for commands and code. Aim for an 84px/1.12 homepage title with −0.04em tracking on desktop, scaling down on phones. Use 24px semibold section titles, 16px/1.6 body, 14px navigation and actions, and 12px metadata. |
| Spacing and shape | Use 12, 24, and 32px within components, with larger gaps between sections. Buttons have 6px corners. Project rows, navigation, and stat cells stay flat. |

The current CSS defaults to dark, and each HTML head only restores a saved light choice. Move light into `:root` and put the dark palette under `[data-theme="dark"]`. Use a deep charcoal-green canvas and slightly lighter surfaces for dark mode, with light ink and the same green action fill. Keep the existing `theme` storage key. Before the stylesheet loads, apply dark only when the saved value is `dark`. Missing, invalid, or unreadable storage falls back to light, including on a device set to dark. Give the button a stable “Dark mode” label and expose its state with `aria-pressed`. Show the button once its handler is ready.

## Implementation order

Verify and commit each increment before starting the next.

1. **Theme and typography.** Update `site/styles.css`, `site/theme.js`, and the pre-paint scripts in all 11 public HTML pages and both authoring templates. Replace green text links and stats with ink, and give keyboard focus a visible outline on both backgrounds. Verify fresh visits, stored choices, and toggling before changing the layout.
2. **Navigation and footer.** Replace the duplicated sidebar across those same files, remove its 280px offset, and retain ordinary HTML links. Add a skip link and current-page indication. Keep each project reachable from the Projects index. Update the sidebar and style guidance in `README.md` alongside this change.
3. **Homepage.** Build the split hero and relocate the existing Ding callout. Restyle the metrics and project rows, then check the composition at phone and desktop widths.
4. **Projects.** Apply the list treatment to `site/projects/index.html`. Give the five detail pages and `site/_project-template.html` whole, naturally wrapping titles, a Projects breadcrumb, and shared styles for facts, examples, and commands. Replace the inline four-column rule on remove-markdown so its stats can stack. Give the PEGS launcher and error text readable colors on its fixed black stage, then exercise play and download.
5. **Reading pages.** Use a roughly 65-character reading column for About, Now, Writing, and the post template. Let the About work-history table wrap. Give the empty Writing index one short message and one RSS link. Check the post template with a sample long title and code block, and give the 404 page a clear route home.

## Acceptance checks

- Serve `site/` with `python3 -m http.server -d site 8765`. Check every public page and both templates. Keep the existing static HTML, URLs, and RSS feed.
- Start with empty storage and a dark OS preference. The first paint should be light. Toggle dark, follow a project link, and reload. Repeat for light. With storage blocked, the control should still switch the current page. With JavaScript disabled, content and navigation should work in light mode.
- Review both themes at 320px, 768px, and 1440px. Check for page-level horizontal scrolling, clipped names, unreadable metadata, and crowded controls. Tab through the header, hero links, and PEGS launcher. Verify ordinary text contrast of at least 4.5:1 and clearly visible focus in both themes.
