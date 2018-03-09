import assign from 'lodash/assign'

const state = {
  dashOpen: false,
  dashWidth: 320,
  optionOpen: false
}

const mutations = {
  Update (state, payload) {
    assign(state, payload)
  }
}

const actions = {
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
