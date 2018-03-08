import assign from 'lodash/assign'

const state = {}

const mutations = {
  Update (state, payload) {
    assign(state, payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
