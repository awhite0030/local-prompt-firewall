import type { Replacement } from "@local-prompt-firewall/core";
import type { MappingResponse, Message } from "./messages.js";

const keyFor = (tabId: number) => `local-prompt-firewall:tab:${tabId}`;

async function getMappings(tabId: number): Promise<Replacement[]> {
  const result = await chrome.storage.session.get(keyFor(tabId));
  return (result[keyFor(tabId)] as Replacement[] | undefined) ?? [];
}

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  if (tabId === undefined) return false;

  if (message.type === "set-mappings") {
    void (async () => {
      const existing = await getMappings(tabId);
      const merged = [...existing, ...message.replacements].filter(
        (replacement, index, all) => all.findIndex((item) => item.token === replacement.token) === index
      );
      await chrome.storage.session.set({ [keyFor(tabId)]: merged });
      sendResponse({ ok: true });
    })();
    return true;
  }

  if (message.type === "get-mappings") {
    void getMappings(tabId).then((replacements) => sendResponse({ replacements } satisfies MappingResponse));
    return true;
  }

  if (message.type === "clear-mappings") {
    void chrome.storage.session.remove(keyFor(tabId)).then(() => sendResponse({ ok: true }));
    return true;
  }

  return false;
});

chrome.tabs.onRemoved.addListener((tabId) => {
  void chrome.storage.session.remove(keyFor(tabId));
});
