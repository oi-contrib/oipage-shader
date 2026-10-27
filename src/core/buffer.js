/**
 * 模板缓冲器
 * flush 时会根据首字符是否含 `(` 自动拆分 token，与原行为等价。
 */
export default class Buffer {
    constructor() {
        this.value = "";
    }

    appendChar(ch) {
        this.value += ch;
    }

    /**
     * 把当前累积内容追加到 tokens。
     *
     * @param {Array} tokens
     * @param {string} color           文本默认色
     * @param {string} openParenColor  当内容以 "(" 开头时，"(" 单独使用的颜色
     * @param {function(string):string|null} [mapColor] 可选回调，按 buffer 内容返回颜色
     */
    flush(tokens, color, openParenColor, mapColor) {
        if (this.value === "") return;

        let start = 0;
        if (this.value.charAt(0) === "(") {
            tokens.push({ color: openParenColor || color, content: "(" });
            start = 1;
        }

        const rest = this.value.substring(start);
        let useColor = color;
        if (typeof mapColor === "function") {
            const mapped = mapColor(rest);
            if (mapped) useColor = mapped;
        }
        if (rest !== "") {
            tokens.push({ color: useColor, content: rest });
        }

        this.value = "";
    }

    clear() {
        this.value = "";
    }
}