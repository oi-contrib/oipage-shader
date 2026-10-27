/**
 * 通用注释解析：抽出 4 种样板代码。
 *
 * 每个函数消费成功返回 true，否则返回 false。
 */

/** 块注释（前缀 "/*"，后缀 *+/） */
export function block(source, tokens, color) {
    if (source.peek(2) !== "/*") return false;
    let buf = "";
    while (source.i < source.length && source.peek(2) !== "*/") {
        buf += source.advance(1);
    }
    if (source.i < source.length) buf += source.advance(2);
    tokens.push({ color, content: buf });
    return true;
}

/** 行注释 prefix ... 换行符，默认 prefix = // */
export function line(source, tokens, color, prefix) {
    prefix = prefix || "//";
    if (source.peek(prefix.length) !== prefix) return false;
    let buf = "";
    while (source.i < source.length && source.peekChar() !== "\n") {
        buf += source.advance(1);
    }
    tokens.push({ color, content: buf });
    return true;
}

/** # 行注释（Python / Shell） */
export function hash(source, tokens, color) {
    if (source.peekChar() !== "#") return false;
    let buf = "";
    while (source.i < source.length && source.peekChar() !== "\n") {
        buf += source.advance(1);
    }
    tokens.push({ color, content: buf });
    return true;
}

/** HTML 注释（<!-- ... -->） */
export function html(source, tokens, color) {
    if (source.peek(4) !== "<!--") return false;
    let buf = "";
    while (source.i < source.length && source.peek(3) !== "-->") {
        buf += source.advance(1);
    }
    if (source.i < source.length) buf += source.advance(3);
    tokens.push({ color, content: buf });
    return true;
}

export default { block, line, hash, html };