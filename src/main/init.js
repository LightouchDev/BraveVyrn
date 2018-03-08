import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { isDev, log, productName } from '../utils'

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
