// 专门处理频道的请求
import request from '@/utils/request'
import store from '@/store'
// 本地缓存需要key
const CACHE_CHANNEL_T = 'hm-91-toutiao-t-01' // 游客
const CACHE_CHANNEL_U = 'hm-91-toutiao-u-01' // 登录
// 获取我的频道
export function getMyChannels () {
  // 首先我们应该先从缓存中读取 看看缓存中有没有，如果没有就去接口获取并存到缓存中

  //   返回一个promise对象
  // return request({
  //   url: '/user/channels'
  //   // 默认就是get不用写
  // })
  return new Promise(async function (resolve, reject) {
    // 做逻辑
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T
    // 从缓存中读取数据
    let str = localStorage.getItem(key) // 得到缓存结果
    if (str) {
      // 如果str存在，表示缓存中有数据，但数据是个字符串
      resolve({ channels: JSON.parse(str) })// 表示从缓存中获取数据 调用成功回调函数
    } else {
      const data = await request({
        url: '/user/channels'
      })
      // 重新将线上数据写入缓存
      localStorage.setItem(key, JSON.stringify(data.channels))
      resolve(data)
      // 将线上的数据释放给下一步
    }
  })
}
// 获取所有的频道
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
// 删除频道
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    // 首先也需要做判断是删除游客的频道还是删除登录的
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T
    // 从缓存中读取
    // 这个数据一定会有
    let channels = JSON.parse(localStorage.getItem(key)) // 得到缓存结果
    let index = channels.findIndex(item => item.id === id)
    if (index > -1) {
      channels.splice(index, 1) // 直接删除原数组中的数据
      channels = channels.filter(item => item.id !== id)// 新数组方式
      // 重新写入缓存
      localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存中
      resolve(channels)
    } else {
      reject(new Error('找不到对应的频道'))
    }
  })
}
// 添加频道
export function addChannel (channel) {
  return new Promise(function (resolve, reject) {
    // 添加逻辑
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T
    let channels = JSON.parse(localStorage.getItem(key)) // 得到缓存结果
    channels.push(channel) // 将频道添加到队尾
    // 重新写入缓存
    localStorage.setItem(key, JSON.stringify(channels))
    resolve(channels)// 释放成功
  })
}
