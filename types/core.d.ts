/**
 * 内部共用类型
 */
export interface Cursor {
    source: string;
    i: number;
    length: number;
    peek(n?: number): string;
    peekChar(): string;
    nextN(n?: number): string;
    advance(n?: number): string;
    advanceUntilNot(stop: string): string;
    skipWhile(predicate: (ch: string) => boolean): number;
}

export interface TokenBuffer {
    value: string;
    appendChar(ch: string): void;
    flush(
        tokens: Token[],
        color: string,
        openParenColor?: string,
        mapColor?: (value: string) => string | null
    ): void;
    clear(): void;
}

export interface Token {
    color: string;
    content: string;
}

export interface Render {
    escapeHTML(s: string): string;
    toHTML(tokens: Token[]): string;
    renderInto(el: HTMLElement, tokens: Token[]): void;
    unescapeSource(s: string): string;
}

export interface CommentReader {
    block(source: Cursor, tokens: Token[], color: string): boolean;
    line(source: Cursor, tokens: Token[], color: string, prefix?: string): boolean;
    hash(source: Cursor, tokens: Token[], color: string): boolean;
    html(source: Cursor, tokens: Token[], color: string): boolean;
}