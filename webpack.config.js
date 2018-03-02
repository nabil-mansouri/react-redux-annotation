var failPlugin = require('webpack-fail-plugin');
var PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// https://www.typescriptlang.org/docs/handbook/react-&-webpack.html
module.exports = {
  entry: {
    'index': './index.ts',
    'redux': './redux.ts',
    'saga': './saga.ts',
    'thunk': './thunk.ts'
  },
  output: {
    library: "[name]",
    libraryTarget: "umd",
    filename: '[name].js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [
          /node_modules/,
          /demo/,
        ],
        loaders: [
          {
            loader: 'awesome-typescript-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new PeerDepsExternalsPlugin(),
    new CopyWebpackPlugin(['*.d.ts', 'package.json','README.md']),
    failPlugin
  ],
  externals: {
    "reflect-metadata": "reflect-metadata"
  }
};
