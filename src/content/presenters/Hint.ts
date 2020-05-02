import * as doms from "../../shared/utils/dom";

interface Point {
  x: number;
  y: number;
}

const hintPosition = (element: Element): Point => {
  const { left, top, right, bottom } = doms.viewportRect(element);

  if (element.tagName !== "AREA") {
    return { x: left, y: top };
  }

  return {
    x: (left + right) / 2,
    y: (top + bottom) / 2,
  };
};

export default abstract class Hint {
  private hint: HTMLElement;

  private tag: string;

  constructor(target: HTMLElement, tag: string) {
    this.tag = tag;

    const doc = target.ownerDocument;
    if (doc === null) {
      throw new TypeError("ownerDocument is null");
    }

    const { x, y } = hintPosition(target);
    const { scrollX, scrollY } = window;

    const hint = doc.createElement("span");
    hint.className = "vimvixen-hint";
    hint.textContent = tag;
    hint.style.left = x + scrollX + "px";
    hint.style.top = y + scrollY + "px";

    doc.body.append(hint);

    this.hint = hint;
    this.show();
  }

  show(): void {
    this.hint.style.display = "inline";
  }

  hide(): void {
    this.hint.style.display = "none";
  }

  remove(): void {
    this.hint.remove();
  }

  getTag(): string {
    return this.tag;
  }
}

export class LinkHint extends Hint {
  private target: HTMLAnchorElement | HTMLAreaElement;

  constructor(target: HTMLAnchorElement | HTMLAreaElement, tag: string) {
    super(target, tag);

    this.target = target;
  }

  getLink(): string {
    return this.target.href;
  }

  getLinkTarget(): string | null {
    return this.target.getAttribute("target");
  }

  click(): void {
    this.target.click();
  }
}

export class InputHint extends Hint {
  private target: HTMLElement;

  constructor(target: HTMLElement, tag: string) {
    super(target, tag);

    this.target = target;
  }

  activate(): void {
    const target = this.target;
    switch (target.tagName.toLowerCase()) {
      case "input":
        switch ((target as HTMLInputElement).type) {
          case "file":
          case "checkbox":
          case "radio":
          case "submit":
          case "reset":
          case "button":
          case "image":
          case "color":
            return target.click();
          default:
            return target.focus();
        }
      case "textarea":
        return target.focus();
      case "button":
      case "summary":
        return target.click();
      default:
        if (doms.isContentEditable(target)) {
          return target.focus();
        } else if (target.hasAttribute("tabindex")) {
          return target.click();
        }
    }
  }
}
