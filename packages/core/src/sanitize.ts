import type { Finding, Replacement, SanitizeOptions, SanitizeResult } from "./types.js";

const TOKEN_PREFIX = "LPF";

function tokenFor(type: Finding["type"], ordinal: number, namespace?: string): string {
  const encodedNamespace = namespace ? `:${namespace}` : "";
  return `[[${TOKEN_PREFIX}${encodedNamespace}:${type.toUpperCase()}:${String(ordinal).padStart(2, "0")}]]`;
}

export function sanitize(text: string, findings: readonly Finding[], options: SanitizeOptions = {}): SanitizeResult {
  if (options.tokenNamespace && !/^[A-Za-z0-9_-]{1,64}$/.test(options.tokenNamespace)) {
    throw new Error("tokenNamespace must contain 1-64 ASCII letters, digits, underscores, or hyphens");
  }
  const ordered = [...findings]
    .sort((left, right) => left.start - right.start)
    .map((finding, index) => ({
      finding,
      token: tokenFor(finding.type, index + 1, options.tokenNamespace)
    }));
  const replacements: Replacement[] = ordered.map(({ finding, token }) => ({
    token,
    original: text.slice(finding.start, finding.end),
    type: finding.type
  }));
  let safeText = text;

  for (const { finding, token } of [...ordered].reverse()) {
    safeText = `${safeText.slice(0, finding.start)}${token}${safeText.slice(finding.end)}`;
  }

  return { safeText, replacements };
}

export function restore(text: string, replacements: readonly Replacement[]): string {
  return replacements.reduce((result, replacement) => result.split(replacement.token).join(replacement.original), text);
}
