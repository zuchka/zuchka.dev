(function () {
  const button = document.getElementById('theme-toggle');
  if (!button) return;

  const root = document.documentElement;
  function updateButton() {
    button.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
  }

  button.addEventListener('click', function () {
    const dark = root.dataset.theme !== 'dark';
    if (dark) root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {}
    updateButton();
  });

  updateButton();
  button.hidden = false;
})();
