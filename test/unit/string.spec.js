import Cursor from "../../src/core/cursor.js";
import readString from "../../src/core/string.js";
import { describe, it, expect } from "./_runner.js";

describe("readString", () => {
    it("parses single quote string", () => {
        const c = new Cursor("'abc'");
        const tokens = [];
        expect(readString(c, tokens, "red", { quotes: ["'", '"'] })).toBe(true);
        expect(tokens).toEqual([{ color: "red", content: "'abc'" }]);
        expect(c.i).toBe(5);
    });

    it("returns false when no leading quote", () => {
        const c = new Cursor("abc");
        const tokens = [];
        expect(readString(c, tokens, "red")).toBe(false);
        expect(tokens.length).toBe(0);
    });

    it("parses JSON-style escaped string", () => {
        const c = new Cursor('"a\\"b"');
        const tokens = [];
        expect(readString(c, tokens, "red")).toBe(true);
        expect(tokens[0].content).toBe('"a\\"b"');
    });

    it("parses Kotlin triple quote", () => {
        const c = new Cursor('"""hi"""');
        const tokens = [];
        expect(readString(c, tokens, "red", { quotes: ['"'], escape: true, multi: 3 })).toBe(true);
        expect(tokens[0].content).toBe('"""hi"""');
    });
});