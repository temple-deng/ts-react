# Jest 26.6

<!-- TOC -->

- [Jest 26.6](#jest-266)
    - [Getting Started](#getting-started)
    - [Using Matchers](#using-matchers)
    - [Testing Asynchronous Code](#testing-asynchronous-code)
    - [Setup and Teardown](#setup-and-teardown)
    - [Mock Functions](#mock-functions)

<!-- /TOC -->

## Getting Started

```
jest my-test --notify --config=config.json
```    

生成配置文件 `jest --init`。    

## Using Matchers

`toBe()` 之类的函数就叫 matcher，就是那些用来使用不同的方式测试一个值是否满足条件的。   

- `toEqual`: 测试对象
- `toBeNull`: 匹配 `null`
- `toBeUndefined`: 匹配 `undefined`
- `toBeDefined`
- `toBeTruthy`
- `toBeFalsy`
- `toBeGreaterThan`
- `toBeGreaterThanOrEqual`
- `toBeLessThan`
- `toBeLessThanOrEqual`
- `toBeCloseTo`
- `toMatch`
- `toContain`    

## Testing Asynchronous Code

第一种回调函数的形式：   

```js
test('the data is peanut butter', done => {
  function callback(data) {
    try {
      expect(data).toBe('peanut butter');
      done();
    } catch (error) {
      done(error);
    }
  }

  fetchData(callback);
});
```    

如果不用 `try..catch`，test 最后会报超时错误。   

第二种形式 Promise 的话，直接返回 Promise 即可。   

第三种是 `.resolves`/`rejects` matcher，这种老实说没看到，fetchData 是不是必须是一个 Promise.   

```js
test('the data is peanut butter', () => {
  return expect(fetchData()).resolves.toBe('peanut butter');
});
```    

第四种方案，async/await：    

```js
test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (e) {
    expect(e).toMatch('error');
  }
});
```    

## Setup and Teardown

- `beforeEach`
- `afterEach`
- `beforeAll`
- `afterAll`

执行顺序：    

```js
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));
test('', () => console.log('1 - test'));
describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));
  test('', () => console.log('2 - test'));
});

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll
```    

describe 里面的代码会先于所有的 test 执行。   

## Mock Functions

有两种 mock 函数的方式：直接创建一个 mock 函数，或者写一个 manual mock 来覆盖模块依赖。    

```js
// 待测试函数
function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}

const mockCallback = jest.fn(x => 42 + x);
forEach([0, 1], mockCallback);

// The mock function is called twice
expect(mockCallback.mock.calls.length).toBe(2);

// The first argument of the first call to the function was 0
expect(mockCallback.mock.calls[0][0]).toBe(0);

// The first argument of the second call to the function was 1
expect(mockCallback.mock.calls[1][0]).toBe(1);

// The return value of the first call to the function was 42
expect(mockCallback.mock.results[0].value).toBe(42);
```    

`mock` 属性保存了函数被调用的情况数据，以及返回值。   

mock 返回值：    

```js
const myMock = jest.fn();
console.log(myMock());

myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

console.log(myMock(), myMock(), myMock(), myMock());

// 10, 'x', true, true
```   

注入代码：   

```js
const myMock = jest.fn();
console.log(myMock());
// > undefined

myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

console.log(myMock(), myMock(), myMock(), myMock());
// > 10, 'x', true, true
```     

mock 模块：   

```js
// users.test.js
import axios from 'axios';
import Users from './users';

jest.mock('axios');

test('should fetch users', () => {
  const users = [{name: 'Bob'}];
  const resp = {data: users};
  axios.get.mockResolvedValue(resp);

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))

  return Users.all().then(data => expect(data).toEqual(users));
});
```     

mock 实现：    

```js
const myMockFn = jest
  .fn(() => 'default')
  .mockImplementationOnce(() => 'first call')
  .mockImplementationOnce(() => 'second call');

console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
// > 'first call', 'second call', 'default', 'default'
```    

专门的 matchers:   

```js
// The mock function was called at least once
expect(mockFunc).toHaveBeenCalled();

// The mock function was called at least once with the specified args
expect(mockFunc).toHaveBeenCalledWith(arg1, arg2);

// The last call to the mock function was called with the specified args
expect(mockFunc).toHaveBeenLastCalledWith(arg1, arg2);

// All calls and the name of the mock is written as a snapshot
expect(mockFunc).toMatchSnapshot();
```    
