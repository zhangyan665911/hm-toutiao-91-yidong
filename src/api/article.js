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
// 获取文章搜索的结果
export function searchArticle (params) {
  return request({
    url: '/search',
    params
  })
}
// 获取文章详情
// 埋点是什么？
export function getArticleInfo (articleId) {
  return request({
    url: `articles/${articleId}`
  })
}
// 封装获取评论或者评论回复
export function getComments (params) {
  return request({
    url: 'comments',
    // query放到params
    params
  })
}
// 封装评论或者回复评论的方法
export function commentOrReply (data) {
  console.log('来到article.js中')
  return request({
    url: 'comments', // 请求地址
    method: 'post',
    data
  })
}
