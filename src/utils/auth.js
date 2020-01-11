// 专门处理用户信息的存储和删除
// 这个key专门用来存储用户信息
const USER_TOKEN = 'heima-91-toutiao-m-token'
export function setUser (user) {
  localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}
export function getUser () {
  return JSON.parse(localStorage.getItem(USER_TOKEN) || '{}')// 短路表达式
}
export function removeUser () {
  localStorage.removeItem(USER_TOKEN)
}
