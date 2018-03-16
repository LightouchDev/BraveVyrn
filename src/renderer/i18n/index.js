import Vue from 'vue'
import VueI18n from 'vue-i18n'
import includes from 'lodash/includes'
// import forEach from 'lodash/forEach'

const { ipcRenderer } = chrome

Vue.use(VueI18n)

export default (lang) => {
  // preset fallback locale
  const fallbackLocale = 'en_US'
  const messages = {}
  messages[fallbackLocale] = require('./translations/en_US.json')

  const i18n = new VueI18n({
    fallbackLocale,
    messages
  })

  /**
   * List language
   */
  const langs = [fallbackLocale, 'zh_TW']
  /*
  // FIXME: don't maintenance lang list manually
  forEach(require.context('./translations', false, /\.json$/).keys(), file =>
    langs.push(file.replace(/\.\/|\.json/g, '')))
  */
  i18n.langs = langs

  /**
   * Load language
   */
  const loadedLang = [fallbackLocale]

  i18n.loadLang = function (lang) {
    if (this.locale !== lang) {
      if (!includes(loadedLang, lang)) {
        return import(
          /* webpackChunkName: "lang-[request]" */
          `./translations/${lang}.json`
        ).then(messages => {
          ipcRenderer.send('LocaleUpdate', messages)
          this.setLocaleMessage(lang, messages)
          loadedLang.push(lang)
          this.locale = lang
          return lang
        })
      }
      ipcRenderer.send('LocaleUpdate', messages[lang])
      this.locale = lang
    }
    return Promise.resolve(lang)
  }

  // set it if initial lang is not available
  if (!includes(langs, lang)) {
    lang = fallbackLocale
  }

  i18n.loadLang(lang)

  return i18n
}
