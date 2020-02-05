// 封装request模块
// 为什么要封装
import axios from 'axios'
import JSONBig from 'json-bigint'
import store from '@/store'
import router from '@/router'
// 创建一个新的插件实例
// 应该给request一个固定的请求地址 baseURL
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/', // 设置一个常量的基础地址
  transformResponse: [function (data) {
    // data是一个字符串。把字符串转化成对象并返回
    // 如果data是一个空字符串。直接转化就会报错
    // 当后台响应的字符串回到axios请求时就会触发
    try {
      return JSONBig.parse(data)
    } catch (error) {
      return data// 如果失败就把字符串直接返回
    }
  }]// 处理后台返回的数据 字符串=》对象 json.parse()=>jsonbig.parse()=>
}) // 创建一个axios的请求工具
// 请求拦截器 发起请求=》请求拦截器=》服务器
// 响应拦截器 服务器 =》 响应拦截器 =》then await之前
instance.interceptors.request.use(function (config) {
  // 配置信息
  // 应该再返回配置以前需要注入token
  if (store.state.user.token) {
    config.headers['Authorization'] = `Bearer ${store.state.user.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error) // 直接返回promise错误
})
instance.interceptors.response.use(function (response) {
  // 返回得到的响应数据 第一层data是默认包的data 第二data是接口里返回的数据的data
  try {
    return response.data.data
  } catch (error) {
    return response.data
  }
}, async function (error) {
  // 处理token失效的问题
  // 判断
  // error  中的三个参数 config=> 当前请求的配置 request=>请求 response 响应
  if (error.response && error.response.status === 401) {
    let topath = { path: '/login', query: { redirectUrl: router.currentRoute.fullPath } }
    // 表示token 过期
    // 判断是否有refresh_token
    if (store.state.user.refresh_token) {
      // 如果有他 发送请求换取一个新的token
      // 这里不应该再用instance因为instance会有请求拦截
      try {
        let result = axios({
          methods: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${store.state.user.refresh_token}`
          }
        })
        // 将以前的refresh 14天有效期
        store.commit('updateUser', { user: { token: result.data.data.token, refresh_token: store.state.user.refresh_token } })
        return instance(error.config)// 把刚才错误的 把这个Promise返回？？？？？
      } catch (error) {
        // 如果出错，表示补救措施也失效了，应该跳转登录页 并且把token清掉
        store.commit('clearUser')// 把用户信息清空
        router.push(topath)
      }
    } else {
      // 没有refresh_token都没有 返回登录
      // push不仅可以一个字符串还可以push一个对象
      router.push(topath)
      //   router.push('/login')
      // 当访问页面时=>去登录 => 登录成功之后=> 回到之前的页面
      // 记住当前的地址 => 登录页面=> 读取地址
      // params 动态路由 user/:id
      // query 传参user?id=123
      // 获取当前的页面地址
    }
  }
  return Promise.reject(error)
})
export default instance
