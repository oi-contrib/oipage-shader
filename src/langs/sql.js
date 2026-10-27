import Cursor from "../core/cursor.js";
import Buffer from "../core/buffer.js";
import comment from "../core/comment.js";
import readString from "../core/string.js";
import defaultColors from "../colors/sql.js";

const KEYWORDS = [
    "ADD", "ALL", "ALTER", "AND", "AS", "ASC",
    "BETWEEN", "BY", "CASCADE", "CASE", "CHECK",
    "COLUMN", "COMMIT", "CONSTRAINT", "CREATE", "CROSS",
    "DATABASE", "DATABASES", "DEFAULT", "DELETE", "DESC",
    "DISTINCT", "DROP", "ELSE", "ESCAPE", "EXISTS",
    "FOREIGN", "FROM", "FULL", "GROUP", "HAVING",
    "IF", "IN", "INDEX", "INNER", "INSERT",
    "INTO", "IS", "JOIN", "KEY", "LEFT",
    "LIKE", "LIMIT", "MATCH", "NATURAL", "NOT",
    "NULL", "ON", "OR", "ORDER", "OUTER",
    "PRIMARY", "REFERENCES", "RIGHT", "ROLLBACK", "ROW",
    "SAVEPOINT", "SELECT", "SET", "TABLE", "THEN",
    "TO", "TRANSACTION", "UNION", "UNIQUE", "UPDATE",
    "USING", "VALUES", "VARCHAR", "VIEW", "WHEN",
    "WHERE", "WITH", "RECURSIVE", "OVER",
    "PARTITION", "RANGE", "ROWS", "CURRENT", "ROW_NUMBER",
    "RANK", "DENSE_RANK", "LAG", "LEAD",
    "TRUE", "FALSE", "AUTO_INCREMENT", "ENGINE",
    "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN",
    "GROUP BY", "ORDER BY", "INSERT INTO",
    "UNIQUE INDEX", "FULLTEXT INDEX", "SPATIAL INDEX"
];

const FUNCTIONS = [
    "COUNT", "SUM", "AVG", "MAX", "MIN",
    "ABS", "CEIL", "FLOOR", "ROUND", "RAND",
    "CONCAT", "UPPER", "LOWER", "TRIM", "LENGTH",
    "SUBSTRING", "SUBSTR", "REPLACE", "LOCATE",
    "NOW", "CURDATE", "CURTIME", "YEAR", "MONTH",
    "DAY", "HOUR", "MINUTE", "SECOND",
    "DATE_ADD", "DATE_SUB", "DATEDIFF", "DATE_FORMAT",
    "STR_TO_DATE", "IF", "IFNULL", "COALESCE",
    "CASE", "CAST", "CONVERT", "GROUP_CONCAT",
    "DATE", "TIME", "TIMESTAMP", "DATETIME",
    "INET_ATON", "INET_NTOA", "LAST_INSERT_ID",
    "USER", "DATABASE", "VERSION", "MD5", "SHA1",
    "TRUNCATE", "MOD", "POW", "SQRT",
    "LEAST", "GREATEST", "LPAD", "RPAD",
    "FIND_IN_SET", "FIELD", "EXPORT_SET",
    "FROM_UNIXTIME", "UNIX_TIMESTAMP"
];

const BOUNDARIES = [";", "{", "}", "(", ")", ".", "\n", "=", "+", ">", "<", "[", "]", "-", "*", "/", "^", "!", ","];
const QUOTES = ["'", '"'];

export function tokenize(source, colors) {
    colors = colors || defaultColors;
    source = source || "";
    const cur = new Cursor(source);
    const buf = new Buffer();
    const tokens = [];

    const flushKeywordAware = () => {
        if (buf.value === "") return;
        const upper = buf.value.trim().toUpperCase();
        if (KEYWORDS.indexOf(upper) > -1) {
            tokens.push({ color: colors.key, content: buf.value });
        } else {
            tokens.push({ color: colors.text, content: buf.value });
        }
        buf.clear();
    };

    while (cur.i < cur.length) {
        // 注释会立即产出 token，需先提交缓冲区，避免前后文本错序
        if (cur.peek(2) === "/*" || cur.peek(2) === "--") flushKeywordAware();
        if (comment.block(cur, tokens, colors.annotation)) continue;
        if (comment.line(cur, tokens, colors.annotation, "--")) continue;

        if (QUOTES.indexOf(cur.peekChar()) > -1) {
            flushKeywordAware();
            if (readString(cur, tokens, colors.string, { quotes: QUOTES })) continue;
        }

        const ch = cur.peekChar();

        if (/[0-9]/.test(ch) || (ch === "-" && /[0-9]/.test(cur.peek(2).charAt(1)))) {
            flushKeywordAware();
            let numBuf = "";
            numBuf += cur.advance(1);
            while (cur.i < cur.length && /[0-9.]/.test(cur.peekChar())) {
                numBuf += cur.advance(1);
            }
            tokens.push({ color: colors.number, content: numBuf });
            continue;
        }

        if (ch === "(") {
            if (buf.value !== "") {
                // 先按缓冲区内容判定颜色（函数名 > 关键字 > 普通文本），再提交
                const upper = buf.value.trim().toUpperCase();
                let nameColor = colors.text;
                if (FUNCTIONS.indexOf(upper) > -1) nameColor = colors.funName;
                else if (KEYWORDS.indexOf(upper) > -1) nameColor = colors.key;
                tokens.push({ color: nameColor, content: buf.value });
                buf.clear();
            }
            tokens.push({ color: colors.insign, content: "(" });
            cur.advance(1);
            continue;
        }

        if (BOUNDARIES.indexOf(ch) > -1) {
            flushKeywordAware();
            tokens.push({ color: colors.insign, content: ch });
            buf.clear();
            cur.advance(1);
            continue;
        }

        if (ch === " ") {
            const upper = buf.value.trim().toUpperCase();
            if (KEYWORDS.indexOf(upper) > -1) {
                tokens.push({ color: colors.key, content: buf.value + " " });
                buf.clear();
                cur.advance(1);
                continue;
            }
            flushKeywordAware();
            buf.appendChar(cur.advance(1));
            continue;
        }

        buf.appendChar(cur.advance(1));
    }
    flushKeywordAware();
    return tokens;
}

export const id = ["sql", "mysql"];
export { defaultColors };
export default { id, defaultColors, tokenize };