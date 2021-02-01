# Declaration Files

<!-- TOC -->

- [Declaration Files](#declaration-files)
    - [Declaration Reference](#declaration-reference)
    - [Library Structures](#library-structures)
    - [Modules .d.ts](#modules-dts)

<!-- /TOC -->

## Declaration Reference

假设有一个全局变量 `myLib`，其下有一个方法 `makeGreeting` 和一个属性 `numberOfGreetings`：   

```ts
let result = myLib.makeGreeting('hello, world');
console.log('The computed greeting is: ' + result);

let count = myLib.numberOfGreeting;
```    

对应的声明：    

```ts
declare namespace myLib {
    function makeGreeting(s: string): string;
    let numberOfGreetings: number;
}
```     

## Library Structures

模块有4种模板可用：`module.d.ts`, `module-class.d.ts`, `module-function.d.ts`, `module-plugin.d.ts`。    

一般来说先看 `module.d.ts` 总览一下模块的功能。如果模块可以像函数一样调用，则使用 `module-function.d.ts`。    

如果模块是像类一样使用，则使用 `module-class.d.ts` 模板。    

如果模块在导入的时候，是对其他模块进行修改，使用 `module-plugin.d.ts` 模板。   

如果我们的库对其他代码有依赖，需要声明这些依赖。如果依赖一个全局库（通过全局变量的方式暴露内容），
则使用 `/// <reference type="..." />` 指令。     

如果依赖一个模块的话，那就 `import` 就行了。    

## Modules .d.ts

如果 CJS 模块导出了一个整体值，那么这样写 `.d.ts` 文件：   

```ts
declare const helloWorld: RegExp;
export default helloWorld;
```     

注意使用 `export default` 的语法需要使用 `esModuleInterop: true` 配置项。   

