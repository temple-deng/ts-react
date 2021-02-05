<!-- TOC -->

- [Webpack](#webpack)
- [Browserslist](#browserslist)
- [babel](#babel)
- [typescript](#typescript)
- [babel 与 typescript](#babel-与-typescript)
- [EditorConfig](#editorconfig)
- [@typescript-eslint](#typescript-eslint)
- [prettier](#prettier)
- [JSDoc](#jsdoc)
- [eslint](#eslint)
    - [可共享配置文件](#可共享配置文件)
    - [注释的用法](#注释的用法)
    - [Ignoring Code](#ignoring-code)
- [eslint-config-prettier](#eslint-config-prettier)
- [@typescript-eslint 项目](#typescript-eslint-项目)

<!-- /TOC -->

## Webpack

运行 webpack-dev-server 的时候如果报错，试试 `webpack serve --open`。   

## Browserslist

有一个默认的配置：   

```json
{
    "browserslist": [
        "defaults"
    ]
}
```    

建议隔一段时间更新一下数据库：   

```shell
npm browserslist@latest --update-db
```    

`or` 和逗号 `,` 的意义一样，因此 `last 1 version or > 1%` 等同于 `last 1 version, > 1%`。    

`and` 关键字也支持。还有 `not` 关键字，不过 `not` 关键字要和 `and` 或者 `or` 搭配在一起才能用。   

完整的查询列表（大小写不敏感）：    

- `defaults`: (`> .5%, last 2 versions, Firefox ESR, not dead`)
- `> 5%`
- `dead`
- `last 2 versions`
- `node 10`
- `iOS 7`
- `since 2015`, `last 2 years`

有问题的话，可以使用 `npx browserslist` 查看当前选中的浏览器，这是一种 debug 方式。   

浏览器名称（大小写不敏感）：   

- `Android`
- `Baidu`
- `BlackBerry`
- `Chrome`
- `ChromeAndroid` or `and_chr`
- `Edge`
- `Electron`
- `Explorer` or `ie`
- `Firefox` or `ff`
- `iOS` or `ios_saf`
- `Node`
- `Opera`
- `OperaMini` or `op_mini`
- `OperaMobile` or `op_mob`
- `QQAndroid` or `and_qq`
- `Safari`
- `Samsung`
- `UCAndroid` or `and_uc`    

## babel

@babel/eslint-parser。因为 eslint 只支持已经写入标准的语法，不支持未入标准的语法，因此像
一些实验性的语法，以及 ts types 之类的语法是无法识别的。而 @babel/eslint-parser 的话就是
将由 Babel 转换后的代码交给 eslint。这里感觉说的不太对啊，既然是 parser 应该是在源代码就动
手了吧，这里的转换应该是对源代码中 eslint 未能识别的代码转换成能识别的代码，然后再对整个源代码
进行检查。    

哦，文档后面说了，相当于先用 Babel 的解析器解析源代码，然后会生成一个 eslint 能理解的 ESTree。   

然后又说了，eslint 的核心规则是不支持实验性的语法的，所以这里如果光用这个 parser 可能检查不出来
实现性语法的问题，因此就还需要另一个 @babel/eslint-plugin。    

然后如何加 typescript 呢，我们先试着一步步来。先把 babel, webpack 和 typescript 串起来，
先不管 react。    

## typescript

首先我们这里应该确定的一个问题是使用 ts 编译还是使用 babel，如果使用 ts 编译，那就需要 ts-loader，
相应的，可能就不需要 babel 了，如果使用 babel，那么应该就不需要 ts-loader，仅仅单独用 tsc
进行类型系统的校验。这样吧，这里我们两种都试一下。先试试用 babel 编译的。    

## babel 与 typescript

首先是需要安装 @babel/preset-typescript。首先确定这个 preset 可以理解类型注解语法，但是
不会去做类型检查。    

支持这几个 options:   

- `isTSX`: 强制进行 jsx 解析，不然尖角括号会被认为是 ts 的类型注解。   
- `jsxPragma`: 字符串，默认是 `React`，貌似意思是保留对 React 库对引入，不要认为是类型导入，
因为类型导入会被删除掉，编译可能出错。  
- `jsxPragmaFrag`
- `allExtensions`: 声明每个文件都应该当成是 ts 或 tsx 文件。
- `allowNamespaces`
- `allowDeclareFields`
- `onlyRemoveTypeImports`   

貌似使用 tsx 的话建议是开启 `isTSX` 和 `allExtensions` 选项，但是测试的时候没设置貌似也
没报错，应该是webpack 和 babel 之类的配置应该能兼容好这两个。   

话说这样我们连 react 也已经引入了。。。。   

但是配置好之后会提示找不到名称 React，这个应该是使用了新的 JSX 语法从而不导入 React 引入的，
但是不造怎么关了它啊，坑爹。   

然后我们就可以进入另一个更恐怖的话题，如何把 typescript 和 eslint 集成。    

这里就又要引入另一个项目：@typescript-eslint。    

webpack, react, eslint, typescript, babel, oh god please。   

其实不引入 typescript 还好，最多麻烦一点的问题是 eslint 无法理解非标准的语法。但是一加入
typescript 后，感觉难度就陡增，首先我们要考虑如何让 babel 理解 typescript 代码，其次如何
让 eslint 理解。     

## EditorConfig

```ini
# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true

# Matches multiple files with brace expansion notation
# Set default charset
[*.{js,py}]
charset = utf-8

# 4 space indentation
[*.py]
indent_style = space
indent_size = 4

# Tab indentation (no size specified)
[Makefile]
indent_style = tab

# Indentation override for all JS under lib directory
[lib/**.js]
indent_style = space
indent_size = 2

# Matches the exact files either package.json or .travis.yml
[{package.json,.travis.yml}]
indent_style = space
indent_size = 2
```     

话说这里为什么 `lib/**.js` 这里是两个星号呢。    

貌似这种文件格式叫 ini 格式。    

glob 通配符的含义：    

- `*`: 匹配路径分隔符外的任意字符串
- `**`: 匹配任意字符串
- `?`: 匹配任意单个字符
- `[name]`: 匹配 name 中的单个字符
- `[!name]`: 取反
- `{s1,s2,s3}`: 匹配其中的一个字符串
- `{num1..num2}`: 匹配 num1 到 num2 间的任意字符     

支持的命令：   

- `indent_style`
- `indent_size`
- `tab_width`
- `end_of_line`
- `charset`
- `trim_trailing_whitespace`
- `insert_final_newline`
- `root`

https://blog.sindresorhus.com/    

## @typescript-eslint

babel, eslint, typescript 三者有一个共同的步骤就是都要先用一个解析器，将源代码解析成一颗
AST。     

然后三者可能转换后的 AST 是有细微不同的，三者可能能理解的 AST 的格式也是有不同的。   

具体工作流程貌似是这样的：   

- eslint 会调用配置的 @typescript-eslint/parser 解析器
- 然后这个解析器会去处理 eslint 的特定配置（话说解析器要解析什么配置），之后调用 @typescript-eslint/typescript-estree，这个包会把 TS 源代码转换成 AST
- typescript-estree 这个库呢是通过调用 TS 的编译器先产生一个 TS 的 AST，然后再把它转换成
一个 ESLint 能理解的 AST    

话说那这里 parser 的存在感在哪里，为什么不直接用 typescripr-estree 做解析器的。    

然而即便替换了 parser，最终也并不是所有的 eslint 规则可以完全无修改的兼容目前的语法。因此我们
可能还需要一个 @typescript-eslint/eslint-plugin。    

吼，最终终于提到了 babel-eslint，可以说两个是不兼容的。两者各有优点，babel 可以通过插件支持
一些 ts 编译器还不支持的语法，而 typescript-eslint 可以支持一些类型信息相关的 lint 规则。
而感觉由于 preset-typescript 会删除类型信息，那么理论上原来的 eslint 规则还是生效的。那
我们就暂时不用这玩意了。    


## prettier

```
prettier --write .
prettier --write app/
prettier --write app/Button.tsx
```     

Options:    

- `printWidth`: 80
- `tabWidth`: 2
- `useTabs`: false
- `semi`: true
- `singleQuote`: false
- `quoteProps`: 'as-needed'
    + 'as-needed'
    + 'consistent'
    + 'peserve'
- `jsxSingleQuote`: false
- `trailingComma`: 'es5'
    + 'es5'
    + 'none'
    + 'all'
- `bracketSpacing`: true
- `jsxBracketSameLine`: false
- `arrowParens`: "always"
    + "always"
    + "avoid"
- `requirePragma`: false
- `insertPragma`: false

和 eslint, stylelint 配合，eslint-config-prettier, stylelint-config-prettier。    

然后在配置文件中继承，记得要放在数组中的最后一个，以便能够覆盖其他配置：   

```json
{
  "extends": [
    // other configs ...
    "stylelint-config-prettier"
  ]
}
```     

那基本 prettier 的内容就是这些，剩下的就是和 pre-commit 钩子结合一下了。    

## JSDoc

JSDoc 的注释必须这样开头，`/**` 多了星号也不行。    

安装 `npm i --save-dev jsdoc`。     

用法一般就是 `npx jsdoc file1.js file2.js ...`    

老实说，JSDoc 应该也得用到 AST 吧，而且为了解析新的用法，估计还得用到 babel-parser 吧。    

JSDoc 支持配置文件，json 或者 js 都行。`-c` 命令行指定配置文件。     

默认的配置是这样的：   

```json
{
    "plugins": [],
    "recurseDepth": 10,
    "source": {
        "includePattern": ".+\\.js(doc|x)?$",
        "excludePattern": "(^|\\/|\\\\)_"
    },
    "sourceType": "module",
    "tags": {
        "allowUnknownTags": true,
        "dictionaries": ["jsdoc","closure"]
    },
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false
    }
}
```    

CLI 的配置项也能写在配置文件里，不过需要都放在 opts 字段下：    

```json
{
    "opts": {
        "template": "templates/default",  // same as -t templates/default
        "encoding": "utf8",               // same as -e utf8
        "destination": "./out/",          // same as -d ./out/
        "recurse": true,                  // same as -r
        "tutorials": "path/to/tutorials", // same as -u path/to/tutorials
    }
}
```  

JSDoc 支持两种类型的 tag:   

- block tags: 顶层注释
- inline tags: 一般是 block tags 中的一部分文本，一般用来链接到文档的其他部分，像个 a 链接    

inline tags 需要放在括号里 `{}`。    

```js
/**
 * Set the shoe's color. Use {@link Shoe#setSize} to set the shoe size
 * 
 * @param {string} color - The shoe's color
 */
Shoe.prototype.setColor = function (color) {
    // ...
}
```     

上面这个是 inline tag 在一段普通的文本中，下面这个是 inline tag 在 block tag 中：   

```js
/**
 * Set the shoe's color
 * 
 * @param {SHOE_COLORS} color - The shoe color. Must be an enumerated
 * value of {@link SHOE_COLORS}
 */
Shoe.protytype.setColor = function (color) {
    // ...
}
```    

JSDoc 的插件是作用于解析流程的，通过以下三种方式可以影响解析的结果：   

- 定义事件回调
- 定义 tags
- 定义 AST 节点的 visitor    

tags 列表，一些不常用的就省略了：    

- `@abstract`
- `@async`: 一般来说不必明说，会自己侦测
- `@augments <namepath>` 或者 `@extends <namepath>`: 继承关系
- `@author <name> [<emailAddress>]`
- `@class` 或 `@constructor`
- `@enum [<type>]`
- `@file` 或 `@fileoverview` 或 `@overview`    

算了，感觉没什么有用的内容。    

## eslint

eslint 无法识别 typescript 代码，会报错，所以可能使用 @typescript-eslint 这个项目了。oh，
烦躁。   

eslint 会在待检测文件同目录下搜索配置文件，以及向上层目录继续搜索，直到找到文件系统顶层或者
指定了 `root: true` 的配置文件目录。    

shared settings 看起来是为了不同的 rules 提供均可见的数据而添加的，也就是说 setting 中的
数据，所有 rules 是都可以访问到的。相当于提供了一些除 eslint 官方的配置数据之外的全局变量，方便
各不同模块访问，不然应该各模块数据相互隔离，拿不到共用的配置项。   

配置文件会级联和 merge。    

在 `extends` 配置中 `eslint-config-` 前缀可以省略。 

### 可共享配置文件

就是一个 npm 包，导出一个配置对象，名字必须是 `eslint-config-name`，scope 包也支持，
`@scope/eslint-config-name` 或者 `@scope/eslint-config` 都行。     

用的时候可以这样用：   

```json
{
    "extends" "@scope/eslint-config",
    "extends": "@scope",
    "extends": "@scope/eslint-config-name"
}
```     

支持在一个包里导出多个配置。需要创建新的文件。比如说在包里创建一个 `my-special-config.js`
文件：    

```js
module.exports = {
    rules: {
        quotes: [2, "double"]
    }
}
```    

假设包名是 `eslint-config-myconfig`，你们访问的时候就是:    

```json
{
    "extends": "myconfig/my-special-config"
}
```    

如果是 scope 包，就是这样引用：   

```json
{
    "extends": "@scope/eslint-config/my-special-config"
}
```    

注意 scope 包这里好像是不能省略 eslint-config 部分的。也就是得全称。  

eslint 插件也可以导出共享配置。然后 plugins 里面是可以省略 `eslint-plugin-` 前缀。    

如果使用 plugin 的配置的话，要写成这样：   

```json
{
    "plugins": [
        "react"
    ],
    "extends": [
        "eslint:recommend",
        "plugin:react/recommend"
    ],
    "rules": {
        "react/no-set-state": "off"
    }
}
```     

基本上是这个样子，先是 `plugin:`，然后跟包名，这里可以省略 eslint-plugin 前缀，然后是 `/`，
最后跟配置名。     

从 4.1 版本开始，提供了更精确配置的方式：    

```json
{
  "rules": {
    "quotes": ["error", "double"]
  },

  "overrides": [
    {
      "files": ["bin/*.js", "lib/*.js"],
      "excludedFiles": "*.test.js",
      "rules": {
        "quotes": ["error", "single"]
      }
    }
  ]
}
```     

### 注释的用法

全局变量 `/* global var1, var2 */`。   

禁用规则：    

```js
/* eslint-disable */
alert('foo');
/* eslint-enable */
```      

```js
alert('foo'); // eslint-disable-line no-alert

// eslint-disable-next-line no-alert
alert('foo');

alert('foo'); /* eslint-disable-line no-alert */

/* eslint-disable-next-line no-alert */
alert('foo');
```     

### Ignoring Code

`ignorePatterns` 字段，还有 `.eslintignore` 文件。    

## eslint-config-prettier

支持以下的插件：   

- @typescript-eslint/eslint-plugin
- eslint-plugin-babel
- eslint-plugin-flowtype
- eslint-plugin-prettier
- eslint-plugin-react
- eslint-plugin-standard
- eslint-plugin-vue     

要是用了对应插件的话，建议把配置也加上：   

```js
{
  "extends": [
    "some-other-config-you-use",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/babel",
    "prettier/flowtype",
    "prettier/prettier",
    "prettier/react",
    "prettier/standard",
    "prettier/unicorn",
    "prettier/vue"
  ]
}
```     

## @typescript-eslint 项目

@typescipt-eslint/parser 包，解析 TS 代码然后转换成一个 eslint 可以识别的 AST，更准备的
说法可能是这样，@typescript-eslint/parser 负责处理 eslint 的配置，然后调用 @typescript-eslint/typescript-estree，
生成一个 AST，而 @typescript-eslint/typescript-estree 实际上是调用 TS 的编译器去解析 TS
代码然后生成一个 TS 的 AST，再然后把这个 AST 转换成一个 eslint 认识的 AST。    

这一部分只涉及到了解析，而 rules 部分则是由 plugin 来负责的。    

首先需要明确一点，不是所有的 eslint plugin 和 rules 都可以直接使用。
