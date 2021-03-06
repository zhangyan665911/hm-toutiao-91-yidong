import Vue from 'vue'
import App from './App.vue'
import router from '@/permission'
// import '@/permission'
import store from './store'
import Vant, { Lazyload } from 'vant' // 引入一个lazyload对象
import 'vant/lib/index.less'
import plugins from '@/utils/plugins'
import 'amfe-flexible' // 引入自动适配
import '@/styles/index.less' // 必须放在vant样式下面 要不覆盖不了
Vue.use(Vant)// 一旦完成注冊 在任意地方都可以用
Vue.use(plugins)
Vue.use(Lazyload)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
