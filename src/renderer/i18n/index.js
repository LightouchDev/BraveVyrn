import Vue from 'vue'
import VueI18n from 'vue-i18n'
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
      if (!loadedLang.includes(lang)) {
        return import(
          /* webpackChunkName: "lang-[request]" */
          `./translations/${lang}.json`
        ).then(messages => {
          ipcRenderer.send('LocaleUpdate', messages)
          this.setLocaleMessage(lang, messages.default)
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

  // set it if current lang is not fallbackLocale
  if (lang !== fallbackLocale) {
    i18n.loadLang(lang)
  } else {
    // send back the fallback locale
    ipcRenderer.send('LocaleUpdate', messages[fallbackLocale])
  }

  return i18n
}
