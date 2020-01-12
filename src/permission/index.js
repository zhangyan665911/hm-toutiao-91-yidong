// 路由的拦截 => 导航守卫
import router from '@/router'
import store from '@/store'
// 前置守卫： 当路由发生改变之前触发
router.beforeEach(function (to, from, next) {
  // to 到哪里去
  // from 到哪里去
  // next是一个函数 必须用next() => resolve 这个钩子 =>前面不执行next =>后面永远不执行
  // next(false)// 终止当前的跳转
  // next(地址) // 跳转到另外一个地址
  // next()// 放行
  if (to.path.startsWith('/user') && !store.state.user.token) {
    // 判断有没有token
    // 有token 放行 没有 去登录
    // 要写携带要去的地址
    let topath = { path: '/login', query: { redirectUrl: to.path } }
    next(topath)
  } else {
    // 直接放行
    next()
  }
})
// 后置守卫
export default router
