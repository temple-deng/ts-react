# Project Configuration

<!-- TOC -->

- [Project Configuration](#project-configuration)
    - [TSConfig Reference](#tsconfig-reference)
        - [File Inclusion](#file-inclusion)
        - [Project Options](#project-options)
        - [Strict Checks](#strict-checks)
        - [Module Resolution](#module-resolution)
        - [Source Maps](#source-maps)
        - [Linter Checks](#linter-checks)
        - [Advanced](#advanced)

<!-- /TOC -->

## TSConfig Reference

tsconfig.json 和 jsconfig.json 的行为和配置字段都是一套。    

配置的话可以分这么几类：    

- File Inclusion
  + exclude
  + extends
  + files
  + include
  + references
  + typeAcquisition    

剩下的所有配置项都放在 compilerOptions 中。   

- Project Options
    + allowJs
    + checkJs
    + composite
    + declaration
    + declarationMap
    + downlevelIteration
    + importHelpers
    + incremental
    + isolatedModules
    + jsx
    + lib
    + module
    + noEmit
    + outDir
    + outFile
    + plugins
    + removeComments
    + rootDir
    + sourceMap
    + target
    + tsBuildInfoFile    

- Strict Checks
    + alwaysStrict
    + noImplicitAny
    + noImplicitThis
    + strict
    + strictBindCallApply
    + strictFunctionTypes
    + strictNullChecks
    + strictPropertyInitialization   


- Module Resolution
  + allowSyntheticDefaultImports
  + allowUmdGlobalAccess
  + baseUrl
  + esModuleInterop
  + moduleResolution
  + paths
  + preserveSymlinks
  + rootDirs
  + typeRoots
  + types

- Source Maps
  + inlineSourceMap
  + inlineSources
  + mapRoot
  + sourceRoot

- Linter Checks
  + noFallthroughCasesInSwitch
  + noImplicitReturns
  + noUncheckedIndexedAccess
  + noUnusedLocals
  + noUnusedParameters

- Experimental
  + emitDecoratorMetadata
  + experimentalDecorators    

- Command Line
  + preserveWatchOutput
  + pretty    

- Watch Options
  + fallbackPolling
  + watchDirectory
  + watchFile     

剩下的先略。太多了。。。。。。      

### File Inclusion

exclude: 数组。注意这个 exclude 是相对于 include 说的，exclude 对文件并不一定不会出现在
结果中，如果文件被 `import` 了，或者使用了 types 包含，或者 `/// <reference` 指令，亦或者
出现在 files 字段中，都可能最终称为输出代码的一部分。    

默认值：`["node_modules", "bower_components", "jspm_packages"]`。    

extends: 字符串。即被继承的配置文件路径。路径解析使用 CJS 的方案。    

```json
{
  "extends": "./configs/base",
  "files": ["main.ts", "supplemental.ts"]
}
```      

files：数组，包含的文件列表。话说没说这个的定位规则啊。    

include：指定一个要包含在项目中的数组。文件名是相对于 tsconfig.json 文件所在目录定位的：   

```json
{
  "include": ["src/**/*", "tests/**/*"]
}
```     

references: project references 是将我们的 TS 项目划分成更小块的一种方式，可以有效改进构建
时间。    

typeAcquisition: 一般 TS 项目的编辑器会自动提供 @types 包中的类型声明，这玩意就叫 type
acquisition。我们可以使用这个参数对象来定制功能。    

可以直接启用或者禁用功能：   

```json
{
  "typeAcquisition": {
    "enable": false
  }
}
```     

如果我们有某个不在 node_modules 中的模块想要指定，或者在 node_modules 中但是不想使用：   

```json
{
  "typeAcquisition": {
    "include": ["jest"],
    "exclude": ["jquery"]
  }
}
```      

### Project Options

allowJs: 允许在项目中引入 JS 文件，而不仅仅是 .ts 和 .tsx 文件。    

checkJs: 和 allowJs 搭配使用。是否允许报出 JS 文件中的错误。等价于在项目中的 JS 文件头部添加
`// @ts-check` 注释。    

composite: 没弄懂，和构建相关。    

declaration: 为项目中的每个 TS 和 JS 文件生成 `.d.ts` 文件。这些文件描述了我们模块的对外 API。

declarationMap: 生成 `.d.ts` 文件的 source map。这个玩意在使用 VS Code 中的查看定义的时候
会有用。    

downlevelIteration: 用来对在老的浏览器中提供更准确的迭代功能提供支持。   

importHelpers: 和上一个差不多，也是对旧的浏览器兼容方面，类似 Babel 会提供一个 helper 函数，
通常这些 helper 代码插入到用它们的文件中。这就可能会导致代码冗余。   

如果启用了这个选项，这些 helper 函数会通过 tslib 模块引入。不过 tslib 这个模块需要我们自己确保
在运行时是存在的。    

incremental: 构建相关的，在磁盘上保存上次编译的信息。会生成一系列 `.tsbuildinfo` 文件。    

isolatedModules: 像 Babel 之类的工具在编译 TS 代码的时候一个时刻只能看到一个文件，无法看到
整个类型系统，因此可能会产生一些运行时错误。启用这个选项后，如果我们的代码出现了这种可能在单文件
编译时产生错误的代码时，TS 会警告。   

jsx: react, react-jsx, react-jsxdev, preserve, react-native。    

lib: TS 会包含一些 JS API 的类型定义。如果想要修改这些自动包含的类型定就用这个选项（数组值）：   

可用的值：es5, es2015, es6, es2016, es7, ... es2020, esnext, dom, webworker, scriphost，
还有一些单独的功能不列出了。   

module: 设置项目的模块系统，可选值：`CommonJS`, `ES6/ES2015`, `ES2020`, `None`, `UMD`,
`AMD`, `System`, `ESNext`。注意 target 的值会影响这个设置的默认值。    

noEmit: 不要生成任何的输出文件，即 JS 文件、source map 文件和 declaration 文件。这样的话
ts 就只进行类型检查，编译代码的工作交给 Babel 之类的工具。   

outDir: 输出 JS 的目录，目录结构和源代码的目录结构一致。如果没指定的话，就在原 ts 文件所处位置
生成 .js 文件。   

```json
{
  "compilerOptions": {
    "outDir": "dist"
  }
}
```   

outFile: 如果指定这个配置项，所有全局的（非模块的）文件会拼接到这个指定的输出文件中。如果是
amd 或 system 的模块语法，模块文件会在这个文件的全局内容后拼接上。这个配置项不能和 CJS 或 ES6
的模块系统一起用。   

plugins: 略，这个貌似是提供给编辑器的一些插件配置，VS Code 貌似自带功能。    

removeComments: 要不要把注释删掉。   

rootDir: 貌似意思是默认情况是所有输入的非 declaration 文件的公共父目录。但是如果设置了 composite，
那么就是 tsconfig.json 文件所在的目录。   

sourceMap: 是否开启 sourceMap。    

target: 略。    

tsBuildInfoFile: 指定用来存储构建信息的文件。    

### Strict Checks

alwaysStrict: 确保每个文件都是处于严格模式。   

noImplicitAny: 如果没有类型注解信息，并且 TS 也无法推测出具体类型时，TS 会认为它的类型是 any。
如果打开这个开关的话，貌似就会在所有推断成 any 类型的地方都报错。   

noImplicitThis: 同样，当 this 推断为 any 的时候报错。   

strict: 这个 strict 就不是严格模式了，是指是否一键开启下面所有的 strict 家族检查。   

strictBindCallApply: 默认情况下，bind, call, apply 方法都认为是接收 any 类型的参数，并且
返回 any 类型值。开启这个开关，就是开启这三种方法参数的类型校验。   

strictFunctionTypes: 对函数参数执行更严格的类型检查。不开启的时候会认为以下的代码是合法的：   

```ts
function fn(x: string) {
  console.log("Hello, " + x.toLowerCase());
}

type StringOrNumberFunc = (ns: string | number) => void;

// Unsafe assignment
let func: StringOrNumberFunc = fn;
// Unsafe call - will crash
func(10);
```     

strictNullChecks: 略。    

strictPropertyInitialization: 如果类中声明了某个属性却没有在构造函数中进行初始化的话报错。  

### Module Resolution   

allowSyntheticDefaultImports: 设置为 true 的时候，这样的写法就是合法的：   

```ts
import React from 'react';
```    

而不用再写成：   

```ts
import * as React from 'react';
```    

有点没理解，不太好懂。    

allowUmdGlobalAccess: 略。   

baseUrl: 略。   

esModuleInterop: 没怎么看懂。    

moduleResolution: 'node' or 'classic'。   

paths: 有点像 webpack 的 alias。   

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"]
    }
  }
}
```     

preserveSymlinks: 略。   

rootDirs: 告诉编译器这里有许多的"虚拟"的目录作为一个单一的根目录，应该是这样的话编译器就可以
在多个目录中处理 module resolution。    

```
 src
 └── views
     └── view1.ts (can import "./template1", "./view2`)
     └── view2.ts (can import "./template1", "./view1`)

 generated
 └── templates
         └── views
             └── template1.ts (can import "./view1", "./view2")
```    

```json
{
  "compilerOptions": {
    "rootDirs": ["src/views", "generated/templates/views"]
  }
}
```    

typeRoots: @types 目录的位置。    


types: 指定仅有这个列表中的 @types 下的包可以包含在编译过程中：  

```json
{
  "compilerOptions": {
    "types": ["node", "jest", "express"]
  }
}
```    

### Source Maps

inlineSourceMap: 略。   

inlineSources: 貌似是指会在 source map 中将源代码也附上。   

mapRoot: 调试工具应该是哪找source map。     

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "mapRoot": "https://my-website.com/debug/sourcemaps/"
  }
}
```     

sourceRoot: 调试工具应该去哪找源文件。   

### Linter Checks

noFallthroughCasesInSwitch: 略。   

noImplicitReturns: 略。   

noUncheckedIndexedAccess: 就下面这个效果，就是给未声明的索引属性添加个 undefined 类型支持。   

```ts
interface EnvironmentVars {
  NAME: string;
  OS: string;

  // Unknown properties are covered by this index signature.
  [propName: string]: string;
}

declare const env: EnvironmentVars;

// Declared as existing
const sysName = env.NAME;
const os = env.OS;
//    ^ = const os: string

// Not declared, but because of the index
// signature, then it is considered a string
const nodeEnv = env.NODE_ENV;
//    ^ = const nodeEnv: string | undefinedTry
```    

noUnusedLocals: 略。   

noUnusedParameters: 略。   

### Advanced

allowUnreachableCode: 略。   

allowUnusedLabels: 略。    

assumeChangesOnlyAffectDirectDependencies: 构建性能相关。   

declarationDir: 配置生成 `.d.ts` 文件的位置。   

disableReferencedProjectLoad: 在多项目的 TS 项目中，TS 会在一开始就加载所有可用的项目到
内存中，以便编辑器能获取准备的信息。不过如果项目很大的话这肯定会卡顿，所有如果用了这个配置，只有
在打开某个项目的时候才会去加载项目。   

emitDeclarationOnly: 只生成 `.d.ts` 文件，不生产 js 文件。    

