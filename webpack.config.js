const path = require('path')

module.exports = {
  resolveLoader: {
    modules: [ 'node_modules', './' ]
  },
  module: {
    rules: [
      {
        test: /template\.html$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'vanilla-dom-loader'
        }
      }
    ]
  },
  entry: "./demo.js",
  output: {
    path: path.resolve(__dirname),
    filename: "bundle.js",
  }
}
