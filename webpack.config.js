// webpack.config.js
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const lessToJs = require('less-vars-to-js');

const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './scripts/ant-theme-vars.less'), 'utf8'));

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['es2015', { modules: false }],
                'react',
                'stage-2'
              ],
              plugins: [
                ['import', { libraryName: 'antd', style: true }]
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              query: {
                name: 'assets/icons/[name].[ext]'
              }
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              query: {
                mozjpeg: {
                  progressive: true,
                },
                gifsicle: {
                  interlaced: true,
                },
                optipng: {
                  optimizationLevel: 7,
                }
              }
            }
          }]
      },
      {
        test: /\.json$/,
        use: [{
          loader: 'json-loader'
        }]
      },
      {
       test: /\.less$/,
       use: [
         {loader: "style-loader"},
         {loader: "css-loader"},
         {loader: "less-loader",
           options: {
             modifyVars: themeVariables,
             root: path.resolve(__dirname, './')
           }
         }
       ]
     }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
    }),
    new ManifestPlugin({
      gcm_sender_id: '103953800507'
    })
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            drop_console: true
        },
        mangle: false
    })
  ],
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/',
    historyApiFallback: {
      index: 'index.html'
    }
  },
  resolve: {
    modules: [
      path.join(__dirname, 'dist'),
      'node_modules'
    ]
  }
}

module.exports = config
