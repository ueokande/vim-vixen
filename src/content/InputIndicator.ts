export default class InputIndicator {

  constructor() {
    document.addEventListener("DOMContentLoaded", this.onDetectFocus, true)
    window.addEventListener("focus", this.onDetectFocus, true);
    window.addEventListener("blur", this.onDetectFocus, true);
    this.onDetectFocus();
  }

  private onDetectFocus() {
    if (document!.activeElement!.tagName === "BODY"){
        document.getElementById("vimvixen-console-frame")!.classList.add("vimvixen-indicate-border-active");
    } else {
        document.getElementById("vimvixen-console-frame")!.classList.remove("vimvixen-indicate-border-active");
    }
  }
}
