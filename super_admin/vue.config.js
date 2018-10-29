module.exports = {
    runtimeCompiler: true,
    configureWebpack: {
      output: {
        libraryExport: 'default'
      }
    },
    chainWebpack: config => {
      config.module.rule('images').use('url-loader')
        .loader('file-loader') // replaces the url-loader
        .tap(options => Object.assign(options, {
          name: 'images/register/[name].[ext]'
        }))
      config.module.rule('svg').use('file-loader')
        .tap(options => Object.assign(options, {
          name: 'images/register/[name].[ext]'
        }))
    },
    css: {
      extract: {
        filename: 'css/register/[name].css',
        chunkFilename: 'css/register/[name].css'
      }
    },
    configureWebpack: {
      output: {
        filename: 'js/register/[name].js',
        chunkFilename: 'js/register/[name].js'
      }
    }
  }