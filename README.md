<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:07111A,40:10B981,100:34D399&height=220&section=header&text=Local%20Prompt%20Firewall&fontSize=38&fontAlignY=38&fontColor=FFFFFF&desc=On-device%20PII%20masking%20before%20prompts%20leave%20the%20browser&descAlignY=60&descSize=16" alt="Local Prompt Firewall"/>
</div>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=18&pause=1200&color=34D399&center=true&vCenter=true&width=680&lines=Mask+secrets+before+ChatGPT+sees+them;Emails+%C2%B7+keys+%C2%B7+custom+regex;100%25+local+%E2%80%94+nothing+uploaded" alt="typing"/>
</p>

<p align="center">
  <strong>Local-first Chrome extension</strong> that detects and masks sensitive text<br/>
  before a prompt is sent to ChatGPT or other supported chat UIs.
</p>

<p align="center">
  <a href="#-why">Why</a> ·
  <a href="#-features">Features</a> ·
  <a href="#-how-it-works">How it works</a> ·
  <a href="#-install">Install</a> ·
  <a href="#-development">Development</a> ·
  <a href="#-security">Security</a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/github/license/awhite0030/local-prompt-firewall?style=for-the-badge&color=10B981" alt="License"/></a>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome"/>
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Vitest-3-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest"/>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/awhite0030/local-prompt-firewall?style=for-the-badge&logo=github&color=FFD700" alt="Stars"/>
  <img src="https://img.shields.io/github/forks/awhite0030/local-prompt-firewall?style=for-the-badge&logo=github&color=8A2BE2" alt="Forks"/>
  <img src="https://img.shields.io/github/last-commit/awhite0030/local-prompt-firewall?style=for-the-badge&color=00C853" alt="Last commit"/>
  <img src="https://img.shields.io/github/issues/awhite0030/local-prompt-firewall?style=for-the-badge&color=E53935" alt="Issues"/>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge" alt="PRs welcome"/>
</p>

---

## ✨ Why

> *The prompt box is the easiest place to leak a secret.*

People paste API keys, emails, tokens and customer data into LLM chats. Cloud prompt scanners solve that by sending the same text to yet another server. This extension never does.

| Pain | What the firewall does |
| :--- | :--- |
| Secrets land in ChatGPT history | Detects common patterns and masks them in the input |
| SaaS DLP wants your prompt | Matching runs **only in the browser** |
| One regex is never enough | Custom rules, first-match wins |
| Hard to test a new rule | Options page includes a live pattern tester |

The extension only looks at text you type into supported chat inputs. Nothing is uploaded or logged remotely.

## 🧩 Features

<table>
  <tr>
    <td width="50%"><h3>🔍 Built-in patterns</h3>Emails, keys and other common secrets out of the box.</td>
    <td width="50%"><h3>🧩 Custom regex</h3>Add your own rules. First match wins. Case-sensitive by default.</td>
  </tr>
  <tr>
    <td><h3>🖥 Options page</h3>Enable rules, edit patterns, test them before saving.</td>
    <td><h3>🔒 On-device only</h3>Firewall logic makes no remote calls. Analysis never leaves the tab.</td>
  </tr>
</table>

## 🛠 How it works

```mermaid
flowchart LR
  T["Chat input"] --> CS["Content script"]
  CS --> C["@local-prompt-firewall/core"]
  C --> M["Masked text"]
  M --> LLM["ChatGPT / supported UI"]
```

1. Content script reads the composer text.
2. Core package runs built-in + custom patterns in order.
3. First hit is masked before the prompt is submitted.
4. After saving new patterns, reload the extension or refresh the tab.

After install, grant host permissions for ChatGPT (or other target domains). Without them the extension looks idle.

## 📦 Install

```bash
git clone https://github.com/awhite0030/local-prompt-firewall.git
cd local-prompt-firewall
npm install
npm run build
```

Then in Chrome: `chrome://extensions` → Developer mode → Load unpacked → select the built `dist` from the Chrome extension workspace.

## 🧪 Development

Requires Node.js 20+.

```text
local-prompt-firewall/
├── apps/chrome-extension/     # Vite + MV3 extension
├── packages/                  # shared core matcher
├── docs/
├── SECURITY.md
└── package.json
```

```bash
npm run build
npm test
npm run typecheck
```

## 🔐 Security

See [SECURITY.md](SECURITY.md). This is a local guardrail, not a substitute for corporate DLP. Do not paste production secrets into a chat box even with the extension enabled.

## 🤝 Contributing

PRs welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).

## 📄 License

[Apache-2.0](LICENSE) © 2026 Local Prompt Firewall contributors

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:34D399,100:07111A&height=120&section=footer" alt="footer"/>
</div>
