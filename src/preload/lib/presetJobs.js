/* global $, Game */
/* eslint-disable camelcase */
import forEach from 'lodash/forEach'
import { commit, eventBus } from './utils'

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
})
