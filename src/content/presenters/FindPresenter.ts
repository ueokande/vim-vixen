import { RangeData } from "../usecases/FindUseCase";

export default interface FindPresenter {
  selectKeyword(rangeData: RangeData): void;

  clearSelection(): void;
}

export class FindPresenterImpl implements FindPresenter {
  clearSelection(): void {
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
    }
  }

  selectKeyword(rangeData: RangeData) {
    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    const textNodes = this.getAllTextNode();
    const range = document.createRange();
    range.selectNode(textNodes[rangeData.startTextNodePos]);
    range.setStart(
      textNodes[rangeData.startTextNodePos],
      rangeData.startOffset
    );
    range.setEnd(textNodes[rangeData.endTextNodePos], rangeData.endOffset);
    if (selection.rangeCount > 0) {
      selection.removeAllRanges();
    }
    selection.addRange(range);
  }

  private getAllTextNode() {
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

    return recursive(document.getRootNode());
  }
}
