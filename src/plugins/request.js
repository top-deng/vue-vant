import axios from 'axios'

import { AXIOS_DEFAULT_CONFIG } from '@/config/index'
import { requestSuccessFunc, requestFailFunc, responseSuccessFunc, responseFailFunc } from '@/config/interceptors'

// 注入默认配置
const axiosInstance = axios.create(AXIOS_DEFAULT_CONFIG)

// 注入请求拦截
axiosInstance
  .interceptors.request.use(requestSuccessFunc, requestFailFunc)

// 注入失败拦截
axiosInstance
  .interceptors.response.use(responseSuccessFunc, responseFailFunc)

export default axiosInstance


export function POST (url, data, isParams) {
  if (isParams) {
    return axiosInstance({
      method: 'post',
      url: url,
      params: data
    })
  } else {
    return axiosInstance({
      method: 'post',
      url: url,
      data: data
    })
  }
}

export function GET (url, params) {
  return axiosInstance({
    method: 'get',
    url: url,
    params: params
  })
}
