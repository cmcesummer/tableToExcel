import typescript from "rollup-plugin-typescript2";
import { uglify } from "rollup-plugin-uglify";

export default {
    input: "./src/index.ts",
    output: {
        file: "dist/index.js",
        format: "umd",
        name: "TableToExcel",
        sourcemap: false
    },
    plugins: [typescript(), uglify()]
};
