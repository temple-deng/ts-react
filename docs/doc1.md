# TypeScript(4.1.3)

<!-- TOC -->

- [TypeScript(4.1.3)](#typescript413)
- [Get Started](#get-started)
- [Handbook](#handbook)
    - [Basic Types](#basic-types)
        - [类型断言](#类型断言)
    - [Interfaces](#interfaces)
        - [Function Types](#function-types)
        - [Indexable Types](#indexable-types)
        - [Class Types](#class-types)
        - [Extending Interfaces](#extending-interfaces)

<!-- /TOC -->

# Get Started

目前 JS 中的原始类型有: `boolean`, `bigint`, `null`, `number`, `string`, `symbol`,
`object`, `undefined`。这些类型可以在 interface 中直接用，另外，ts 还扩展了一些类型，
`any`(任意值), `unknown`, `never`, `void`。     

```ts
// greeter.ts
function greeter(person) {
    return 'Hello, ' + person;
}

let user = 'Jane User';

document.body.textContent = greeter(user);
```    

编译：`tsc greeter.ts`。    

在 ts 中，如果两个类型的内部结构是兼容的，则他们的类型是兼容的。   

这里补充个知识点，bigint 是 es2020 新引入的类型，用来表示整数，没有位数的限制，任何位数的整数
都可以精确表示。为了与 number 类型区别，BigInt 类型的数据必须添加后缀 n。   

具体的内容这里就不展开讲了。   

# Handbook

## Basic Types

- `boolean`
- `number`
- `bigint`
- `string`
- array
  + `let list: number[] = [1, 2, 3];`
  + `let list: Array<number> = [1, 2, 3];`
- tuple: `let x: [string, number];` 注意 tuple 类型的元素数量是随着类型声明固定的
- enum: 枚举类型实际上是给一组数字起了一组更友好的名字    
- `unknown`: 代表我们目前还不知道确切的类型，它可以是任何类型的值
- `any`: any 类型代表可能我们要接收的值并没有一个类型定义（比如是从一个第三方没用ts的库引入的），
相当于我们不希望在这个值上加类型限制，不同于 unknown 的一点是，ts 不会对 any 类型的值进行限制，
访问未知的属性是允许的。
- `void`: void 类似于 any 的反面，代表没有任何类型的值，一般用来说明一个函数没有返回值，一般
情况下，void 类型的变量只允许赋值为 `null` 或 `undefined`
- `null` 和 `undefined` 也是单独的类型。默认情况下 `null` 和 `undefined` 是所有其他类型的
子类型。然而在开启了 `--strictNullChecks` 标志位后，则 `null` 和 `undefined` 只能赋值给
`unknown`, `any` 和它们自己对应的类型（还有一种例外情况是undefined可以赋值给 `void` 类型）。    
- `never`
- `object`     


```ts
enum Color {
    Red,
    Green,
    Blue,
}

let c: Color = Color.Green;
```    

枚举值可以进行反向映射：    

```ts
enum Color {
    Red = 1,
    Green,
    Blue,
}

let colorName: string = Color[2];

// Displays 'Green'
console.log(colorName);
```     

```ts
function warnUser(): void {
    console.log('This is my warning message');
}
```    

### 类型断言

一些情况下，我们可能比 ts 更清楚变量具体的类型。类型断言有两种形式，第一种是 `as` 语法：   

```ts
let someValue: unknown = 'this is a string';

let strLength: number = (someValue as string).length;
```    

另一种形式是尖括号：    

```ts
let someValue: unknown = 'this is a string';

let strLength: number = (<string>someValue).length;
```     

## Interfaces

ts 核心原则之一是类型检查聚焦与一个值的 `shape`。即鸭子辩型。interface 扮演了命名这些类型的
角色。     

```ts
function printLabel(labeledObj: { label: string }) {
  console.log(labeledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```    

可选属性：   

```ts
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    let newSquare = {
        color: 'white',
        area: 100,
    };

    if (config.color) {
        newSquare.color = config.color;
    }

    if (config.width) {
        newSquare.area = config.width * config.width;
    }

    return newSquare;
}

let mySquare = createSquare({color: 'black'});
```     

只读属性：    

```ts
interface Point {
    readonly x: number;
    readonly y: number;
}

let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
```     

对于对象字面量来说，任意 target type 不包含的属性会导致编译出错。    

一种解决办法是这样写：    

```ts
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
```    

### Function Types

interface 除了能描述对象的 shape，还可以描述函数的类型：     

```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;

mySearch = function (source: string, subString: string) {
    let result = source.search(subString);
    return result > -1;
}
```    

这里有个问题啊，下面的函数并没有声明返回值类型啊。     

对于函数类型来说，参数的名字没必要完全匹配：    

```ts
let mySearch: SearchFunc;

mySearch = function (src: string, sub: string): boolean {
    let result = src.search(sub);
    return result > -1;
}
```    

函数类型的参数类型和返回值类型都是可以省略的，因为已经通过 interface 声明了，ts 会自动推断：   

```ts
let mySearch: SearchFunc;

mySearch = function (src, sub) {
  let result = src.search(sub);
  return result > -1;
};
```     

### Indexable Types

这个东西还是没弄懂干嘛的：    

```ts
interface StringArray {
    [index: number]: string;
}

let myArray: StringArray = ['Bob', 'Fred'];

let myStr: string = myArray[0];
```      

支持两种类型的 index signatures: 字符串和数字。是可以两种同时都支持的，但是 number 类型的
索引返回的类型必须是 string 类型索引返回类型的子类型。因为用数字索引的时候最终还是要转换成字符串。   

了解了，这种索引类型可以用来声明一个所有属性都是特定类型的对象。     

```ts
interface NumberDictionary {
  [index: string]: number;
  length: number; // ok, length is a number
  name: string; // error, the type of 'name' is not a subtype of the indexer
Property 'name' of type 'string' is not assignable to string index type 'number'.
}
```     

### Class Types

```ts
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date): void;
}

class Clock implements ClockInterface {
    currentTime: Date = new Date();
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) {}
}
```    

### Extending Interfaces

```ts
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}
```    
