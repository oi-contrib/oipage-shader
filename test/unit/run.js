/**
 * Node 端测试运行入口：通过 import 各 spec 文件触发 describe/it 注册。
 * @oipage/testjs 在 Node 端注册了 process.on('beforeExit', ...) 自动汇总输出。
 *
 * 用例文件里通过
 *     import { describe, it, expect } from "./_runner.js";
 * 即可使用 testjs 的断言 API。
 */
import "./cursor.spec.js";
import "./buffer.spec.js";
import "./string.spec.js";
import "./comment.spec.js";

import "./langs/css.spec.js";
import "./langs/javascript.spec.js";
import "./langs/python.spec.js";
import "./langs/json.spec.js";
import "./langs/java.spec.js";
import "./langs/go.spec.js";
import "./langs/c.spec.js";
import "./langs/kotlin.spec.js";
import "./langs/shell.spec.js";
import "./langs/sql.spec.js";
import "./langs/html.spec.js";

import "./token-order.spec.js";
import "./index.spec.js";