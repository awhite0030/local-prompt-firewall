import type { Replacement } from "@local-prompt-firewall/core";

export type Message =
  | { type: "set-mappings"; replacements: Replacement[] }
  | { type: "get-mappings" }
  | { type: "clear-mappings" }
  | { type: "restore-selection" };

export interface MappingResponse {
  replacements: Replacement[];
}
