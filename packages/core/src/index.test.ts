import { describe, expect, it } from "vitest";
import { restore, sanitize, scan } from "./index.js";

describe("scan", () => {
  it("detects high-confidence formats without recording values in findings", () => {
    const text = [
      "Write to jane@example.com or call +44 20 7946 0018.",
      "Card: 4242 4242 4242 4242. CVV: 123.",
      "IBAN: GB82 WEST 1234 5698 7654 32.",
      "https://example.test/callback?access_token=very-secret-value",
      "AWS key AKIAIOSFODNN7EXAMPLE"
    ].join(" ");
    const findings = scan(text);

    expect(findings.map((finding) => finding.type)).toEqual([
      "email",
      "phone",
      "payment_card",
      "cvv",
      "iban",
      "url_secret",
      "api_key"
    ]);
    expect(findings.every((finding) => !("value" in finding))).toBe(true);
  });

  it("does not confuse invalid card-like values with payment cards", () => {
    expect(scan("This identifier is 4242 4242 4242 4243").some((item) => item.type === "payment_card")).toBe(false);
  });

  it("honors policy overrides", () => {
    const findings = scan("Contact jane@example.com", { email: "off" });
    expect(findings).toHaveLength(0);
  });
});

describe("sanitize and restore", () => {
  it("uses opaque, reversible tokens", () => {
    const input = "Card 4242 4242 4242 4242, email jane@example.com";
    const result = sanitize(input, scan(input));

    expect(result.safeText).not.toContain("4242 4242 4242 4242");
    expect(result.safeText).not.toContain("jane@example.com");
    expect(result.safeText).toContain("[[LPF:PAYMENT_CARD:01]]");
    expect(restore(result.safeText, result.replacements)).toBe(input);
  });

  it("uses an integration-provided namespace to prevent cross-message token collisions", () => {
    const first = sanitize("first@example.test", scan("first@example.test"), { tokenNamespace: "message-a" });
    const second = sanitize("second@example.test", scan("second@example.test"), { tokenNamespace: "message-b" });

    expect(first.replacements[0].token).toBe("[[LPF:message-a:EMAIL:01]]");
    expect(second.replacements[0].token).toBe("[[LPF:message-b:EMAIL:01]]");
    expect(first.replacements[0].token).not.toBe(second.replacements[0].token);
  });
});
