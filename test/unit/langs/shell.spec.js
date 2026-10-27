import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import lang from "../../../src/langs/shell.js";
import { flatten } from "../../helpers.js";
import { describe, it, expect } from "../_runner.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("shell lexer", () => {
    it("command/option/argument", () => {
        const src = "ls -la /tmp";
        const tokens = lang.tokenize(src);
        expect(flatten(tokens)).toBe(src);
        expect(tokens.some(t => t.content === "-la" && t.color === lang.defaultColors.option)).toBeTruthy();
        expect(tokens.some(t => t.content === "ls" && t.color === lang.defaultColors.command)).toBeTruthy();
    });

    it("variable", () => {
        const src = "echo $NAME ${USER}_v1";
        const tokens = lang.tokenize(src);
        expect(flatten(tokens)).toBe(src);
    });

    it("full fixture", () => {
        const src = fs.readFileSync(path.join(__dirname, "../../fixtures/sample.sh"), "utf8");
        const tokens = lang.tokenize(src);
        expect(flatten(tokens)).toBe(src);
    });
});