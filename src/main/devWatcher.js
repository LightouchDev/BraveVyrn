/**
 * This file is used specifically and only for development.
 */

import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { loadPreload } from './gameViewHandler'

const port = fs.readFileSync(path.join(__dirname, '../../.electron-vue', 'port.txt'))
const devSocket = require('socket.io-client')(`http://localhost:${port}`)

devSocket.on('preload', () => {
  loadPreload()
  app.emit('HostReload')
})
devSocket.on('renderer', () => app.emit('HostReload'))
app.on('before-quit', () => { devSocket.disconnect() })
