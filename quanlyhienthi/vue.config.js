if (process.env.NODE_ENV === 'production') {
  module.exports = {
    runtimeCompiler: true,
    productionSourceMap: false,
    chainWebpack: config => {
      config.module.rule('images').use('url-loader')
        .loader('file-loader') // replaces the url-loader
        .tap(options => Object.assign(options, {
          name: '../../wars/opencps-store/src/main/webapp/js/cli/thutuc_huyenxa/app/images/[name].[ext]'
        }))
      config.module.rule('svg').use('file-loader')
        .tap(options => Object.assign(options, {
          name: '../../wars/opencps-store/src/main/webapp/js/cli/thutuc_huyenxa/app/images/[name].[ext]'
        }))
    },
    css: {
      extract: {
        filename: '../../wars/opencps-store/src/main/webapp/js/cli/thutuc_huyenxa/app/css/[name].css',
        chunkFilename: '../../wars/opencps-store/src/main/webapp/js/cli/thutuc_huyenxa/app/css/[name].css'
      }
    },
    configureWebpack: {
      output: {
        filename: '../../wars/opencps-store/src/main/webapp/js/cli/thutuc_huyenxa/app/js/[name].js',
        chunkFilename: '../../wars/opencps-store/src/main/webapp/js/cli/thutuc_huyenxa/app/js/[name].js'
      }
    }
  }
} else {
  module.exports = {
    runtimeCompiler: true
  }
}

// manage_screen1.
// danhsachthutuc1