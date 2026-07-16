# Threat model

## Assets

- Text entered in the ChatGPT composer.
- Sensitive spans detected by deterministic rules.
- Token-to-original mappings for the current tab.

## Trust boundaries

The extension runs in Chrome’s isolated extension context on the two declared ChatGPT origins. The browser, installed extensions, operating system, and ChatGPT itself are outside this project’s trust boundary.

## Protections

- Analysis occurs locally; the project has no server endpoint, telemetry, account system, or remote configuration.
- Only opaque tokens are inserted into a prompt after the user selects **Mask and send**.
- Mappings are held in `chrome.storage.session`, keyed by tab, and deleted when the tab closes. They are not persisted across browser restarts.
- The restoration command requires the user to manually select text and works only for exact tokens from the same tab session.
- The extension asks for narrow ChatGPT host permissions and contains no remotely hosted executable code.

## Non-goals and residual risks

- Detection is heuristic. False negatives and false positives are expected; no security guarantee is made.
- The extension does not inspect files, images, voice input, pasted rich content outside the text composer, or secrets encoded/obfuscated by the user.
- A malicious browser extension, compromised browser or OS, keylogger, screen recorder, or page-level attack may access data outside this extension’s control.
- Choosing **Allow once** intentionally sends the original prompt to ChatGPT.
- Restoring text and copying it to the clipboard may expose it to other software with clipboard access.

## Reporting

Never file real credentials or PII in an issue. Follow [SECURITY.md](../SECURITY.md) for private reporting.
