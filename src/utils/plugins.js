export default {
  // VUe.use(obj)会调用obj的install方法
  install (Vue) {
    Vue.prototype.$znotify = (params) => Vue.prototype.$notify({ duration: 1000, ...params })
  }
}
