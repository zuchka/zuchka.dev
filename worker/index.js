const moviePath = /^\/films\/([a-z0-9-]+)\/v(?:[2-9]|[1-9]\d+)\/\1-(?:feed|wide|vertical|shelf|home-loop)\.mp4$/;
const conditionalHeaders = ['if-match', 'if-unmodified-since', 'if-none-match', 'if-modified-since'];

function includesTag(value, etag, weak = false) {
  return value.split(',').some(candidate => {
    const tag = candidate.trim();
    return tag === '*' || (weak ? tag.replace(/^W\//, '') : tag) === etag;
  });
}

function preconditionStatus(headers, etag, modified) {
  const match = headers.get('if-match');
  if (match ? !includesTag(match, etag) : modified > Date.parse(headers.get('if-unmodified-since'))) return 412;
  const noneMatch = headers.get('if-none-match');
  if (noneMatch ? includesTag(noneMatch, etag, true) : modified <= Date.parse(headers.get('if-modified-since'))) return 304;
  return 200;
}

function readRange(value, size) {
  const match = /^bytes=(\d*)-(\d*)$/i.exec(value ?? '');
  if (!match) return;
  const [, first, last] = match;
  if (!first && !last) return;
  const start = first ? Number(first) : Math.max(0, size - Number(last));
  const end = first && last ? Math.min(Number(last), size - 1) : size - 1;
  if (start > end) return null;
  return { offset: start, length: end - start + 1 };
}

async function serveMovie(request, films, key) {
  const head = request.method === 'HEAD';
  if (!head && request.method !== 'GET') {
    return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
  }

  const requestedRange = head ? null : request.headers.get('range');
  const metadataOnly = head || requestedRange || conditionalHeaders.some(name => request.headers.has(name));
  const object = metadataOnly ? await films.head(key) : await films.get(key);
  if (!object) return new Response(null, { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('ETag', object.httpEtag);
  headers.set('Last-Modified', object.uploaded.toUTCString());
  const modified = Date.parse(headers.get('Last-Modified'));
  const precondition = preconditionStatus(request.headers, object.httpEtag, modified);
  if (precondition !== 200) return new Response(null, { status: precondition, headers });

  const ifRange = request.headers.get('if-range');
  const range = !ifRange || ifRange === object.httpEtag || Date.parse(ifRange) === modified
    ? readRange(requestedRange, object.size)
    : undefined;
  if (range === null) {
    headers.set('Content-Range', 'bytes */' + object.size);
    return new Response(null, { status: 416, headers });
  }
  if (range) {
    const end = range.offset + range.length - 1;
    headers.set('Content-Range', `bytes ${range.offset}-${end}/${object.size}`);
  }
  headers.set('Content-Length', String(range?.length ?? object.size));
  if (head) return new Response(null, { headers });

  // Versioned film keys keep the metadata and body consistent across ranged reads.
  const movie = metadataOnly ? await films.get(key, range && { range }) : object;
  if (!movie) return new Response(null, { status: 404 });
  return new Response(movie.body, { status: range ? 206 : 200, headers });
}

export default {
  fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (moviePath.test(pathname)) return serveMovie(request, env.FILMS, pathname.slice(1));
    return env.ASSETS.fetch(request);
  }
};
