import type { EntityType, Policy, PolicyAction } from "./types.js";

export const DEFAULT_POLICY: Readonly<Record<EntityType, PolicyAction>> = {
  email: "warn",
  phone: "warn",
  payment_card: "mask",
  cvv: "mask",
  iban: "mask",
  url_secret: "mask",
  api_key: "mask"
};

export function resolveAction(type: EntityType, policy: Policy = {}): PolicyAction {
  return policy[type] ?? DEFAULT_POLICY[type];
}
