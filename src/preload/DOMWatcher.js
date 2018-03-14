import { commit, eventBus, log } from './lib/utils'
import viewInfoParser from './lib/viewInfoParser'

// Initial a watcher to get game info
eventBus.once('head-ready', () => {
  let gameFound
  const findHead = setInterval(() => {
    if (!gameFound && window.Game) {
      gameFound = true

      // extract game view info
      const { Game } = window
      viewInfoParser(window.displayInitialize.toString())
      commit('Game/Update', Game)

      // stop watcher if we aren't login
      if (!Game.userId || (Game.ua && Game.ua.platformName() === 'notlogin')) {
        clearInterval(findHead)
      }
    } else if (gameFound && document.querySelector('#submenu')) {
      const submenu = document.querySelector('#submenu')
      new MutationObserver(() => {
        commit('GameView/Update', { subOpen: /open/.test(submenu.className) })
      }).observe(submenu, {attributes: true})
      clearInterval(findHead)
    }
  }, 0)
})

// Initial a watcher to wait head ready
let htmlWatcher = new MutationObserver(() => {
  log('[DOMWatcher] document head searching...')
  if (document.head) {
    log('[DOMWatcher] document head detected!')
    eventBus.emit('head-ready')

    htmlWatcher.disconnect()
    htmlWatcher = null
  }
})
htmlWatcher.observe(document, { childList: true, subtree: true })
