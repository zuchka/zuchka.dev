# zuchka.dev

Source for [zuchka.dev](https://zuchka.dev) — Matt Abrams' developer portfolio and writing archive.

Hand-written HTML, no build step, no JS framework. One shared `styles.css`,
one HTML file per page. The deployed site is exactly what's in `site/`.

## Layout

```
site/
├── index.html                       home
├── styles.css                       shared
├── _post-template.html              copy this for new blog posts
├── _project-template.html           copy this for new project pages
├── _headers                         Cloudflare Pages headers config
├── 404.html
├── about.html
├── now.html
├── rss.xml
├── projects/
│   ├── index.html
│   ├── free-design-md.html
│   ├── ding.html
│   ├── remove-markdown.html
│   ├── obsidian-readability.html
│   ├── pegs.html                    js-dos embed
│   └── pegs/                        PEGS assets (binary, gif, .jsdos bundle)
└── writing/
    ├── index.html
    └── YYYY-MM-DD-<slug>.html       posts
```

## Local development

```bash
python3 -m http.server -d site 8765
# → http://localhost:8765
```

That's it. No deps to install.

## Adding a new blog post

1. `cp site/_post-template.html site/writing/$(date +%Y-%m-%d)-<slug>.html`
2. Replace the `{{TOKENS}}` in the new file
3. Add a `<div class="post-row">` row to `site/writing/index.html` (newest first)
4. Add a corresponding `<item>` to `site/rss.xml` (newest first)
5. Update the "Recent writing" section on `site/index.html` if it should appear there
6. Commit, push — Cloudflare Pages auto-deploys

## Adding a new project page

1. `cp site/_project-template.html site/projects/<slug>.html`
2. Replace the `{{TOKENS}}`
3. Add the new project to the sidebar `Projects` list across **all** existing
   pages. The sidebar is duplicated by design; see the `<aside class="sidebar">`
   block in any existing page.

## Deploy (Cloudflare Workers)

The production `zuchka-dev` Worker serves the static files in `site/` at
`zuchka.dev`. Cloudflare Workers Builds is connected to this GitHub repository.
A push to `main` runs `npx wrangler deploy` with `site/` as the asset directory;
Wrangler generates its configuration during the build. There is no separate Pages
project or checked-in Wrangler config.

To publish, commit and push to `main`, then check the `zuchka-dev` build in
Cloudflare and the live site. If an old page persists after a successful deploy,
purge the `zuchka.dev` host from the zone cache.

### Headers

`site/_headers` controls cache + security headers. The PEGS page uses COOP +
COEP-credentialless to allow js-dos's SharedArrayBuffer-backed emulation.

## Style tokens

The palette began with Ding's original website: Courier New, a `#0e0e0e`
background, and a `#7ee787` green accent. This site's tokens are defined as CSS
custom properties at the top of `site/styles.css`.

## License

Source: MIT. Content (writing, project pages): all rights reserved.
