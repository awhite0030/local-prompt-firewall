# Local Prompt Firewall

Local-first Chrome extension that detects and masks sensitive text before ChatGPT prompts are sent.

Everything runs on-device — no data leaves your browser for analysis. Patterns and masking happen entirely client-side.

## Features
- Detects common sensitive patterns (emails, keys, etc.)
- Custom rules support
- Simple options page

Tip: the extension only looks at the text you type into supported chat inputs. Nothing is uploaded or logged remotely.

Note: all matching and masking happens locally in the browser — no remote calls are made for the firewall logic itself.

Patterns are evaluated in the order they appear; the first matching pattern is used (first-match wins).

You can test custom patterns directly in the options page before saving — handy when writing new regexes.

After saving new patterns, you may need to reload the extension (or the options page) for the changes to take full effect.

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
PRs and ideas welcome! Check the open issues for small polish ideas. ❤️
