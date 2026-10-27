import Buffer from "../../src/core/buffer.js";
import { describe, it, expect } from "./_runner.js";

describe("Buffer", () => {
    it("flush appends text token", () => {
        const b = new Buffer();
        b.appendChar("a");
        b.appendChar("b");
        const tokens = [];
        b.flush(tokens, "red", "gray");
        expect(tokens).toEqual([{ color: "red", content: "ab" }]);
        expect(b.value).toBe("");
    });

    it("flush splits leading '(' into its own token", () => {
        const b = new Buffer();
        b.appendChar("(");
        b.appendChar("foo");
        const tokens = [];
        b.flush(tokens, "red", "gray");
        expect(tokens).toEqual([
            { color: "gray", content: "(" },
            { color: "red", content: "foo" }
        ]);
    });

    it("flush on empty is a no-op", () => {
        const b = new Buffer();
        const tokens = [];
        b.flush(tokens, "red", "gray");
        expect(tokens).toEqual([]);
    });

    it("flush honours mapColor callback", () => {
        const b = new Buffer();
        b.appendChar("SELECT");
        const tokens = [];
        b.flush(tokens, "red", "gray", v => v === "SELECT" ? "blue" : null);
        expect(tokens).toEqual([{ color: "blue", content: "SELECT" }]);
    });
});