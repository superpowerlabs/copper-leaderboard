const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { join } = require("path");
// const { HotModuleReplacementPlugin } = require('webpack')

const mode = process.env.ENV || "production";

const config = {
  entry: "./client",
  output: {
    path: __dirname + "/public/bundle",
    publicPath: "/bundle/",
    filename: "bundle.min.js",
  },
  devServer: {
    contentBase: "./dist",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new HTMLWebpackPlugin({
      favicon: false,
      showErrors: true,
      cache: true,
      template: join(__dirname, "/public/index.html"),
    }),
  ],
  externals: {
    lodash: "_",
  },
  mode,
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "inline-source-map";
  }

  if (argv.mode === "production") {
    config.plugins.push(
      new ESLintPlugin({
        files: "src/**/*.js",
      })
    );
  }

  return config;
};
