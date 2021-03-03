if (process.env.NODE_ENV === 'production') {
  module.exports = {
    productionSourceMap: false,
    runtimeCompiler: true,
    chainWebpack: config => {
      config.module.rule('images').use('url-loader')
        .loader('file-loader') // replaces the url-loader
        .tap(options => Object.assign(options, {
          name: '../../wars/opencps-store/src/main/webapp/js/cli/serviceinfo_mappingdvcqg/app/images/[name].[ext]'
        }))
      config.module.rule('svg').use('file-loader')
        .tap(options => Object.assign(options, {
          name: '../../wars/opencps-store/src/main/webapp/js/cli/serviceinfo_mappingdvcqg/app/images/[name].[ext]'
        }))
    },
    css: {
      extract: {
        filename: '../../wars/opencps-store/src/main/webapp/js/cli/serviceinfo_mappingdvcqg/app/css/[name].css',
        chunkFilename: '../../wars/opencps-store/src/main/webapp/js/cli/serviceinfo_mappingdvcqg/app/css/[name].css'
      }
    },
    configureWebpack: {
      output: {
        filename: '../../wars/opencps-store/src/main/webapp/js/cli/serviceinfo_mappingdvcqg/app/js/[name].js',
        chunkFilename: '../../wars/opencps-store/src/main/webapp/js/cli/serviceinfo_mappingdvcqg/app/js/[name].js'
      }
    }
  }
} else {
  module.exports = {
    runtimeCompiler: true
  }
}
// serviceinfo_mappingdvcqg and serviceinfo_mapping_mc