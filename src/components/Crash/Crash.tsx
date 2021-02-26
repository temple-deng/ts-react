import {Component} from 'react';

type CrashState = {
  crashed: boolean;
};

class Crash extends Component<unknown, CrashState> {
  state: CrashState = {
    crashed: false,
  };

  componentDidMount() {
    setTimeout(() => {
      // this.setState({
      //   crashed: true
      // });
    }, 3000);
  }

  render() {
    if (this.state.crashed) {
      // console.log(window.randomStr.hhh);
    }

    return <div>normal text</div>;
  }
}

export default Crash;
