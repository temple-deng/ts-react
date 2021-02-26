import React, {Component} from 'react';

// 那目前来看这种转发 ref 的方式只适用于函数式组件？
const FancyInput = React.forwardRef<HTMLInputElement, unknown>((props, ref) => {
  return <input type="text" ref={ref} />;
});

FancyInput.displayName = 'FancyInput';

class Parent extends Component {
  inputRef = React.createRef<HTMLInputElement>();

  handleClick = () => {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  };

  render() {
    return (
      <div>
        <FancyInput ref={this.inputRef} />
        <button onClick={this.handleClick}>click to focus</button>
      </div>
    );
  }
}

export default Parent;
