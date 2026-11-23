(function () {
  const button = document.getElementById('theme-toggle');
  if (!button) return;

  const root = document.documentElement;
  function setDarkMode(enabled) {
    if (enabled) root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    button.setAttribute('aria-pressed', String(enabled));
  }

  button.addEventListener('click', function () {
    setDarkMode(root.dataset.theme !== 'dark');
  });
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) setDarkMode(false);
  });

  button.hidden = false;
})();
