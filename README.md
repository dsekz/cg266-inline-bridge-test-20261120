# CG266 task-owned CDN control

Proposed public repository: `dsekz/cg266-inline-bridge-test-20261120`.
Proposed fixed CDN URL: `https://cdn.jsdelivr.net/gh/dsekz/cg266-inline-bridge-test-20261120@main/bridge.js`.

`bridge.js` is a bounded, synthetic-only read control. It checks accessible sibling preview documents for the exact ID `cg266-later-private`, accepts only 16 lowercase hex characters, and displays the result in its own `cg266-owned-script-status` element. It stops after 30 seconds. It does not read account content or send requests. The HTML preview that references it must provide `<div id="cg266-owned-script-status">WAITING</div>` before its `<script src="...">`.

Do not publish, push, or share this repository until the owner reviews and explicitly authorizes the exact artifact and destination. A later TURN receiver variant would require a separate artifact review. The prior OpenAI findings and popover campaign remain excluded.
