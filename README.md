# zuchka.dev

Source for [zuchka.dev](https://zuchka.dev) — Matt Abrams' developer portfolio and writing archive.

Hand-written HTML, no build step, no JS framework. One shared `styles.css`,
one HTML file per page. The Worker serves `site/` and streams animation videos from R2.

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
5. When publishing the first post, replace the empty-state message on the writing index.
6. Commit and follow the deployment steps below.

## Adding a new project page

1. `cp site/_project-template.html site/projects/<slug>.html`
2. Replace the `{{TOKENS}}`
3. Add the project to the appropriate list in `site/projects/index.html`. Feature it
   on the homepage if appropriate. The shared navigation links to the project index.

## Add an animation

Add a watch page under `site/animations/<slug>/` using an existing film as a reference. Add it to `site/animations/index.html`. Copy the poster, widescreen social image and standalone player to `site/films/<slug>/<version>/`.

Upload the MP4s before deploying the page. Use a new version when replacing a released cut.

```sh
node scripts/upload-film.mjs /path/to/films/tokenizer-cut/v2
```

The browser uses the same `/films/<slug>/<version>/` URL for video and static assets. Use `npx wrangler dev` to test the video route with a local R2 object or verify playback and seeking on a deployed preview.

## Deploy (Cloudflare Workers)

The production `zuchka-dev` Worker serves the static files in `site/` at
`zuchka.dev`. Cloudflare Workers Builds is connected to this GitHub repository.
A push to `main` runs `npx wrangler deploy` with `wrangler.jsonc` as its configuration.

To publish, commit and push to `main`, then check the `zuchka-dev` build in
Cloudflare and the live site. If an old page persists after a successful deploy,
purge the `zuchka.dev` host from the zone cache.

### Headers

`site/_headers` controls cache + security headers. The PEGS page uses COOP +
COEP-credentialless to allow js-dos's SharedArrayBuffer-backed emulation.

## Style tokens

The shared tokens in `site/styles.css` define a warm off-white canvas, dark ink,
system sans typography, and a green action accent. The featured project and
editorial links use the same violet palette as the animations. Every page opens in
light mode, including on devices set to dark. The header toggle switches the
current page only. Reloading or navigating starts the page in light mode again.

## License

Source: MIT. Content (writing, project pages): all rights reserved.
