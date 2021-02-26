import {Component} from 'react';

type ClockState = {
  date: Date;
};

class Clock extends Component<unknown, ClockState> {
  state: ClockState = {
    date: new Date(),
  };

  private timerID = 0;

  componentDidMount() {
    this.timerID = window.setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render(): React.ReactNode {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}</h2>
      </div>
    );
  }
}

export default Clock;
