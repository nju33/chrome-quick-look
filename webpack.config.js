const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.vue', '.js', '.json', '.jsx', '.css']
  },
  entry: {
    background: './src/scripts/background.js',
    popup: './src/scripts/popup.js'
  },
  output: {
    path: path.join(__dirname, 'dev/scripts'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
        options: {
          presets: [
            [
              'env',
              {
                targets: {
                  browsers: ['last 2 chrome versions']
                }
              }
            ]
          ],
          plugins: [
            'transform-decorators-legacy',
            'transform-object-rest-spread',
            'transform-class-properties'
          ]
        }
      }
    ]
  }
}
