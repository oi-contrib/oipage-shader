import { createRequire } from "node:module";
import pluginNodeResolve from "@rollup/plugin-node-resolve";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

export default {
    input: "./src/index.js",
    output: {
        name: "Shader",
        file: "./dist/shader.js",
        format: "umd",
        banner: `/*!
 * @oipage/shader v${pkg.version}
 * git+https://github.com/oi-contrib/oipage-shader.git
 */`
    },
    plugins: [pluginNodeResolve()]
};