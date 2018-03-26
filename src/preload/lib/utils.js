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

/**
 * @typedef taskFunction
 * @type {function}
 * @var {function} stop - stop loop
 * @var {function} next - stop current loop, and continue
 */

/**
 * @typedef taskObject
 * @type {Object}
 * @property {string} name - the job name
 * @property {taskFunction} job - the job that require to execute.
 * @property {taskFunction} [fallback] - the job when timeout.
 * @property {string|number} [timeout=10000] - timeout condition, millisecond or event name
 */

/**
 * Brutally execute task array by order
 * @param {taskObject|taskObject[]} task
 */
function brutalExecutor (task) {
  function _promiseExecutor ({name, job, fallback, timeout = 10000}) {
    return new Promise((resolve, reject) => {
      let whileLoop = null
      const command = {
        stop () {
          task = []
          clearInterval(whileLoop)
        },
        next () {
          resolve()
          clearInterval(whileLoop)
        }
      }

      whileLoop = setInterval(job.bind(command), 0)

      // setup fallback condition when timeout (if any)
      fallback = typeof fallback === 'function'
        ? fallback.bind(command)
        : resolve

      typeof timeout === 'string'
        ? oneshotListener(window, timeout, fallback)
        : setTimeout(fallback, timeout)
    }).then(() => {
      log(`[BrutalExecutor] job '%s' done`, name)
      // recursive call to simulate foreach loop
      task.length && _promiseExecutor(task.shift())
    }).catch((error) =>
      log(`[BrutalExecutor] job '%s' error: %o`, name, error))
  }

  if (!Array.isArray(task)) {
    task = [task]
  }

  _promiseExecutor(task.shift())
}

export { brutalExecutor, commit, console, eventBus, log, send, sendToHost }
