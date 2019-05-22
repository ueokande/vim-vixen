export default interface ClipboardRepository {
  read(): string;

  write(text: string): void;
}

export class ClipboardRepositoryImpl {
  read(): string {
    let textarea = window.document.createElement('textarea');
    window.document.body.append(textarea);

    textarea.style.position = 'fixed';
    textarea.style.top = '-100px';
    textarea.contentEditable = 'true';
    textarea.focus();

    let ok = window.document.execCommand('paste');
    let value = textarea.textContent!!;
    textarea.remove();

    if (!ok) {
      throw new Error('failed to access clipbaord');
    }

    return value;
  }

  write(text: string): void {
    let input = window.document.createElement('input');
    window.document.body.append(input);

    input.style.position = 'fixed';
    input.style.top = '-100px';
    input.value = text;
    input.select();

    let ok = window.document.execCommand('copy');
    input.remove();

    if (!ok) {
      throw new Error('failed to access clipbaord');
    }
  }
}
