import Shader from "../../src/index.js";
import { flatten } from "../helpers.js";
import { describe, it, expect } from "./_runner.js";

/**
 * 回归测试：注释/字符串 token 会立即产出，若解析器没有先提交缓冲区，
 * 就会出现「注释插到前面文本之前、缓冲区内容被推到注释之后」的顺序错乱。
 * 这里用「前面有普通文本 + 行内注释」的样例保证 tokenize 后文本能原样还原。
 */
const CASES = [
    ["javascript", "var a = 1 // comment\n"],
    ["javascript", "foo() // c\n"],
    ["java", "x = 1 // comment\n"],
    ["go", "x := 1 // comment\n"],
    ["c", "x = 1 // comment\n"],
    ["kotlin", "val a = 1 // comment\n"],
    ["python", "a = 1 # comment\n"],
    ["sql", "SELECT 1 -- comment\n"],
    ["css", "a { color: red; } /* c */\n"],
    ["html", "<p>hi</p> <!-- c -->\n"],
    ["json", "{\n    \"a\": 1 // c\n}\n"],
    ["shell", "echo hi # comment\n"]
];

describe("token order around comments", () => {
    CASES.forEach(([langId, src]) => {
        it(langId + " keeps text order", () => {
            expect(flatten(Shader.tokenize(langId, src))).toBe(src);
        });
    });
});
