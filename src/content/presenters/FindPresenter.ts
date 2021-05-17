import { RangeData } from "../usecases/FindUseCase";

export default interface FindPresenter {
  selectKeyword(keyword: string, rangeData: RangeData): void;

  clearSelection(): void;
}

const cache: { [key: string]: Node[] } = {};

export class FindPresenterImpl implements FindPresenter {
  clearSelection(): void {
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
    }
  }

  selectKeyword(keyword: string, rangeData: RangeData) {
    const selection = window.getSelection();
    if (!selection) {
      return;
    }
    const textNodes = this.getAllTextNode(keyword);
    const textNode = textNodes[rangeData.startTextNodePos];
    const range = document.createRange();
    range.selectNode(textNode);
    range.setStart(
      textNodes[rangeData.startTextNodePos],
      rangeData.startOffset
    );
    range.setEnd(textNodes[rangeData.endTextNodePos], rangeData.endOffset);
    if (selection.rangeCount > 0) {
      selection.removeAllRanges();
    }
    selection.addRange(range);

    textNode.parentElement!.scrollIntoView({ block: "center" });
  }

  private getAllTextNode(keyword: string) {
    if (typeof cache[keyword] !== "undefined") {
      return cache[keyword];
    }

    const recursive = (root: Node): Array<Node> => {
      let textNodes: Array<Node> = [];
      for (let node = root.firstChild; node != null; node = node?.nextSibling) {
        if (node.nodeType == Node.TEXT_NODE) {
          textNodes.push(node);
        } else {
          textNodes = textNodes.concat(recursive(node));
        }
      }
      return textNodes;
    };

    const textNodes = recursive(document.getRootNode());
    cache[keyword] = textNodes;
    return textNodes;
  }
}
