/**
 * @file
 */

interface MyProps {
  name: string;
  age: number;
}

const Header = (props: MyProps = {name: 'temple', age: 29}): JSX.Element => {
  return (
    <header>
      <div>
        <span>name</span>
        <span>{props.name}</span>
      </div>
      <div>
        <span>age</span>
        <span>{props.age}</span>
      </div>
    </header>
  );
};

export default Header;
