# Local Prompt Firewall

**Local Prompt Firewall** is an open-source Chrome extension that detects sensitive text in a ChatGPT prompt *before* it is sent. It runs entirely in the browser: no account, backend, telemetry, remote configuration, or third-party AI API.

> This is an early release. It reduces accidental disclosure; it cannot guarantee that every sensitive value will be found.

## What it does

- Supports ChatGPT at `chatgpt.com` and `chat.openai.com`.
- Scans only when the user attempts to send a text prompt.
- Detects high-confidence emails, international phones, payment cards, CVV/CVC with context, IBANs, secrets in URL parameters, and selected API-key formats.
- Offers **Mask and send**, replacing detected spans with opaque, per-message tokens such as `[[LPF:9f3a…:PAYMENT_CARD:01]]`.
- Keeps the token-to-original mapping in `chrome.storage.session`, scoped to the current tab and cleared when that tab closes or the browser restarts.
- Lets the user manually restore tokens in selected response text for copying. It never mutates ChatGPT responses automatically.

## What it does not do

- It does not inspect attachments, images, voice input, canvas content, browser history, or hidden page data.
- It does not automatically classify people, unstructured addresses, medical context, or arbitrary passport-like strings.
- It does not make prompts safe to share. Review every prompt before sending.

## Install from source

Requirements: Node.js 20+ and Chrome.

```bash
npm ci
npm run build
```

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select `apps/chrome-extension/dist`.
4. Open ChatGPT and send a synthetic test prompt such as `Card 4242 4242 4242 4242`.

## Workspace

| Package | Purpose |
| --- | --- |
| `packages/core` | Standalone TypeScript scanner, tokenization, and restoration API. |
| `apps/chrome-extension` | Manifest V3 ChatGPT adapter and local extension UI. |
| `packages/test-fixtures` | Synthetic regression corpus; never add real personal data. |
| `docs` | Threat model, privacy policy, and Russian quick start. |

### Core API

```ts
import { scan, sanitize, restore } from "@local-prompt-firewall/core";

const findings = scan("Email jane@example.com and card 4242 4242 4242 4242");
const { safeText, replacements } = sanitize(text, findings);
const restored = restore(safeText, replacements);
```

`Finding` contains category, character span, confidence, detector source, and policy action. It intentionally does not include the matched value.

## Privacy and security

The extension requests only `storage`, `tabs`, and host access to ChatGPT. It uses no broad host permission, remote code, analytics, or network request. Read the [privacy policy](docs/PRIVACY.md) and [threat model](docs/THREAT_MODEL.md) before using it.

If you find a vulnerability, follow [SECURITY.md](SECURITY.md); do not open a public issue with a secret or real PII.

## Development

```bash
npm test
npm run typecheck
npm run build
```

Use synthetic data only in tests, issues, screenshots, demonstrations, and pull requests. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Roadmap

- [x] ChatGPT-first Manifest V3 extension and deterministic local PII detectors.
- [ ] Browser beta and compatibility matrix for ChatGPT UI updates.
- [ ] Site adapters for Claude, Gemini, Copilot, and DeepSeek.
- [ ] Explicit opt-in local ML mode for ambiguous entities, using pinned and verified open weights.

## License

Licensed under the [Apache License 2.0](LICENSE).
