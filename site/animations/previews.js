const cards = document.querySelectorAll('[data-shelf-preview]');
const allowMotion = matchMedia('(any-hover: hover) and (prefers-reduced-motion: no-preference)');
let active;
let player;
let pending;

const visibility = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.target === active && !entry.isIntersecting)) stop();
});

function stop() {
  window.clearTimeout(pending);
  visibility.disconnect();
  active = undefined;
  if (player) {
    player.pause();
    player.remove();
    player.removeAttribute('src');
    player.load();
    player = undefined;
  }
}

function preview(card) {
  if (active === card || !allowMotion.matches || navigator.connection?.saveData || document.hidden) return;
  stop();
  active = card;
  visibility.observe(card);
  pending = window.setTimeout(() => {
    const video = document.createElement('video');
    player = video;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('aria-hidden', 'true');
    video.addEventListener('playing', () => video.setAttribute('data-playing', ''), { once: true });
    const failed = () => { if (player === video) stop(); };
    video.addEventListener('error', failed, { once: true });
    card.querySelector('.film-poster').append(video);
    video.src = card.dataset.shelfPreview;
    video.play().catch(failed);
  }, 120);
}

for (const card of cards) {
  card.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') preview(card); });
  card.addEventListener('pointerleave', () => {
    if (active === card && !card.matches(':focus-visible')) stop();
  });
  card.addEventListener('focus', () => { if (card.matches(':focus-visible')) preview(card); });
  card.addEventListener('blur', () => { if (active === card && !card.matches(':hover')) stop(); });
}
allowMotion.addEventListener('change', () => { if (!allowMotion.matches) stop(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
window.addEventListener('pagehide', stop);
