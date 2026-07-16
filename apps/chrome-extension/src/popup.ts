import "./popup.css";

const status = document.querySelector<HTMLOutputElement>("#status")!;

async function activeChatTab(): Promise<chrome.tabs.Tab | undefined> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

document.querySelector<HTMLButtonElement>("#restore")!.addEventListener("click", async () => {
  const tab = await activeChatTab();
  if (!tab?.id || !tab.url?.match(/^https:\/\/(chatgpt\.com|chat\.openai\.com)\//)) {
    status.value = "Open a ChatGPT tab and select text containing Local Prompt Firewall tokens.";
    return;
  }
  await chrome.tabs.sendMessage(tab.id, { type: "restore-selection" });
  status.value = "Opened the restore panel in ChatGPT.";
});

document.querySelector<HTMLButtonElement>("#clear")!.addEventListener("click", async () => {
  const tab = await activeChatTab();
  if (!tab?.id) return;
  await chrome.tabs.sendMessage(tab.id, { type: "clear-mappings" });
  status.value = "Session mappings cleared for this tab.";
});
