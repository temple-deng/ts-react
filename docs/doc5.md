# Handbook Reference

<!-- TOC -->

- [Handbook Reference](#handbook-reference)
    - [Namespaces](#namespaces)
    - [Namespaces and Modules](#namespaces-and-modules)
    - [Triple-Slash Directives](#triple-slash-directives)

<!-- /TOC -->

## Namespaces

```ts
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }
    
    let letterRegexp = /^[A-Za-z]+$/;
    let numberRegexp = /^[0-9]+$/;

    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return letterRegexp.test(s);
        }
    }

    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}

let strings = ['hello', '98052', '101'];

let validators: { [s: string]: Validation.StringValidator } = {};

validators['ZIP code'] = new Validation.ZipCodeValidator();
validators['Letters only'] = new Validation.LettersOnlyValidator();

for (let s of strings) {
    for (let name in validators) {
        let isMatch = validators[name].isAcceptable(s);
        console.log(`'${s}' ${isMatch ? 'matches' : 'does not match'} '${name}.'`);
    }
}
```    

一个命名空间可以划分到多个文件中：    

```ts
// Validation.ts
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }
}
```  

```ts
// LettersOnlyValidator.ts
/// <reference path="Validation.ts" />
namespace Validation {
    const lettersRegexp = /^[A-Za-z]+$/;

    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return letterRegexp.test(s);
        }
    }
}
```   

```ts
// ZipCodeValidator.ts
/// <reference path="Validation.ts" />
namespace Validation {
    let numberRegexp = /^[0-9]+$/;

    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}
```    

```ts
// Test.ts
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
  for (let name in validators) {
    console.log(
      `"${s}" - ${
        validators[name].isAcceptable(s) ? "matches" : "does not match"
      } ${name}`
    );
  }
}
```    

## Namespaces and Modules

如果编译器在定位文件时未能找到，会使用 ambient module declaration。   

```ts
// myModules.d.ts
declare module 'SomeModule' {
    export function fn(): string;
}
```    

```ts
// myOtherModule.ts
/// <reference path='myModules.d.ts' />
import * as m from 'SomeModule';
```    

reference 标签让我们可以定位声明了这个 ambient module 的声明文件。     

## Triple-Slash Directives

三斜线指令仅在文件的头部才有效。这个指令前面只能有注释以及其他三斜线指令。    

```ts
/// <reference path='...' />
```     

这个指令的功能是作为文件间依赖的声明。    

三斜线的 reference 指令会告诉编译器在编译阶段包含其他的文件。    

reference 指令还有种用法是在使用 `--out` 或者 `--outFile` 的时候用来组织文件在输出文件中的顺序。    

编译器会有一个预处理阶段，这个阶段就是处理所有三斜线 reference 指令的，通常在这个阶段会将其他
文件添加到编译过程中。    

这个流程从一组根文件开始，根文件就是命令行中声明的文件，或者 tsconfig.json 中 files 字段声明的
文件。这组根文件按照声明的顺序进行预处理。    

```ts
/// <reference types='...' />
```    

类似于 path，但是这个是直接在声明了对包的依赖。

```ts
/// <reference lib='...' />
```     

