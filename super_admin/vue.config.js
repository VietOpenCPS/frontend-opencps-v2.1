module.exports = {
  productionSourceMap: true,
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
        name: '../../docs/o/opencps-frontend/super_admin_bbat/images/[name].[ext]'
      }))
    config.module.rule('svg').use('file-loader')
      .tap(options => Object.assign(options, {
        name: '../../docs/o/opencps-frontend/super_admin_bbat/images/[name].[ext]'
      }))
  },
  css: {
    extract: {
      filename: '../../docs/o/opencps-frontend/super_admin_bbat/css/[name].css',
      chunkFilename: '../../docs/o/opencps-frontend/super_admin_bbat/css/[name].css'
    }
  },
  configureWebpack: {
    output: {
      filename: '../../docs/o/opencps-frontend/super_admin_bbat/js/[name].js',
      chunkFilename: '../../docs/o/opencps-frontend/super_admin_bbat/js/[name].js'
    }
  }
}