# Tutorials

<!-- TOC -->

- [Tutorials](#tutorials)
    - [Migrating from JavaScript](#migrating-from-javascript)
        - [和 webpack 集成](#和-webpack-集成)
        - [Getting Declaration Files](#getting-declaration-files)
    - [Using Babel with TypeScript](#using-babel-with-typescript)
        - [Babel for transpiling, tsc for types](#babel-for-transpiling-tsc-for-types)

<!-- /TOC -->

## Migrating from JavaScript

tsconfig.json 文件：    

```json
{
    "compilerOptions": {
        "outDir": "./dist",
        "allowJs": true,
        "target": "es5"
    },
    "include": ["./src/**/*"]
}
```     

### 和 webpack 集成

需要安装 `ts-loader` 和 `source-map-loader`。    

```js
module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "./dist/bundle.js",
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, loader: "ts-loader" },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, loader: "source-map-loader" },
    ],
  },

  // Other options...
};
```    

### Getting Declaration Files

如果我们开始进行 ts import 的转换，可能会收到 `Cannot find module 'foo'` 的报错。这种
情况是因为我们的库没有 declaration 文件。假设现在是找不到 lodash，那就安装这个：    

```bash
npm install -S @types/lodash
```    

貌似 ts 会将模块系统翻译成 cjs 的 require 形式，或者 amd 的 define 形式。最后这些加载函数
怎么定义还要其他的工具进行辅助。    

## Using Babel with TypeScript

### Babel for transpiling, tsc for types

使用 preset-typescript 来生成 JS 文件。注意 Babel 不会进行类型检查。    

tsc 用来执行类型检查及生成 `.d.ts` 文件。   

补充以下配置项：   

```json
{
    "compilerOptions": {
        // Ensure that .d.ts files are created by tsc, but not .js files
        "declaration": true,
        "emitDeclarationOnly": true,
        // Ensure that Babel can safely transpile files in the TypeScript project
        "isolatedModules": true
    }
}
```    
