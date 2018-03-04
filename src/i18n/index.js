import Vue from 'vue'
import VueI18n from 'vue-i18n'

import messages from './translations'

Vue.use(VueI18n)

const i18n = new VueI18n({
  // we will set locale from outside
  fallbackLocale: 'en_US',
  messages // set locale messages
})

export default i18n
