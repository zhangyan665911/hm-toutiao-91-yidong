export default {
  // VUe.use(obj)会调用obj的install方法
  install (Vue) {
    Vue.prototype.$znotify = (params) => Vue.prototype.$notify({ duration: 1000, ...params })
    // 封装一个函数
    Vue.prototype.$sleep = sleep
  }
}
// function (time = 500) 如果传time用传的。不传用500
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() =>
      resolve()
    , time)
  })
}
