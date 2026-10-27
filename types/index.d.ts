import type { LangHandler, AnyColors } from "./langs";
import type { Render } from "./core";

export interface Token {
    color: string;
    content: string;
}

export type TokenizeFn<C = AnyColors> = (source: string, colors?: C) => Token[];

export interface ColorPalette {
    get(id: string): Record<string, string> | null;
    list(): string[];
    raw: Record<string, Record<string, string>>;
}

export interface Shader {
    /* PR_* 颜色键 */
    PR_ATTRIB_NAME: string;
    PR_ATTRIB_VALUE: string;
    PR_COMMENT: string;
    PR_DECLARATION: string;
    PR_KEYWORD: string;
    PR_LITERAL: string;
    PR_NOCODE: string;
    PR_PLAIN: string;
    PR_PUNCTUATION: string;
    PR_SOURCE: string;
    PR_STRING: string;
    PR_TAG: string;
    PR_TYPE: string;

    /* 公共 API */
    tokenize(langId: string, source: string, colors?: AnyColors): Token[];
    toHTML(langId: string, source: string, colors?: AnyColors): string;
    shader(rootEl?: HTMLElement, opts?: { colors?: AnyColors }): void;
    registerLangHandler(handler: LangHandler, langIds?: string | string[]): void;
    getHandler(langId: string): LangHandler | null;

    /* 元数据 */
    langs: string[];
    colors: ColorPalette;
    render: Render;

    /* 内部：测试/重置用 */
    _installBuiltin(): void;
    _registry: {
        install(id: string, handler: LangHandler): void;
        get(id: string): LangHandler | null;
        list(): string[];
        reset(): void;
    };
}

declare const Shader: Shader;
export default Shader;
export { LangHandler, AnyColors, Token, TokenizeFn, ColorPalette, Render };