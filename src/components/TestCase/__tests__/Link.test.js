import renderer from 'react-test-renderer';
import Link from '../Link';

it.skip('link render', () => {
  const tree = renderer
    .create(<Link href="https://www.qq.com" name="Facebook" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it.skip('link render inline snapshot', () => {
  const tree = renderer
    .create(<Link href="https://www.qq.com" name="Facebook" />)
    .toJSON();

  expect(tree).toMatchInlineSnapshot(`
    <a
      href="https://www.qq.com"
    >
      Facebook
    </a>
  `);
});
