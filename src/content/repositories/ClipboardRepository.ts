export default interface ClipboardRepository {
  read(): string;

  write(text: string): void;
}

export class ClipboardRepositoryImpl {
  read(): string {
    const textarea = window.document.createElement("textarea");
    window.document.body.append(textarea);

    textarea.style.position = "fixed";
    textarea.style.top = "-100px";
    textarea.contentEditable = "true";
    textarea.focus();

    const ok = window.document.execCommand("paste");
    const value = textarea.value;
    textarea.remove();

    if (!ok) {
      throw new Error("failed to access clipbaord");
    }

    return value;
  }

  write(text: string): void {
    const input = window.document.createElement("input");
    window.document.body.append(input);

    input.style.position = "fixed";
    input.style.top = "-100px";
    input.value = text;
    input.select();

    const ok = window.document.execCommand("copy");
    input.remove();

    if (!ok) {
      throw new Error("failed to access clipbaord");
    }
  }
}
