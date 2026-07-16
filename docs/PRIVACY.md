# Privacy Policy

Effective date: 2026-07-16

Local Prompt Firewall processes text in the ChatGPT composer only to provide its single purpose: warning about and replacing selected sensitive text before the user sends a prompt.

## Data handling

- The extension reads the current composer only when the user attempts to submit it.
- Detection, token generation, and replacement run locally in the browser.
- The original values required to restore Local Prompt Firewall tokens are stored in `chrome.storage.session`, scoped to the active browser session and removed when the corresponding tab closes.
- The project does not operate a backend and does not transmit, sell, share, log, or use prompt text, detected values, token mappings, browsing activity, analytics, or telemetry.
- ChatGPT receives only the text the user chooses to send. When **Mask and send** is selected, it receives the tokenized text rather than the detected values.

## Permissions

- `storage`: stores session-only token mappings.
- `tabs`: identifies the current tab for session-map isolation and removes its map at tab close.
- `https://chatgpt.com/*` and `https://chat.openai.com/*`: runs the content script only where the extension’s stated functionality is available.

This policy does not change OpenAI’s, Chrome’s, or any other provider’s data practices. The extension is not affiliated with OpenAI.

## Contact

For security concerns, follow [SECURITY.md](../SECURITY.md). For ordinary privacy questions, open a GitHub discussion without personal data.
