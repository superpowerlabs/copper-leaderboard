var path = require("path");
var webpack = require("webpack");

module.exports = {
  devtool:
    process.env.NODE_ENV === "development"
      ? "cheap-module-eval-source-map"
      : undefined,
  entry: "./client/index.js",
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: "style!css!",
      },
    ],
  },
  output: {
    path: path.join(__dirname, "public"),
    filename: "bundle/bundle.min.js",
  },
  plugins: [new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        mode: process.env.NODE_ENV || "production",
      },
    }),
  ],
};
