var path = require('path');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'build');

module.exports = {
  entry: {
    index: path.join(src, 'content'),
    background: path.join(src, 'background')
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
      }
    ]
  },

  resolve: {
    extensions: [ '.js' ]
  }
};
