# Handbook Reference

<!-- TOC -->

- [Handbook Reference](#handbook-reference)
    - [Decorators](#decorators)
    - [Declaration Merging](#declaration-merging)
        - [Merging Interfaces](#merging-interfaces)
        - [Merging Namespaces](#merging-namespaces)
        - [Mergin Namespaces with Classes, Functions, Enums](#mergin-namespaces-with-classes-functions-enums)
    - [JSX](#jsx)
    - [Modules](#modules)
        - [Ambient Modules](#ambient-modules)
    - [Module Resolution](#module-resolution)
        - [Base URL](#base-url)
        - [Path mapping](#path-mapping)
        - [Tracing module resolution](#tracing-module-resolution)

<!-- /TOC -->

## Decorators

这个先略了吧，因为貌似提案还在大幅修改中，不确定性太大。    

## Declaration Merging

看大致的意思是会把使用同一个名字的多个声明块合并成一个。这其实隐含了一个意思就是一个声明名称是
可以出现多次的。       

在 TS 中，声明语句会在至少这三个分组中创建实体：namespace, type, value。命名空间创建声明会
创造一个命名空间，包含了可以使用点运算符访问的名称。类型创建声明会用声明的 shape 创建一个类型，
然后绑定到给定的名称上。值创建声明就是声明了一个 JS 可以使用的值。    


Declaration Type | Namespace | Type | Value
---------|----------|---------|---------
 Namespace | x | | x
 Class | | x | x
 Enum | | x | x
 Interface | | x | 
 Type Alias | | x |
 Function | | | x
 Variable | | | x

### Merging Interfaces

```ts
interface Box {
    width: number;
    height: number;
}

interface Box {
    scale: number;
}

let box: Box = {
    width: 6,
    height: 5,
    scale: 100,
};
```    

### Merging Namespaces

同名的命名空间会合并它们的成员，而且命名空间会同时创建一个值。    

```ts
namespace Animals {
    export class Zebra {}
}

namespace Animals {
    export interface Legged {
        numberOfLegs: number;
    }
    export class Dog {}
}
```    

合并成：   

```ts
namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }

  export class Zebra {}
  export class Dog {}
}
```    

对于非导出的成员，严格来说它只在一个命名空间中可见，因此非导出成员需要注意一下：   

```ts
namespace Animal {
    let haveMuscles = true;

    export function animalsHaveMuscles() {
        return haveMuscles;
    }
}

namespace Animal {
    export function doAnimalsHaveMuscles() {
        return haveMuscles; // error
    }
}
```   

### Mergin Namespaces with Classes, Functions, Enums

貌似看意思是，namespace 和这几种声明合并的话，namespace 的声明必须跟在其声明的后面。   

和 class 合并：   

```ts
class Album {
    label: Album.AlbumLabel;
}

namespace Album {
    export class AlbumLabel {}
}
```    

这种相当于定义了一个内部类。   

和 function 合并：    

```ts
function buildLabel(name: string): string {
    return buildLabel.prefix + name + buildLabel.suffix;
}

namespace buildLabel {
    export let suffix = '';
    export let prefix = 'hello, ';
}
```    

和 enum 合并：   

```ts
namespace Color {
    export function mixColor(colorName: string) {
        if (colorName === 'yellow') {
            return Color.red + Color.green;
        } else if (colorName === 'white') {
            return Color.red + Color.green + Color.blue;
        } else if (colorName === 'magenta') {
            return Color.red + Color.blue;
        } else if (colorName === 'cyan') {
            return Color.green + Color.blue;
        }
    }
}

enum Color {
    red = 1,
    green = 2,
    blue = 4,
}
```    

## JSX

使用 JSX 要做两个事情：   

1. 将文件名以 `.tsx` 结尾
2. 启用 `jsx` 选项

ts 有三种 jsx 模式：`preserve`, `react` 和 `react-native`。preserve 会将 jsx 输出，
等待被另一种转换器转换。react 模式会调用 `React.createElement`，不再需要进一步进行转换。
react-native 等价于 preserve 只不过生成的文件是 .js 结尾。    

貌似还又加了 react-jsx 和 react-jsxdev 模式。    

```ts
class MyComponent {
    render() {}
}

var myComponent = new MyComponent();

// element class type => MyComponent
// element instance type => { render: () => void }

function MyFactoryFunction() {
    return {
        render: () => {},
    };
}

var myComponent = MyFactoryFunction();

// element class type => MyFactoryFunction
// element instance type => { render: () => void }
```     

## Modules

选择性模块加载，如果一个模块标识符仅用来作为类型注释的一部分，从没有用作表达式的一部分，那么一般
来说不会对这个模块调用 `require`。      

```ts
declare function require(moduleName: string): any;

import { ZipCodeValidator as Zip } from './ZipCodeValidator';

if (needZipValidation) {
    let ZipCodeValidator: typeof Zip = require('./ZipCodeValidator');
    let validator = new ZipCodeValidator();
}
```    

### Ambient Modules

如果想要描述一个非 TS 写的库的 shape，需要定义这个库暴露的 API。   

我们将未定义具体实现的声明称为 ambient。一般定义在 `.d.ts` 文件中。    

将所有模块接口定义在一个 `.d.ts` 文件中：    

```ts
declare module 'url' {
    export interface Url {
        protocol?: string;
        hostname?: string;
        pathname?: string;
    }

    export function parse(
        urlStr: string,
        parseQueryString?,
        slashesDenoteHost?
    ): Url;
}

declare module 'path' {
    export function normalize(p: string): string;
    export function join(...paths: any[]): string;
    export var sep: string;
}
```    

有了定义文件后，就可以这样引用文件了：    

```ts
/// <reference path="node.d.ts" />
import * as URL from 'url';
```    

## Module Resolution

相对路径导入，以 `/`, `./`, `../` 开头，话说斜杠开头算相对还是第一次见：   

- `import Entry from './components/Entry';`
- `import { DefaultHeaders } from '../constants/http';`
- `import '/mod';`    

相对路径导入都是相对于导入文件进行定位的。无法使用 ambient module declaration。      

非相对路径导入是通过于 `baseUrl` 相对，或者通过路径映射定位到。还有一种方案叫 ambient module
declaration。    

有两种模块解析策略：Node 和 Classic。使用 `--moduleResolution` 指定模块解析策略。如果不指定
的挂，`--module commonjs` 默认是 Node，其他的是 Classic。一般来说推荐用 Node。    

Classic 方案：    

相对导入：`/root/src/folder/A.ts` 导入了 `import { b } from './moduleB`，则会搜索以下
地方：    

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`     

非相对导入的话，会搜索这些地方：    

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`
3. `/root/src/moduleB.ts`
4. `/root/src/moduleB.d.ts`
5. `/root/moduleB.ts`
6. `/root/moduleB.d.ts`
7. `/moduleB.ts`
8. `/moduleB.d.ts`     

Node 方案：    

相对导入的话，`/root/src/A.ts`：    

1. `/root/src/moduleB.ts`
2. `/root/src/moduleB.tsx`
3. `/root/src/moduleB.d.ts`
4. `/root/src/moduleB/package.json` 其中指定了 `types` 属性
5. `/root/src/moduleB/index.ts`
6. `/root/src/moduleB/index.tsx`
7. `/root/src/moduleB/index.d.ts`    

非相对导入的话：    

1. `/root/src/node_modules/moduleB.ts`
2. `/root/src/node_modules/moduleB.tsx`
3. `/root/src/node_modules/moduleB.d.ts`
4. `/root/src/node_modules/moduleB/package.json` 其中指定了 types 属性
5. `/root/src/node_modules/@types/moduleB.d.ts`
6. `/root/src/node_modules/moduleB/index.ts`
7. `/root/src/node_modules/moduleB/index.tsx`
8. `/root/src/node_modules/moduleB/index.d.ts`    

然后到上一目录的 node_modules 中重复上面的步骤。    

### Base URL    

当我们用 AMD 加载并且一般会将所有模块打包到一个文件夹中，那么可能会用到 `baseUrl`。    

设置 `baseUrl` 会告诉编译器到哪去搜索模块。所有非相对导入都被认为是相对于 `baseUrl`。    

### Path mapping

```json
// tsconfig.json
{
    "compilerOptions": {
        "baseUrl": ".",  // 如果有 path 参数，则必须设置 baseUrl
        "paths": {
            "jquery": ["node_modules/jquery/dist/jquery"]
        }
    }
}
```

### Tracing module resolution

`tsc --traceResolution`    