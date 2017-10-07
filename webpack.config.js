var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'build');

module.exports = {
  entry: {
    index: path.join(src, 'content'),
    settings: path.join(src, 'pages/settings'),
    background: path.join(src, 'background'),
    console: path.join(src, 'pages', 'console.js')
  },

  output: {
    path: dist,
    filename: '[name].js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [ 'es2015' ]
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader?sourceMap=true'
      },
    ]
  },

  resolve: {
    extensions: [ '.js' ],
    modules: [path.join(__dirname, 'src'), 'node_modules']
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(src, 'pages', 'console.html'),
      filename: path.join(dist, 'console.html'),
      inject: false
    }),
    new HtmlWebpackPlugin({
      template: path.join(src, 'pages', 'settings.html'),
      filename: path.join(dist, 'settings.html'),
      inject: false
    })
  ]
};
