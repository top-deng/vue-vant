import Cookies from 'js-cookie'
import { COOKIE_EXPIRES } from '@/config' // cookie保存的天数

/**
 * @msg: 存取token
 * @param {string} token
*/
export const TOKEN_KEY = 'EPH-Token'

export function getToken () {
  return Cookies.get(TOKEN_KEY)
}

export function setToken (token) {
  return Cookies.set(TOKEN_KEY, token, { expires: COOKIE_EXPIRES || 1 })
}

export function removeToken () {
  return Cookies.remove(TOKEN_KEY)
}
