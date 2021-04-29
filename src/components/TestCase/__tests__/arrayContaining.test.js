describe('arrayContaining', () => {
  const expected = ['Alice', 'Bob'];

  it.skip('matches even if received contains additional elements', () => {
    expect(['Alice', 'Bob', 'Eve']).toEqual(expect.arrayContaining(['Alice', 'Eve']));
  });

  it('does not match if received does not contain expected elements', () => {
    expect(['Bob', 'Eve']).not.toEqual(expect.arrayContaining(['Alice', 'Bob']));
  });
});

describe.skip('not arrayContaining', () => {
  const expected = ['Alice', 'Bob'];

  it('not match', () => {
    expect(['Alice', 'Eve', 'Card']).toEqual(expect.not.arrayContaining(expected));
  });
});