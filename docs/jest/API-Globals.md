# Globals

<!-- TOC -->

- [Globals](#globals)
    - [`afterAll(fn, timeout)`](#afterallfn-timeout)
    - [`afterEach(fn, timeout)`, `beforeAll(fn, timeout)`, `beforeEach(fn, timeout)`](#aftereachfn-timeout-beforeallfn-timeout-beforeeachfn-timeout)
    - [`describe(name, fn)`](#describename-fn)
    - [`describe.each(table)(name, fn, timeout)`](#describeeachtablename-fn-timeout)
    - [`describe.only(name, fn)`](#describeonlyname-fn)
    - [`describe.only.each(table)(name, fn)`](#describeonlyeachtablename-fn)
    - [`describe.skip(name, fn)`, `describe.skip.each(table)(name, fn)`](#describeskipname-fn-describeskipeachtablename-fn)
    - [`test(name, fn, timeout)`](#testname-fn-timeout)
    - [`test.concurrent(name, fn, timeout)`](#testconcurrentname-fn-timeout)
    - [`test.concurrent.each(table)(name, fn, timeout)`](#testconcurrenteachtablename-fn-timeout)
    - [`test.concurrent.only.each(table)(name, fn)`, `test.concurrent.skip.each(table)(name, fn)`](#testconcurrentonlyeachtablename-fn-testconcurrentskipeachtablename-fn)
    - [`test.each(table)(name, fn, timeout)`, `test.only(name, fn, timeout)`, `test.only.each(table)(name, fn, timeout)`, `test.skip(name, fn, timeout)`, `test.skip.each(table)(name, fn)`](#testeachtablename-fn-timeout-testonlyname-fn-timeout-testonlyeachtablename-fn-timeout-testskipname-fn-timeout-testskipeachtablename-fn)
    - [`test.todo(name)`](#testtodoname)

<!-- /TOC -->

下面这些变量和方法都是全局可用的，如果想要显示引入的话，`import {describe, expect, test} from '@jest/globals'`。    

## `afterAll(fn, timeout)`    

默认 timeout 是 5s。    

## `afterEach(fn, timeout)`, `beforeAll(fn, timeout)`, `beforeEach(fn, timeout)`   

略。   

## `describe(name, fn)`   

略。   

## `describe.each(table)(name, fn, timeout)`    

对不同的数据进行相同的测试套件。那能不能写个循环也行吧。    

- `describe.each(table)(name, fn, timeout)`
  + `table`: Array, 每次传给 fn 的参数，如果传入一个原始值的一维数组，内部会转换成一个表格
  `[1, 2, 3] => [[1], [2], [3]]`
  + `name`: 测试套件的名称
    - `%p` - pretty-format: 字符串化 js 值
    - `%s` - string
    - `%d` - number
    - `%i` - integer
    - `%f` - floating point 
    - `%j` - json
    - `%o` - object
    - `%#` - 索引
    - `%%`- 百分号

第二种使用方式 `describe.each'table'(name, fn, timeout)` 把 ' 替换成模板字符串的反斜线。   

```js
describe.each`
  a    | b    | expected
  ${1} | ${1} | ${2}
  ${1} | ${2} | ${3}
  ${2} | ${1} | ${3}
`('$a + $b', ({a, b, expected}) => {
  test(`returns ${expected}`, () => {
    expect(a + b).toBe(expected);
  });

  test(`returned value not be greater than ${expected}`, () => {
    expect(a + b).not.toBeGreaterThan(expected);
  });

  test(`returned value not be less than ${expected}`, () => {
    expect(a + b).not.toBeLessThan(expected);
  });
});
```     

## `describe.only(name, fn)`

同名函数还有 `fdescribe(name, fn)`。     

## `describe.only.each(table)(name, fn)`    

同名函数还有 `fdescribe.each(table)(name, fn)` 或者反斜线版本的。    

## `describe.skip(name, fn)`, `describe.skip.each(table)(name, fn)`   

同名函数还有 `xdescribe(name, fn)`, `xdescribe.each(table)(name, fn)`。    

跳过测试。   

## `test(name, fn, timeout)`

同名函数 `it(name, fn, timeout)`。    

## `test.concurrent(name, fn, timeout)`    

同名函数 `it.concurrent(name, fn, timeout)`。   

注意这里 fn 是异步函数。    

## `test.concurrent.each(table)(name, fn, timeout)`

同名 `it.concurrent.each(table)(name, fn, timeout)`。    

## `test.concurrent.only.each(table)(name, fn)`, `test.concurrent.skip.each(table)(name, fn)`

略。    

## `test.each(table)(name, fn, timeout)`, `test.only(name, fn, timeout)`, `test.only.each(table)(name, fn, timeout)`, `test.skip(name, fn, timeout)`, `test.skip.each(table)(name, fn)`    

略。   

## `test.todo(name)`

仅仅占个位的意思。   

