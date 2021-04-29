# React test tutorial

source: https://www.robinwieruch.de/react-testing-library   

## Jest VS React Testing Library

这两种东西并不是两种对立的东西，他们在测试中是负责不同的内容，而且可以相互依赖和互补。   

Jest 是一个 test runner，是用来跑测试代码用例的。RTL 则是一个用来测试 React 组件的测试
库/框架。   

## RTL: Rendering a component

```js
import React from 'react';
import { render, screen } from '@testing-library/react';

import App from './App';

describe('App', () => {
  test('renders App component', () => {
    render(<App />);

    screen.debug();
  });
});
```    

`screen.debug` 会把组件渲染的大致 html 结构在控制台打印出来。   

话说，这里的 render 不会包含一些异步的内容吗。

## RTL: Selecting elements

渲染完组件后，我们就可以开始抓取元素了，抓取到元素后面可以用来进行断言或者交互。    

```js
import React from 'react';
import { render, screen } from '@testing-library/react';
 
import App from './App';
 
describe('App', () => {
  test('renders App component', () => {
    render(<App />);
 
    expect(screen.getByText('Search:')).toBeInTheDocument();
  });
});
```    

## RTL: Search types

`getByRole` 原本是用来获取 aria-label 属性的，不过很多 dom 元素都有隐藏的 role。比如说
button 元素。    

除此之外，还有这些获取元素的方法：   

- LabelText: `getByLabelText`, `<label for="search" />`
- PlaceholderText: `getByPlaceholderText`, `<input placeholader="Search" />`
- AltText: `getByAltText`, `<img alt="profile" />`
- DisplayValue: `getByDisplayValue`, `<input value="JavaScript" />`    

除此之外还有终极大招，`getByTestId`，不过需要在元素上设置 `data-testid` 属性。    

## RTL: Search Variants

这个词组不造怎么翻译，貌似就是与 getBy 相对的，还有两组 queryBy 和 findBy，然后上面提到的
获取元素的方法，这两组都有对应的方法。    

getBy 在找不到元素的时候会返回一个错误，而 queryBy 呢，在找不到元素的时候会返回 null。   

而 findBy 呢，则一般用在异步渲染的元素上。    

```js
import React from 'react';
import { render, screen } from '@testing-library/react';
 
import App from './App';
 
describe('App', () => {
  test('renders App component', async () => {
    render(<App />);
 
    expect(screen.queryByText(/Signed in as/)).toBeNull();
 
    expect(await screen.findByText(/Signed in as/)).toBeInTheDocument();
  });
});
```     

这些查询都是针对单个元素的，如果想要测试多个元素的话，使用 getAllBy, queryAllBy, findAllBy。
这些东西返回都是一个数组。    

有一个库，@testing-library/jest-dom 提供了一些方法，扩展了 jest 的 matcher，从而能方便的
测试 DOM 的状态。    

使用这个库的话，要在 jest 的启动代码中引入：   

```js
// In your own jest-setup.js (or any other name)
import '@testing-library/jest-dom';

// In jest.config.js add (if you haven't already)
setupFilesAfterEnv: ['<rootDir>/jest-setup.js']
```    

这部分的内容我们暂时还没看到。   

## RTL: Fire Event

使用 fireEvent 函数来模拟用户的交互行为。    

```js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
 
import App from './App';
 
describe('App', () => {
  test('renders App component', () => {
    render(<App />);
 
    screen.debug();
 
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'JavaScript' },
    });
 
    screen.debug();
  });
});
```    

fireEvent 接受一个元素和一个事件做参数。   

然后呢，这里又有另一个库，@testing-library/user-event。这个库以 fireEvent 为基础，然后呢
扩展了用户事件。扩展后的事件模拟的更像浏览器的行为。     

## RTL: Callback Handlers

