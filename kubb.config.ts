import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginReactQuery } from "@kubb/plugin-react-query";

export default defineConfig({
    input: {
        path: "./openapi.json"
    },
    output: {
        path: "./src/kubb"
    },
    plugins: [
        pluginOas(),
        pluginTs({
            output: {
                path: "./ts",
                barrelType: false
            }
        }),
        pluginReactQuery({
            group: {
                type: "tag"
            },
            output: {
                path: "./reactQuery",
                barrelType: "named",
            },
        })
    ]
});