module.exports = {
  productionSourceMap: false,
  runtimeCompiler: true,
  chainWebpack: config => {
    config.module.rule('images').use('url-loader')
      .loader('file-loader') // replaces the url-loader
      .tap(options => Object.assign(options, {
        name: '../../docs/o/opencps-frontend-cli/report_charts_motcua/app/images/[name].[ext]'
      }))
    config.module.rule('svg').use('file-loader')
      .tap(options => Object.assign(options, {
        name: '../../docs/o/opencps-frontend-cli/report_charts_motcua/app/images/[name].[ext]'
      }))
  },
  css: {
    extract: {
      filename: '../../docs/o/opencps-frontend-cli/report_charts_motcua/app/css/[name].css',
      chunkFilename: '../../docs/o/opencps-frontend-cli/report_charts_motcua/app/css/[name].css'
    }
  },
  configureWebpack: {
    output: {
      filename: '../../docs/o/opencps-frontend-cli/report_charts_motcua/app/js/[name].js',
      chunkFilename: '../../docs/o/opencps-frontend-cli/report_charts_motcua/app/js/[name].js'
    }
  }
}
// report_charts_v3.,report_charts_motcu
