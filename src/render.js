/**
 * 把 token 数组渲染为彩色 HTML 字符串 / DOM。
 */

export function escapeHTML(s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/** token[] → '<span style="color:...">...</span>' 字符串 */
export function toHTML(tokens) {
    if (!tokens || tokens.length === 0) return "";
    const out = [];
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (t.content === "") continue; // 跳过空内容，避免生成空 <span>
        out.push('<span style="color:' + t.color + ';">' + escapeHTML(t.content) + '</span>');
    }
    return out.join("");
}

/** 浏览器端：把着色结果挂载到指定元素 */
export function renderInto(el, tokens) {
    if (!el) return;
    el.innerHTML = "";
    const doc = el.ownerDocument || (typeof document !== "undefined" ? document : null);
    if (!doc) return;
    const frag = doc.createDocumentFragment();
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].content === "") continue; // 跳过空内容，避免生成空 <span>
        const span = doc.createElement("span");
        span.style.color = tokens[i].color;
        span.textContent = tokens[i].content;
        frag.appendChild(span);
    }
    el.appendChild(frag);
}

export function unescapeSource(s) {
    return String(s)
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
}

export default { escapeHTML, toHTML, renderInto, unescapeSource };