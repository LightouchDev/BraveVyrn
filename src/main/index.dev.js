/**
 * This file is used specifically and only for development.
 */

import { app } from 'electron'
import { updatePreload } from './gameViewHandler'

const devSocket = require('socket.io-client')('http://localhost:9080')

devSocket.on('preload', () => {
  updatePreload()
  app.emit('HostReload')
})
devSocket.on('renderer', () => app.emit('HostReload'))

// Require `main` process to boot app
require('./index')
