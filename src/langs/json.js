import Cursor from "../core/cursor.js";
import Buffer from "../core/buffer.js";
import comment from "../core/comment.js";
import readString from "../core/string.js";
import defaultColors from "../colors/json.js";

export function tokenize(source, colors) {
    colors = colors || defaultColors;
    source = source || "";
    const cur = new Cursor(source);
    const buf = new Buffer();
    const tokens = [];

    const flushAsText = () => {
        if (buf.value !== "") {
            tokens.push({ color: colors.text, content: buf.value });
            buf.clear();
        }
    };

    while (cur.i < cur.length) {
        if (comment.line(cur, tokens, colors.annotation, "//")) continue;
        if (readString(cur, tokens, colors.string)) continue;

        const ch = cur.peekChar();

        if (/[0-9]/.test(ch) || (ch === "-" && /[0-9]/.test(cur.peek(2).charAt(1)))) {
            flushAsText();
            let numBuf = "";
            numBuf += cur.advance(1);
            while (cur.i < cur.length && /[0-9.]/.test(cur.peekChar())) {
                numBuf += cur.advance(1);
            }
            tokens.push({ color: colors.number, content: numBuf });
            continue;
        }

        const kw4 = cur.peek(4);
        const kw5 = cur.peek(5);
        const tail4 = cur.peek(5);
        const tail5 = cur.peek(6);

        if (kw4 === "true" && (tail4 === "" || /[\s,:}\]]/.test(tail4.charAt(4)))) {
            flushAsText();
            tokens.push({ color: colors.keyword, content: "true" });
            cur.advance(4);
            continue;
        }
        if (kw5 === "false" && (tail5 === "" || /[\s,:}\]]/.test(tail5.charAt(5)))) {
            flushAsText();
            tokens.push({ color: colors.keyword, content: "false" });
            cur.advance(5);
            continue;
        }
        if (kw4 === "null" && (tail4 === "" || /[\s,:}\]]/.test(tail4.charAt(4)))) {
            flushAsText();
            tokens.push({ color: colors.keyword, content: "null" });
            cur.advance(4);
            continue;
        }

        if (ch === ":" || ch === "{" || ch === "}" || ch === "[" || ch === "]" ||
            ch === "," || ch === " " || ch === "\n" || ch === "\t") {
            flushAsText();
            tokens.push({ color: colors.insign, content: ch });
            buf.clear();
            cur.advance(1);
            continue;
        }

        buf.appendChar(cur.advance(1));
    }
    flushAsText();
    return tokens;
}

export const id = ["json"];
export { defaultColors };
export default { id, defaultColors, tokenize };