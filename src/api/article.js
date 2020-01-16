// 用于文章数据的获取
import request from '@/utils/request.js'
// query要写在params
// body 要写在data里
export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: {
      with_top: 1,
      ...params
    }
  })
}
// 不喜欢文章接口
export function dislikeArticle (data) {
  return request({
    url: 'article/dislikes',
    method: 'post',
    data
  })
}
// 举报文章的api
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    data,
    method: 'post'
  })
}

// 获取文章搜索建议
export function suggestion (params) {
  return request({
    url: '/suggestion',
    params
  })
}
