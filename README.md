<!-- TOC -->

- [Webpack](#webpack)
- [Browserslist](#browserslist)
- [babel](#babel)
- [typescript](#typescript)
- [babel 与 typescript](#babel-与-typescript)
- [EditorConfig](#editorconfig)
- [@typescript-eslint](#typescript-eslint)
- [prettier](#prettier)

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


