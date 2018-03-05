'use strict'

import { oneshotListener, noop } from '../../utils'
import { log } from './utils'

log(`%s inject start!`, performance.now().toFixed(2))

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
