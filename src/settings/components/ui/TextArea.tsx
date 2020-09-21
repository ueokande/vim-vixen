import React from "react";
import styled from "styled-components";

const Container = styled.div`
  page-break-inside: avoid;
`;

const Label = styled.label`
  font-weight: bold;
  min-width: 14rem;
  display: inline-block;
`;

const ErrorableTextArea = styled.textarea<{ hasError: boolean }>`
  box-shadow: ${({ hasError }) => (hasError ? "0 0 2px red" : "none")};
  font-family: monospace;
  font-family: monospace;
  width: 100%;
  min-height: 64ex;
  resize: vertical;
`;

const ErrorMessage = styled.p`
  font-weight: bold;
  color: red;
  min-height: 1.5em;
`;

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label: string;
  onValueChange?: (name: string, value: string) => void;
}

const TextArea: React.FC<Props> = (props) => {
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props.onValueChange) {
      props.onValueChange(e.target.name, e.target.value);
    }
  };

  const hasError = typeof props.error !== "undefined" && props.error !== "";
  const pp = { ...props };
  delete pp.onValueChange;
  return (
    <Container>
      <Label htmlFor={props.id}>{props.label}</Label>
      <ErrorableTextArea hasError={hasError} onChange={onChange} {...pp} />
      {hasError ? (
        <ErrorMessage role="alert">{props.error}</ErrorMessage>
      ) : null}
    </Container>
  );
};

export default TextArea;
