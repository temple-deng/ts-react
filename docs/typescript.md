# TypeScript

当把一个对象字面量赋值给一个接口类型的变量时，不能出现接口中没有的字段。   

TS 提供了两种新建类型的语法：Interfaces 和 Types。    

结构化类型系统，即鸭式辩型，形状一致可认为类型一致。   

默认情况下，TS 不会根据代码主动去 narrow unknown 类型的可选范围，除非我们用了一些类似 typeof
之类的类型检查方案。    

```ts
function printLabel(labelObj: { label: string, size: number }) {
    console.log(labelObj.label);
}

printLabel({
    size: 10,  // error
    label: 'Size 10 Object',
});
```    

准确的来说，针对对象字面量来说，shape 必须和 interface 完全一致，多或少属性都不行。但是对于
变量来说，是允许有多余的属性，但是不能少。   

```ts
let myAdd: (x: number, y: number) => number = function(x: number, y: number): number {
    return x + y;
}
```    

这里的箭头不能换成 `:`，应该是语法导致的。     

跟着所有必须属性后面的带有默认值的属性默认是可选参数。    

```ts
let suits = ['hearts', 'spades', 'clubs', 'diamonds'];

function pickCard(x: { suit: string; card: number }[]): number;
function pickCard(x: number): { suit: string; card: number };
function pickCard(x: any): any {
    if (typeof x === 'object') {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }

    else if (typeof x === 'number') {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}
```     

需要注意的是上面的 `function pickCard(x): any` 并不是重载列表的一部分，上面这段代码只有两种
重载。    

话说我好奇函数参数个数不一样的重载要怎么写。   

除了 JS 中自带的基础类型，以及 TS 中新加的 `unknown, any, never, void, enum` 等类型，
TS 中还将字符串、数字、布尔的字面量看做成对应的特殊类型。    

当我们通过 `const` 声明变量的时候，隐含的意思就是这个变量的时候是不变的，那么 TS 就可以把它的
类型精确到对象的字面量类型上。这个过程就叫做 narrowing。    

抽象类中未定义实现的方法会被视为抽象方法，因此必须有 abstract 关键字。    

每个枚举成员都有一个值与其想关联，这个值要么是个常量、要么是个计算值。   

当这个成员是枚举的第一个成员，且没有进行初始化。又或者一个枚举成员没有初始化，但是它前面的枚举
成员是个数字枚举常量。亦或者这个成员使用了常量枚举表达式（一个字面量或者另一个常量枚举成员）进行
初始化，那么就认为这个成员值是个常量。    

其他的情况都认为是个计算值。   

类型变量，即在泛型中，出现在类型注解位置的变量，作用于类型的变量。   

泛型函数、泛型接口、泛型类。    

泛型类型限制：   

```ts
interface Lengthwise {
    length: number;
}

function logginIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

function myFn<T extends { length: number }>(arg: T): T {
    console.log(arg.length);
    return arg;
}
```    

type guard 是什么呢，就是当我们通过某种判断确定了某个变量是某个类型后，TS 就可以自动确认这个
变量是什么类型了，从而不会再乱报错。相当于假设我们有个 unknown 的变量，如果我们对这个变量执行了
typeof 判断，并且确认了是 string 类型，那么我们后续访问变量的 length 属性的时候也不会报错。    

基本上 interface 有的功能，类型别名都有，唯一不同的是，类型别名定义后无法添加新的属性了，但是
interface 是可以被继承和扩展的。   

```ts
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
  return propertyNames.map((n) => o[n]);
}

interface Car {
  manufacturer: string;
  model: string;
  year: number;
}

let taxi: Car = {
  manufacturer: "Toyota",
  model: "Camry",
  year: 2014,
};

// Manufacturer and model are both of type string,
// so we can pluck them both into a typed string array
let makeAndModel: string[] = pluck(taxi, ["manufacturer", "model"]);

// If we try to pluck model and year, we get an
// array of a union type: (string | number)[]
let modelYear = pluck(taxi, ["model", "year"]);
```     

interface 声明合并时，非方法属性如果有重名的，类型必须一样，不一样会报错，方法属性被看做是重载。   

除了interface后，能合并的就是namespace了。话说 namespace 会在变量空间创建同名的变量，那重复
声明竟然不会报错。   

一般的模块语法都是将所有的模块的暴露内容挂载到 `exports` 对象上。但是也支持直接用一个对象替换
掉 `exports` 对象。default export 就是用来对标这种行为的。不过，这两种方案是不兼容的。TS
使用 `export = ` 来模拟传统模块语法的这种行为。    

`export = ` 语法指定了一个模块导出的单一对象。当我们使用这种语法导出模块的时候，就必须使用
TS 特定的 `import module = require('module')` 加载这个模块。   

classic 的 resolution 方案中，不涉及到对 baseUrl 的使用，也不涉及到对 extension 的扩展，
仅仅是一层一层往上找而已。    

node 使用了 `main` 字段定位入口文件，TS 使用的是 `types` 字段。     

两种策略对相对导入的策略是大致相同的，都是在相对路径直接搜索，不会再向上搜索。   

TS 的 node 策略和原来 node 模块 resolution 的一个主要不同就是在搜索完 package.json 的 types
字段后，还会去 @types 包中搜索对应的模块.d.ts 文件。    

我们的声明文件一般很可能会依赖其他库，因此需要在声明文件中引入依赖，具体做法是：   

- 全局模块：使用 references 指令 `<reference types="someLib" />`
- 普通模块：使用 import，`import * as moment from 'moment'`    


```ts
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

/*~ This is the module template file. You should rename it to index.d.ts
 *~ and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */

/*~ If this module is a UMD module that exposes a global variable 'myLib' when
 *~ loaded outside a module loader environment, declare that global here.
 *~ Otherwise, delete this declaration.
 */
export as namespace myLib;

/*~ If this module exports functions, declare them like so.
 */
export function myFunction(a: string): string;
export function myOtherFunction(a: number): number;

/*~ You can declare types that are available via importing the module */
export interface SomeType {
  name: string;
  length: number;
  extras?: string[];
}

/*~ You can declare properties of the module using const, let, or var */
export const myField: number;
```    

类型只有在存在一个同名的类型别名声明的时候，才会出现冲突。    

注意，namespace 永远不会冲突，即便了 type alias。    

```ts
class C {}
// ... elsewhere ...
namespace C {
  export let x: number;
}
let y = C.x; // OK
```     

namespace 是很灵活多变的，这个例子中，namespace 融合到了类里，相当于创建了一个类的静态属性。    

https://zhuanlan.zhihu.com/p/133344957


react, webpack, babel, typescript, eslint, postcss, stylelint, prettier,
jsdoc, test