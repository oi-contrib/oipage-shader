/**
 * 通用字符串字面量解析：抽取 ['"/`/三引号] 起始 + 转义配对的样板代码。
 *
 * @param {import('./core/cursor').default} source
 * @param {Array} tokens
 * @param {string} color
 * @param {object} opts
 *   - quotes:   string[] 允许的引号字符集合
 *   - escape:   boolean 是否处理 \ 转义
 *   - multi:    number? 多行字符模板长度（Kotlin 三引号 = 3）
 */
export default function readString(source, tokens, color, opts) {
    opts = opts || {};
    const quotes = opts.quotes || ["'", '"'];
    const escape = opts.escape !== false;
    const multi = opts.multi || null;

    const ch = source.peekChar();

    if (multi && quotes.indexOf(ch) > -1) {
        const tri = source.peek(multi);
        if (
            tri.length === multi &&
            tri.split("").every(c => c === ch)
        ) {
            let triBuf = tri;
            source.advance(multi);
            while (source.i < source.length) {
                if (source.peek(multi) === tri) {
                    triBuf += tri;
                    source.advance(multi);
                    break;
                }
                triBuf += source.advance(1);
            }
            tokens.push({ color, content: triBuf });
            return true;
        }
    }

    if (quotes.indexOf(ch) === -1) return false;

    const border = ch;
    let buf = border;
    source.advance(1);

    while (source.i < source.length) {
        const c = source.peekChar();
        if (escape && c === "\\") {
            buf += source.advance(1);
            if (source.i < source.length) buf += source.advance(1);
            continue;
        }
        if (c === border) {
            buf += source.advance(1);
            break;
        }
        buf += source.advance(1);
    }

    tokens.push({ color, content: buf });
    return true;
}