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
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
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
  externals: {},
  mode,
};

module.exports = (env, argv) => {
  if (mode === "development" || argv.mode === "development") {
    config.devtool = "inline-source-map";
  }

  return config;
};
