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

const Completion: React.FC<Props> = ({ select, size, completions }) => {
  const [viewOffset, setViewOffset] = React.useState(0);
  const [prevSelect, setPrevSelect] = React.useState(-1);

  React.useEffect(() => {
    if (select === prevSelect) {
      return;
    }

    const viewSelect = (() => {
      let index = 0;
      for (let i = 0; i < completions.length; ++i) {
        ++index;
        const g = completions[i];
        if (select + i + 1 < index + g.items.length) {
          return select + i + 1;
        }
        index += g.items.length;
      }
      return -1;
    })();

    const nextViewOffset = (() => {
      if (prevSelect < select) {
        return Math.max(viewOffset, viewSelect - size + 1);
      } else if (prevSelect > select) {
        return Math.min(viewOffset, viewSelect);
      }
      return 0;
    })();

    setPrevSelect(select);
    setViewOffset(nextViewOffset);
  }, [select]);

  let itemIndex = 0;
  let viewIndex = 0;
  const groups: Array<JSX.Element> = [];

  completions.forEach((group, groupIndex) => {
    const items = [];
    const title = (
      <CompletionTitle
        id={`title-${groupIndex}`}
        key={`group-${groupIndex}`}
        shown={viewOffset <= viewIndex && viewIndex < viewOffset + size}
        title={group.name}
      />
    );
    ++viewIndex;
    for (const item of group.items) {
      items.push(
        <CompletionItem
          shown={viewOffset <= viewIndex && viewIndex < viewOffset + size}
          key={`item-${itemIndex}`}
          icon={item.icon}
          caption={item.caption}
          url={item.url}
          highlight={itemIndex === select}
          aria-selected={itemIndex === select}
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
};

export default Completion;
