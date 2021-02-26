import {Component} from 'react';

class NameForm extends Component {
  state = {
    value: '',
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      value: e.target.value,
    });
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('A name was submitted: ' + this.state.value);
    e.preventDefault();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="">
          Name:
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default NameForm;
