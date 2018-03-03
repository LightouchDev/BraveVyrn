'use strict'

import path from 'path'
import { app } from 'electron'
import { isDev, productName } from '../utils'

// set userData path manually, muon is not using package name as path to save user data.
app.setPath(
  'userData',
  path.join(
    app.getPath('userData'),
    '../',
    isDev ? 'muon' : productName))

isDev && (global.electron = require('electron'))
