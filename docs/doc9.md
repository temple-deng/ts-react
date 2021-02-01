# 深入理解 TypeScript

<!-- TOC -->

- [深入理解 TypeScript](#深入理解-typescript)
    - [TypeScript 项目](#typescript-项目)
        - [声明空间](#声明空间)
        - [模块](#模块)
    - [TypeScript 类型系统](#typescript-类型系统)
        - [概览](#概览)
        - [从 JS 迁移](#从-js-迁移)
        - [@types](#types)
        - [环境声明](#环境声明)
        - [lib.d.ts](#libdts)
        - [可调用的](#可调用的)
        - [流动的类型](#流动的类型)

<!-- /TOC -->

## TypeScript 项目

### 声明空间

在 TS 中有两种声明空间：类型声明空间和变量声明空间。     

类型声明空间包含用来当做类型注解的内容，例如下面的类型声明：    

```ts
class Foo {}
interface Bar {}
type Baz = {};
```    

上面的 class Foo 同样提供了一个变量 `Foo` 到变量声明空间。OK，这里其实相当于解释了之前文档中
声明合并那里的那个表格，严格来说，还有一种命名空间声明空间，按之前的文档中叫实体。也就是整个
TS 文件中是有这三种实体内容组成的，每个声明都至少在这一个实体中创建一个引用内容，有的声明还可能
会在两个实体中创建内容，同一个实体中理论上应该是不能出现两个相同的名字的，但是看样子应该除了变量
声明空间，其他两个空间是可以出现同名的，因为 TS 有个声明合并到功能。    

### 模块

默认情况下，TS 项目中的代码是在全局命名空间中，应该是在文件内使用了模块的引用导出语法后才成为
一个模块内容。    

## TypeScript 类型系统

### 概览  

这段代码竟然是正常的：   

```ts
let power: any;

power = '123';
power = 123;

let num: number;
power = num;
num = power;
```     

### 从 JS 迁移

几乎排名前 90% 的 JavaScript 库的声明文件存在于 DefinitelyTyped 仓库里，在创建自己定义的
声明文件之前，我们建议你先去仓库中寻找是否有对应的声明文件。尽管如此，创建一个声明文件这种快速
但不好的方式是减小使用 TypeScript 初始阻力的重要步骤。     

### @types

安装某个库：   

```shell
npm i @types/jquery --save-dev
```     

@types 支持全局和模块类型定义。    

默认情况下，TypeScript 会自动包含支持全局使用的任何声明定义。例如，对于 jquery，你应该能够在
项目中开始全局使用 $。    

模块使用的话，就 `import` 对应的模块就行了，也不用写什么。   

可以看出，对于某些团队而言，拥有允许全局使用的定义是一个问题。因此，你可以通过配置 tsconfig.json
的 `compilerOptions.types` 选项，引入有意义的类型：    

```json
{
  "compilerOptions": {
    "types" : [
      "jquery"
    ]
  }
}
```

如上例所示，通过配置 `compilerOptions.types: [ "jquery" ]` 后，只允许使用 jquery 的
@types 包，即使这个人安装了另一个声明文件，比如 `npm install @types/node`，它的全局变
量（例如 process）也不会泄漏到你的代码中，直到你将它们添加到 tsconfig.json 类型选项。    

### 环境声明

环境声明允许你安全的使用现有的 JavaScript 库，并且能让你的 JavaScript、CoffeeScript
或者其他需要编译成 JavaScript 的语言逐步迁移至 TypeScript。     

通过 `declare` 来告诉 TS，正在试图表述一个其他地方已经存在的代码。    

可以选择把这些声明放入 `.ts` 或 `.d.ts` 里，一般建议放在独立的 `.d.ts` 文件里。   

### lib.d.ts

安装 TS 时，回安装一个 lib.d.ts 文件，这个文件包含 JS 运行时以及 DOM 中存在各种常见的环境声明。   

- 它自动包含在 TS 项目的编译上下文中
- 它能让你快速开始书写经过类型检查的 JavaScript 代码     

在 TypeScript 中，接口是开放式的，这意味着当你想使用不存在的成员时，只需要将它们添加至
lib.d.ts 中的接口声明中即可，TypeScript 将会自动接收它。注意，你需要在全局模块中做这些修改，
以使这些接口与 lib.d.ts 相关联。我们推荐你创建一个称为 global.d.ts 的特殊文件。   

例如给 Window interface 添加方法：   

```ts
interface Window {
    helloWorld(): void;
}
```    

有时，你想要解耦编译目标（即生成的 JavaScript 版本）和环境库支持之间的关系。例如对于 Promise，
你的编译目标是 `--target es5`，但是你仍然想使用它，这时，你可以使用 `lib` 对它进行控制。   

```json
{
    "compilerOptions": {
        "lib": ["dom", "es6"]
    }
}
```     

如果没有指定 `lib`，则会使用默认的配置：    

- `"target": "es5"`，会导入 es5, dom, scripthost
- `"target": "es6"`，会导入 es6, dom, dom.iterable, scripthost    

### 可调用的

接口可以表示一个可被调用的类型注解：   

```ts
interface ReturnString {
    (): string;
}
```     

还有可以表示可实例化：   

```ts
interface CallWithNew {
    new (): string;
}
```    

### 流动的类型    

`typeof` 运算符在类型注解中使用变量，可以告诉编译器，一个变量的类型于其他类型相同：  

```ts
let foo = 123;
let bar: typeof foo;

bar = 456; // ok
bar = '789'; // Error: 'string' 不能分配给 'number' 类型
```     

```ts
const foo = 'Hello World';

let bar: typeof foo;

bar = 'Hello World';
bar = 'anything else'; // Error
```    
