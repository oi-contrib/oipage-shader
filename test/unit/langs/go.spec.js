import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import lang from "../../../src/langs/go.js";
import { flatten } from "../../helpers.js";
import { describe, it, expect } from "../_runner.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("go lexer", () => {
    it("func keyword + raw string", () => {
        const src = 'func greet() string { return `hi` }';
        const tokens = lang.tokenize(src);
        expect(flatten(tokens)).toBe(src);
    });

    it("full fixture", () => {
        const src = fs.readFileSync(path.join(__dirname, "../../fixtures/sample.go"), "utf8");
        const tokens = lang.tokenize(src);
        expect(flatten(tokens)).toBe(src);
    });
});