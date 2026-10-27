import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "../../../src/langs/javascript.js";
import { flatten } from "../../helpers.js";
import { describe, it, expect } from "../_runner.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("javascript lexer", () => {
    it("keyword coloured", () => {
        const src = "if (a) { return 1; }";
        const tokens = js.tokenize(src);
        expect(flatten(tokens)).toBe(src);
        const hasKey = tokens.some(t => t.content.trim() === "if" || t.content.trim() === "return");
        expect(hasKey).toBeTruthy();
    });

    it("string with escaped quote", () => {
        const src = 'var s = "he said \\"hi\\"";';
        const tokens = js.tokenize(src);
        expect(flatten(tokens)).toBe(src);
        expect(tokens.some(t => t.content.indexOf('"he said \\"hi\\""') > -1)).toBeTruthy();
    });

    it("template literal", () => {
        const src = "var t = `a${1 + 2}b`;";
        const tokens = js.tokenize(src);
        expect(flatten(tokens)).toBe(src);
    });

    it("full fixture", () => {
        const src = fs.readFileSync(path.join(__dirname, "../../fixtures/sample.js"), "utf8");
        const tokens = js.tokenize(src);
        expect(flatten(tokens)).toBe(src);
    });
});