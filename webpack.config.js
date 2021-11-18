const { resolve } = require("path");

module.exports = {
    mode: "development",
    entry: "./src/index.tsx",
    context: __dirname,
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
    },
    module: {
        rules: [{
            loader: "ts-loader",
            test: /.(ts|tsx|js)$/,
            include: [
                resolve(__dirname, "src"),
            ],
            options: {
                configFile: "tsconfig.json",
            },
        }],
    },
    output: {
        filename: "main.bundle.js",
        path: resolve(__dirname, "dist", "js"),
    },
    devServer: {
        static: {
            directory: resolve(__dirname, "dist"),
        },
        devMiddleware: {
            publicPath: "/js",
        },
        port: 3333,
        host: "127.0.0.1",
    },
};
