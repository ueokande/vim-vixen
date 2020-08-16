import React from "react";
import styled from "../Theme";

const Error = styled.p`
  border-top: 1px solid gray;
  background-color: ${({ theme }) => theme.consoleErrorBackground};
  color: ${({ theme }) => theme.consoleErrorForeground};
  font-weight: bold;
`;

const Info = styled.p`
  border-top: 1px solid gray;
  background-color: ${({ theme }) => theme.consoleInfoBackground};
  color: ${({ theme }) => theme.consoleInfoForeground};
  font-weight: normal;
`;

interface Props {
  mode: string;
  children: string;
}

const Message: React.FC<Props> = ({ mode, children }) => {
  switch (mode) {
    case "error":
      return <Error role="alert">{children}</Error>;
    case "info":
      return <Info role="status">{children}</Info>;
  }
  return null;
};

export default Message;
