import { commit, eventBus, log } from './lib/utils'
import viewInfoParser from './lib/viewInfoParser'

/**
 * Brutally execute task array by order,
 * return true to finish current task.
 * @param {function[]} task - function array
 */
function brutalExecutor (task) {
  const whileLoop = setInterval(() => {
    const command = {
      stop () { clearInterval(whileLoop) }
    }
    task.length
      ? task[0](command) && task.shift()
      : command.stop()
  }, 0)
}

// Initial a watcher to get game info
eventBus.once('head-ready', () => {
  brutalExecutor([
    function ({stop}) {
      if (window.Game) {
        // extract game view info
        const { Game } = window
        viewInfoParser(window.displayInitialize.toString())
        commit('Game/Update', Game)

        // stop watcher if we aren't login
        if (!Game.userId || (Game.ua && Game.ua.platformName() === 'notlogin')) {
          stop()
        }
        return true
      }
    },
    function () {
      const submenu = document.querySelector('#submenu')
      if (submenu) {
        new MutationObserver(() => {
          commit('GameView/Update', { subOpen: /open/.test(submenu.className) })
        }).observe(submenu, {attributes: true})
        return true
      }
    },
    function () {
      if (window.$) {
        eventBus.emit('jquery-ready')
        return true
      }
    }
  ])
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
