'use strict'

import { commit, log } from './utils'

function extractViewInfo (content) {
  const { Game } = window

  log('start parse')
  commit('GameView/UPDATE', {
    baseWidth: Game.actualPexWidth / 2,
    isJssdkSideMenu: Game.ua.isJssdkSideMenu(),
    platformName: Game.ua.platformName()
  })

  if (location.pathname === '/') {
    log('url correct!')
    // Setup view when not log in
    if (Game.userId === 0 || Game.ua.platformName() === 'notlogin') {
      log('not login')
      commit('GameView/RESET')
      commit('GameView/UPDATE', {
        baseSize: Number(/^[ \t]+deviceRatio = window\.innerWidth \/ (\d+);$/m.exec(content)[1]),
        subOpen: false
      })
      return
    }
    // Setup view when login
    const match = /^[ \t]+deviceRatio = \(window\.outerWidth - sideMenuWidth - (\d+)\) \/ (\d+);/m.exec(content)
    if (match) {
      log('login with autoResize')
      const sideMenuWidth = /^[ \t]+var sideMenuWidth = (.*);/m.exec(content)
      commit('GameView/UPDATE', {
        autoResize: true,
        sidePadding: Number(sideMenuWidth && sideMenuWidth[1]),
        unknownPadding: Number(match[1]),
        baseSize: Number(match[2]),
        subMenuWidth: Number(match[2]) - Game.actualPexWidth
      })
      /* eslint-disable no-tabs */
    } else if (content.indexOf('	deviceRatio') !== -1) {
      // when view is not responsive
      log('login without autoResize')
      commit('GameView/RESET')
      commit('GameView/UPDATE', {
        zoom: Number(/^[ \t]+deviceRatio = ([\d.]+);/m.exec(content)[1])
      })
      commit('GameView/PRESET')
      /* eslint-enable no-tabs */
    } else {
      log(`can't extract info.`)
    }
  }
  if (location.pathname === '/maintenance') {
    log('maintenance mode')
    commit('GameView/RESET')
    commit('GameView/UPDATE', {
      maintenance: true,
      autoResize: true,
      baseSize: Number(/^[ \t]+var deviceRatio = window\.innerWidth \/ (\d+);$/m.exec(content)[1])
    })
  }
}

function bruteWatcher () {
  // brutely extract info from DOM
  let gameFound
  const findHead = setInterval(() => {
    if (!gameFound && window.Game && typeof window.Game === 'object') {
      gameFound = true
      extractViewInfo(window.displayInitialize.toString())
      commit('Game/UPDATE', window.Game)
      if (window.Game.userId === 0) clearInterval(findHead)
    } else if (gameFound && document.querySelector('#submenu')) {
      const submenu = document.querySelector('#submenu')
      new MutationObserver(mutations => {
        commit('GameView/UPDATE', { subOpen: /open/.test(submenu.className) })
      }).observe(submenu, {attributes: true})
      clearInterval(findHead)
    }
  }, 0)
}

// append css to head
let scrollBarStyle = document.createElement('style')
scrollBarStyle.setAttribute('type', 'text/css')
scrollBarStyle.textContent += '::-webkit-scrollbar{display:none}body{cursor:default;image-rendering:-webkit-optimize-contrast}[class*=btn-]{cursor:pointer}'

// Initial a watcher to get head ready
let htmlWatcher = new MutationObserver(() => {
  log('document head searching...')
  if (document.head) {
    log('document head detected!')
    document.head.appendChild(scrollBarStyle)
    bruteWatcher()
    htmlWatcher.disconnect()
    // force gc
    htmlWatcher = null
    scrollBarStyle = null
  }
})
htmlWatcher.observe(document, { childList: true, subtree: true })
