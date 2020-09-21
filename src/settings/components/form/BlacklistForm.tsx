import styled from "styled-components";
import AddButton from "../ui/AddButton";
import DeleteButton from "../ui/DeleteButton";
import React from "react";
import Blacklist, { BlacklistItem } from "../../../shared/settings/Blacklist";

const Grid = styled.div``;

const GridRow = styled.div`
  display: flex;
`;

const GridCell = styled.div<{ grow?: number }>`
  &:nth-child(1) {
    flex-grow: 1;
  }
  &:nth-child(2) {
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

class BlacklistForm extends React.Component<Props> {
  public static defaultProps: Props = {
    value: new Blacklist([]),
    onChange: () => {},
    onBlur: () => {},
  };

  render() {
    return (
      <>
        <Grid role="list">
          {this.props.value.items.map((item, index) => {
            if (item.partial) {
              return null;
            }
            return (
              <GridRow role="listitem" key={index}>
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
      items[index] = new BlacklistItem(e.target.value, false, []);
    } else if (name === "add") {
      items.push(new BlacklistItem("", false, []));
    } else if (name === "delete") {
      items.splice(index, 1);
    }

    this.props.onChange(new Blacklist(items));
    if (name === "delete") {
      this.props.onBlur();
    }
  }
}

export default BlacklistForm;
