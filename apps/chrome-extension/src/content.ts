import { restore, sanitize, scan, type Finding, type Replacement } from "@local-prompt-firewall/core";
import type { MappingResponse, Message } from "./messages.js";
import { chatGptAdapter, type SiteAdapter } from "./site-adapter.js";

type SendAction =
  | { kind: "click"; target: HTMLButtonElement }
  | { kind: "keyboard"; target: HTMLElement };

const adapter: SiteAdapter = chatGptAdapter;
let bypassNextSubmission = false;

function sendMessage<T>(message: Message): Promise<T> {
  return chrome.runtime.sendMessage(message) as Promise<T>;
}

function groupFindings(findings: readonly Finding[]): string {
  const grouped = new Map<string, number>();
  for (const finding of findings) grouped.set(finding.type, (grouped.get(finding.type) ?? 0) + 1);
  return [...grouped.entries()]
    .map(([type, count]) => `<li><strong>${count}</strong> ${type.replaceAll("_", " ")}</li>`)
    .join("");
}

function destroyDialog(): void {
  document.getElementById("local-prompt-firewall-dialog")?.remove();
}

function showDialog(options: {
  title: string;
  body: string;
  actions: Array<{ label: string; primary?: boolean; onClick: () => void | Promise<void> }>;
}): void {
  destroyDialog();
  const host = document.createElement("div");
  host.id = "local-prompt-firewall-dialog";
  host.setAttribute("role", "dialog");
  host.setAttribute("aria-modal", "true");
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:rgba(0,0,0,.45);font-family:system-ui,sans-serif;color:#172033";
  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      .card{width:min(480px,calc(100vw - 32px));border-radius:16px;background:#fff;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.28)}
      h2{margin:0 0 12px;font-size:20px}p{line-height:1.45}.actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:20px}
      button{border:1px solid #cbd5e1;border-radius:8px;background:#fff;padding:9px 12px;cursor:pointer;font:inherit}button.primary{background:#0f766e;border-color:#0f766e;color:#fff}
      ul{padding-left:20px}textarea{box-sizing:border-box;width:100%;min-height:120px;font:12px ui-monospace,monospace}
    </style>
    <section class="card"><h2>${options.title}</h2><div>${options.body}</div><div class="actions"></div></section>`;
  const actions = shadow.querySelector(".actions")!;
  for (const action of options.actions) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    if (action.primary) button.className = "primary";
    button.addEventListener("click", () => void action.onClick());
    actions.append(button);
  }
  document.documentElement.append(host);
  shadow.querySelector("button")?.focus();
}

function replay(action: SendAction): void {
  bypassNextSubmission = true;
  if (action.kind === "click") {
    action.target.click();
    return;
  }
  const sendButton = Array.from(document.querySelectorAll("button")).find((button) => adapter.isSendButton(button));
  if (sendButton instanceof HTMLButtonElement) {
    sendButton.click();
    return;
  }
  bypassNextSubmission = false;
  action.target.focus();
  showDialog({
    title: "Prompt masked",
    body: "<p>The prompt was safely tokenized, but ChatGPT’s send control was not available. Review it and press Send manually.</p>",
    actions: [{ label: "Close", onClick: destroyDialog }]
  });
}

async function inspectAndPrompt(action: SendAction): Promise<void> {
  const composer = adapter.findComposer();
  if (!composer) return;
  const text = adapter.readComposer(composer);
  const findings = scan(text);
  if (findings.length === 0) {
    replay(action);
    return;
  }

  showDialog({
    title: "Sensitive text detected",
    body: `<p>Local Prompt Firewall found the following items. Raw values are not displayed here.</p><ul>${groupFindings(findings)}</ul><p>“Mask and send” replaces each value with an opaque token before ChatGPT receives it.</p>`,
    actions: [
      { label: "Edit prompt", onClick: destroyDialog },
      {
        label: "Allow once",
        onClick: () => {
          destroyDialog();
          replay(action);
        }
      },
      {
        label: "Mask and send",
        primary: true,
        onClick: async () => {
          const result = sanitize(text, findings, { tokenNamespace: crypto.randomUUID().replaceAll("-", "") });
          adapter.writeComposer(composer, result.safeText);
          await sendMessage<{ ok: boolean }>({ type: "set-mappings", replacements: result.replacements });
          destroyDialog();
          replay(action);
        }
      }
    ]
  });
}

function interceptedKeyboard(event: KeyboardEvent): boolean {
  return event.key === "Enter" && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey && Boolean(adapter.findComposer());
}

document.addEventListener(
  "keydown",
  (event) => {
    if (!interceptedKeyboard(event)) return;
    if (bypassNextSubmission) {
      bypassNextSubmission = false;
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    void inspectAndPrompt({ kind: "keyboard", target: event.target instanceof HTMLElement ? event.target : document.body });
  },
  true
);

document.addEventListener(
  "click",
  (event) => {
    if (!(event.target instanceof Element) || !adapter.isSendButton(event.target)) return;
    if (bypassNextSubmission) {
      bypassNextSubmission = false;
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    const button = event.target.closest("button");
    if (button instanceof HTMLButtonElement) void inspectAndPrompt({ kind: "click", target: button });
  },
  true
);

function showRestoredSelection(selection: string, replacements: Replacement[]): void {
  const restored = restore(selection, replacements);
  if (restored === selection) {
    showDialog({ title: "No session tokens found", body: "<p>The selected text does not contain tokens from this tab’s current browser session.</p>", actions: [{ label: "Close", onClick: destroyDialog }] });
    return;
  }
  showDialog({
    title: "Restored text",
    body: `<p>Review before copying. This value never leaves the browser.</p><textarea readonly>${restored.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</textarea>`,
    actions: [
      { label: "Close", onClick: destroyDialog },
      {
        label: "Copy",
        primary: true,
        onClick: async () => {
          await navigator.clipboard.writeText(restored);
          destroyDialog();
        }
      }
    ]
  });
}

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  if (message.type === "clear-mappings") {
    void (async () => {
      await sendMessage<{ ok: boolean }>({ type: "clear-mappings" });
      sendResponse({ ok: true });
    })();
    return true;
  }
  if (message.type !== "restore-selection") return false;
  void (async () => {
    const selection = window.getSelection()?.toString() ?? "";
    const { replacements } = await sendMessage<MappingResponse>({ type: "get-mappings" });
    showRestoredSelection(selection, replacements);
    sendResponse({ ok: true });
  })();
  return true;
});
