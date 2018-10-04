var path = require("path");
var webpack = require("webpack");

module.exports = {
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
    new webpack.NoErrorsPlugin()
  ]
};
