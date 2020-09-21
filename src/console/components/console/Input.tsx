import React from "react";
import styled from "../Theme";

const Container = styled.div`
  background-color: ${({ theme }) => theme.commandBackground};
  color: ${({ theme }) => theme.commandForeground};
  display: flex;
`;

const Prompt = styled.i`
  font-style: normal;
`;

const InputInner = styled.input`
  border: none;
  flex-grow: 1;
  background-color: ${({ theme }) => theme.commandBackground};
  color: ${({ theme }) => theme.commandForeground};
`;

interface Props {
  mode: string;
  value: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

class Input extends React.Component<Props> {
  private input: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);

    this.input = React.createRef();
  }

  focus() {
    if (this.input.current) {
      this.input.current.focus();
    }
  }

  render() {
    let prompt = "";
    if (this.props.mode === "command") {
      prompt = ":";
    } else if (this.props.mode === "find") {
      prompt = "/";
    }

    return (
      <Container>
        <Prompt>{prompt}</Prompt>
        <InputInner
          ref={this.input}
          onBlur={this.props.onBlur}
          onKeyDown={this.props.onKeyDown}
          onChange={this.props.onChange}
          value={this.props.value}
        />
      </Container>
    );
  }
}

export default Input;
