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
    let eles = [];
    let index = 0;

    for (const group of this.props.completions) {
      eles.push(<CompletionTitle key={`group-${index}`} title={group.name} />);
      for (const item of group.items) {
        eles.push(
          <CompletionItem
            key={`item-${index}`}
            icon={item.icon}
            caption={item.caption}
            url={item.url}
            highlight={index === this.props.select}
          />
        );
        ++index;
      }
    }

    const viewOffset = this.state.viewOffset;
    eles = eles.slice(viewOffset, viewOffset + this.props.size);

    return <ul>{eles}</ul>;
  }
}

export default Completion;
