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

  resolve: {
    extensions: [ '.js' ],
    modules: [path.join(__dirname, 'src'), 'node_modules']
  }
};

module.exports = config

