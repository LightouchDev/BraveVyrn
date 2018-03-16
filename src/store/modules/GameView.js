import assign from 'lodash/assign'

/**
 * Default parameters:
 *  zoom: the zoom of game that read from header or calculate from window size
 *  maintenance: game is in maintenance or not.
 *  autoResize: game is in responsive mode (or call "Full size")
 *  isJssdkSideMenu: is there has a useless sidebar.
 *  platformName: account provider.
 *  sidePadding: the width of sidebar of account provider, use for hiding that.
 *  baseSize: the basic size for full game width size, use for detecting zoom.
 *  baseWidth: the basic size for single game width.
 *  unknownPadding: extra width that I don't know the purpose.
 *  subOpen: submenu is opened or not.
 *  subType: current submenu page type.
 *  subMenuWidth: submenu width.
 *  dashTab: the current tab of dashboard
 */
const defaults = {
  zoom: 1.5,
  maintenance: false,
  autoResize: false,
  unknownPadding: 0,
  // hard-coded widths for current version: 2017-12-21(1513867784)
  baseSize: 704,
  sidePadding: 64,
  subMenuWidth: 64
}

// only set variables when initialize
const state = assign({
  isJssdkSideMenu: false,
  platformName: '',
  baseWidth: 320,
  subOpen: false,
  subType: '',
  dashTab: 'main'
}, defaults)

const mutations = {
  Update (state, payload) {
    assign(state, payload)
  },
  UpdateWithPreset (state, payload) {
    assign(state, defaults, payload)
  }
}

const actions = {
  // async update for non-blocking mutation for component use
  Update ({ commit }, payload) {
    commit('Update', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
