# [@oipage/shader](https://github.com/oi-contrib/oipage-shader)
一个简单小巧的代码着色库

<p>
    <a href="https://zxl20070701.github.io/toolbox/#/npm-download?packages=@oipage/shader&interval=7">
        <img src="https://img.shields.io/npm/dm/@oipage/shader.svg" alt="downloads">
    </a>
    <a href="https://www.npmjs.com/package/@oipage/shader">
        <img src="https://img.shields.io/npm/v/@oipage/shader.svg" alt="npm">
    </a>
    <a href="https://github.com/oi-contrib/oipage-shader/issues">
        <img src="https://img.shields.io/github/issues/oi-contrib/oipage-shader" alt="issue">
    </a>
    <a href="https://github.com/oi-contrib/oipage-shader" target='_blank'>
        <img alt="GitHub repo stars" src="https://img.shields.io/github/stars/oi-contrib/oipage-shader?style=social">
    </a>
    <a href="https://github.com/oi-contrib/oipage-shader">
        <img src="https://img.shields.io/github/forks/oi-contrib/oipage-shader" alt="forks">
    </a>
    <a href="https://gitee.com/oi-contrib/oipage-shader" target='_blank'>
        <img alt="Gitee repo stars" src="https://gitee.com/oi-contrib/oipage-shader/badge/star.svg">
    </a>
    <a href="https://gitee.com/oi-contrib/oipage-shader">
        <img src="https://gitee.com/oi-contrib/oipage-shader/badge/fork.svg" alt="forks">
    </a>
</p>

<img src="https://nodei.co/npm/@oipage/shader.png?downloads=true&amp;downloadRank=true&amp;stars=true" alt="NPM">

## 特性

- 零依赖、体积小，同时提供 UMD 与 ES Module 两种使用方式
- 开箱内置 `html`、`css`、`javascript`、`python`、`json`、`java`、`go`、`c`、`kotlin`、`shell`、`sql` 等语言
- 颜色可完全自定义，不绑定任何样式/主题
- 支持通过 `registerLangHandler` 扩展新语言
- 提供完整的 TypeScript 类型声明

## 安装

```bash
npm install --save @oipage/shader
```

## 快速开始

### 浏览器

引入打包产物后，扫描页面内所有 `<pre tag="xxx">` 自动着色：

```html
<pre tag="javascript">function add (a, b) { return a + b; }</pre>

<script src="./dist/shader.js"></script>
<script>
    Shader.shader();
</script>
```

也可以手动着色某一区块：

```js
Shader.shader(document.getElementById("container"));
```

### ES Module / Node

```js
import Shader from "@oipage/shader";

// 1. 直接产出彩色 HTML 字符串
const html = Shader.toHTML("javascript", "const a = 1;");

// 2. 编译为 token 数组，自定义渲染
Shader.tokenize("javascript", "const a = 1;");
// => [{ color: "#ff0000", content: "const " }, { color: "#000000", content: "a = 1;" }, ...]
```

## 核心 API

| API | 说明 |
| --- | --- |
| `Shader.shader(rootEl?, opts?)` | 浏览器端：扫描并着色 `rootEl`（或其文档）下所有 `<pre tag="xxx">` |
| `Shader.tokenize(langId, source, colors?)` | 将源码编译为 `{ color, content }[]` token 数组 |
| `Shader.toHTML(langId, source, colors?)` | 将源码编译为 `<span style="color:...">` 形式的 HTML 字符串 |
| `Shader.registerLangHandler(handler, langIds?)` | 注册/扩展语言，`handler` 形如 `{ id, defaultColors, tokenize }` |
| `Shader.getHandler(langId)` | 获取已注册语言对应的 handler |
| `Shader.langs` | 已注册语言 id 列表 |
| `Shader.PR_*` | 仿 code-prettify 的颜色键常量（如 `PR_KEYWORD`、`PR_STRING`） |

## 运行示例

`test/example/index.html` 是所有示例的入口页，直接用浏览器打开即可（无需构建，逐个页面独立运行）：

```
test/example/index.html      # 示例入口（导航全部示例）
test/example/api/*.html      # API 示例：tokenize / toHTML / 自定义颜色 / 注册新语言
test/example/<lang>.html     # 各语言示例（含「基础用法」与「更多情况」）
```

> 示例依赖 `dist/shader.js`，请先执行 `npm run build`（或 `npm run dev`）。

## 更多文档

- [docs/api.md](./docs/api.md) — API 详解、颜色配置、token 结构、扩展新语言
- [docs/lang.md](./docs/lang.md) — 各语言默认颜色键一览

## 开发

```bash
npm install

npm run dev     # 监听构建，自动产出 dist/shader.js
npm run build   # 产出 dist/shader.js、dist/shader.min.js
npm test        # 运行 test/unit 单元测试（基于 @oipage/testjs）
```

## 版权

MIT License

Copyright (c) [zxl20070701](https://zxl20070701.github.io/notebook/home.html) 走一步，再走一步
