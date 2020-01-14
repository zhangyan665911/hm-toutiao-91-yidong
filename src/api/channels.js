// 专门处理频道的请求
import request from '@/utils/request'
export function getMyChannels () {
  // 获取我的频道
  //   返回一个promise对象
  return request({
    url: '/user/channels'
    // 默认就是get不用写
  })
}
