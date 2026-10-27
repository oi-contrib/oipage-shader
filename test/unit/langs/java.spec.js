import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import lang from "../../../src/langs/java.js";
import { flatten } from "../../helpers.js";
import { describe, it, expect } from "../_runner.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("java lexer", () => {
    it("keyword + string", () => {
        const src = 'public class A { String s = "hi"; }';
        const tokens = lang.tokenize(src);
        expect(flatten(tokens)).toBe(src);
    });

    it("full fixture", () => {
        const src = fs.readFileSync(path.join(__dirname, "../../fixtures/sample.java"), "utf8");
        const tokens = lang.tokenize(src);
        expect(flatten(tokens)).toBe(src);
    });
});