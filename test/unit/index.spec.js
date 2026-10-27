import Shader from "../../src/index.js";
import { describe, it, expect } from "./_runner.js";

describe("Shader global API", () => {
    it("exposes PR_* constants", () => {
        expect(Shader.PR_KEYWORD).toBe("kwd");
        expect(Shader.PR_STRING).toBe("str");
        expect(Shader.PR_COMMENT).toBe("com");
    });

    it("langs contains built-in languages", () => {
        const list = Shader.langs;
        expect(list.indexOf("html") > -1).toBeTruthy();
        expect(list.indexOf("javascript") > -1).toBeTruthy();
        expect(list.indexOf("python") > -1).toBeTruthy();
        expect(list.indexOf("kotlin") > -1).toBeTruthy();
        expect(list.indexOf("shell") > -1).toBeTruthy();
        expect(list.indexOf("sql") > -1).toBeTruthy();
        expect(list.indexOf("mysql") > -1).toBeTruthy();
    });

    it("tokenize dispatches by alias", () => {
        const t1 = Shader.tokenize("javascript", "var a = 1;");
        const t2 = Shader.tokenize("js", "var a = 1;");
        expect(t1).toEqual(t2);
    });

    it("toHTML wraps each token in a <span>", () => {
        const html = Shader.toHTML("css", ".x{color:red}");
        expect(html.indexOf("style=") > -1).toBeTruthy();
        expect(html.indexOf(">") > -1).toBeTruthy();
    });

    it("tokenize throws on unknown language", () => {
        let threw = false;
        try {
            Shader.tokenize("not-a-language", "x");
        } catch (e) {
            threw = true;
        }
        expect(threw).toBeTruthy();
    });

    it("registerLangHandler adds custom language", () => {
        Shader.registerLangHandler({
            id: ["x-foo"],
            defaultColors: { text: "black" },
            tokenize: src => [{ color: "black", content: src }]
        });
        expect(Shader.tokenize("x-foo", "abc")).toEqual([{ color: "black", content: "abc" }]);
    });
});