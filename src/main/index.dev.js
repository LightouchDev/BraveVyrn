/**
 * This file is used specifically and only for development.
 */

import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { updatePreload } from './gameViewHandler'

const port = fs.readFileSync(path.join(__dirname, '../../.electron-vue', 'port.txt'))
const devSocket = require('socket.io-client')(`http://localhost:${port}`)

devSocket.on('preload', () => {
  updatePreload()
  app.emit('HostReload')
})
devSocket.on('renderer', () => app.emit('HostReload'))
app.on('before-quit', () => { devSocket.disconnect() })

// Require `main` process to boot app
require('./index')
