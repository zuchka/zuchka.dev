(function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }

  function setTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try { localStorage.setItem('theme', theme); } catch (e) {}
    btn.textContent = theme === 'light' ? '◑ dark mode' : '◑ light mode';
  }

  btn.textContent = getTheme() === 'light' ? '◑ dark mode' : '◑ light mode';

  btn.addEventListener('click', function () {
    setTheme(getTheme() === 'light' ? 'dark' : 'light');
  });
})();
