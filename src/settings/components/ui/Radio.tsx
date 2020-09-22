import React from "react";
import styled from "styled-components";

const Container = styled.div`
  font-family: system-ui;
`;

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onValueChange?: (name: string, value: string) => void;
}

const Radio: React.FC<Props> = (props) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onValueChange) {
      props.onValueChange(e.target.name, e.target.value);
    }
  };

  const pp = { ...props };
  delete pp.onValueChange;

  return (
    <Container>
      <label htmlFor={props.id}>
        <input type="radio" onChange={onChange} {...pp} />
        {props.label}
      </label>
    </Container>
  );
};

export default Radio;
