// 用户相关的请求模块
import request from '@/utils/request'// 引入封装的方法
export function login (data) {
  return request({
    url: 'authorizations',
    data,
    method: 'post'
  })// 得到一个promise对象 返回
}
// 关注用户
export function followUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}
// 取消关注用户
export function unFollowUser (target) {
  return request({
    url: `/user/followings/${target}`,
    method: 'delete'
  })
}
