// import forEach from 'lodash/forEach'
import { oneshotListener, noop } from '../utils'
import { console, log } from './lib/utils'

log('[EVENT] preload start!')

// prevent alert popup when resize cause frequency reload
const _alert = window.alert
window.alert = noop

oneshotListener(window, 'DOMContentLoaded', () => {
  log('[EVENT] DOMContentLoaded')
})

oneshotListener(window, 'load', () => {
  log('[EVENT] load')
  // restore alert
  window.alert = _alert
})

window.addEventListener('error', (...args) => console.error(...args))

require('./lib/workaround')
require('./lib/presetJobs')
