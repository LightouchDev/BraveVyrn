'use strict'

process.env.BABEL_ENV = 'preload'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

let preloadConfig = {
  entry: {
    preload: path.join(__dirname, '../src/preload/main.js')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PROCESS_TYPE': '"preload"',
      'process.platform': `"${process.platform}"`
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          ecma: 8,
          compress : {
            passes: 4,
            toplevel: true
          },
          mangle: {
            reserved: [
              'BVport',
              'BVpath',
              'BVconfig'
            ]
          }
        }
      })
    ]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../dist/muon')
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  mode: process.env.NODE_ENV,
  target: 'web'
}

module.exports = preloadConfig
