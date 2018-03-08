'use strict'

import assign from 'lodash/assign'

const state = {}

const mutations = {
  Update (state, payload) {
    assign(state, payload)
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
