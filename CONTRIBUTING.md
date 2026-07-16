# Contributing

Thanks for improving Local Prompt Firewall.

## Ground rules

- Never commit real personal data, API keys, credentials, or copied production prompts.
- Use clearly synthetic fixtures such as `jane@example.test` and the well-known test card `4242 4242 4242 4242`.
- Keep detection changes high precision and explain expected false-positive/false-negative behaviour in the pull request.
- Do not add telemetry, network calls, remote code, or broader host permissions without a maintainer-approved threat-model update.

## Development workflow

1. Open an issue or discussion for material detector or UI changes.
2. Add regression tests for each detection rule and its negative cases.
3. Run `npm test`, `npm run typecheck`, and `npm run build`.
4. Submit a focused pull request using the template.

By contributing, you agree that your contributions are licensed under Apache-2.0.
