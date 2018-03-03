'use strict'

const socket = require('socket.io-client')(`http://localhost:${BVport}`, {
  path: `${BVpath}`
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

export { commit, log, send, sendToHost }
