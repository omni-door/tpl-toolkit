export default function (config: {
  name: string;
  ts: boolean;
}) {
  const { name, ts } = config;

  return `'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    path.resolve(__dirname, 'demo/index.tsx')
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'demo')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      ${ts ? `{
        test: /\\.(ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }` : ''}
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '${name}',
      path: path.resolve(__dirname, 'demo'),
      template: path.resolve(__dirname, 'demo/index.html'),
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackBar()
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ]
  }
};`;
}