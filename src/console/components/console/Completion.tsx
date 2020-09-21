import React from "react";
import CompletionItem from "./CompletionItem";
import CompletionTitle from "./CompletionTitle";

interface Item {
  icon?: string;
  caption?: string;
  url?: string;
}

interface Group {
  name: string;
  items: Item[];
}

interface Props {
  select: number;
  size: number;
  completions: Group[];
}

interface State {
  viewOffset: number;
  select: number;
}

class Completion extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { viewOffset: 0, select: -1 };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (prevState.select === nextProps.select) {
      return null;
    }

    const viewSelect = (() => {
      let index = 0;
      for (let i = 0; i < nextProps.completions.length; ++i) {
        ++index;
        const g = nextProps.completions[i];
        if (nextProps.select + i + 1 < index + g.items.length) {
          return nextProps.select + i + 1;
        }
        index += g.items.length;
      }
      return -1;
    })();

    let viewOffset = 0;
    if (nextProps.select < 0) {
      viewOffset = 0;
    } else if (prevState.select < nextProps.select) {
      viewOffset = Math.max(
        prevState.viewOffset,
        viewSelect - nextProps.size + 1
      );
    } else if (prevState.select > nextProps.select) {
      viewOffset = Math.min(prevState.viewOffset, viewSelect);
    }
    return { viewOffset, select: nextProps.select };
  }

  render() {
    let itemIndex = 0;
    let viewIndex = 0;
    const groups: Array<JSX.Element> = [];
    const viewOffset = this.state.viewOffset;
    const viewSize = this.props.size;

    this.props.completions.forEach((group, groupIndex) => {
      const items = [];
      const title = (
        <CompletionTitle
          id={`title-${groupIndex}`}
          key={`group-${groupIndex}`}
          shown={viewOffset <= viewIndex && viewIndex < viewOffset + viewSize}
          title={group.name}
        />
      );
      ++viewIndex;
      for (const item of group.items) {
        items.push(
          <CompletionItem
            shown={viewOffset <= viewIndex && viewIndex < viewOffset + viewSize}
            key={`item-${itemIndex}`}
            icon={item.icon}
            caption={item.caption}
            url={item.url}
            highlight={itemIndex === this.props.select}
            aria-selected={itemIndex === this.props.select}
            role="menuitem"
          />
        );
        ++viewIndex;
        ++itemIndex;
      }
      groups.push(
        <div
          key={`group-${groupIndex}`}
          role="group"
          aria-describedby={`title-${groupIndex}`}
        >
          {title}
          <ul>{items}</ul>
        </div>
      );
    });

    return <div role="menu">{groups}</div>;
  }
}

export default Completion;
