const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    'console': './src/console.js',
    'console.loader': './src/console.loader.js',
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].js',
  },
  module: {
    rules: [
    ],
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   title: '',
    //   template: './example/example.html',
    // }),
  ],
}
