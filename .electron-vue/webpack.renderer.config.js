'use strict'

process.env.BABEL_ENV = 'renderer'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

function sassExtractLoader(isSass) {
  return ExtractTextPlugin.extract({
    use: [
      {
        loader: 'css-loader',
        options: {
          minimize: process.env.NODE_ENV === 'production'
        }
      },
      {
        loader: 'sass-loader',
        options: {
          data: '@import "./src/renderer/globals";',
          indentedSyntax: isSass
        }
      }
    ],
    fallback: 'vue-style-loader'
  })
}

let rendererConfig = {
  entry: {
    renderer: path.join(__dirname, '../src/renderer/main.js')
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
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
        include: [ path.resolve(__dirname, '../src/renderer') ],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            loaders: {
              i18n: '@kazupon/vue-i18n-loader',
              sass: sassExtractLoader(true),
              scss: sassExtractLoader(false)
            },
          }
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      allChunks: true,
      filename: 'style.css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      }
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../src/static'),
        to: path.join(__dirname, '../dist/muon/static'),
        ignore: ['.*']
      }
    ]),
    new webpack.DefinePlugin({
      'process.env.PROCESS_TYPE': '"renderer"'
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
            toplevel: true,
            collapse_vars: false
          }
        }
      })
    ]
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    path: path.join(__dirname, '../dist/muon')
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.vue', '.json', '.css']
  },
  mode: process.env.NODE_ENV,
  target: 'web'
}

module.exports = rendererConfig
