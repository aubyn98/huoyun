module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    } else {
      // 为开发环境修改配置...
    }
  }
}
