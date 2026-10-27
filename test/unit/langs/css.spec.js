import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import css from "../../../src/langs/css.js";
import { flatten, colorsOf } from "../../helpers.js";
import { describe, it, expect } from "../_runner.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("css lexer", () => {
    it("basic selector + value", () => {
        const src = ".box { color: red; }";
        const tokens = css.tokenize(src);
        expect(flatten(tokens)).toBe(src);
        // 选择器、属性名、属性值至少 3 种颜色
        const set = new Set(colorsOf(tokens));
        expect(set.size).toBeGreaterThanOrEqual(3);
    });

    it("block comment captured as one token", () => {
        const src = "/* css comment */\n.box { color: red; }";
        const tokens = css.tokenize(src);
        expect(flatten(tokens)).toBe(src);
        expect(tokens.some(t => t.content === "/* css comment */")).toBeTruthy();
    });

    it("string literal", () => {
        const src = ".box { content: 'hi'; }";
        const tokens = css.tokenize(src);
        expect(tokens.some(t => t.content === "'hi'")).toBeTruthy();
    });

    it("full fixture", () => {
        const src = fs.readFileSync(path.join(__dirname, "../../fixtures/sample.css"), "utf8");
        const tokens = css.tokenize(src);
        expect(flatten(tokens)).toBe(src);
    });
});