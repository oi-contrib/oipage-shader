/**
 * 测试公共工具：把 token 数组拍平成纯文本 / 颜色序列
 */
export function flatten(tokens) {
    return tokens.map(t => t.content).join("");
}

export function colorsOf(tokens) {
    return tokens.map(t => t.color);
}

export function contentsOf(tokens) {
    return tokens.map(t => t.content);
}