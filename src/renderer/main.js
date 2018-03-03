import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import i18n from '../i18n'

Vue.config.productionTip = false

window.vue = new Vue({
  components: { App },
  i18n,
  router,
  store,
  template: '<App/>'
}).$mount('#app')
