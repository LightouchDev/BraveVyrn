// steal from https://github.com/vuejs/vuex/issues/92#issuecomment-212012430
import Vue from 'vue'
import Vuex from 'vuex'
import { ipcMain } from 'electron'
import { log, err } from '../utils'

import modules from '../store/modules'
import { apply, defaults, config } from './config'

// link config Object
modules.Config.state = config

Vue.use(Vuex)

const clients = []

const store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})

store.subscribe((mutation, state) => {
  clients.forEach(client => {
    client.send('vuex-apply-mutation', mutation)
  })
})

ipcMain.on('vuex-connect', (event) => {
  const win = event.sender
  const winId = win.id
  log('[vuex] new vuex client: %s', winId)

  win.on('destroyed', () => {
    clients[winId] = null
    delete clients[winId]
  })

  clients[winId] = win
  event.returnValue = store.state
})

ipcMain.on('vuex-mutation', (event, args) => {
  try {
    store.commit(...args)
  } catch (error) {
    err(error)
    if (event.sender) {
      event.sender.send('vuex-error', error)
    }
  }
})

ipcMain.on('vuex-action', (event, args) => {
  try {
    store.dispatch(...args)
  } catch (error) {
    err(error)
    if (event.sender) {
      event.sender.send('vuex-error', error)
    }
  }
})

/**
 * for config
 */
// apply options when Config update
store.subscribe(({type, payload}) => {
  type === 'Config/Update' && apply(payload)
})

// apply defaults
ipcMain.on('ConfigDefaults', () => {
  log('[conf] set to defaults')
  store.commit('Config/Replace', defaults)
})

export default store
