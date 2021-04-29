function doAsync(cb1, cb2) {
  setTimeout(() => {
    cb1(true);
    setTimeout(() => {
      cb2(123);
    }, 100)
  }, 1000); 
}


test.skip('doAsyns calls both callbacks', async () => {
  expect.assertions(2);
  function cb1(data) {
    expect(data).toBeTruthy();
  }
  function cb2(data) {
    expect(data).toBeTruthy();
  }

  doAsync(cb1, cb2);
});