if (process.env.NODE_ENV === 'production') {
  module.exports = {
    runtimeCompiler: true,
    chainWebpack: config => {
      config.module.rule('images').use('url-loader')
        .loader('file-loader') // replaces the url-loader
        .tap(options => Object.assign(options, {
          name: '../../o/opencps-store/js/cli/serviceinfo/app/images/[name].[ext]'
        }))
      config.module.rule('svg').use('file-loader')
        .tap(options => Object.assign(options, {
          name: '../../o/opencps-store/js/cli/serviceinfo/app/images/[name].[ext]'
        }))
    },
    css: {
      extract: {
        filename: '../../o/opencps-store/js/cli/serviceinfo/app/css/[name].css',
        chunkFilename: '../../o/opencps-store/js/cli/serviceinfo/app/css/[name].css'
      }
    },
    configureWebpack: {
      output: {
        filename: '../../o/opencps-store/js/cli/serviceinfo/app/js/[name].js',
        chunkFilename: '../../o/opencps-store/js/cli/serviceinfo/app/js/[name].js'
      }
    }
  }
} else {
  module.exports = {
    runtimeCompiler: true
  }
}

