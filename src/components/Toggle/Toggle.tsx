import {Component} from 'react';

type ToggleState = {
  isToggleOn: boolean;
};

class Toggle extends Component<unknown, ToggleState> {
  state: ToggleState = {
    isToggleOn: false,
  };

  handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({
      isToggleOn: !this.state.isToggleOn,
    });
  };

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

export default Toggle;
