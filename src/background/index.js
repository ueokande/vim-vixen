browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Pressed " + request.which);
  sendResponse({ response: "Response from background script" });
});
