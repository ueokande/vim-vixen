import React from "react";
import styled from "../Theme";

const Container = styled.li<{ icon: string; highlight: boolean }>`
  backgroundimage: ${({ icon }) => "url(" + icon + ")"};
  background-color: ${({ highlight, theme }) =>
    highlight
      ? theme.completionSelectedBackground
      : theme.completionItemBackground};
  color: ${({ highlight, theme }) =>
    highlight
      ? theme.completionSelectedForeground
      : theme.completionItemForeground};
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
  highlight: boolean;
  caption?: string;
  url?: string;
  icon?: string;
}

const CompletionItem: React.FC<Props> = ({ highlight, caption, url, icon }) => (
  <Container icon={icon || ""} highlight={highlight}>
    <Caption>{caption}</Caption>
    <Description>{url}</Description>
  </Container>
);

export default CompletionItem;
