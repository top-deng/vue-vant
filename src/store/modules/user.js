import { getToken, setToken } from '@/utils/auth'

const state = {
  token: getToken(),
  userInfo: {
    displayName: '',
    username: '',
    email: '',
    telephone: '',
    id: '',
    userType: '',
    status: null
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    setToken(token)
    state.token = token
  },
  SET_USERINFO: (state, user) => {
    state.userInfo = Object.assign(state.userInfo, user)
  }
}

const actions = {
  // 登录
  // Login({ commit }, userInfo) {
  //   const username = userInfo.userName.trim()
  //   return new Promise((resolve, reject) => {
  //     login(username, userInfo.password, userInfo.validateCode).then(res => {
  //       const data = res.data
  //       commit('SET_TOKEN', data.token)
  //       commit('SET_COMPANYID', data.companyId)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
