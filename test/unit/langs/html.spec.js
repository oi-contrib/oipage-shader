import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Shader from "../../../src/index.js";
import { flatten } from "../../helpers.js";
import { describe, it, expect } from "../_runner.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("html lexer", () => {
    it("tag/attr/text round-trip", () => {
        const src = "<a href=\"x\">hi</a>";
        const tokens = Shader.tokenize("html", src);
        const text = flatten(tokens);
        expect(text).toBe(src);
        expect(text.indexOf("<a") > -1).toBeTruthy();
        expect(text.indexOf("</a>") > -1).toBeTruthy();
    });

    it("full fixture preserves text", () => {
        const src = fs.readFileSync(path.join(__dirname, "../../fixtures/sample.html"), "utf8");
        const tokens = Shader.tokenize("html", src);
        const text = flatten(tokens);
        expect(text).toBe(src);
        expect(text.indexOf("Demo") > -1).toBeTruthy();
        expect(text.indexOf("<style>") > -1).toBeTruthy();
    });

    it("embedded style/script tokens come from css/js", () => {
        const src = "<style>.x{color:red}</style><script>var a=1;</script>";
        const tokens = Shader.tokenize("html", src);
        const text = flatten(tokens);
        expect(text.indexOf(".x") > -1).toBeTruthy();
        expect(text.indexOf("var a=1") > -1).toBeTruthy();
    });
});