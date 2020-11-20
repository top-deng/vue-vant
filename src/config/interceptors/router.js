import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
import { VIEW_WHITE_LIST } from '@/config'

export function routerBeforeEachFunc (to, from, next) {
  // 这里可以做页面拦截，比如做权限处理
  // ...
  // start progress bar

  // 设置浏览器标题
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const userToken = getToken()
  const hasViewWhiteList = VIEW_WHITE_LIST.some(path => { return to.path.indexOf(path) !== -1 })
  if (hasViewWhiteList && !userToken) {
    // console.log('routerBeforeEachFunc if (VIEW_WHITE_LIST.indexOf(to.path) !== -1 && !userToken)')
    return next()
  }
  if (userToken) {
    // console.log('routerBeforeEachFunc if (userToken)')
    // console.log('to.meta.roles', to.meta.roles)
  }
  return next('/login')
}

export function routerAfterEachFunc (to) {
  const prefix = 'ember'
  const { title } = to.meta
  document.title = title ? `${prefix} - ${title}` : prefix
  // 置顶，针对keepAlive
  // window.scrollTo(0, 0)
  // finish progress bar
}
