# API 详解

## 引入方式

### UMD

```html
<script src="./dist/shader.js"></script>
<script>
    // 全局变量 Shader
    Shader.shader();
</script>
```

### ES Module

```js
import Shader from "@oipage/shader";
```

### CommonJS

```js
const Shader = require("@oipage/shader");
```

> 注意：`require` 指向的是 UMD 产物 `dist/shader.min.js`；`import` 指向源码入口 `src/index.js`。

---

## Shader.shader(rootEl?, opts?)

浏览器端使用。扫描 `rootEl`（省略时为其所在文档）下所有 `<pre tag="语言">` 元素，读取其内容并就地着色。

```html
<pre tag="java">
// 注释
public class A {}
</pre>

<script>
    // 扫描整个页面
    Shader.shader();

    // 只处理某个区块
    Shader.shader(document.getElementById("code-area"));
</script>
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `rootEl` | `HTMLElement?` | 扫描范围，缺省为 `document.body` |
| `opts.colors` | `object?` | 覆盖默认颜色 |

> `tag` 属性的值即 `langId`，支持别名（如 `js`、`py`、`mysql`）。

---

## Shader.tokenize(langId, source, colors?)

把源码编译成 token 数组。

```js
Shader.tokenize("javascript", "const a = 1;");
// [
//   { color: "#ff0000", content: "const " },
//   { color: "#000000", content: "a = 1;" }
// ]
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `langId` | `string` | 语言 id，未知语言会抛出异常 |
| `source` | `string` | 源码文本 |
| `colors` | `object?` | 覆盖该语言的默认颜色 |

返回的每个 token 结构为：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `color` | `string` | CSS 颜色值（如 `#ff0000`） |
| `content` | `string` | 该段文本原文 |

---

## Shader.toHTML(langId, source, colors?)

在 `tokenize` 基础上，直接拼接成带颜色的 HTML 字符串：

```js
Shader.toHTML("css", ".box { color: red; }");
// '<span style="color:#1e50b3;">.box </span><span ...>...</span>'
```

---

## Shader.registerLangHandler(handler, langIds?)

注册自定义语言。

```js
Shader.registerLangHandler({
    id: ["mylang"],           // 也可以省略，改用第二个参数传入
    defaultColors: { text: "#000000" },
    tokenize(source, colors) {
        return [{ color: colors.text, content: source }];
    }
}, ["mylang", "ml"]);         // 支持多个别名

Shader.tokenize("mylang", "hello");
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string[]` | 语言 id 及别名 |
| `defaultColors` | `object` | 该语言的默认颜色 |
| `tokenize` | `(source, colors) => token[]` | 解析函数 |

> 复用工具（`Cursor` / `Buffer` / 注释与字符串解析）位于 `src/core/`，编写新语言时可参考 `src/langs/` 下现有实现。

---

## Shader.PR_* 常量

命名参考 googlearchive/code-prettify，用于表达颜色语义：

| 常量 | 值 | 含义 |
| --- | --- | --- |
| `PR_PLAIN` | `pln` | 普通文本 |
| `PR_KEYWORD` | `kwd` | 关键字 |
| `PR_STRING` | `str` | 字符串 |
| `PR_COMMENT` | `com` | 注释 |
| `PR_LITERAL` | `lit` | 字面量 |
| `PR_PUNCTUATION` | `pun` | 标点/符号 |
| `PR_TAG` | `tag` | 标签 |
| `PR_ATTRIB_NAME` | `atn` | 属性名 |
| `PR_ATTRIB_VALUE` | `atv` | 属性值 |
| `PR_TYPE` | `typ` | 类型 |
| `PR_DECLARATION` | `dec` | 声明 |
| `PR_SOURCE` | `src` | 源 |
| `PR_NOCODE` | `nocode` | 非代码 |

---

## 自定义颜色

每种语言的默认颜色见 [lang.md](./lang.md)。传入 `colors` 时按需覆盖即可，未覆盖的字段仍使用默认值：

```js
Shader.tokenize("javascript", code, {
    key: "#ff0000",
    string: "#008000",
    annotation: "#888888"
});
```
