import html from "./html.js";
import css from "./css.js";
import javascript from "./javascript.js";
import python from "./python.js";
import json from "./json.js";
import java from "./java.js";
import go from "./go.js";
import c from "./c.js";
import kotlin from "./kotlin.js";
import shell from "./shell.js";
import sql from "./sql.js";

// 使用无原型对象，避免 id 为 constructor / toString / __proto__ 时误命中原型成员
const byId = Object.assign(Object.create(null), {
    html,
    css,
    javascript, js: javascript,
    python, py: python,
    json,
    java,
    go,
    c,
    kotlin, kt: kotlin,
    shell, sh: shell, bash: shell,
    sql, mysql: sql
});

export function get(id) {
    return byId[id] || null;
}

export function list() {
    return Object.keys(byId);
}

export const raw = byId;

export default { get, list, raw };