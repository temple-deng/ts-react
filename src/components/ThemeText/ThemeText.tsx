import {Component} from 'react';
import ThemeContext from '../../contexts/ThemeContext';

class ThemeText extends Component {
  context = 'light';
  render() {
    console.log('theme text render');
    return <div>{this.context}</div>;
  }
}

ThemeText.contextType = ThemeContext;

export default ThemeText;
