const path = require("path");
const webpack = require("webpack");

module.exports = [{
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /perf_hooks/
    })
  ],

  entry: {
    index: "./client/ts/index"
  },

  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      }
    ]
  },



  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      "@hingler-party": path.resolve(__dirname, "./hingler-party")
    }
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "client/js")
  }
}]