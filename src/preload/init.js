import assign from 'lodash/assign'
import { isDev, oneshotListener, noop } from '../utils'
import { log } from './lib/utils'

import './lib/workaround'

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

if (isDev) {
  const { assert, error, time, timeEnd, log, warn } = console
  oneshotListener(window, 'load', () =>
    assign(console, { assert, error, time, timeEnd, log, warn }))
}
