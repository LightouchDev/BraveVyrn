'use strict'

import fs from 'fs'
import path from 'path'
import { ipcMain, webContents, session } from 'electron'
import { extID, getRandomInt, isDev, log, noop, rootPath, site } from '../utils'
import store from './store'

function updatePreload () {
  preloadScript = fs.readFileSync(path.join(rootPath, 'preload.js'), 'utf8')
}

function preloadInject (content, callback) {
  content.executeScriptInTab(extID, `
    const BVpath = '${BVpath}';
    const BVport = ${BVport};
    ${preloadScript}
  `, {
    mainWorld: true,
    runAt: 'document_start'
  })
  callback && callback()
}

// setup gameView when changed
function setup (content) {
  isDev && (global.gameView = content)
  content.on('did-navigate', () =>
    preloadInject(content, () =>
      content.send('hostLog', ['preload executed'])))
}

/**
 * gameView preload script polyfill
 */
let gameView, BVport, socket

let preloadScript = fs.readFileSync(path.join(rootPath, 'preload.js'), 'utf8')

// create socket.io to simulate ipc message, random path, port for security
const BVpath = '/' + require('crypto').randomBytes(32).toString('hex')
require('get-port')({
  port: getRandomInt(2048, 65535)
}).then(port => {
  const io = require('socket.io')(port, {
    path: BVpath,
    serveClient: false
  })
  io.on('connection', (client) => {
    socket = client
    isDev && (global.socket = client)

    // redirect to Main process ipc channel
    client.on('toMain', ([ channel, ...args ]) =>
      ipcMain.emit(channel, {}, ...args))

    // redirect to Renderer process ipc channel
    client.on('toHostView', (args) =>
      process.emit('toHostView', args))
  })
  // save port
  BVport = port
})

ipcMain.on('toGameView', (event, args) => socket.emit(...args))

/**
 * ipc services
 */
ipcMain.on('GameViewChanged', (event, tabId) => {
  log('[view] Received tabID: %s', tabId)
  gameView = webContents.fromTabID(tabId)
  isDev && gameView.openDevTools({ mode: 'detach' })
  setup(gameView)
})

// auto open submenu when open purchase page
// FIXME: find a better way to filter request
ipcMain.once('GameViewChanged', () => {
  /* eslint-disable standard/no-callback-literal */
  const reply = { cancel: false }
  const regex = new RegExp(`${site}/.+/purchase_jssdk`)
  function filter (details, callback) {
    callback(reply)
    if (regex.test(details.url) && !store.state.GameView.subOpen) {
      log('[view] purchase request detected')
      gameView.executeScriptInTab(
        extID,
        'Game.submenu.mainView.switchCurrent(Game.submenu.mainView.state.current)',
        { mainWorld: true }
      )
    }
  }
  session.defaultSession.webRequest.onBeforeRequest(filter)
})

ipcMain.on('GameViewOpenDevTools', () =>
  gameView.openDevTools({ mode: 'detach' }))

ipcMain.on('GameViewReloadIgnoringCache', () =>
  gameView.reloadIgnoringCache())

ipcMain.on('GameViewClearCache', () =>
  gameView.session.clearCache(noop))

ipcMain.on('GameViewClearStorageData', () =>
  gameView.session.clearStorageData(() =>
    gameView.loadURL(site)))

export { updatePreload }
