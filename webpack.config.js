var path = require('path');
module.exports = {
  target: 'atom',

  context: path.join(__dirname, 'src'),

  entry: './index',

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        loaders: ['style', 'css', 'sass']
      }
    ],
  }
};
