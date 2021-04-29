jest.useFakeTimers();
const timerGame = require('../timerGame.ts');

// test('waits 1 second before ending the game', () => {
//   timerGame();

//   expect(setTimeout).toHaveBeenCalledTimes(1);
//   expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
// });

test.skip('calls the callback after 1 second', () => {
  const cb = jest.fn();

  timerGame(cb);

  expect(cb).not.toBeCalled();

  jest.runAllTimers();

  expect(cb).toBeCalled();
  expect(cb).toHaveBeenCalledTimes(1);
});