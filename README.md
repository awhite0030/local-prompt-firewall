# Local Prompt Firewall

Local-first Chrome extension that detects and masks sensitive text before ChatGPT prompts are sent.

Everything runs on-device — no data leaves your browser for analysis. Patterns and masking happen entirely client-side.

## Features
- Detects common sensitive patterns (emails, keys, etc.)
- Custom rules support
- Simple options page

Tip: the extension only looks at the text you type into supported chat inputs. Nothing is uploaded or logged remotely.

Note: all matching and masking happens locally in the browser — no remote calls are made for the firewall logic itself.

## Development
```bash
npm install
npm run build
```

Load the `dist` folder as an unpacked extension in Chrome.

## TODO
- More pattern presets
- Better options UI polish
- Optional indicator for last matched pattern (see open issues)

## Contributing
PRs and ideas welcome! ❤️
