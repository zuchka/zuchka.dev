import { execFileSync } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';

const [releaseDirectory] = process.argv.slice(2);
if (!releaseDirectory) throw new Error('Pass the path to films/<slug>/<version>.');
const directory = resolve(releaseDirectory);
const release = basename(directory);
const slug = basename(dirname(directory));
if (!/^[a-z0-9-]+$/.test(slug) || !/^v(?:[2-9]|[1-9]\d+)$/.test(release)) {
  throw new Error('Pass an episode slug and a release version of v2 or higher.');
}

const cuts = new Set(['feed', 'vertical', 'wide', 'shelf', 'home-loop'].map(cut => slug + '-' + cut + '.mp4'));
const files = (await readdir(directory, { withFileTypes: true }))
  .filter(entry => entry.isFile() && cuts.has(entry.name));
if (!files.length) throw new Error('No released MP4s in ' + directory);

const wrangler = process.env.WRANGLER_BIN || 'npx';
const command = process.env.WRANGLER_BIN ? [] : ['wrangler'];
for (const { name } of files) {
  execFileSync(wrangler, [...command, 'r2', 'object', 'put', `sothats-how-films/films/${slug}/${release}/${name}`,
    '--remote', '--file', join(directory, name), '--content-type', 'video/mp4',
    '--cache-control', 'public, max-age=3600'], { stdio: 'inherit' });
}
