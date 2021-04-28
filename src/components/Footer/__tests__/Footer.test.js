import { render, unmountComponentAtNode } from 'react-dom';
import Footer from '../Footer';
import { act } from 'react-dom/test-utils';
import renderer from 'react-test-renderer';

let container = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it.skip("renders with or without gender", () => {
  act(() => {
    render(<Footer name="temple" />, container);
  });
  expect(container.textContent).toBe("name: temple");
});

it.skip('renders correctly', () => {
  const tree = renderer
    .create(<Footer name="temple" />)
    .toJSON();
    expect(tree).toMatchSnapshot();
});