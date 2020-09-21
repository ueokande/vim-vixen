import React from "react";
import styled from "styled-components";

const Button = styled.input`
  border: none;
  padding: 4;
  display: inline;
  background: none;
  font-weight: bold;
  color: green;
  cursor: pointer;

  &:hover {
    color: darkgreen;
  }
`;

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const AddButton: React.FC<Props> = (props) => (
  <Button type="button" value="&#x271a;" {...props} />
);

export default AddButton;
