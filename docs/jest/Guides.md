# Guides

<!-- TOC -->

- [Guides](#guides)
- [Snapshot Testing](#snapshot-testing)
    - [Snapshot Testing with Jest](#snapshot-testing-with-jest)
        - [Updating Snapshots](#updating-snapshots)
        - [Inline Snapshots](#inline-snapshots)
        - [Property Matchers](#property-matchers)
- [Timer Mocks](#timer-mocks)
    - [Run Pending Timers](#run-pending-timers)
    - [Advance Timers by Time](#advance-timers-by-time)
- [Manual Mocks](#manual-mocks)
    - [Mocking user modules](#mocking-user-modules)
    - [Mocking Node modules](#mocking-node-modules)
    - [Examples](#examples)
- [ES6 Class Mocks](#es6-class-mocks)
    - [An ES6 Class Example](#an-es6-class-example)
    - [The 4 ways to create an ES6 class mock](#the-4-ways-to-create-an-es6-class-mock)
        - [Automatic mock](#automatic-mock)
        - [Manual mock](#manual-mock)
        - [Calling jest.mock() with the module factory parameter](#calling-jestmock-with-the-module-factory-parameter)
        - [Replacing the mock using mockImplementation or mockImplementationOnce](#replacing-the-mock-using-mockimplementation-or-mockimplementationonce)
- [Bypassing module mocks](#bypassing-module-mocks)
- [Using with webpack](#using-with-webpack)
    - [Handling Statis Assets](#handling-statis-assets)

<!-- /TOC -->

# Snapshot Testing

```js
import React from 'react';
import renderer from 'react-test-renderer';
import Link from '../Link.react';

it('renders correctly', () => {
  const tree = renderer
    .create(<Link page="http://www.facebook.com">Facebook</Link>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
```     

第一次运行的时候会生成一个这样的快照文件：    

```snapshot
exports[`renders correctly 1`] = `
<a
  className="normal"
  href="http://www.facebook.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}
>
  Facebook
</a>
`;
```    

## Snapshot Testing with Jest

### Updating Snapshots

当我们修改了实现的时候，自然而然的现在的快照可能会和之前的快照不匹配，这时候需要更新快照内容：   

```
jest --updateSnapshot/-u
```    

这个命令的话会所有失败的快照测试生成新的快照，因此如果我们有因为bug引发的快照失败，需要先把 bug
修了，不然就生成带有 bug 的快照了。   

如果不想更新所有的例子的话，可以传个 `--testNamePattern` 参数用来匹配更新。    

### Inline Snapshots

内联快照的话是直接写在 test 文件里：   

```js
it('link render inline snapshot', () => {
  const tree = renderer
    .create(<Link href="https://www.qq.com" name="Facebook" />)
    .toJSON();

  expect(tree).toMatchInlineSnapshot();
});
```    

跑一次以后就会变成：   

```js
it('link render inline snapshot', () => {
  const tree = renderer
    .create(<Link href="https://www.qq.com" name="Facebook" />)
    .toJSON();

  expect(tree).toMatchInlineSnapshot(`
    <a
      href="https://www.qq.com"
    >
      Facebook
    </a>
  `);
});
```    

### Property Matchers

```js
it('will check the matchers and pass', () => {
  const user = {
    createdAt: new Date(),
    id: Math.floor(Math.random() * 20),
    name: 'LeBron James',
  };

  expect(user).toMatchSnapshot({
    createdAt: expect.any(Date),
    id: expect.any(Number),
  });
});

// Snapshot
exports[`will check the matchers and pass 1`] = `
Object {
  "createdAt": Any<Date>,
  "id": Any<Number>,
  "name": "LeBron James",
}
`;
```    

这些特殊的 matcher 会在每次生成快照以及比对快照前执行检查，然后会将东西写会快照中，而不是把收到的测试值写到快照中。    

# Timer Mocks

```js
function timerGame(cb: undefined | (() => undefined)) {
  console.log('Ready....go!');

  setTimeout(() => {
    console.log('Timer up --- stop');
    cb && cb();
  }, 1000)
}

module.exports = timerGame;
```    

```js
// timerGame.test.js
jest.useFakeTimers();

test('waits 1 second before ending the game', () => {
  const timerGame = require('../timerGame.ts');
  timerGame();

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
});
```    

另一种测试这个模块的方案是，测试一下 cb 是不是在一秒后执行的：   

```js
jest.useFakeTimers();
test('calls the callback after 1 second', () => {
  const cb = jest.fn();
  const timerGame = require('../timerGame.ts');

  timerGame(cb);

  expect(cb).not.toBeCalled();

  jest.runAllTimers();

  expect(cb).toBeCalled();
  expect(cb).toHaveBeenCalledTimes(1);
});
```    

## Run Pending Timers

有一种场景是，代码中包含有递归的 timer，即 timer 在回调中设置了一个新的 timer，这种情况下，
如果执行完所有的 timers 会进入无限循环，这个时候可能需要使用 `jest.runOnlyPendingTimers()`。    

```js
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
```     

```js
jest.useFakeTimers();

describe('infiniteTimerGame', () => {
  test('schedulest a 10-second timer after 1 second', () => {
    const infiniteTimerGame = require('../infiniteTimerGame');
    const callback = jest.fn();

    infiniteTimerGame(callback);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    jest.runOnlyPendingTimers();

    expect(callback).toBeCalled();

    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000);
  });
});
```     

## Advance Timers by Time

另一种方案是使用 `jest.advanceTimersByTime(msToRun)`，看名字就知道什么意思了，所有的 timers 会提前 `msToRun` 毫秒。   

# Manual Mocks

## Mocking user modules

manual mocks 都是写入到待 mock 模块目录下的 `__mocks__` 子目录中的，然后在代码中需要加上：`jest.mock('./moduleName')`。    

## Mocking Node modules

如果要 mock node_modules 中的模块，应该是在建立一个和 node_modules 同级的 `__mocks__`
目录，然后不需要在代码中手动 `jest.mock('module_name')`。    

## Examples

需要注意的是，如果我们设置了 `automock` 参数为 true，则只要存在模块的 mock，都是自动使用
模块的 mock，而不用手动声明，这个时候如果不想要用 mock，就必须声明 `jest.unmock('moduleName')`。   

# ES6 Class Mocks

## An ES6 Class Example

```ts
// soundPlayer.ts
export default class SoundPlayer {
  foo = 'bar';

  playSoundFile(fileName: string) {
    console.log('Playing sound file ', fileName);
  }
}
```    

```ts
// soundPlayerConsumer.ts
import SoundPlayer from './soundPlayer';

export default class SoundPlayerConsumer {
  soundPlayer = new SoundPlayer();

  playSomethingCool() {
    const coolSoundFileName = 'song.mp3';
    this.soundPlayer.playSoundFile(coolSoundFileName);
  }
}
```     

## The 4 ways to create an ES6 class mock

### Automatic mock

调用 `jest.mock('./sound-player')` 之后，jest 会使用一个 mock 的构造函数替代这个 es6
的类，并且会用返回 `undefined` 的 mock 函数将他所有的方法替换掉。方法的调用是保存在
`theAutomaticMock.mock.instances[index].methodName.mock.calls`。    

```js
import SoundPlayer from "../soundPlayer";
import SoundPlayerConsumer from "../soundPlayerConsumer";
jest.mock('../soundPlayer');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods
  SoundPlayer.mockClear();
});

it('We can check if the consumer called the class constructr', () => {
  const spc = new SoundPlayerConsumer();
  expect(SoundPlayer).toHaveBeenCalledTimes(1);
});

it('We cha check if the consumer called a methdo on the class instance', () => {
  expect(SoundPlayer).not.toHaveBeenCalled();

  const spc = new SoundPlayerConsumer();
  expect(SoundPlayer).toHaveBeenCalledTimes(1);

  const coolSoundFileName = 'song.mp3';
  spc.playSomethingCool();

  const mockSoundPlayerInstance = SoundPlayer.mock.instances[0];
  const mockPlaySoundFile = mockSoundPlayerInstance.playSoundFile;

  expect(mockPlaySoundFile.mock.calls[0][0]).toEqual(coolSoundFileName);
  expect(mockPlaySoundFile).toHaveBeenLastCalledWith(coolSoundFileName);
  expect(mockPlaySoundFile).toHaveBeenCalledTimes(1);
});
```    

### Manual mock

在 `__mocks__` 中手动创建 mock 内容。    

```js
// __mocks__/soundPlayer.js
export const mockPlaySoundFile = jest.fn();

const mock = jest.fn().mockImplementation(() => {
  return {
    playSoundFile: mockPlaySoundFile
  };
});

export default mock;
```     

```js
import SoundPlayer, { mockPlaySoundFile } from "../soundPlayer";
import SoundPlayerConsumer from "../soundPlayerConsumer";

jest.mock('../soundPlayer');

beforeEach(() => {
  SoundPlayer.mockClear();
  mockPlaySoundFile.mockClear();
});

it('We can check if the consumer called the class construct', () => {
  const spc = new SoundPlayerConsumer();
  expect(SoundPlayer).toHaveBeenCalledTimes(1);
});

it('We can check if the consumer called a method on the class instance', () => {
  const spc = new SoundPlayerConsumer();
  const coolName = 'song.mp3';
  spc.playSomethingCool();
  expect(mockPlaySoundFile).toHaveBeenCalledWith(coolName);
});
```    

所以所谓的手动，是指我们手动实现要 mock 的内容，而自动 mock，则是由 jest 会替换掉 mock 的内容。   

### Calling jest.mock() with the module factory parameter

```js
import SoundPlayer from './soundPlayer';
const mockPlaySoundFile = jest.fn();

jest.mock('./sound-player', () => {
  return jest.fn().mockImplementation(() => {
    return {
      playSoundFile: mockPlaySoundFile
    }
  });
});
```    

这种方案的一个缺点就是，`jest.mock` 会被提升至文件开头，那么就不可能先定义一个变量然后在 factory
中使用，除非这个变量是用 `mock` 开头的。    

### Replacing the mock using mockImplementation or mockImplementationOnce

略，没看懂。   

# Bypassing module mocks

有的时候我们在 mock 整个模块的时候，可能会想访问模块内部分功能的原实现。    

```js
jest.mock('node-fetch');
import fetch from 'node-fetch';
const {Response} = jest.requireActual('node-fetch');
```     

# Using with webpack

## Handling Statis Assets

通常来说，像样式表和图片之类的东西在测试中基本没什么用，所以一般会 mock 了。除非使用了 CSS
Modules，这时候可能需要注意下 mock 的方式：    

```json
// package.json
{
  "jest": {
    "moduleNameMapper": {
       "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js"
    }
  }
}
```    

mock 的话就这样 mock：   

```js
// __mocks__/styleMock.js
module.exports = {};

// __mocks__/fileMock.js
module.exports = 'test-file-stub';
```    

