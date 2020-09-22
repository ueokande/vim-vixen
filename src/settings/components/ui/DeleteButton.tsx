import React from "react";
import styled from "styled-components";

const Button = styled.input`
  border: none;
  padding: 4;
  display: inline;
  background: none;
  color: red;
  cursor: pointer;

  &:hover {
    color: darkred;
  }
`;

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const DeleteButton: React.FC<Props> = (props) => (
  <Button type="button" value="&#x2716;" {...props} />
);

export default DeleteButton;
