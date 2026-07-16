export { scan } from "./detectors.js";
export { DEFAULT_POLICY, resolveAction } from "./policy.js";
export { restore, sanitize } from "./sanitize.js";
export type {
  DetectorSource,
  EntityType,
  Finding,
  Policy,
  PolicyAction,
  Replacement,
  SanitizeOptions,
  SanitizeResult
} from "./types.js";
