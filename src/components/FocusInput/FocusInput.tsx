import React, {ChangeEvent, Component, FormEvent} from 'react';

type FocusInputState = {
  value: string;
};

class FocusInput extends Component<unknown, FocusInputState> {
  myRef = React.createRef<HTMLInputElement>();
  state: FocusInputState = {
    value: '222',
  };

  handleClick = () => {
    if (this.myRef.current) {
      console.log(this.myRef);
      this.myRef.current.focus();
    }
  };

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    return (
      <>
        <input
          type="text"
          ref={this.myRef}
          value={this.state.value}
          onChange={this.handleChange}
        />
        <input type="button" value="Focus" onClick={this.handleClick} />
      </>
    );
  }
}

export default FocusInput;
