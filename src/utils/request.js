// 封装request模块
// 为什么要封装
import axios from 'axios'
import JSONBig from 'json-bigint'
import store from '@/store'
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
}, function (error) {
  return Promise.reject(error)
})
export default instance
