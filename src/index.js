/**
 * @oipage/shader 入口
 *
 * - 自动注册 11 种内置语言
 * - 暴露 Shader.tokenize / Shader.toHTML / Shader.shader / Shader.registerLangHandler
 * - 提供 PR_* 颜色键常量
 */

import * as tokenCore from "./core/token.js";
import * as colors from "./colors/index.js";
import registry from "./langs/_registry.js";
import * as render from "./render.js";

import html from "./langs/html.js";
import css from "./langs/css.js";
import javascript from "./langs/javascript.js";
import python from "./langs/python.js";
import json from "./langs/json.js";
import java from "./langs/java.js";
import go from "./langs/go.js";
import c from "./langs/c.js";
import kotlin from "./langs/kotlin.js";
import shell from "./langs/shell.js";
import sql from "./langs/sql.js";

const BUILTINS = [html, css, javascript, json, java, go, c, kotlin, shell, sql, python];

function installBuiltin() {
    registry.reset();
    for (let i = 0; i < BUILTINS.length; i++) {
        const lang = BUILTINS[i];
        for (let j = 0; j < lang.id.length; j++) {
            registry.install(lang.id[j], lang);
        }
    }
}

function getHandler(langId) {
    return registry.get(langId);
}

function tokenize(langId, source, colorsOpt) {
    const handler = registry.get(langId);
    if (!handler) {
        throw new Error("[@oipage/shader] unknown language: " + langId);
    }
    const useColors = colorsOpt || handler.defaultColors || colors.get(langId);
    return handler.tokenize(source, useColors);
}

function toHTML(langId, source, colorsOpt) {
    return render.toHTML(tokenize(langId, source, colorsOpt));
}

/**
 * 用户扩展新语言
 * @param {{id:string[], defaultColors:object, tokenize:Function}} handler
 * @param {string|string[]} [langIds] 当 handler.id 缺省时使用
 */
function registerLangHandler(handler, langIds) {
    if (!handler || typeof handler.tokenize !== "function") {
        throw new Error("[@oipage/shader] handler.tokenize must be a function");
    }
    if (!Array.isArray(handler.id) && typeof langIds === "undefined") {
        throw new Error("[@oipage/shader] handler.id or langIds is required");
    }
    const ids = (Array.isArray(handler.id) && handler.id.length)
        ? handler.id
        : (Array.isArray(langIds) ? langIds : [langIds]);
    for (let i = 0; i < ids.length; i++) {
        registry.install(ids[i], handler);
    }
}

/**
 * 浏览器端：扫描 root 元素（或 document）下所有 <pre tag="xxx"> 自动着色
 * 兼容原 shader.js 的 doShader(el) 入口。
 */
function shader(rootEl, opts) {
    opts = opts || {};
    if (typeof document === "undefined") return;
    const doc = (rootEl && rootEl.ownerDocument) ? rootEl.ownerDocument : document;
    const scope = rootEl || doc.body;
    if (!scope || !scope.getElementsByTagName) return;
    const preEls = scope.getElementsByTagName("pre");
    for (let i = 0; i < preEls.length; i++) {
        const el = preEls[i];
        const lang = el.getAttribute("tag");
        if (!lang) continue;
        const handler = registry.get(lang);
        if (!handler) continue;
        const raw = el.innerHTML;
        const tokens = tokenize(lang, render.unescapeSource(raw), opts.colors || handler.defaultColors);
        render.renderInto(el, tokens);
    }
}

const Shader = {
    PR_ATTRIB_NAME: tokenCore.PR.PR_ATTRIB_NAME,
    PR_ATTRIB_VALUE: tokenCore.PR.PR_ATTRIB_VALUE,
    PR_COMMENT: tokenCore.PR.PR_COMMENT,
    PR_DECLARATION: tokenCore.PR.PR_DECLARATION,
    PR_KEYWORD: tokenCore.PR.PR_KEYWORD,
    PR_LITERAL: tokenCore.PR.PR_LITERAL,
    PR_NOCODE: tokenCore.PR.PR_NOCODE,
    PR_PLAIN: tokenCore.PR.PR_PLAIN,
    PR_PUNCTUATION: tokenCore.PR.PR_PUNCTUATION,
    PR_SOURCE: tokenCore.PR.PR_SOURCE,
    PR_STRING: tokenCore.PR.PR_STRING,
    PR_TAG: tokenCore.PR.PR_TAG,
    PR_TYPE: tokenCore.PR.PR_TYPE,

    tokenize,
    toHTML,
    shader,
    registerLangHandler,
    getHandler,

    langs: colors.list(),
    colors,
    render,

    _installBuiltin: installBuiltin,
    _registry: registry
};

installBuiltin();

if (typeof window !== "undefined") {
    window.Shader = Shader;
}

export default Shader;