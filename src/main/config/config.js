'use strict'

import fs from 'fs'
import path from 'path'
import locale from 'os-locale'
import { app } from 'electron'
import { isUndefined } from 'lodash'

import i18n from '../../i18n'
import { err, isDev, log, productName } from '../../utils'

// ensure it'ss in right path
const configPath = path.join(
  app.getPath('userData'),
  '../',
  isDev ? 'muon' : productName,
  `${productName}.json`)

const defaults = {
  raider: 'http://spur.us.to/gbf',
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

// check default translation exist
if (isUndefined(i18n.messages[defaults.language])) {
  defaults.language = 'en_US'
}

// read saved config
let config
try {
  const fd = fs.openSync(configPath, 'r+')
  config = JSON.parse(fs.readFileSync(fd, 'utf8'))
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
