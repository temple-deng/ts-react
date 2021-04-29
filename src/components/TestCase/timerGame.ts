function timerGame(cb: undefined | (() => undefined)) {
  console.log('Ready....go!');

  setTimeout(() => {
    console.log('Timer up --- stop');
    cb && cb();
  }, 1000)
}

module.exports = timerGame;
