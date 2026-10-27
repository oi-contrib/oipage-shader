import Cursor from "../../src/core/cursor.js";
import comment from "../../src/core/comment.js";
import { describe, it, expect } from "./_runner.js";

describe("comment", () => {
    it("block parses /* ... */", () => {
        const c = new Cursor("/* hello */");
        const tokens = [];
        expect(comment.block(c, tokens, "green")).toBe(true);
        expect(tokens).toEqual([{ color: "green", content: "/* hello */" }]);
        expect(c.i).toBe(c.length);
    });

    it("line parses // ... \\n", () => {
        const c = new Cursor("// hi\nrest");
        const tokens = [];
        expect(comment.line(c, tokens, "green")).toBe(true);
        expect(tokens).toEqual([{ color: "green", content: "// hi" }]);
    });

    it("hash parses # ... \\n", () => {
        const c = new Cursor("# py\nrest");
        const tokens = [];
        expect(comment.hash(c, tokens, "green")).toBe(true);
        expect(tokens).toEqual([{ color: "green", content: "# py" }]);
    });

    it("html parses <!-- ... -->", () => {
        const c = new Cursor("<!-- hi -->");
        const tokens = [];
        expect(comment.html(c, tokens, "green")).toBe(true);
        expect(tokens).toEqual([{ color: "green", content: "<!-- hi -->" }]);
    });

    it("block returns false when not starting with /*", () => {
        const c = new Cursor("// not block");
        const tokens = [];
        expect(comment.block(c, tokens, "green")).toBe(false);
        expect(tokens.length).toBe(0);
    });
});