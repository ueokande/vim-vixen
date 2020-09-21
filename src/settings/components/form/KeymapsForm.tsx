import React from "react";
import styled from "styled-components";
import Text from "../ui/Text";
import keymaps from "../../keymaps";
import { FormKeymaps } from "../../../shared/SettingData";

const Grid = styled.div`
  column-count: 3;
`;

const FieldGroup = styled.div`
  margin-top: 24px;

  &:first-of-type {
    margin-top: 24px;
  }
`;

interface Props {
  value: FormKeymaps;
  onChange: (e: FormKeymaps) => void;
  onBlur: () => void;
}

class KeymapsForm extends React.Component<Props> {
  public static defaultProps: Props = {
    value: FormKeymaps.fromJSON({}),
    onChange: () => {},
    onBlur: () => {},
  };

  render() {
    const values = this.props.value.toJSON();
    return (
      <Grid>
        {keymaps.fields.map((group, index) => {
          return (
            <FieldGroup key={index}>
              {group.map(([name, label]) => {
                const value = values[name] || "";
                return (
                  <Text
                    id={name}
                    name={name}
                    key={name}
                    label={label}
                    value={value}
                    onValueChange={this.bindValue.bind(this)}
                    onBlur={this.props.onBlur}
                  />
                );
              })}
            </FieldGroup>
          );
        })}
      </Grid>
    );
  }

  bindValue(name: string, value: string) {
    this.props.onChange(this.props.value.buildWithOverride(name, value));
  }
}

export default KeymapsForm;
