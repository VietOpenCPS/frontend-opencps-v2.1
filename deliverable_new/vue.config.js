module.exports = {
  productionSourceMap: false,
  runtimeCompiler: true,
  chainWebpack: config => {
    config.module.rule('images').use('url-loader')
      .loader('file-loader') // replaces the url-loader
      .tap(options => Object.assign(options, {
        name: '../../docs/o/opencps-frontend-cli/deliverable/app/images/[name].[ext]'
      }))
    config.module.rule('svg').use('file-loader')
      .tap(options => Object.assign(options, {
        name: '../../docs/o/opencps-frontend-cli/deliverable/app/images/[name].[ext]'
      }))
  },
  css: {
    extract: {
      filename: '../../docs/o/opencps-frontend-cli/deliverable/app/css/[name].css',
      chunkFilename: '../../docs/o/opencps-frontend-cli/deliverable/app/css/[name].css'
    }
  },
  configureWebpack: {
    output: {
      filename: '../../docs/o/opencps-frontend-cli/deliverable/app/js/[name].js',
      chunkFilename: '../../docs/o/opencps-frontend-cli/deliverable/app/js/[name].js'
    }
  }
}
