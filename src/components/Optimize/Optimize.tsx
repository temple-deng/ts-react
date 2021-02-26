import {Component, PureComponent} from 'react';

type OptimizeProps = {
  count: number;
};

// class Optimize extends Component<OptimizeProps> {
//   shouldComponentUpdate(): boolean {
//     if (this.props.count === 2) {
//       return false;
//     }
//     return true;
//   }

//   render() {
//     console.log('optimize render')
//     return <div>Count: {this.props.count}</div>;
//   }
// }

class Optimize extends PureComponent<OptimizeProps> {
  render() {
    console.log('optimize render');
    return <div>Count: {this.props.count}</div>;
  }
}

export default Optimize;
