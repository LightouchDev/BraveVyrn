/**
 * This file is used specifically and only for development.
 */

import { updatePreload } from './gameViewHandler'
import { app } from 'electron'

const devSocket = require('socket.io-client')('http://localhost:9080')

app.once('windowCreated', () => {
  devSocket.on('preload', () => {
    updatePreload()
    global.mainWindow.webContents.reload()
  })
  devSocket.on('renderer', () => global.mainWindow.webContents.reload())
})

// Require `main` process to boot app
require('./index')
