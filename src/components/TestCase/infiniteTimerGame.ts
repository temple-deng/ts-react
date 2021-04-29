function infiniteTimerGame(cb) {
  console.log('ready...go');

  setTimeout(() => {
    console.log('Times up! 10 seconds before the next game starts...');

    cb && cb();

    setTimeout(() => {
      infiniteTimerGame(cb);
    }, 10000);
  }, 1000);
}

module.exports = infiniteTimerGame;
