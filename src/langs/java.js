import Cursor from "../core/cursor.js";
import Buffer from "../core/buffer.js";
import comment from "../core/comment.js";
import readString from "../core/string.js";
import tryKeyword from "../core/keywords.js";
import defaultColors from "../colors/java.js";

const KEYWORDS = [
    "abstract", "assert", "boolean", "break", "byte",
    "case", "catch", "char", "class", "const",
    "continue", "default", "do", "double", "else",
    "enum", "extends", "final", "finally", "float",
    "for", "goto", "if", "implements", "import",
    "instanceof", "int", "interface", "long", "native",
    "new", "package", "private", "protected", "public",
    "return", "short", "static", "strictfp", "super",
    "switch", "synchronized", "throw", "throws",
    "transient", "try", "void", "volatile", "while",
    "true", "false", "null"
];

const BOUNDARIES = [";", "{", "}", "(", ")", ".", "\n", "=", "+", ">", "<", "[", "]", "-", "*", "/", "^", "!", "@", ","];
const QUOTES = ["'", '"'];

export function tokenize(source, colors) {
    colors = colors || defaultColors;
    source = source || "";
    const cur = new Cursor(source);
    const buf = new Buffer();
    const tokens = [];

    while (cur.i < cur.length) {
        // 注释会立即产出 token，需先提交缓冲区，避免前后文本错序
        if (cur.peek(2) === "/*" || cur.peek(2) === "//") {
            if (buf.value !== "") buf.flush(tokens, colors.text, colors.insign);
        }
        if (comment.block(cur, tokens, colors.annotation)) continue;
        if (comment.line(cur, tokens, colors.annotation, "//")) continue;

        if (QUOTES.indexOf(cur.peekChar()) > -1) {
            if (buf.value !== "") buf.flush(tokens, colors.text, colors.insign);
            if (readString(cur, tokens, colors.string)) continue;
        }

        const ch = cur.peekChar();

        if (ch === "(" && (buf.value.charAt(0) === " " ||
            (cur.i - buf.value.length - 1 >= 0 && cur.source[cur.i - buf.value.length - 1] === " "))) {
            tokens.push({ color: colors.funName, content: buf.value });
            buf.value = "(";
            cur.advance(1);
            continue;
        }
        if (ch === "(") {
            tokens.push({ color: colors.execName, content: buf.value });
            buf.value = "(";
            cur.advance(1);
            continue;
        }

        if (BOUNDARIES.indexOf(ch) > -1) {
            buf.flush(tokens, colors.text, colors.insign);
            tokens.push({ color: colors.insign, content: ch });
            buf.clear();
            cur.advance(1);
            continue;
        }

        if (tryKeyword(buf, tokens, cur, KEYWORDS, colors.key)) continue;

        buf.appendChar(cur.advance(1));
    }
    buf.flush(tokens, colors.text, colors.insign);
    return tokens;
}

export const id = ["java"];
export { defaultColors };
export default { id, defaultColors, tokenize };