'use strict'

process.env.BABEL_ENV = 'preload'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

let preloadConfig = {
  devtool: '#cheap-module-eval-source-map',
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
  plugins: [],
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

/**
 * Adjust preloadConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  delete preloadConfig.devtool
}

module.exports = preloadConfig
