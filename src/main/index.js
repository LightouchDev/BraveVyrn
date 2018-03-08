import './init'
import './store'
import '../i18n'
import './mainWindow'
import './contentHandler'
import './dialogHandler'
import './gameViewHandler'

import { app, session } from 'electron'
import { extKey, extID, isDev, err, log } from '../utils'
import contextMenu from './contextMenu'

/**
 * Init app
 */
app.on('ready', init)
app.once('ready', () => log('[app]  ready!'))

function init () {
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
}

/**
 * Add context menu to each webContent
 */

app.on('web-contents-created', (event, content) => {
  content.on('context-menu', contextMenu(content))
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
