import fs from 'fs'
import path from 'path'
import { ipcMain, webContents, session } from 'electron'
import { err, extID, isDev, log, noop, rootPath, site } from '../utils'
import store from './store'

function loadPreload () {
  preloadScript = `
  const BVpath = '${BVpath}';
  const BVport = ${BVport};
  ${fs.readFileSync(path.join(rootPath, 'preload.js'), 'utf8')}
`
  isDev && (global.preloadScript = preloadScript)
}

function preloadInject (content, callback) {
  content.executeScriptInTab(extID, preloadScript, {
    mainWorld: true,
    runAt: 'document_start'
  })
  callback && callback()
}

// setup gameView when changed
function setup (content) {
  isDev && (global.gameView = content)
  content.on('did-navigate', () => {
    if (BVport) {
      preloadInject(content, () =>
        process.emit('toHostView', ['hostLog', ['[Main] preload executed']]))
    } else {
      // the flag that show we have inject pending but socket.io server is not ready.
      injectRequired = true
    }
  })
}

/**
 * gameView preload script polyfill
 */
let gameView, BVport, socket, injectRequired, preloadScript

// create socket.io to simulate ipc message, random path, port for security
const BVpath = '/' + require('crypto').randomBytes(32).toString('hex')

const httpServer = require('http').createServer()

// start http server listen
httpServer.listen(0, '127.0.0.1', () => {
  // init socket.io server
  const io = require('socket.io')(httpServer, {
    path: BVpath,
    serveClient: false
  })

  // handle client connect
  io.on('connection', (client) => {
    log('[http] Socket.io new client incoming: %s', client.id)
    socket = client
    isDev && (global.socket = client)

    // redirect to Main process ipc channel
    client.on('toMain', ([ channel, ...args ]) =>
      ipcMain.emit(channel, {}, ...args))

    // redirect to Renderer process ipc channel
    client.on('toHostView', (args) =>
      process.emit('toHostView', args))

    client.on('disconnect', (reason) =>
      log('[http] Socket.io client "%s" disconnect: %s', client.id, reason))
  })

  // save port and load preload script
  BVport = httpServer.address().port
  loadPreload()

  // execute preload script if required
  if (injectRequired) {
    preloadInject(gameView, () =>
      process.emit('toHostView', ['hostLog', ['[Main] preload executed']]))
    injectRequired = false
  }

  log('[http] Socket.io listen on:\n  http://localhost:%s%s', BVport, BVpath)
  isDev && (global.io = io)
}).on('error', error =>
  // handle error event
  err('[http] Socket.io error: %s', error))

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
        `Game.submenu.contentView
          ? Game.submenu.mainView.toggleSubmenu()
          : Game.submenu.mainView.switchCurrent(Game.submenu.mainView.state.current)
        `,
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

export { loadPreload }
