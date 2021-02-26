import ThemeContext from '../../contexts/ThemeContext';

function ThemeText2() {
  return (
    <ThemeContext.Consumer>
      {(value) => <div>{value}</div>}
    </ThemeContext.Consumer>
  );
}

export default ThemeText2;
