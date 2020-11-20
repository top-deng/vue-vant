import * as utils from '@/constants/functions'
import { BASE_URL } from '@/config'

function inject (Vue, name, module) {
  Object.defineProperty(Vue.prototype, name, {
    get () {
      return module
    }
  })
}

export default {
  install (Vue) {
    // 可自定义的注释或删除全局注入
    inject(Vue, '$utils', utils)
    inject(Vue, 'BASE_URL', BASE_URL)
    inject(Vue, '$EventBus', new Vue())
  }
}
