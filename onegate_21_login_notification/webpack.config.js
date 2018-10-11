var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: [
    path.resolve(__dirname, "src/index.js")
  ],

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public/dist"),
    publicPath: "/dist/"
  },

  resolve: {
    extensions: ["", ".js", ".json"]
  },

  module: {
    loaders: [
      {
        loaders: ["react-hot", "babel-loader", "eslint-loader"],
        include: [
          path.resolve(__dirname, "src")
        ],
        test: /\.js?$/
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
