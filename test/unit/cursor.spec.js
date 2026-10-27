import Cursor from "../../src/core/cursor.js";
import { describe, it, expect } from "./_runner.js";

describe("Cursor", () => {
    it("peek reads n chars without advancing", () => {
        const c = new Cursor("abcdef");
        expect(c.peek(3)).toBe("abc");
        expect(c.i).toBe(0);
    });

    it("peek handles overflow", () => {
        const c = new Cursor("abc");
        expect(c.peek(10)).toBe("abc");
    });

    it("peek handles empty source", () => {
        const c = new Cursor("");
        expect(c.peek(5)).toBe("");
    });

    it("advance advances and returns consumed text", () => {
        const c = new Cursor("abcdef");
        expect(c.advance(2)).toBe("ab");
        expect(c.i).toBe(2);
        expect(c.peek(3)).toBe("cde");
    });

    it("advanceUntilNot stops at boundary", () => {
        const c = new Cursor("abc\ndef");
        expect(c.advanceUntilNot("\n")).toBe("abc");
        expect(c.peekChar()).toBe("\n");
    });

    it("skipWhile skips matching characters", () => {
        const c = new Cursor("  abc");
        const skipped = c.skipWhile(ch => ch === " ");
        expect(skipped).toBe(2);
        expect(c.peekChar()).toBe("a");
    });
});