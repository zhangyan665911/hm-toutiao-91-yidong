import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'// 引入中文的语言包
dayjs.extend(relativeTime)
export default {
  // VUe.use(obj)会调用obj的install方法
  install (Vue) {
    Vue.prototype.$znotify = (params) => Vue.prototype.$notify({ duration: 1000, ...params })
    // 封装一个函数
    Vue.prototype.$sleep = sleep
    Vue.filter('relTime', relTime) // 注册一个全局相对时间过滤器
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

function relTime (value) {
  //
  return dayjs().locale('zh-cn').from(value)
}
