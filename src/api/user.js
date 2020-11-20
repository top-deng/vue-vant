import request from '@/plugins/request'

export function login(loginName, password, code) {
  return request({
    url: `${process.env.VUE_APP_BASE_API}/userlogin/login`,
    method: 'post',
    data: {
      loginName,
      password,
      code
    }
  })
}