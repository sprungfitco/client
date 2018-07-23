const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
module.exports = {
  context: path.resolve('web/src/'),
  devtool: 'source-map',
  entry: [
  'react-hot-loader/patch',
   'babel-polyfill',
   'isomorphic-fetch',
   '../styles/main.scss',
    './index.jsx'
  ],
  output: {
    filename: 'js/[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              publicPath: '/',
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'css-hot-loader' },
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer({ browsers: ['> 1%', 'IE >= 10'] })],
            },
          },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({ template: '../public/index.html' }),
    new webpack.IgnorePlugin(/\.svg$/),
  ],
  devServer: {
    disableHostCheck: true,
    host: 'localhost',
    hot: true,
    port: process.env.PORT || 5000,
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
