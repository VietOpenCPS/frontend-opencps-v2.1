if (process.env.NODE_ENV === 'production') {
  const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
  module.exports = {
    productionSourceMap: false,
    runtimeCompiler: true,
    chainWebpack: config => {
      config.module.rule('images').use('url-loader')
        .loader('file-loader') // replaces the url-loader
        .tap(options => Object.assign(options, {
          name: '../../o/opencps-store/js/cli/motcua_optimize/app/images/[name].[ext]'
        }))
      config.module.rule('svg').use('file-loader')
        .tap(options => Object.assign(options, {
          name: '../../o/opencps-store/js/cli/motcua_optimize/app/images/[name].[ext]'
        }))
    },
    css: {
      extract: {
        filename: '../../o/opencps-store/js/cli/motcua_optimize/app/css/[name].css',
        chunkFilename: '../../o/opencps-store/js/cli/motcua_optimize/app/css/[name].css'
      }
    },
    configureWebpack: {
      output: {
        filename: '../../o/opencps-store/js/cli/motcua_optimize/app/js/[name].js',
        chunkFilename: '../../o/opencps-store/js/cli/motcua_optimize/app/js/[name].js'
      },
      optimization: {
        splitChunks: {
          chunks: 'all',
        },
      },
      plugins: [new VuetifyLoaderPlugin()]
    }
  }
} else {
  module.exports = {
    runtimeCompiler: true
  }
}
