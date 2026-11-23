const video = document.querySelector('.film-player');
const [wide, feed] = video.querySelectorAll('source');
const screen = matchMedia(wide.media);
const selectedCut = () => screen.matches ? wide : feed;
video.poster = selectedCut().dataset.poster;

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  video.play().catch(async error => {
    if (error.name !== 'NotAllowedError') return;
    video.muted = true;
    try {
      await video.play();
    } catch (retryError) {
      if (retryError.name === 'NotAllowedError') video.muted = false;
    }
  });
}

// Keep the same moment when rotating across the portrait and widescreen layouts.
screen.addEventListener('change', () => {
  const cut = selectedCut();
  video.poster = cut.dataset.poster;
  if (video.currentSrc === cut.src) return;
  const position = video.currentTime;
  const resume = !video.paused && !video.ended;
  video.src = cut.src;
  video.load();
  if (position) video.currentTime = position;
  if (resume) video.play().catch(() => {});
});
