import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import py from "../../../src/langs/python.js";
import { flatten } from "../../helpers.js";
import { describe, it, expect } from "../_runner.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("python lexer", () => {
    it("hash comment", () => {
        const src = "# 注释\nx = 1";
        const tokens = py.tokenize(src);
        expect(flatten(tokens)).toBe(src);
        expect(tokens.some(t => t.content === "# 注释")).toBeTruthy();
    });

    it("def keyword", () => {
        const src = "def add(a, b):\n    return a + b";
        const tokens = py.tokenize(src);
        expect(flatten(tokens)).toBe(src);
    });

    it("full fixture", () => {
        const src = fs.readFileSync(path.join(__dirname, "../../fixtures/sample.py"), "utf8");
        const tokens = py.tokenize(src);
        expect(flatten(tokens)).toBe(src);
    });
});