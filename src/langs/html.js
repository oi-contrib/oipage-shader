import Cursor from "../core/cursor.js";
import Buffer from "../core/buffer.js";
import comment from "../core/comment.js";
import registry from "./_registry.js";
import defaultColors from "../colors/html.js";

/**
 * HTML lexer：
 *   - 普通标签 <tag attr="value">
 *   - 闭合标签 </tag>
 *   - 注释 <!-- -->
 *   - 嵌套 <style>/<script> 内部使用对应 lexer
 */
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

    const readAttrValue = () => {
        let val = "";
        const ch = cur.peekChar();
        if (ch === '"' || ch === "'") {
            // 引号包裹：整体（含首尾引号）作为属性值着色
            const quote = ch;
            val += cur.advance(1);
            while (cur.i < cur.length && cur.peekChar() !== quote) {
                val += cur.advance(1);
            }
            if (cur.i < cur.length) {
                val += cur.advance(1);
            }
        } else {
            // 无引号：读到空格或标签闭合为止
            while (cur.i < cur.length && cur.peekChar() !== " " && cur.peekChar() !== ">") {
                val += cur.advance(1);
            }
        }
        tokens.push({ color: colors.attrValue, content: val });
        buf.clear();
    };

    while (cur.i < cur.length) {
        // 注释会立即产出 token，需先提交缓冲区，避免前后文本被拆散/错序
        if (cur.peek(4) === "<!--") flushAsText();
        if (comment.html(cur, tokens, colors.annotation)) continue;

        if (cur.peek(2) === "</") {
            flushAsText();
            tokens.push({ color: colors.insign, content: "</" });
            cur.advance(2);
            let nameBuf = "";
            while (cur.i < cur.length && cur.peekChar() !== ">") {
                nameBuf += cur.advance(1);
            }
            if (nameBuf !== "") {
                tokens.push({ color: colors.node, content: nameBuf });
                if (cur.i < cur.length) {
                    tokens.push({ color: colors.insign, content: ">" });
                    cur.advance(1);
                }
            }
            continue;
        }

        if (cur.peekChar() === "<" && cur.peek(2) !== "< ") {
            let specialTag = "";
            flushAsText();
            tokens.push({ color: colors.insign, content: "<" });
            cur.advance(1);

            let tagName = "";
            while (cur.i < cur.length && cur.peekChar() !== ">" && cur.peekChar() !== " ") {
                tagName += cur.advance(1);
            }
            if (tagName !== "") {
                if (tagName === "style" || tagName === "script") {
                    specialTag = "</" + tagName + ">";
                }
                tokens.push({ color: colors.node, content: tagName });
                buf.clear();
                if (cur.i < cur.length) {
                    while (cur.i < cur.length) {
                        if (cur.peekChar() === ">") {
                            flushAsText();
                            tokens.push({ color: colors.insign, content: ">" });
                            cur.advance(1);
                            break;
                        }
                        if (cur.peekChar() !== " ") {
                            flushAsText();
                            const ch = cur.peekChar();
                            if (ch !== '"' && ch !== "'") {
                                let key = "";
                                while (cur.i < cur.length && cur.peekChar() !== "=" &&
                                    cur.peekChar() !== ">" && cur.peekChar() !== " ") {
                                    key += cur.advance(1);
                                }
                                if (key !== "") {
                                    tokens.push({ color: colors.attrKey, content: key });
                                    if (cur.peekChar() === "=") {
                                        tokens.push({ color: colors.insign, content: "=" });
                                        cur.advance(1);
                                        if (cur.i < cur.length && cur.peekChar() !== " " && cur.peekChar() !== ">") {
                                            readAttrValue();
                                        }
                                    }
                                } else {
                                    buf.appendChar(cur.advance(1));
                                }
                            } else if (ch === "=") {
                                tokens.push({ color: colors.insign, content: "=" });
                                cur.advance(1);
                            } else if (cur.i < cur.length && cur.peekChar() !== " " && cur.peekChar() !== ">") {
                                readAttrValue();
                            }
                        } else {
                            buf.appendChar(cur.advance(1));
                        }
                    }
                }
            }

            if (specialTag !== "") {
                const oldI = cur.i;
                const oldTemplate = buf.value;
                let inner = "";
                while (cur.i < cur.length && cur.peek(specialTag.length) !== specialTag) {
                    inner += cur.advance(1);
                }
                if (cur.i < cur.length) {
                    // <style>/<script> 对应注册表中的 css/javascript
                    const innerTag = specialTag.replace(/<\//, "").replace(">", "");
                    const innerLangId = innerTag === "style" ? "css" : "javascript";
                    const innerHandler = registry.get(innerLangId);
                    if (innerHandler) {
                        const innerColors = innerHandler.defaultColors || defaultColors;
                        const innerTokens = innerHandler.tokenize(inner, innerColors);
                        for (let k = 0; k < innerTokens.length; k++) tokens.push(innerTokens[k]);
                    } else {
                        tokens.push({ color: colors.text, content: inner });
                    }
                    buf.clear();
                } else {
                    buf.value = oldTemplate;
                    cur.i = oldI;
                }
            }
            continue;
        }

        buf.appendChar(cur.advance(1));
    }
    flushAsText();
    return tokens;
}

export const id = ["html"];
export { defaultColors };
export default { id, defaultColors, tokenize };