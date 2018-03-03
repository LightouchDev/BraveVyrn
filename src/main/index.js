'use strict'

import './init'
import './configHelper'
import './store'
import '../i18n'
import './contentHandler'
import './dialogHandler'
import './gameViewHandler'

import { app, BrowserWindow, session } from 'electron'
import { extKey, extID, isDev, err, log, rootPath } from '../utils'
import windowHandler from './windowHandler'

/**
 * Init app
 */
log('App start!')

app.isReady()
  ? createWindow()
  : app.on('ready', createWindow)
app.once('ready', () => log('App ready!'))

/**
 * Window section
 */
let mainWindow
const isSecondInstance = app.makeSingleInstance(() => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})
if (isSecondInstance) {
  app.quit()
}

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

function createWindow () {
  /**
   * Load renderer script as extension
   */
  session.defaultSession.extensions.load('.', {
    name: 'Content wrapper',
    manifest_version: 2,
    version: '1.0',
    permissions: [
      'externally_connectable.all_urls',
      'contentSettings',
      '<all_urls>',
      'webview',
      'storage',
      'tabs'
    ],
    externally_connectable: {
      matches: [ '<all_urls>' ]
    },
    // incognito: 'split',
    key: extKey
  }, 'component')
  session.defaultSession.extensions.enable(extID)

  mainWindow = new BrowserWindow({
    width: global.state.Config.width || 480,
    height: global.state.Config.height || 870,
    show: false,
    useContentSize: true,
    fullscreenable: false,
    maximizable: false
  })

  if (global.state.Config.x >= 0 && global.state.Config.y >= 0) {
    mainWindow.setPosition(global.state.Config.x, global.state.Config.y)
  }

  // show window and inject into it
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    isDev && mainWindow.webContents.openDevTools({ mode: 'detach' })
    windowHandler(mainWindow)
  })

  // exit when main window closed
  mainWindow.on('closed', () => app.quit())

  mainWindow.loadURL(`chrome://brave/${rootPath}/index.html`)

  /**
   * Register mainWindow to global
   */
  global.mainWindow = mainWindow

  /**
   * Emit 'windowCreated' event
   */
  app.emit('windowCreated')
}

/**
 * Add context menu to each webContent
 */

app.on('web-contents-created', (event, content) => {
  content.on('context-menu', require('./contextMenu').default(content))
})

/**
 * Handle common error
 */
if (!isDev) {
  process.on('unhandledRejection', err)
  process.on('uncaughtException', err)
}

/**
 * Auto Updater
 *
 * Un-comment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (!DEV) autoUpdater.checkForUpdates()
})
 */
