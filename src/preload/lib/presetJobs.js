/* global $, Game */
/* eslint-disable camelcase */
import forEach from 'lodash/forEach'
import { brutalExecutor, commit, eventBus, log, send } from './utils'
import { site } from '../../utils'

// send back submenu status when button click
eventBus.once('jquery-ready', () => {
  // append a setTimeout to ensure listener executed in next tick to prevent state is not ready.
  $('#submenu').on('finishInitializing', () => setTimeout(() => {
    const { state } = Game.submenu.mainView
    // submenu buttons defined at 14-03-2018
    const subButtons = [
      '.btn-submenu-control',
      '.btn-sub-chat',
      '.btn-sub-setting',
      '.btn-sub-help',
      '.btn-sub-comic',
      '.btn-sub-beginnercomic'
    ]

    // Declare submenu here to ensure we are using correct target
    const submenu = $('#submenu')
    forEach(subButtons, element =>
      submenu.on('tap', element, () =>
        commit('GameView/Update', {
          subType: state.current
        })))
  }))
  log('[Hook] Submenu button patched!')
})

// pull all ajax
eventBus.once('jquery-ready', () => {
  $(document).ajaxComplete((event, jqXHR, ajaxOptions) => {
    const { url, dataType } = ajaxOptions
    const { responseJSON, responseText, statusText } = jqXHR
    const data = dataType === 'json'
      ? responseJSON
      : responseText
    if (url.indexOf(site) !== -1 && statusText === 'OK') {
      send('game-ajax', {
        url,
        dataType,
        data
      })
    }
  })
  log('[Hook] Ajax hooked!')
})

// pull all raid info
function injectMultiPlayerRaid () {
  if (location.hash.indexOf('#raid_multi') !== -1) {
    brutalExecutor({
      name: 'raidSocketInjector',
      job () {
        try {
          Game.view.setupView.socket.socket.on('raid', (data) => {
            send('game-raid', data)
          })
          log('[Hook] Raid socket hooked!')
          this.next()
        } catch (error) {}
      }
    })
  }
}

eventBus.once('jquery-ready', () => {
  injectMultiPlayerRaid()
  window.addEventListener('hashchange', injectMultiPlayerRaid)
})
