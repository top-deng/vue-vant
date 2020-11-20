import createLogger from 'vuex/dist/logger'

// 当前运行环境
export const NODE_ENV = process.env.NODE_ENV || 'production'
export const NODE_ENV_IS_PRODUCTION = NODE_ENV === 'production'

// router 默认配置
export const ROUTER_DEFAULT_CONFIG = {
  // mode: 'hash', // 配置路由模式
  // base: '/', // 应用的基路径
  linkActiveClass: 'router-link-active', // 链接激活时使用的 class
  linkExactActiveClass: 'router-link-exact-active' // 链接被精确匹配激活时使用的 class
}

// vuex 默认配置
export const VUEX_DEFAULT_CONFIG = {
  strict: !NODE_ENV_IS_PRODUCTION, // 在开发环境进入严格模式，mutation 以外修改 state 都会抛出错误
  plugins: !NODE_ENV_IS_PRODUCTION // 在开发环境生成状态快照
    ? [createLogger({})]
    : []
}

// axios 默认配置
export const AXIOS_DEFAULT_CONFIG = {
  timeout: 5 * 60 * 1000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
}

// API 默认配置
export const API_DEFAULT_CONFIG = {
  prefix: '/api',
  errorIntercept: true
}

// 方便开发的配置
export const CONSOLE_REQUEST_ENABLE = !NODE_ENV_IS_PRODUCTION && false // 开启请求参数打印
export const CONSOLE_RESPONSE_ENABLE = !NODE_ENV_IS_PRODUCTION && true // 开启响应参数打印

// 业务相关的配置
// ...
/**
 * @description token在Cookie中存储的天数，默认1天
*/
export const COOKIE_EXPIRES = 1

// 上传的文件服务地址
export const VUE_APP_UP_LOAD_FELE_URL = window.location.hostname === 'localhost' || window.location.hostname.indexOf('inner') !== -1 || window.location.hostname.indexOf('192.') !== -1 ? 'http://internal-file.topband-cloud.com/' : 'http://file.topband-cloud.com/'

// 第三方组件跟目录地址
export const BASE_URL = window.location.hostname.indexOf('inner') !== -1 || window.location.hostname.indexOf('192.') !== -1 ? '/ember/h5' : ''

// 非拦截路由白名单
export const VIEW_WHITE_LIST = ['/login']

// 非拦截接口URL白名单
export const API_WHITE_LIST = ['/login']

// 非拦截接口错误提示状态码
export const API_STATUS_WHITE_LIST = [201034, 201081, 201094]

// 拦截接口, 错误提示状态码(token 失效)
export const API_STATUS_INTERCEPT_LIST = [17, 49, 201035, 201036, 201037, 201038]

// 拦截接口, 接口不传token
export const API_NO_TOKEN_LIST = []
