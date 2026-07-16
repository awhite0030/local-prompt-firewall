export type EntityType =
  | "email"
  | "phone"
  | "payment_card"
  | "cvv"
  | "iban"
  | "url_secret"
  | "api_key";

export type PolicyAction = "off" | "warn" | "mask";

export type DetectorSource = "pattern" | "checksum" | "context";

export interface Finding {
  type: EntityType;
  start: number;
  end: number;
  confidence: number;
  source: DetectorSource;
  action: PolicyAction;
}

export type Policy = Partial<Record<EntityType, PolicyAction>>;

export interface Replacement {
  token: string;
  original: string;
  type: EntityType;
}

export interface SanitizeResult {
  safeText: string;
  replacements: Replacement[];
}

export interface SanitizeOptions {
  /**
   * Optional ASCII namespace embedded in tokens. Browser integrations should
   * provide a fresh value per submission to prevent token collisions.
   */
  tokenNamespace?: string;
}
