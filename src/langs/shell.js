import Cursor from "../core/cursor.js";
import Buffer from "../core/buffer.js";
import comment from "../core/comment.js";
import readString from "../core/string.js";
import tryKeyword from "../core/keywords.js";
import defaultColors from "../colors/shell.js";

const KEYWORDS = [
    "if", "then", "else", "elif", "fi", "case", "esac", "for", "select", "while",
    "until", "do", "done", "in", "function", "time", "coproc",
    "alias", "bg", "bind", "break", "builtin", "caller", "cd", "command",
    "compgen", "complete", "compopt", "continue", "declare", "dirs", "disown",
    "echo", "enable", "eval", "exec", "exit", "export", "false", "fc", "fg",
    "getopts", "hash", "help", "history", "jobs", "kill", "let", "local",
    "logout", "mapfile", "popd", "printf", "pushd", "pwd", "read", "readarray",
    "readonly", "return", "set", "shift", "shopt", "source", "suspend",
    "test", "times", "trap", "true", "type", "typeset", "ulimit", "umask",
    "unalias", "unset", "wait"
];

// 注意："-" 不列入边界，否则 `-la` 会被拆成 "-" + "la"，
// flushTemplate 里以 "-" 开头的 option 分支将永远不可达。
const BOUNDARIES = [";", "|", "&", ">", "<", "(", ")", "[", "]", "{", "}", "=", "!", "?", "*", "+", "~", "^"];

export function tokenize(source, colors) {
    colors = colors || defaultColors;
    source = source || "";
    const cur = new Cursor(source);
    const buf = new Buffer();
    const tokens = [];

    const flushTemplate = () => {
        if (buf.value === "") return;
        const head = cur.source[cur.i - buf.value.length - 1];
        const isCommand = buf.value.trim() !== "" &&
            (cur.i - buf.value.length === 0 || head === "\n" || head === ";");
        if (isCommand) {
            tokens.push({ color: colors.command, content: buf.value });
        } else if (buf.value.trim().indexOf("-") === 0) {
            tokens.push({ color: colors.option, content: buf.value });
        } else if (buf.value.trim() !== "") {
            tokens.push({ color: colors.argument, content: buf.value });
        } else {
            tokens.push({ color: colors.text, content: buf.value });
        }
        buf.clear();
    };

    while (cur.i < cur.length) {
        if (comment.hash(cur, tokens, colors.annotation)) continue;
        if (readString(cur, tokens, colors.string)) continue;

        const ch = cur.peekChar();

        if (ch === "$") {
            flushTemplate();
            let varBuf = cur.advance(1);
            if (cur.peekChar() === "{") {
                varBuf += cur.advance(1);
                while (cur.i < cur.length && cur.peekChar() !== "}") {
                    varBuf += cur.advance(1);
                }
                if (cur.i < cur.length) varBuf += cur.advance(1);
            } else {
                while (cur.i < cur.length && /[a-zA-Z_0-9]/.test(cur.peekChar())) {
                    varBuf += cur.advance(1);
                }
            }
            tokens.push({ color: colors.variable, content: varBuf });
            continue;
        }

        if (ch === " " || ch === "\n" || ch === "\t") {
            flushTemplate();
            tokens.push({ color: colors.insign, content: ch });
            buf.clear();
            cur.advance(1);
            continue;
        }

        if (BOUNDARIES.indexOf(ch) > -1) {
            flushTemplate();
            tokens.push({ color: colors.insign, content: ch });
            buf.clear();
            cur.advance(1);
            continue;
        }

        if (tryKeyword(buf, tokens, cur, KEYWORDS, colors.key)) continue;

        buf.appendChar(cur.advance(1));
    }
    flushTemplate();
    return tokens;
}

export const id = ["shell", "sh", "bash"];
export { defaultColors };
export default { id, defaultColors, tokenize };