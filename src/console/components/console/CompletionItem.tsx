import React from "react";
import styled from "../Theme";

const Container = styled.li<{
  shown: boolean;
  icon: string;
  highlight: boolean;
}>`
  backgroundimage: ${({ icon }) => "url(" + icon + ")"};
  background-color: ${({ highlight, theme }) =>
    highlight
      ? theme.completionSelectedBackground
      : theme.completionItemBackground};
  color: ${({ highlight, theme }) =>
    highlight
      ? theme.completionSelectedForeground
      : theme.completionItemForeground};
  display: ${({ shown }) => (shown ? "display" : "none")};
  padding-left: 1.5rem;
  background-position: 0 center;
  background-size: contain;
  background-repeat: no-repeat;
  white-space: pre;
`;

const Caption = styled.span`
  display: inline-block;
  width: 40%;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Description = styled.span`
  display: inline-block;
  color: ${({ theme }) => theme.completionItemDescriptionForeground};
  width: 60%;
  text-overflow: ellipsis;
  overflow: hidden;
`;

interface Props {
  shown: boolean;
  highlight: boolean;
  caption?: string;
  url?: string;
  icon?: string;
}

const CompletionItem: React.FC<React.HTMLAttributes<HTMLElement> & Props> = (
  props
) => (
  <Container icon={props.icon || ""} {...props}>
    <Caption>{props.caption}</Caption>
    <Description>{props.url}</Description>
  </Container>
);

export default CompletionItem;
