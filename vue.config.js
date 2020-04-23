module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/mthebot/' : '/',
    chainWebpack: config => {
        config
        .plugin('html')
        .tap(args => {
          args[0].title = 'MtheBot_'
          return args
        })
      }
  }