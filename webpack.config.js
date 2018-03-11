const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'build');

config = {
  entry: {
    content: path.join(src, 'content'),
    settings: path.join(src, 'settings'),
    background: path.join(src, 'background'),
    console: path.join(src, 'console')
  },

  output: {
    path: dist,
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: [ /\.js$/,  /\.jsx$/ ],
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['preact']
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
    extensions: [ '.js', '.jsx' ],
    modules: [path.join(__dirname, 'src'), 'node_modules']
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(src, 'console', 'index.html'),
      filename: path.join(dist, 'console.html'),
      inject: false
    }),
    new HtmlWebpackPlugin({
      template: path.join(src, 'settings', 'index.html'),
      filename: path.join(dist, 'settings.html'),
      inject: false
    })
  ]
};

module.exports = config
