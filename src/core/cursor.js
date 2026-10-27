/**
 * 字符游标：把 "当前索引 i + 预读 nextN(n)" 这种样板代码封装起来。
 */
export default class Cursor {
    constructor(source) {
        this.source = source || "";
        this.i = 0;
        this.length = this.source.length;
    }

    /** 从当前光标起读 n 个字符，不会越界 */
    peek(n = 1) {
        const end = Math.min(this.length, this.i + n);
        return this.source.substring(this.i, end);
    }

    /** 等价于 peek(1) */
    peekChar() {
        return this.peek(1);
    }

    /** 兼容旧 API：nextNValue(n) */
    nextN(n) {
        return this.peek(n);
    }

    /** 前进 n 个字符，返回推进过程中"经过"的所有字符 */
    advance(n = 1) {
        const end = Math.min(this.length, this.i + n);
        const s = this.source.substring(this.i, end);
        this.i = end;
        return s;
    }

    /** 把光标停在终止符 stop 上但不再消费终止符 */
    advanceUntilNot(stop) {
        let buf = "";
        while (this.i < this.length && this.source[this.i] !== stop) {
            buf += this.source[this.i++];
        }
        return buf;
    }

    /** 跳过连续的字符集合，返回跳过的字符数 */
    skipWhile(predicate) {
        let n = 0;
        while (this.i < this.length && predicate(this.source[this.i])) {
            this.i++;
            n++;
        }
        return n;
    }
}