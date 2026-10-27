/**
 * token 工厂 + 全局 PR_* 颜色键常量
 */

export const PR = {
    PR_ATTRIB_NAME: "atn",
    PR_ATTRIB_VALUE: "atv",
    PR_COMMENT: "com",
    PR_DECLARATION: "dec",
    PR_KEYWORD: "kwd",
    PR_LITERAL: "lit",
    PR_NOCODE: "nocode",
    PR_PLAIN: "pln",
    PR_PUNCTUATION: "pun",
    PR_SOURCE: "src",
    PR_STRING: "str",
    PR_TAG: "tag",
    PR_TYPE: "typ"
};

/**
 * 把任意 token 推入数组（null/undefined 会被忽略）
 */
export function push(tokens, color, content) {
    if (content === undefined || content === null) return;
    tokens.push({ color, content: String(content) });
}

export default { PR };