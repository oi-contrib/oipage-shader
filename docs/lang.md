# 各语言默认颜色

以下为各语言的默认颜色键（均为 CSS 颜色值），可在调用 `tokenize` / `toHTML` / `shader` 时通过 `colors` 参数覆盖。

## html

| 键 | 默认值 | 含义 |
| --- | --- | --- |
| `text` | `#000000` | 文本 |
| `annotation` | `#6a9955` | 注释 |
| `insign` | `#9e9e9e` | 符号 |
| `node` | `#1e50b3` | 标签名 |
| `attrKey` | `#1e83b1` | 属性名 |
| `attrValue` | `#ac4c1e` | 属性值 |

## css

| 键 | 默认值 | 含义 |
| --- | --- | --- |
| `annotation` | `#6a9955` | 注释 |
| `insign` | `#9e9e9e` | 符号 |
| `selector` | `#1e50b3` | 选择器 |
| `attrKey` | `#1e83b1` | 属性名 |
| `attrValue` | `#ac4c1e` | 属性值 |

## javascript / python / java / go / c / kotlin

| 键 | 默认值 | 含义 |
| --- | --- | --- |
| `text` | `#000000` | 文本 |
| `annotation` | `#6a9955` | 注释 |
| `insign` | `#9e9e9e` | 符号 |
| `key` | `#ff0000` | 关键字 |
| `string` | `#ac4c1e` | 字符串 |
| `funName` | `#1e50b3` | 函数名 |
| `execName` | `#1e83b1` | 被调用方法名 |

## json

| 键 | 默认值 | 含义 |
| --- | --- | --- |
| `text` | `#000000` | 文本 |
| `annotation` | `#6a9955` | 注释 |
| `insign` | `#9e9e9e` | 符号 |
| `string` | `#ac4c1e` | 字符串 |
| `number` | `#1e50b3` | 数字 |
| `keyword` | `#1e83b1` | `true` / `false` / `null` |

## shell

| 键 | 默认值 | 含义 |
| --- | --- | --- |
| `text` | `#000000` | 文本 |
| `annotation` | `#6a9955` | 注释 |
| `insign` | `#9e9e9e` | 符号 |
| `command` | `#1e50b3` | 命令 |
| `option` | `#1e83b1` | 选项 |
| `argument` | `#ac4c1e` | 参数 |
| `string` | `#ac4c1e` | 字符串 |
| `variable` | `#ff0000` | 变量 |

## sql (别名 mysql)

| 键 | 默认值 | 含义 |
| --- | --- | --- |
| `text` | `#000000` | 文本 |
| `annotation` | `#6a9955` | 注释 |
| `insign` | `#9e9e9e` | 符号 |
| `key` | `#ff0000` | 关键字 |
| `string` | `#ac4c1e` | 字符串 |
| `number` | `#1e50b3` | 数字 |
| `funName` | `#1e83b1` | 函数名 |

---

## 语言 id 与别名

| 语言 | id | 别名 |
| --- | --- | --- |
| HTML | `html` | — |
| CSS | `css` | — |
| JavaScript | `javascript` | `js` |
| Python | `python` | `py` |
| JSON | `json` | — |
| Java | `java` | — |
| Go | `go` | — |
| C | `c` | — |
| Kotlin | `kotlin` | `kt` |
| Shell | `shell` | `sh`、`bash` |
| SQL | `sql` | `mysql` |
