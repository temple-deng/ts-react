# Expect

## `expect(value)`

略。   

## `expect.extend(matchers)`    

用来添加自己的 matchers：    

```js
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

test('numeric ranges', () => {
  expect(100).toBeWithinRange(90, 110);
  expect(101).not.toBeWithinRange(0, 100);
  expect({apples: 6, bananas: 3}).toEqual({
    apples: expect.toBeWithinRange(1, 10),
    bananas: expect.not.toBeWithinRange(11, 20),
  });
});
```     

异步 matcher 的例子，注意异步 matcher 需要返回一个 promise：    

```js
expect.extend({
  async toBeDivisibleByExternalValue(received) {
    const externalValue = await getExternalValueFromRemoteSource();
    const pass = received % externalValue == 0;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be divisible by ${externalValue}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be divisible by ${externalValue}`,
        pass: false,
      };
    }
  },
});

test('is divisible by external value', async () => {
  await expect(100).toBeDivisibleByExternalValue();
  await expect(101).not.toBeDivisibleByExternalValue();
});
```     

然后在自定义的 matcher 函数中，下面的这些属性和方法是可用的：   

- `this.isNot`: 布尔值
- `this.promise`: 字符串
- `this.equals(a, b)`: 一个深比较函数，用来比较两个对象是否相等，应该类似 `expect(value).toEquals(a, b)`
- `this.expand`: 布尔值，调用 jest 的时候是否使用了 `--expand` flag
- `this.utils`: 这个上面暴露了很多 helper 方法，大多数是 jest-matcher-utils 暴露出来的   

## `expect.anything()`     

这个东西可以匹配除 `null` 和 `undefined` 外的任意东西，没弄懂这个东西的用法，是只能用在特定
地方，还是哪都能用，这个东西是来替代一个非 `null` 非 `undefined` 值的吗。   

```js
test('map calls its argument with a non-null argument', () => {
  const mock = jest.fn();
  [1].map(x => mock(x));
  expect(mock).toBeCalledWith(expect.anything());
});
```     

## `expect.any(constructor)`

匹配使用给定构造函数生成的东西，用法貌似同上面的。    

## `expect.arrayContaining(array)`    

将 array 与接收到的数组进行匹配，要求接收到的数组中，必须包含所有 array 中的元素，也就是 array
是接收到数组的一个子数组。    

```js
describe('arrayContaining', () => {
  const expected = ['Alice', 'Bob'];

  it('matches even if received contains additional elements', () => {
    expect(['Alice', 'Bob', 'Eve']).toEqual(expect.arrayContaining(['Alice', 'Eve']));
  });

  it('does not match if received does not contain expected elements', () => {
    expect(['Bob', 'Eve']).not.toEqual(expect.arrayContaining(['Alice', 'Bob']));
  });
});
```    

注意上面这3个，其实应该都是返回了一个值，等等，好像这么说也不对，不光返回值，还有一些特殊的功能。   

## `expect.assertions(number)`    

校验在一个测试中的，调用了指定次数的断言，一般用来异步测试代码中，以确保回调中的断言确实调用了。    

```js
test('doAsync calls both callbacks', () => {
  expect.assertions(2);
  function callback1(data) {
    expect(data).toBeTruthy();
  }
  function callback2(data) {
    expect(data).toBeTruthy();
  }

  doAsync(callback1, callback2);
});
```    

等等啊，这个例子是不是少了点什么，这也不是异步测试代码的写法吧，如何保证测试代码会等异步返回呢。
难道是 `expect.assertions()` 来保证测试代码不结束？但是之前的文档里面好像没这种啊。    

果然，上面的代码是通不过测试的。。。。。    

## `expect.hasAssertions()`

好像等价于 `expect.assertions(1)`。    

## `expect.not.arrayContaining(array)`     

表示接收到的数组中，不包含所有的 array 元素，注意不是说一个元素都不能包含，是说 array 中的所有
元素，不能同时都出现了。    

## `expect.not.objectContaining(object)`    

非对象的子集。   

## `expect.not.stringContaining(string)`

非字符串的子集。    


## `expect.not.stringMatching(string | regexp)`

略。    

## `expect.objectContaining(object)`   

略。   

## `expect.stringContaining(string)`    

略。   

## `expect.stringMatching(string | regexp)`    

略。    

## `expect.addSnapshotSerializer(serializer)`     

看不懂。    

## `.not`    

略。    

## `.resolves`    

```js
test('resolves to lemon', () => {
  // make sure to add a return statement
  return expect(Promise.resolve('lemon')).resolves.toBe('lemon');
});
```    

## `.rejects`    

```js
test('rejects to octopus', async () => {
  await expect(Promise.reject(new Error('octopus'))).rejects.toThrow('octopus');
});
```    

## `.toBe(value)`    

使用 `Object.is()` 进行比较。    

## `toHaveBeenCalled()`, `toBeCalled()`   

## `toHaveBeenCalledTimes(number)`, `toBeCalledTimes(number)`   

## `toHaveBeenCalledWith(arg1, arg2, ...)`, `toBeCalledWith`    

## `toHaveBeenLastCalledWith(arg1, arg2...)`, `lastCalledWith`    

## `toHaveBeenNthCalledWith(nthCall, arg1, arg2, ...)`, `nthCalledWith`    

注意 nth 是从 1 开始的。   

## `toHaveReturned()`,  `toReturn`      

mock 函数至少有一次是有返回的，意味着没抛出 error。   

## `toHaveReturnedTimes(number)`, `toReturnTimes(number)`     

应该是正好返回了指定的次数，多少都不行。    

## `toHaveBeenReturnedWith(value)`, `toReturnWith(value)`    

```js
test.only('at least one time return exact value', () => {
  const mockFn = jest.fn((param) => param);

  mockFn('lemon');
  mockFn('apple');

  expect(mockFn).toReturnWith('lemon');
  expect(mockFn).not.lastReturnedWith('lemon');
})
```    

只要有一次返回指定的值就行。    

## `toHaveLastReturnedWith(value)`, `lastReturnedWith(value)`     

## `toHaveNthReturnedWith(nthCall, value)`, `nthReturnedWith(nthCall, value)`    

## `toHaveLength(number)`    

检查一个对象是否 `.length` 属性是指定的值。    

## `toHaveProperty(keyPath, value?)`    

检查是否有指令的属性咯，以及属性的值（可选）。    

```js
// Object containing house features to be tested
const houseForSale = {
  bath: true,
  bedrooms: 4,
  kitchen: {
    amenities: ['oven', 'stove', 'washer'],
    area: 20,
    wallColor: 'white',
    'nice.oven': true,
  },
  'ceiling.height': 2,
};

test('this house has my desired features', () => {
  // Example Referencing
  expect(houseForSale).toHaveProperty('bath');
  expect(houseForSale).toHaveProperty('bedrooms', 4);

  expect(houseForSale).not.toHaveProperty('pool');

  // Deep referencing using dot notation
  expect(houseForSale).toHaveProperty('kitchen.area', 20);
  expect(houseForSale).toHaveProperty('kitchen.amenities', [
    'oven',
    'stove',
    'washer',
  ]);

  expect(houseForSale).not.toHaveProperty('kitchen.open');

  // Deep referencing using an array containing the keyPath
  expect(houseForSale).toHaveProperty(['kitchen', 'area'], 20);
  expect(houseForSale).toHaveProperty(
    ['kitchen', 'amenities'],
    ['oven', 'stove', 'washer'],
  );
  expect(houseForSale).toHaveProperty(['kitchen', 'amenities', 0], 'oven');
  expect(houseForSale).toHaveProperty(['kitchen', 'nice.oven']);
  expect(houseForSale).not.toHaveProperty(['kitchen', 'open']);

  // Referencing keys with dot in the key itself
  expect(houseForSale).toHaveProperty(['ceiling.height'], 'tall');
});
```    

## `toBeCloseTo(number, numDigits?)`     

比较浮点数，numDigits 是检查的小数点后数字的位数，

