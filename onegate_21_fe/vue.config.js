let prodDir = "../../docs/o/opencps-frontend-cli/dvc";

module.exports = {
    runtimeCompiler: true,
    productionSourceMap: false,
    configureWebpack: {
      output: {
        filename: prodDir + "/js/[name].js",
        chunkFilename: prodDir + "/js/[name].js"
      }
    },
  
    chainWebpack: config => {
      config.module.rule('images').use('url-loader')
        .loader('file-loader') // replaces the url-loader
        .tap(options => Object.assign(options, {
          name: prodDir + '/images/[name].[ext]'
        }))
      config.module.rule('svg').use('file-loader')
        .tap(options => Object.assign(options, {
          name: prodDir + '/images/[name].[ext]'
        }))
    },
    css: {
      extract: {
        filename: prodDir + "/css/[name].css",
        chunkFilename: prodDir + "/css/[name].css"
      }
    }

  }