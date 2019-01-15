var path = require("path");
var webpack = require("webpack");

module.exports = {
  devtool: '',

  entry: [
    path.resolve(__dirname, "src/index.jsx")
  ],
  
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public/dist"),
    publicPath: "/dist/"
  },

  resolve: {
    extensions: ["", ".js", ".jsx", ".json"]
  },

  module: {
    loaders: [
      {
        loader: 'babel',
        include: [
          path.resolve(__dirname, "src")
        ],
        test: /\.jsx?$/
      }
    ]
  },

  eslint: {
    configFile: './.eslintrc'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
};
