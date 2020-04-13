import React from "react";
import PropTypes from "prop-types";

interface Props {
  highlight: boolean;
  caption?: string;
  url?: string;
  icon?: string;
}

const CompletionItem = (props: Props) => {
  let className = "vimvixen-console-completion-item";
  if (props.highlight) {
    className += " vimvixen-completion-selected";
  }
  return (
    <li
      className={className}
      style={{ backgroundImage: "url(" + props.icon + ")" }}
    >
      <span className="vimvixen-console-completion-item-caption">
        {props.caption}
      </span>
      <span className="vimvixen-console-completion-item-url">{props.url}</span>
    </li>
  );
};

CompletionItem.propTypes = {
  highlight: PropTypes.bool,
  caption: PropTypes.string,
  url: PropTypes.string,
};

export default CompletionItem;
