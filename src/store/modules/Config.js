import assign from 'lodash/assign'
import forEach from 'lodash/forEach'

const state = {}

const mutations = {
  Update (state, payload) {
    assign(state, payload)
  },
  Replace (state, payload) {
    forEach(state, (value, key) => {
      delete state[key]
    })
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
