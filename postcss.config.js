module.exports = {
  plugins: {
    'autoprefixer': {},
    'postcss-pxtorem': {
      rootValue: 37.5, // 手机以iphone6为主要适配 375 十分之一
      propList: ['*']
    }
  }
}
