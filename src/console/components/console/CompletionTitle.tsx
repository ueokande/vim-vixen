import React from "react";
import styled from "../Theme";

const Li = styled.li<{ shown: boolean }>`
  display: ${({ shown }) => (shown ? "display" : "none")};
  background-color: ${({ theme }) => theme.completionTitleBackground};
  color: ${({ theme }) => theme.completionTitleForeground};
  font-weight: bold;
  margin: 0;
  padding: 0;
`;

interface Props {
  shown: boolean;
  title: string;
}

const CompletionTitle: React.FC<React.HTMLAttributes<HTMLElement> & Props> = (
  props
) => <Li {...props}>{props.title}</Li>;

export default CompletionTitle;
