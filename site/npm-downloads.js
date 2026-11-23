(async function updateDownloads() {
  try {
    const response = await fetch('https://api.npmjs.org/downloads/point/last-week/remove-markdown', {
      credentials: 'omit'
    });
    if (!response.ok) return;

    const { downloads, end, package: name } = await response.json();
    if (name !== 'remove-markdown' || !Number.isSafeInteger(downloads) || downloads < 0) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(end)) return;
    const week = new Date(end + 'T00:00:00Z');
    if (Number.isNaN(week.getTime()) || week.toISOString().slice(0, 10) !== end) return;

    const dateLabel = week.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
    });
    const count = downloads.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 2 });
    const detail = downloads.toLocaleString('en-US') + ' downloads in the week ending ' + dateLabel;

    for (const element of document.querySelectorAll('[data-npm-count]')) {
      element.textContent = count;
      element.title = detail;
    }
    for (const time of document.querySelectorAll('time[data-npm-week]')) {
      time.dateTime = end;
      time.textContent = dateLabel;
    }
  } catch {
    // Keep the dated snapshot in the HTML if npm is unavailable.
  }
})();
