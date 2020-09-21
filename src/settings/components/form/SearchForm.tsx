import React from "react";
import styled from "styled-components";
import AddButton from "../ui/AddButton";
import DeleteButton from "../ui/DeleteButton";
import { FormSearch } from "../../../shared/SettingData";

const Grid = styled.div``;

const GridRow = styled.div`
  display: flex;
`;

const GridCell = styled.div<{ grow?: number }>`
  &:nth-child(1) {
    flex-grow: 0;
    min-width: 10%;
    max-width: 10%;
  }

  &:nth-child(2) {
    flex-grow: 2;
  }

  &:nth-child(3) {
    flex-grow: 0;
    flex-shrink: 1;
  }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
`;

interface Props {
  value: FormSearch;
  onChange: (value: FormSearch) => void;
  onBlur: () => void;
}

class SearchForm extends React.Component<Props> {
  public static defaultProps: Props = {
    value: FormSearch.fromJSON({ default: "", engines: [] }),
    onChange: () => {},
    onBlur: () => {},
  };

  render() {
    const value = this.props.value.toJSON();
    return (
      <>
        <Grid>
          <GridRow>
            <GridCell>Name</GridCell>
            <GridCell>URL</GridCell>
            <GridCell>Default</GridCell>
          </GridRow>
          {value.engines.map((engine, index) => {
            return (
              <GridRow key={index}>
                <GridCell>
                  <Input
                    data-index={index}
                    type="text"
                    name="name"
                    value={engine[0]}
                    onChange={this.bindValue.bind(this)}
                    onBlur={this.props.onBlur}
                  />
                </GridCell>
                <GridCell>
                  <Input
                    data-index={index}
                    type="text"
                    name="url"
                    placeholder="http://example.com/?q={}"
                    value={engine[1]}
                    onChange={this.bindValue.bind(this)}
                    onBlur={this.props.onBlur}
                  />
                </GridCell>
                <GridCell>
                  <input
                    data-index={index}
                    type="radio"
                    name="default"
                    checked={value.default === engine[0]}
                    onChange={this.bindValue.bind(this)}
                  />
                  <DeleteButton
                    data-index={index}
                    name="delete"
                    onClick={this.bindValue.bind(this)}
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

  // eslint-disable-next-line max-statements
  bindValue(e: any) {
    const value = this.props.value.toJSON();
    const name = e.target.name;
    const index = Number(e.target.getAttribute("data-index"));
    const next: typeof value = {
      default: value.default,
      engines: value.engines.slice(),
    };

    if (name === "name") {
      next.engines[index][0] = e.target.value;
      next.default = value.engines[index][0];
    } else if (name === "url") {
      next.engines[index][1] = e.target.value;
    } else if (name === "default") {
      next.default = value.engines[index][0];
    } else if (name === "add") {
      next.engines.push(["", ""]);
    } else if (name === "delete" && value.engines.length > 1) {
      next.engines.splice(index, 1);
      if (value.engines[index][0] === value.default) {
        const nextIndex = Math.min(index, next.engines.length - 1);
        next.default = next.engines[nextIndex][0];
      }
    }

    this.props.onChange(FormSearch.fromJSON(next));
    if (name === "delete" || name === "default") {
      this.props.onBlur();
    }
  }
}

export default SearchForm;
