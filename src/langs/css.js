import Cursor from "../core/cursor.js";
import Buffer from "../core/buffer.js";
import comment from "../core/comment.js";
import readString from "../core/string.js";
import defaultColors from "../colors/css.js";

/**
 * CSS lexer
 *
 * state:
 *   "tag"     -> 选择器
 *   "attr"    -> 属性名
 *   "string"  -> 属性值
 */
export function tokenize(source, colors) {
    colors = colors || defaultColors;
    source = source || "";
    const cur = new Cursor(source);
    const buf = new Buffer();
    const tokens = [];
    let state = "tag";

    const colorOfState = () =>
        ({ tag: colors.selector, attr: colors.attrKey, string: colors.attrValue })[state];

    const flush = () => {
        if (buf.value !== "") {
            tokens.push({ color: colorOfState(), content: buf.value });
            buf.clear();
        }
    };

    while (cur.i < cur.length) {
        // 注释会立即产出 token，需先提交缓冲区，避免前后文本错序
        if (cur.peek(2) === "/*") flush();
        if (comment.block(cur, tokens, colors.annotation)) continue;

        // 字符串可能出现在属性值中间（如 url("./bg.png")），
        // 需要先把缓冲区内容提交，避免 token 顺序错乱
        if (cur.peekChar() === '"' || cur.peekChar() === "'") {
            flush();
            if (readString(cur, tokens, colors.attrValue, { quotes: ["'", '"'], escape: false })) continue;
        }

        const ch = cur.peekChar();

        if (ch === ":" || ch === "{" || ch === "}" || ch === ";") {
            flush();
            tokens.push({ color: colors.insign, content: ch });
            buf.clear();
            if (ch === "{" || ch === ";") state = "attr";
            else if (ch === "}") state = "tag";
            else state = "string";
            cur.advance(1);
            continue;
        }

        buf.appendChar(cur.advance(1));
    }
    flush();
    return tokens;
}

export const id = ["css"];
export { defaultColors };
export default { id, defaultColors, tokenize };