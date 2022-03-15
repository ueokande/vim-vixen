import React from "react";
import styled from "../../colorscheme/styled";

const Container = styled.li<{
  shown: boolean;
  icon: string;
  highlight: boolean;
}>`
  background-image: ${({ icon }) => "url(" + icon + ")"};
  background-color: ${({ highlight, theme }) =>
    highlight
      ? theme.completionSelectedBackground
      : theme.completionItemBackground};
  color: ${({ highlight, theme }) =>
    highlight
      ? theme.completionSelectedForeground
      : theme.completionItemForeground};
  display: ${({ shown }) => (shown ? "display" : "none")};
  padding-left: 1.8rem;
  background-position: 0 center;
  background-size: contain;
  background-repeat: no-repeat;
  white-space: pre;
`;

const Primary = styled.span`
  display: inline-block;
  width: 40%;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Secondary = styled.span`
  display: inline-block;
  color: ${({ theme }) => theme.completionItemDescriptionForeground};
  width: 60%;
  text-overflow: ellipsis;
  overflow: hidden;
`;

interface Props extends React.HTMLAttributes<HTMLElement> {
  shown: boolean;
  highlight: boolean;
  primary?: string;
  secondary?: string;
  icon?: string;
}

const CompletionItem: React.FC<Props> = (props) => (
  <Container
    icon={props.icon || ""}
    aria-labelledby={`completion-item-${props.primary}`}
    {...props}
  >
    <Primary id={`completion-item-${props.primary}`}>{props.primary}</Primary>
    <Secondary>{props.secondary}</Secondary>
  </Container>
);

export default CompletionItem;
