import React from "react";
import styled from "../Theme";

const Li = styled.li`
  background-color: ${({ theme }) => theme.completionTitleBackground};
  color: ${({ theme }) => theme.completionTitleForeground};
  font-weight: bold;
  margin: 0;
  padding: 0;
`;

interface Props {
  title: string;
}

const CompletionTitle: React.FC<Props> = ({ title }) => {
  return <Li>{title}</Li>;
};

export default CompletionTitle;
