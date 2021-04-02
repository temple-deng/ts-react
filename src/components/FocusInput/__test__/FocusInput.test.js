import { render, screen, fireEvent } from '@testing-library/react';

import FocusInput from "../FocusInput";

describe('focus input', () => {
  test('render focus input', () => {
    render(<FocusInput />);
    screen.debug();

    fireEvent.change(screen.getByRole('textbox'), {
      target: {
        value: 'Javasript',
      }
    });

    screen.debug();
  });
});

