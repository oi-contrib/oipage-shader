import type { Token, TokenizeFn } from "./index";

/**
 * 各语言暴露给 tokenize() 的可选 colors 字段。
 * 用户传入的 colors 不需要覆盖全部字段，缺失的字段会回落到 defaults.
 */
export interface HtmlColors {
    text?: string;
    annotation?: string;
    insign?: string;
    node?: string;
    attrKey?: string;
    attrValue?: string;
}

export interface CssColors {
    annotation?: string;
    insign?: string;
    selector?: string;
    attrKey?: string;
    attrValue?: string;
}

export interface JavascriptColors {
    text?: string;
    annotation?: string;
    insign?: string;
    key?: string;
    string?: string;
    funName?: string;
    execName?: string;
}

export interface PythonColors {
    text?: string;
    annotation?: string;
    insign?: string;
    key?: string;
    string?: string;
    funName?: string;
    execName?: string;
}

export interface JsonColors {
    text?: string;
    annotation?: string;
    insign?: string;
    string?: string;
    number?: string;
    keyword?: string;
}

export interface JavaColors extends JavascriptColors {}

export interface GoColors extends JavascriptColors {}

export interface CColors extends JavascriptColors {}

export interface KotlinColors extends JavascriptColors {}

export interface ShellColors {
    text?: string;
    annotation?: string;
    insign?: string;
    command?: string;
    option?: string;
    argument?: string;
    string?: string;
    variable?: string;
}

export interface SqlColors {
    text?: string;
    annotation?: string;
    insign?: string;
    key?: string;
    string?: string;
    number?: string;
    funName?: string;
}

export type AnyColors =
    | HtmlColors | CssColors | JavascriptColors | PythonColors
    | JsonColors | JavaColors | GoColors | CColors | KotlinColors
    | ShellColors | SqlColors
    | Record<string, string | undefined>;

export interface LangHandler<C = AnyColors> {
    id: string[];
    defaultColors: Record<string, string>;
    tokenize: (source: string, colors?: C) => Token[];
}