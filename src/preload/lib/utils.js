import EventEmitter from 'eventemitter3'
import assign from 'lodash/assign'
import clone from 'lodash/clone'
import { oneshotListener } from '../../utils'

/**
 * Setup ipcRenderer-like socket service
 */
let socket = require('socket.io-client')(`http://localhost:${BVport}`, {
  path: `${BVpath}`
})

oneshotListener(window, 'beforeunload', () => {
  socket.disconnect()
  socket = null
})

// simulate ipcRenderer method
function sendToHost (...args) {
  socket.emit('toHostView', args)
}
function send (...args) {
  socket.emit('toMain', args)
}

// send log to host console
function log (...args) {
  sendToHost('hostLog', args)
}

function commit (...args) {
  send('vuex-mutation', args)
}

/**
 * Add a global event bus
 */
const eventBus = new EventEmitter()

/**
 * console object
 */
const { assert, error, time, timeEnd, log: clog, warn } = window.console
const console = clone(window.console)
assign(console, { assert, error, time, timeEnd, log: clog, warn })

export { commit, console, eventBus, log, send, sendToHost }
