# Local Prompt Firewall

Local-first Chrome extension that detects and masks sensitive text **before** prompts are sent to ChatGPT (and similar tools). Everything runs in the browser — nothing is sent to any server.

## Features
- Client-side detection and masking of sensitive patterns (API keys, emails, tokens, etc.)
- Configurable rules in the options page
- Works with ChatGPT and similar chat interfaces
- Zero network requests for the firewall itself
- All matching happens on-device

## Quick tip
You can test your patterns in the options page before enabling them. All matching happens on-device — nothing leaves your browser.

## Supported chat UIs

| UI | Status |
|----|--------|
| **ChatGPT** | Fully supported today |
| Claude | On the radar |
| Gemini | On the radar |
| Other AI chat interfaces | Contributions welcome |

If you run into a site that doesn’t get detected, feel free to open an issue with the URL and a short description.

Let's keep privacy first! 🛡️

> Note: the extension never phones home. Pattern matching and masking stay entirely local. No telemetry, no external calls.
