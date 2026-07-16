import { resolveAction } from "./policy.js";
import type { DetectorSource, EntityType, Finding, Policy } from "./types.js";

interface Candidate {
  type: EntityType;
  start: number;
  end: number;
  confidence: number;
  source: DetectorSource;
}

function addMatch(
  candidates: Candidate[],
  type: EntityType,
  start: number,
  end: number,
  confidence: number,
  source: DetectorSource
): void {
  if (start < end) candidates.push({ type, start, end, confidence, source });
}

function isLuhnValid(value: string): boolean {
  let sum = 0;
  let doubleDigit = false;
  for (let index = value.length - 1; index >= 0; index -= 1) {
    let digit = Number(value[index]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
}

function isIbanValid(value: string): boolean {
  if (value.length < 15 || value.length > 34) return false;
  const rearranged = `${value.slice(4)}${value.slice(0, 4)}`;
  let remainder = 0;
  for (const character of rearranged) {
    const digits = /[A-Z]/.test(character)
      ? String(character.charCodeAt(0) - 55)
      : character;
    for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder === 1;
}

function scanEmails(text: string, candidates: Candidate[]): void {
  const pattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  for (const match of text.matchAll(pattern)) {
    addMatch(candidates, "email", match.index!, match.index! + match[0].length, 0.99, "pattern");
  }
}

function scanPhones(text: string, candidates: Candidate[]): void {
  const pattern = /(?<!\w)(?:\+|00)\d(?:[\s().-]?\d){7,14}(?!\w)/g;
  for (const match of text.matchAll(pattern)) {
    const digits = match[0].replace(/\D/g, "");
    if (digits.length >= 8 && digits.length <= 15) {
      addMatch(candidates, "phone", match.index!, match.index! + match[0].length, 0.94, "pattern");
    }
  }
}

function scanPaymentCards(text: string, candidates: Candidate[]): void {
  const pattern = /(?<!\d)(?:\d[ -]?){12,18}\d(?!\d)/g;
  for (const match of text.matchAll(pattern)) {
    const digits = match[0].replace(/\D/g, "");
    if (digits.length >= 13 && digits.length <= 19 && isLuhnValid(digits)) {
      addMatch(candidates, "payment_card", match.index!, match.index! + match[0].length, 0.995, "checksum");
    }
  }
}

function scanCvv(text: string, candidates: Candidate[]): void {
  const pattern = /\b(?:cvv|cvc|security\s*code)\s*[:#-]?\s*(\d{3,4})\b/gi;
  for (const match of text.matchAll(pattern)) {
    const value = match[1];
    const relativeStart = match[0].lastIndexOf(value);
    const start = match.index! + relativeStart;
    addMatch(candidates, "cvv", start, start + value.length, 0.99, "context");
  }
}

function scanIbans(text: string, candidates: Candidate[]): void {
  const pattern = /\b[A-Z]{2}\d{2}(?:[ ]?[A-Z0-9]){11,30}\b/g;
  for (const match of text.matchAll(pattern)) {
    const iban = match[0].replace(/\s/g, "");
    if (isIbanValid(iban)) {
      addMatch(candidates, "iban", match.index!, match.index! + match[0].length, 0.995, "checksum");
    }
  }
}

function scanUrlSecrets(text: string, candidates: Candidate[]): void {
  const pattern = /[?&](?:token|secret|key|password|access_token)=([^&#\s]+)/gi;
  for (const match of text.matchAll(pattern)) {
    const value = match[1];
    const start = match.index! + match[0].lastIndexOf(value);
    addMatch(candidates, "url_secret", start, start + value.length, 0.99, "context");
  }
}

function scanApiKeys(text: string, candidates: Candidate[]): void {
  const patterns = [
    /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g,
    /\bgh[opsu]_[A-Za-z0-9]{30,}\b/g,
    /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g,
    /\bAKIA[0-9A-Z]{16}\b/g,
    /\bAIza[A-Za-z0-9_-]{35}\b/g,
    /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g
  ];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      addMatch(candidates, "api_key", match.index!, match.index! + match[0].length, 0.995, "pattern");
    }
  }
}

function removeOverlaps(candidates: Candidate[]): Candidate[] {
  const sorted = [...candidates].sort((left, right) =>
    left.start - right.start || right.end - left.end || right.confidence - left.confidence
  );
  const accepted: Candidate[] = [];
  for (const candidate of sorted) {
    if (!accepted.some((item) => candidate.start < item.end && candidate.end > item.start)) {
      accepted.push(candidate);
    }
  }
  return accepted;
}

export function scan(text: string, policy: Policy = {}): Finding[] {
  const candidates: Candidate[] = [];
  scanEmails(text, candidates);
  scanPhones(text, candidates);
  scanPaymentCards(text, candidates);
  scanCvv(text, candidates);
  scanIbans(text, candidates);
  scanUrlSecrets(text, candidates);
  scanApiKeys(text, candidates);

  return removeOverlaps(candidates)
    .map((candidate) => ({ ...candidate, action: resolveAction(candidate.type, policy) }))
    .filter((finding) => finding.action !== "off");
}
