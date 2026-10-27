import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import lang from "../../../src/langs/sql.js";
import { flatten } from "../../helpers.js";
import { describe, it, expect } from "../_runner.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("sql lexer", () => {
    it("keywords + function", () => {
        const src = "SELECT COUNT(*) FROM users WHERE id = 1;";
        const tokens = lang.tokenize(src);
        expect(flatten(tokens)).toBe(src);
        expect(tokens.some(t => t.content.trim() === "SELECT")).toBeTruthy();
    });

    it("colours function name and emits no empty token", () => {
        const tokens = lang.tokenize("SELECT COUNT(*) FROM users;");
        expect(tokens.some(t => t.content === "COUNT" && t.color === lang.defaultColors.funName)).toBeTruthy();
        expect(tokens.every(t => t.content !== "")).toBeTruthy();
    });

    it("full fixture", () => {
        const src = fs.readFileSync(path.join(__dirname, "../../fixtures/sample.sql"), "utf8");
        const tokens = lang.tokenize(src);
        expect(flatten(tokens)).toBe(src);
    });
});