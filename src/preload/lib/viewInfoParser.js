import assign from 'lodash/assign'
import { commit, log } from './utils'

export default (content) => {
  const { Game } = window

  log('[VIParser] Start parse')

  if (location.pathname === '/') {
    log('[VIParser] Standard mode')
    let result = {
      baseWidth: Game.actualPexWidth / 2,
      isJssdkSideMenu: Game.ua.isJssdkSideMenu(),
      platformName: Game.ua.platformName()
    }

    // Setup view when not log in
    if (Game.userId === 0 || Game.ua.platformName() === 'notlogin') {
      log('[VIParser] Not login')
      commit('GameView/UpdateWithPreset', assign(result, {
        baseSize: Number(/^[ \t]+deviceRatio = window\.innerWidth \/ (\d+);$/m.exec(content)[1]),
        subOpen: false
      }))
      return
    }
    // Setup view when login
    const match = /^[ \t]+deviceRatio = \(window\.outerWidth - sideMenuWidth - (\d+)\) \/ (\d+);/m.exec(content)
    if (match) {
      log('[VIParser] Login with autoResize')

      const sideMenuWidth = /^[ \t]+var sideMenuWidth = (.*);/m.exec(content)
      commit('GameView/Update', assign(result, {
        autoResize: true,
        sidePadding: Number(sideMenuWidth && sideMenuWidth[1]),
        unknownPadding: Number(match[1]),
        baseSize: Number(match[2]),
        subMenuWidth: Number(match[2]) - Game.actualPexWidth
      }))
    } else if (/\tdeviceRatio/.test(content)) {
      // when view is not responsive
      log('[VIParser] Login without autoResize')

      commit('GameView/UpdateWithPreset', assign(result, {
        zoom: Number(/^[ \t]+deviceRatio = ([\d.]+);/m.exec(content)[1])
      }))
    } else {
      log(`[VIParser] No available info.`)
    }
  }

  if (location.pathname === '/maintenance') {
    log('[VIParser] Maintenance mode')
    commit('GameView/UpdateWithPreset', {
      maintenance: true,
      autoResize: false,
      baseSize: Number(/^[ \t]+var deviceRatio = window\.innerWidth \/ (\d+);$/m.exec(content)[1])
    })
  }
}
