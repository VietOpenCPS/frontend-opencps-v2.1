var path = require('path')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  outputDir: path.resolve(__dirname, '../docs/o/opencps-frontend-cli-test/employees/app'),
  css: {
    extract: {
      filename: '[name].css',
      chunkFilename: '[name].css'
    },
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        entry: {
          'app': './src/main.js'
        },
        output: {
          filename: '[name].js',
          chunkFilename: '[name].js'
        },
        resolve: {
          extensions: ['.js', '.vue', '.json']
        },
        module: {
          rules: [
            {
              test: /\.(js|vue)$/,
              loader: 'eslint-loader',
              enforce: 'pre',
              include: [resolve('src'), resolve('test')],
              options: {
                formatter: require('eslint-friendly-formatter')
              }
            },
            {
              test: /\.js$/,
              loader: 'babel-loader',
              include: [resolve('src'), resolve('test')]
            },
            {
              test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
              loader: 'url-loader',
              options: {
                limit: 10000
              }
            }
          ]
        }
      }
    } else {
      return {
        entry: {
          app: './src/main.js'
        }
      }
    }
  }
}