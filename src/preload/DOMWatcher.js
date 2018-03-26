import { brutalExecutor, commit, eventBus, log } from './lib/utils'
import viewInfoParser from './lib/viewInfoParser'

// Initial a watcher to get game info
eventBus.once('head-ready', () => {
  brutalExecutor([{
    name: 'viewInfoParser',
    job () {
      if (window.Game) {
        // extract game view info
        const { Game } = window
        viewInfoParser(window.displayInitialize.toString())
        commit('Game/Update', Game)

        // stop watcher if we aren't login
        if (!Game.userId || (Game.ua && Game.ua.platformName() === 'notlogin')) {
          this.stop()
        }
        this.next()
      }
    },
    fallback () {
      this.stop()
      // FIXME: apply zoom manually here.
    },
    timeout: 'load'
  }, {
    name: 'submenuObserver',
    job () {
      const submenu = document.querySelector('#submenu')
      if (submenu) {
        new MutationObserver(() => {
          commit('GameView/Update', { subOpen: /open/.test(submenu.className) })
        }).observe(submenu, {attributes: true})
        this.next()
      }
    }
  }, {
    name: 'jQueryWatcher',
    job () {
      if (window.$) {
        eventBus.emit('jquery-ready')
        this.next()
      }
    }
  }])
})

// Initial a watcher to wait head ready
let htmlWatcher = new MutationObserver(() => {
  log('[DOMWatcher] document head searching...')
  if (document.head) {
    log('[DOMWatcher] document head detected!')

    htmlWatcher.disconnect()
    htmlWatcher = null

    eventBus.emit('head-ready')
  }
})
htmlWatcher.observe(document, { childList: true, subtree: true })
