import styled from "styled-components";
import React from "react";

const Form = styled.div``;

const Row = styled.div``;

const Label = styled.label`
  display: inline-block;
  min-width: 5rem;
  font-weight: bold;
`;

const Input = styled.input`
  line-height: 2.2rem;
`;

interface Props {
  types: { [key: string]: string };
  value: { [key: string]: any };
  onChange: (value: any) => void;
  onBlur: () => void;
}

class PropertiesForm extends React.Component<Props> {
  public static defaultProps: Props = {
    types: {},
    value: {},
    onChange: () => {},
    onBlur: () => {},
  };

  render() {
    const types = this.props.types;
    const values = this.props.value;

    return (
      <Form>
        {Object.keys(types).map((name) => {
          const type = types[name];
          let inputType = "";
          let onChange = this.bindValue.bind(this);
          if (type === "string") {
            inputType = "text";
          } else if (type === "number") {
            inputType = "number";
          } else if (type === "boolean") {
            inputType = "checkbox";

            // Settings are saved onBlur, but checkbox does not fire it
            onChange = (e) => {
              this.bindValue(e);
              this.props.onBlur();
            };
          } else {
            return null;
          }
          return (
            <Row key={name}>
              <Label>
                <span>{name}</span>
                <Input
                  type={inputType}
                  name={name}
                  value={values[name] ? values[name] : ""}
                  onChange={onChange}
                  onBlur={this.props.onBlur}
                  checked={values[name]}
                />
              </Label>
            </Row>
          );
        })}
      </Form>
    );
  }

  bindValue(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const next = { ...this.props.value };
    if (e.target.type.toLowerCase() === "checkbox") {
      next[name] = e.target.checked;
    } else if (e.target.type.toLowerCase() === "number") {
      next[name] = Number(e.target.value);
    } else {
      next[name] = e.target.value;
    }

    this.props.onChange(next);
  }
}

export default PropertiesForm;
