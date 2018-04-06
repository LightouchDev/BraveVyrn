'use strict'

process.env.BABEL_ENV = 'main'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

let mainConfig = {
  entry: {
    main: path.join(__dirname, '../src/main/index.js')
  },
  externals: [
    ...Object.keys(dependencies || {})
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
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
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          ecma: 8,
          compress : {
            passes: 4,
            toplevel: true,
            collapse_vars: false
          }
        }
      })
    ]
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/muon')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PROCESS_TYPE': '"main"',
      'process.platform': `"${process.platform}"`
    })
  ],
  resolve: {
    extensions: ['.js', '.json', '.node']
  },
  mode: process.env.NODE_ENV,
  target: 'electron-main'
}

/**
 * build external package into app
 */
 if (process.env.NODE_ENV === 'production') {
   mainConfig.externals = ['uws']
 }

module.exports = mainConfig
