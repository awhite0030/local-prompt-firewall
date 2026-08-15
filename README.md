# Local Prompt Firewall

Local-first Chrome extension that detects and masks sensitive text before ChatGPT prompts are sent.

Everything runs on-device — no data leaves your browser for analysis. Patterns and masking happen entirely client-side.

## Features
- Detects common sensitive patterns (emails, keys, etc.)
- Custom rules support
- Simple options page

Tip: the extension only looks at the text you type into supported chat inputs. Nothing is uploaded or logged remotely.

## Development
```bash
npm install
npm run build
```

Load the `dist` folder as an unpacked extension in Chrome.

## TODO
- More pattern presets
- Better options UI polish

## Contributing
PRs and ideas welcome! ❤️
