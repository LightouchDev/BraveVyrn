import fs from 'fs'
import path from 'path'
import locale from 'os-locale'
import { app } from 'electron'
import assign from 'lodash/assign'

import { err, log, productName } from '../../utils'

const configPath = path.join(
  app.getPath('userData'),
  `${productName}.json`)

const defaults = {
  raidFinderURL: 'http://spur.us.to/gbf',
  noThrottling: true,
  noHardwareAccel: false,
  // renderer defaults
  language: locale.sync(),
  alwaysOnTop: false,
  proxy: 'direct://',
  raids: [],
  gameViewConfig: {},
  subHide: false
}

// read saved config
let config
try {
  const fd = fs.openSync(configPath, 'r+')
  config = assign({}, defaults, JSON.parse(fs.readFileSync(fd, 'utf8')))
  fs.closeSync(fd)
} catch (error) {
  if (error.code === 'ENOENT') {
    log('[conf] no config found, apply defaults')
    config = defaults
  } else {
    throw error
  }
}

log('[conf] loaded: %o', config)

// auto save storage each 10 mins
setInterval(() => {
  fs.writeFile(configPath, JSON.stringify(config), (error) => {
    if (error) err(error)
    log('[conf] auto saved')
  })
}, 600000)

let isSaving // ensure there's only one thread to save config
// save config when exit gracefully
app.on('before-quit', event => {
  event.preventDefault()
  if (!isSaving) {
    fs.writeFile(configPath, JSON.stringify(config), (error) => {
      if (error) err(error)
      log('[conf] saved before quit')
      app.exit(0)
    })
  }
  isSaving = true
})

export { config, defaults }
