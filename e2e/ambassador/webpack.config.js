const path = require('path');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'build');

config = {
  entry: {
    content: path.join(src, 'content'),
    background: path.join(src, 'background')
  },

  output: {
    path: dist,
    filename: '[name].js'
  },

  module: {
    loaders: [
      {
        test: [ /\.js$/ ],
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },

  resolve: {
    extensions: [ '.js' ],
    modules: [path.join(__dirname, 'src'), 'node_modules']
  }
};

module.exports = config

