/**
 * 关键字匹配辅助：把
 *   else if (nextNValue(1) == ' ' && keyWords.indexOf(template.trim()) > -1) {
 *       shaderArray.push({ color: colors.key, content: template + " " });
 *       template = ""; i += 1;
 *   }
 * 这种重复结构抽出。
 *
 * @param {import('./core/buffer').default} buffer
 * @param {Array} tokens
 * @param {import('./core/cursor').default} source
 * @param {string[]} set
 * @param {string} color
 * @returns {boolean} 是否命中关键字
 */
export default function tryKeyword(buffer, tokens, source, set, color) {
    if (source.peekChar() !== " ") return false;
    const word = buffer.value.trim();
    if (word === "") return false;
    if (set.indexOf(word) === -1) return false;

    tokens.push({ color, content: buffer.value + " " });
    buffer.clear();
    source.advance(1);
    return true;
}