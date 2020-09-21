import React from "react";
import styled from "styled-components";
import AddButton from "../ui/AddButton";
import DeleteButton from "../ui/DeleteButton";
import Blacklist, { BlacklistItem } from "../../../shared/settings/Blacklist";

const Grid = styled.div``;

const GridHeader = styled.div`
  display: flex;
  font-weight: bold;
`;

const GridRow = styled.div`
  display: flex;
`;

const GridCell = styled.div<{ grow?: number }>`
  &:nth-child(1) {
    flex-grow: 5;
  }

  &:nth-child(2) {
    flex-shrink: 1;
    min-width: 20%;
    max-width: 20%;
  }

  &:nth-child(3) {
    flex-shrink: 1;
  }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
`;

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
      <>
        <Grid>
          <GridHeader>
            <GridCell>URL</GridCell>
            <GridCell>Keys</GridCell>
          </GridHeader>
          {this.props.value.items.map((item, index) => {
            if (!item.partial) {
              return null;
            }
            return (
              <GridRow key={index}>
                <GridCell>
                  <Input
                    data-index={index}
                    type="text"
                    name="url"
                    value={item.pattern}
                    placeholder="example.com/mail/*"
                    onChange={this.bindValue.bind(this)}
                    onBlur={this.props.onBlur}
                  />
                </GridCell>
                <GridCell>
                  <Input
                    data-index={index}
                    type="text"
                    name="keys"
                    value={item.keys.join(",")}
                    placeholder="j,k,<C-d>,<C-u>"
                    onChange={this.bindValue.bind(this)}
                    onBlur={this.props.onBlur}
                  />
                </GridCell>
                <GridCell>
                  <DeleteButton
                    data-index={index}
                    name="delete"
                    onClick={this.bindValue.bind(this)}
                    onBlur={this.props.onBlur}
                  />
                </GridCell>
              </GridRow>
            );
          })}
        </Grid>
        <AddButton
          name="add"
          style={{ float: "right" }}
          onClick={this.bindValue.bind(this)}
        />
      </>
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
