test.only('at least one time return exact value', () => {
  const mockFn = jest.fn((param) => param);

  mockFn('lemon');
  mockFn('apple');

  expect(mockFn).toReturnWith('lemon');
  expect(mockFn).not.lastReturnedWith('lemon');
})