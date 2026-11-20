(() => {
  const output = document.getElementById('cg266-owned-script-status');
  if (!output) return;
  const expected = /^[0-9a-f]{16}$/;
  const started = Date.now();
  const intervalMs = 250;
  const maximumMs = 30000;
  let timer;

  function findSyntheticMarker() {
    const visited = new Set();
    let marker = null;
    function inspect(win) {
      if (marker !== null || visited.has(win)) return;
      visited.add(win);
      try {
        const doc = win.document;
        if (doc !== document) {
          const element = doc.getElementById('cg266-later-private');
          const candidate = element?.textContent?.trim();
          if (candidate && expected.test(candidate)) {
            marker = candidate;
            return;
          }
        }
        for (let i = 0; i < win.frames.length && marker === null; i++) {
          inspect(win.frames[i]);
        }
      } catch (_) {
        // Other origins are not readable by this sandbox.
      }
    }
    try {
      for (let i = 0; i < top.frames.length && marker === null; i++) {
        inspect(top.frames[i]);
      }
    } catch (_) {
      // The host page is not readable by this sandbox.
    }
    return marker;
  }

  function check() {
    const marker = findSyntheticMarker();
    if (marker !== null) {
      output.textContent = `SYNTHETIC_MARKER_FOUND:${marker}`;
      clearInterval(timer);
    } else if (Date.now() - started >= maximumMs) {
      output.textContent = 'NO_VALID_SYNTHETIC_MARKER';
      clearInterval(timer);
    }
  }
  timer = setInterval(check, intervalMs);
  check();
})();
