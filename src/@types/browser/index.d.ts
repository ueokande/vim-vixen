// NOTE: window.find is not standard API
// https://developer.mozilla.org/en-US/docs/Web/API/Window/find
interface Window {
  find(
    aString: string,
    aCaseSensitive?: boolean,
    aBackwards?: boolean,
    aWrapAround?: boolean,
    aWholeWord?: boolean,
    aSearchInFrames?: boolean,
    aShowDialog?: boolean
  ): boolean;
}
