import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { err, isDev, log, productName } from '../utils'

log('[app]  start!')

// set userData path manually, muon is not using package name as path to save user data.
const userDataPath = path.join(
  app.getPath('userData'),
  isDev ? '.' : `../${productName}`)

// create folder manually, muon won't create this properly.
fs.existsSync(userDataPath) || fs.mkdirSync(userDataPath)

// set path
app.setPath('userData', userDataPath)

// disable sandbox like electron
app.commandLine.appendSwitch('no-sandbox')

// export electron api when dev
isDev && (global.electron = require('electron'))

/**
 * Handle common error
 */
if (!isDev) {
  process.on('unhandledRejection', err)
  process.on('uncaughtException', err)
}

require('./store') // start state storage and import config
require('./mainWindow') // setup main window
require('./contentHandler') // setup webContents
require('./dialogHandler') // setup dialogs
require('./gameViewHandler') // setup gameview behavior

if (isDev) {
  require('./devWatcher') // setup for webpack hot reload
}
