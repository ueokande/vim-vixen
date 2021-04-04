import React from "react";
import { styled } from "./ColorSchemeProvider";

const Wrapper = styled.p`
  border-top: 1px solid gray;
  background-color: ${({ theme }) => theme.consoleInfoBackground};
  color: ${({ theme }) => theme.consoleInfoForeground};
  font-weight: normal;
`;

const InfoMessage: React.FC = ({ children }) => {
  return <Wrapper role="status">{children}</Wrapper>;
};

export default InfoMessage;
