# Project Configuration

<!-- TOC -->

- [Project Configuration](#project-configuration)
    - [Project References](#project-references)

<!-- /TOC -->

## Project References

tsconfig.json 新加了一个顶层配置项 `references`，一个对象数组，声明该项目的引用的其他项目。   

```json
{
    "compilerOptions": {
        
    },
    "references": [{
        "path": "../src"
    }]
}
```    

path 属性可以指向一个包含 tsconfig.json 的目录，也可以直接指向一个 tsconfig.json 文件。   

当我们引用一个项目时，会发生这些事情：   

- 从被引用的项目中导入模块时，加载的是其输出的 declaration 文件
- 如果被引用的项目有 `outFile`，则这个文件的 declaration 文件对本项目可见
- build mode 会在必要的时候自动构建被引用的项目     

被引用的项目可以设置 `composite` 配置项，这个配置项用来让 TS 知道这个项目的输出在哪里。   

