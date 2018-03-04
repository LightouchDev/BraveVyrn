'use strict'

import { assign } from 'lodash'

const state = {}

const mutations = {
  UPDATE (state, payload) {
    assign(state, payload)
  }
}

const actions = {
  // async update for non-blocking mutation for component use
  UPDATE ({ commit }, payload) {
    commit('UPDATE', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
