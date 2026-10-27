/**
 * 测试运行装置：把 describe/it/expect 转发到 @oipage/testjs。
 *
 * 用法：在每个 spec.js 里
 *     import { describe, it, expect } from "./_runner.js";
 *
 * 注：Unit.node() 内部会注册 process.on('beforeExit', ...)，每个文件 import 时
 * 都调用一次会重复注册；这里用 module-level 单例保证只调用一次。
 */
import testjs from "@oipage/testjs";

const { describe, it, expect } = testjs.Unit.node();

export { describe, it, expect };