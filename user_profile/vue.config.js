
/*
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
        name: 'images/user_profile/[name].[ext]'
      }))
    config.module.rule('svg').use('file-loader')
      .tap(options => Object.assign(options, {
        name: 'images/user_profile/[name].[ext]'
      }))
  },
  css: {
    extract: {
      filename: 'css/user_profile/[name].css',
      chunkFilename: 'css/user_profile/[name].css'
    }
  },
  configureWebpack: {
    output: {
      filename: 'js/user_profile/[name].js',
      chunkFilename: 'js/user_profile/[name].js'
    }
  }
}


*/
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
          name: '../../docs/o/opencps-frontend/user_profile/images/[name].[ext]'
        }))
      config.module.rule('svg').use('file-loader')
        .tap(options => Object.assign(options, {
          name: '../../docs/o/opencps-frontend/user_profile/images/[name].[ext]'
        }))
    },
    css: {
      extract: {
        filename: '../../docs/o/opencps-frontend/user_profile/css/[name].css',
        chunkFilename: '../../docs/o/opencps-frontend/user_profile/css/[name].css'
      }
    },
    configureWebpack: {
      output: {
        filename: '../../docs/o/opencps-frontend/user_profile/js/[name].js',
        chunkFilename: '../../docs/o/opencps-frontend/user_profile/js/[name].js'
      }
    }
  }
