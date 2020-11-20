import store from '@/plugins/store'
import { getToken } from '@/utils/auth'
import { CONSOLE_REQUEST_ENABLE, CONSOLE_RESPONSE_ENABLE, API_NO_TOKEN_LIST } from '../index'
// import { CONSOLE_REQUEST_ENABLE, CONSOLE_RESPONSE_ENABLE, API_WHITE_LIST, API_STATUS_WHITE_LIST, API_STATUS_INTERCEPT_LIST, API_NO_TOKEN_LIST } from '../index'

// 自定义请求拦截逻辑，可以处理权限，请求发送监控等
export function requestSuccessFunc (req) {
  // eslint-disable-next-line
  CONSOLE_REQUEST_ENABLE && console.info('requestSuccess', '\n', req)
  const HAS_API_NO_TOKEN_LIST = API_NO_TOKEN_LIST.some(path => {
    return req.url.indexOf(path) !== -1
  })
  // 设置header 参数
  if (store.getters.token) {
    req.headers['Authorization'] = !HAS_API_NO_TOKEN_LIST ? getToken() : '' // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // 设置接口URL的时间戳 防IE等浏览器的请求被缓存（实际未发起请求到服务器）
  if (req.url.indexOf('s=') === -1) {
    req.url = req.url.indexOf('?') !== -1 ? `${req.url}&s=${new Date().getTime()}` : `${req.url}?s=${new Date().getTime()}`
  }
  // 设置表单数据
  if (typeof req.data === 'object' && req.data.isForm) {
    delete req.data.isForm
    req.headers['Content-Type'] = 'multipart/form-data'
    const fd = new FormData()
    Object.keys(req.data).forEach((key) => {
      const data = req.data[key]
      data !== undefined && fd.append(key, data)
    })
    req.data = fd
  }
  return req
}

// 自定义发送请求失败逻辑，断网，请求发送监控等
export function requestFailFunc (err) {
  return Promise.reject(err)
}

// 自定义响应成功逻辑，全局拦截接口，根据不同业务做不同处理，响应成功监控等
export function responseSuccessFunc (response) {
  /**
   * 状态码（status/code）为非0是抛错 可结合自己业务进行修改
  */
  const res = response.data
  // eslint-disable-next-line
  CONSOLE_RESPONSE_ENABLE && console.info('responseSuccess', '\n', res)
  // const locat = window.location || location
  // const hrefUrl = (response.config && response.config.url) || locat.href
  // const hasWhiteList = API_WHITE_LIST.some(path => {
  //   return hrefUrl.indexOf(path) !== -1
  // })
  // const hasWhiteStatusList = API_STATUS_WHITE_LIST.some(STATUS => {
  //   return res.status === STATUS
  // })
  // const hasInterceptStatusList = API_STATUS_INTERCEPT_LIST.some(STATUS => {
  //   return res.status === STATUS
  // })
  // 无需公共接口校验验证的白名单
  if (res && res.status && res.status !== 0) {
    /*
     * @status
     * 17 非法的token; 过期了;
     */
    // if (hasInterceptStatusList) {
    //   const msg = '账号在其他地方登录，强制退出，请重新登录'
    // }
    // if (!hasWhiteList) {
    //   if (res.status !== 17 && res.status !== 49 && !hasWhiteStatusList) {
    //     const msg = res.message || '操作失败'
    //   }
    // }
    return Promise.reject(new Error({ status: res.status, message: res.message }))
  }
  return res
}

// 响应失败，可根据 error.message 和 error.response 来做监控处理
export function responseFailFunc (error) {
  const { message, response } = error
  // eslint-disable-next-line
  CONSOLE_RESPONSE_ENABLE && console.info('responseFail', '\n', `message: ${message}`, '\n', response)
  // const { errorIntercept, closeErrorIntercept } = response.config.option
  // if (errorIntercept && !closeErrorIntercept) {
  //   // 自定义全局错误拦截处理
  // }
  if (error && error.response.request.responseURL.indexOf('loginsuccess') >= 0) {
    const timeOut = setTimeout(() => {
      store.dispatch('user/FedLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
      clearTimeout(timeOut)
    }, 2000)
  }
  return Promise.reject(new Error(null))
}
