import { app, session } from 'electron'
import assign from 'lodash/assign'
import forEach from 'lodash/forEach'
import isUndefined from 'lodash/isUndefined'

import { log, noop, site } from '../../utils'
import { defaults, config } from './config'

const options = {
  noThrottling (args) {
    if (args && !app.isReady()) {
      app.commandLine.appendSwitch('disable-renderer-backgrounding')
      log('[conf] noThrottling is enabled!')
    }
  },
  noHardwareAccel (args) {
    if (args && !app.isReady()) {
      app.disableHardwareAcceleration()
      log('[conf] noHardwareAccel is enabled!')
    }
  }
}

// the option for window created
const rendererOptions = {
  alwaysOnTop (args) {
    process.emit('setAlwaysOnTop', args)
  },
  proxy (args) {
    session.defaultSession.setProxy({
      proxyRules: args,
      proxyBypassRules: '<local>'
    }, noop)
    session.defaultSession.resolveProxy(site, (proxyString) => {
      log('[conf] proxy resolve with: %s', proxyString)
    })
  }
}

// apply options
function _apply (options, config) {
  forEach(options, (value, key) => {
    if (!isUndefined(config[key])) {
      value(config[key])
    }
  })
}

// merge and apply option when main window created
app.once('WindowCreated', () => {
  _apply(rendererOptions, config)
  assign(options, rendererOptions)
  log('[conf] renderer config applied!')
})

// apply config when loaded
_apply(options, config)
log('[conf] applied!')

export { config, defaults }
export function apply (config) { _apply(options, config) }
