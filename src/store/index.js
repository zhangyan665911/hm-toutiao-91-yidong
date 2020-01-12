import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 放数据的地方
    // 直接将用户信息给公共状态
    user: auth.getUser()
  },
  mutations: {
    updateUser (state, payload) {
      state.user = payload.user // 更新数据
      // 更新缓存中的数据
      auth.setUser(payload.user) // 将数据同步设置到本地存储中
    },
    clearUser (state) {
      state.user = {}
      auth.removeUser()// 将缓存中的数据也清空
    }

  },
  actions: {
  },
  modules: {
  }
})
