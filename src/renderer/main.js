import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import i18n from './i18n'

import { isDev } from '../utils'

Vue.config.productionTip = isDev

// create global event bus
const EventBus = new Vue()
Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  }
})

// create vue instance
const vue = new Vue({
  components: { App },
  i18n: i18n(store.state.Config.language),
  router,
  store,
  template: '<App/>'
}).$mount('#app')

isDev && (window.vue = vue)
