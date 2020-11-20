// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 引入lib-flexible 用于设置rem基准值
import 'lib-flexible/flexible'
import Vue from 'vue'
import store from '@/plugins/store'
import router from '@/plugins/router'
import inject from '@/plugins/inject'
import '@/plugins/directive'
import App from './App'
// import i18n from './local' // Internationalization
import { Lazyload } from 'vant'

Vue.config.productionTip = false
Vue.config.debug = true // 开启debug模式

Vue.use(Lazyload)
Vue.use(inject)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  // i18n,
  render: (h) => h(App)
}).$mount('#app')
