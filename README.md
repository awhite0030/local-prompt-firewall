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

After saving new patterns, reload the extension (or just refresh the ChatGPT tab) so the content script picks up the latest rules.

Custom patterns are case-sensitive by default (use a case-insensitive flag if you need otherwise).

After installing, you may need to grant site access / host permissions for the ChatGPT (or other) domains you want the firewall to protect — otherwise it can look inactive until those are confirmed. Check the extension details in Chrome if it seems quiet on first use.

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
- Optional subtle badge/toast when something was masked (session counter?)
- Docs tip about testing custom patterns in options page
- Optional keyboard shortcut to toggle the firewall (#47)

## Contributing
PRs and ideas welcome! Check the open issues for small polish ideas. ❤️
