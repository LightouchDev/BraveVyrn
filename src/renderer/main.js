import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import i18n from '../i18n'

import { isDev } from '../utils'

Vue.config.productionTip = isDev

// init language
i18n.locale = store.state.Config.language

const vue = new Vue({
  components: { App },
  i18n,
  router,
  store,
  template: '<App/>'
}).$mount('#app')

isDev && (window.vue = vue)
