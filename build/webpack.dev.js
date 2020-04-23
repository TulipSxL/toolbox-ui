/*
 * @Author: SxL
 * @Date: 2020-04-03 21:16:18
 * @LastEditTime: 2020-04-08 14:18:34
 * @Description: webpack dev
 * @FilePath: /toolbox-ui/build/webpack.dev.js
 */
const path = require("path");
const webpackBase = require("./webpack.base");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(webpackBase, {
  mode: "development",
  devtool: "cheap-module-source-map",
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        "vue-style-loader",
        "css-loader"
      ]
    },
    {
      test: /\.less$/,
      use: [
        "vue-style-loader",
        "css-loader",
        "less-loader"
      ]
    },
    ]
  },
  devServer: {
    proxy: {
      // '/': 'https://mytoolbox.com.cn'
      "/": "http://localhost:8080"
    },
    port: 8081
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./template/index.html")
    })
  ]
});