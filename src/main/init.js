'use strict'

import path from 'path'
import { app } from 'electron'
import { isDev, log, productName } from '../utils'

log('[app]  start!')

// set userData path manually, muon is not using package name as path to save user data.
app.setPath(
  'userData',
  path.join(
    app.getPath('userData'),
    '../',
    isDev ? 'muon' : productName))

// disable sandbox like electron
app.commandLine.appendSwitch('no-sandbox')

// export electron api when dev
isDev && (global.electron = require('electron'))
