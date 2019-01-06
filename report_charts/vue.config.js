
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
        name: 'images/register/[name].[ext]'
      }))
    config.module.rule('svg').use('file-loader')
      .tap(options => Object.assign(options, {
        name: 'images/register/[name].[ext]'
      }))
  },
  css: {
    extract: {
      filename: 'css/register/[name].css',
      chunkFilename: 'css/register/[name].css'
    }
  },
  configureWebpack: {
    output: {
      filename: 'js/register/[name].js',
      chunkFilename: 'js/register/[name].js'
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
          name: '../../docs/o/opencps-frontend/report_charts_new/images/[name].[ext]'
        }))
      config.module.rule('svg').use('file-loader')
        .tap(options => Object.assign(options, {
          name: '../../docs/o/opencps-frontend/report_charts_new/images/[name].[ext]'
        }))
      config.entry('main_section_1')
        .add('./src/main_section_1.js')
        .end()
      .entry('main_section_2')
        .add('./src/main_section_2.js')
        .end() 
    },
    css: {
      extract: {
        filename: '../../docs/o/opencps-frontend/report_charts_new/css/[name].css',
        chunkFilename: '../../docs/o/opencps-frontend/report_charts_new/css/[name].css'
      }
    },
    configureWebpack: {
      output: {
        filename: '../../docs/o/opencps-frontend/report_charts_new/js/[name].js',
        chunkFilename: '../../docs/o/opencps-frontend/report_charts_new/js/[name].js'
      }
    }
  }
