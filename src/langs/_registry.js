/**
 * 内部 lexer 注册表：用于 HTML lexer 解析 <style>/<script>
 * 嵌套时回调对应语言的 tokenize。
 */
export function install(langId, handler) {
    registry[langId] = handler;
}

export function get(langId) {
    return registry[langId] || null;
}

export function reset() {
    registry = Object.create(null);
}

export function list() {
    return Object.keys(registry);
}

// 使用无原型对象，避免 langId 为 constructor / toString / __proto__ 时误命中原型成员
let registry = Object.create(null);

export default { install, get, reset, list };