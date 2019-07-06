const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const uglifyJsPlugin = require("uglifyjs-webpack-plugin");
const config = require("config");

/*-------------------------------------------------*/

let plugins = [
  new HTMLWebpackPlugin({
    template: path.resolve(__dirname, "index.html")
  }),
  new webpack.HotModuleReplacementPlugin()
];

if (config.get("uglify")) {
  plugins.push(
    new uglifyJsPlugin({
      sourceMap: config.get("sourcemap")
    })
  );
}

/*-------------------------------------------------*/

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  output: {
    library: "Excel",
    libraryTarget: "umd",
    libraryExport: "default",
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    publicPath: config.get("publicPath")
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: plugins,
  devServer: {
    historyApiFallback: true,
    open: config.get("open")
  }
};
