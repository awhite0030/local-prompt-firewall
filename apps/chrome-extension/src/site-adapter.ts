export interface SiteAdapter {
  findComposer(): HTMLElement | null;
  readComposer(composer: HTMLElement): string;
  writeComposer(composer: HTMLElement, text: string): void;
  isSendButton(element: Element): boolean;
}

function visible(elements: HTMLElement[]): HTMLElement[] {
  return elements.filter((element) => {
    const style = window.getComputedStyle(element);
    return style.visibility !== "hidden" && style.display !== "none" && element.getClientRects().length > 0;
  });
}

export const chatGptAdapter: SiteAdapter = {
  findComposer() {
    const candidates = visible(
      Array.from(document.querySelectorAll<HTMLElement>(
        "textarea, [contenteditable='true'][role='textbox'], div[contenteditable='true']"
      ))
    );
    return candidates.at(-1) ?? null;
  },

  readComposer(composer) {
    return composer instanceof HTMLTextAreaElement ? composer.value : composer.innerText;
  },

  writeComposer(composer, text) {
    if (composer instanceof HTMLTextAreaElement) {
      const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
      nativeSetter?.call(composer, text);
    } else {
      composer.focus();
      document.execCommand("selectAll", false);
      document.execCommand("insertText", false, text);
    }
    composer.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
  },

  isSendButton(element) {
    const button = element.closest("button");
    if (!button || button.disabled) return false;
    const label = `${button.getAttribute("aria-label") ?? ""} ${button.getAttribute("data-testid") ?? ""}`.toLowerCase();
    return label.includes("send") || label.includes("submit");
  }
};
