import React from "react";
import styled from "styled-components";

const Container = styled.div`
  page-break-inside: avoid;
`;

const Input = styled.input<{ hasError: boolean }>`
  padding: 4px;
  width: 8rem;
  box-shadow: ${({ hasError }) => (hasError ? "0 0 2px red" : "none")};
`;

const Label = styled.label`
  font-weight: bold;
  min-width: 14rem;
  display: inline-block;
`;

interface Props extends React.HTMLAttributes<HTMLElement> {
  name: string;
  error?: string;
  label: string;
  value: string;
  onValueChange?: (name: string, value: string) => void;
}

const Text: React.FC<Props> = (props) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onValueChange) {
      props.onValueChange(e.target.name, e.target.value);
    }
  };

  const pp = { ...props };
  delete pp.onValueChange;

  return (
    <Container>
      <Label>
        {props.label}
        <br />
        <Input
          type="text"
          hasError={props.error !== undefined}
          onChange={onChange}
          {...pp}
        />
      </Label>
    </Container>
  );
};

export default Text;
