import React, {Component} from 'react';

class FocusInput extends Component {
  myRef = React.createRef<HTMLInputElement>();

  handleClick = () => {
    if (this.myRef.current) {
      console.log(this.myRef);
      this.myRef.current.focus();
    }
  };

  render() {
    return (
      <>
        <input type="text" ref={this.myRef} />
        <input type="button" value="Focus" onClick={this.handleClick} />
      </>
    );
  }
}

export default FocusInput;
