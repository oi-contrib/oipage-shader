import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import json from "../../../src/langs/json.js";
import { flatten } from "../../helpers.js";
import { describe, it, expect } from "../_runner.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("json lexer", () => {
    it("numbers + keywords", () => {
        const src = '{ "a": 1, "b": true, "c": null, "d": false }';
        const tokens = json.tokenize(src);
        expect(flatten(tokens)).toBe(src);
        expect(tokens.some(t => t.content === "true")).toBeTruthy();
        expect(tokens.some(t => t.content === "false")).toBeTruthy();
        expect(tokens.some(t => t.content === "null")).toBeTruthy();
        expect(tokens.some(t => t.content === "1")).toBeTruthy();
    });

    it("escaped quote", () => {
        const src = '{ "a": "b\\"c" }';
        const tokens = json.tokenize(src);
        expect(flatten(tokens)).toBe(src);
    });

    it("full fixture", () => {
        const src = fs.readFileSync(path.join(__dirname, "../../fixtures/sample.json"), "utf8");
        const tokens = json.tokenize(src);
        expect(flatten(tokens)).toBe(src);
    });
});