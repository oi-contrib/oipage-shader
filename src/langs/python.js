import Cursor from "../core/cursor.js";
import Buffer from "../core/buffer.js";
import comment from "../core/comment.js";
import readString from "../core/string.js";
import tryKeyword from "../core/keywords.js";
import defaultColors from "../colors/python.js";

const KEYWORDS = [
    "False", "None", "True", "and", "as", "assert", "break", "class",
    "continue", "def", "del", "elif", "else", "except", "finally",
    "for", "from", "global", "if", "import", "in", "is", "lambda",
    "nonlocal", "not", "or", "pass", "raise", "return", "try",
    "while", "with", "yield"
];

const BOUNDARIES = [":", "{", "}", "(", ")", ".", "\n", "=", "+", ">", "<", "[", "]", "-", "*", "/", "^", "!"];
const QUOTES = ["'", '"'];

export function tokenize(source, colors) {
    colors = colors || defaultColors;
    source = source || "";
    const cur = new Cursor(source);
    const buf = new Buffer();
    const tokens = [];

    while (cur.i < cur.length) {
        // 注释会立即产出 token，需先提交缓冲区，避免前后文本错序
        if (cur.peekChar() === "#" && buf.value !== "") buf.flush(tokens, colors.text, colors.insign);
        if (comment.hash(cur, tokens, colors.annotation)) continue;

        if (QUOTES.indexOf(cur.peekChar()) > -1) {
            if (buf.value !== "") buf.flush(tokens, colors.text, colors.insign);
            if (readString(cur, tokens, colors.string, { quotes: ["'", '"'], escape: true })) continue;
        }

        const ch = cur.peekChar();
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

export const id = ["python", "py"];
export { defaultColors };
export default { id, defaultColors, tokenize };