const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  productionSourceMap: false,
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
        name: '../../wars/opencps-store/src/main/webapp/js/super_admin_bbat/images/[name].[ext]'
      }))
    config.module.rule('svg').use('file-loader')
      .tap(options => Object.assign(options, {
        name: '../../wars/opencps-store/src/main/webapp/js/super_admin_bbat/images/[name].[ext]'
      }))
  },
  css: {
    extract: {
      filename: '../../wars/opencps-store/src/main/webapp/js/super_admin_bbat/css/[name].css',
      chunkFilename: '../../wars/opencps-store/src/main/webapp/js/super_admin_bbat/css/[name].css'
    }
  },
  configureWebpack: {
    plugins: [new BundleAnalyzerPlugin()],
    output: {
      filename: '../../wars/opencps-store/src/main/webapp/js/super_admin_bbat/js/[name].js',
      chunkFilename: '../../wars/opencps-store/src/main/webapp/js/super_admin_bbat/js/[name].js'
    }
  }
}