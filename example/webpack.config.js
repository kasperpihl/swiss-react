/* eslint-disable */
var webpack = require('webpack');
var path = require('path');

var NODE_ENV = process.env.NODE_ENV;
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  context: __dirname,
  devtool: 'eval',
  mode: 'development',
  resolve: {
    modules: [ path.join(__dirname, 'node_modules') ],
    extensions: ['.js']
  },
  entry: {
    app: './src/index',
  },
  output: {
      path: path.join(__dirname, 'dist'),
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].js',
      publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunks: ['app']
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
          }
        ],
        include: [ path.join(__dirname, 'src') ]
      }
    ]
  },
  devServer: {
    publicPath: '/',
    port: 3000,
    hot: true,
    contentBase: './dist',
    inline: true,
    hot: true,
    historyApiFallback: true
  }
};

module.exports = config;