import React from "react";
import { styled } from "./ColorSchemeProvider";

const Wrapper = styled.p`
  border-top: 1px solid gray;
  background-color: ${({ theme }) => theme.consoleErrorBackground};
  color: ${({ theme }) => theme.consoleErrorForeground};
  font-weight: bold;
`;

const ErrorMessage: React.FC = ({ children }) => {
  return <Wrapper role="alert">{children}</Wrapper>;
};

export default ErrorMessage;
