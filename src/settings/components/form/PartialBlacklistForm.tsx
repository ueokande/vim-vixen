import "./PartialBlacklistForm.scss";
import AddButton from "../ui/AddButton";
import DeleteButton from "../ui/DeleteButton";
import React from "react";
import Blacklist, { BlacklistItem } from "../../../shared/settings/Blacklist";

interface Props {
  value: Blacklist;
  onChange: (value: Blacklist) => void;
  onBlur: () => void;
}

class PartialBlacklistForm extends React.Component<Props> {
  public static defaultProps: Props = {
    value: new Blacklist([]),
    onChange: () => {},
    onBlur: () => {},
  };

  render() {
    return (
      <div className="form-partial-blacklist-form">
        <div className="form-partial-blacklist-form-header">
          <div className="column-url">URL</div>
          <div className="column-keys">Keys</div>
        </div>
        {this.props.value.items.map((item, index) => {
          if (!item.partial) {
            return null;
          }
          return (
            <div key={index} className="form-partial-blacklist-form-row">
              <input
                data-index={index}
                type="text"
                name="url"
                className="column-url"
                value={item.pattern}
                onChange={this.bindValue.bind(this)}
                onBlur={this.props.onBlur}
              />
              <input
                data-index={index}
                type="text"
                name="keys"
                className="column-keys"
                value={item.keys.join(",")}
                onChange={this.bindValue.bind(this)}
                onBlur={this.props.onBlur}
              />
              <DeleteButton
                data-index={index}
                name="delete"
                onClick={this.bindValue.bind(this)}
                onBlur={this.props.onBlur}
              />
            </div>
          );
        })}
        <AddButton
          name="add"
          style={{ float: "right" }}
          onClick={this.bindValue.bind(this)}
        />
      </div>
    );
  }

  bindValue(e: any) {
    const name = e.target.name;
    const index = e.target.getAttribute("data-index");
    const items = this.props.value.items;

    if (name === "url") {
      const current = items[index];
      items[index] = new BlacklistItem(e.target.value, true, current.keys);
    } else if (name === "keys") {
      const current = items[index];
      items[index] = new BlacklistItem(
        current.pattern,
        true,
        e.target.value.split(",")
      );
    } else if (name === "add") {
      items.push(new BlacklistItem("", true, []));
    } else if (name === "delete") {
      items.splice(index, 1);
    }

    this.props.onChange(new Blacklist(items));
    if (name === "delete") {
      this.props.onBlur();
    }
  }
}

export default PartialBlacklistForm;
