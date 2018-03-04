'use strict'

import { BrowserWindow, ipcMain, webContents } from 'electron'
import { isDev, log, rootPath } from '../utils'

const windowConfig = {
  width: 1024,
  height: 768
}

// only one popup allowed
let popup

ipcMain.on('TabOpenDevTools', (event, tabId) => webContents.fromTabID(tabId).openDevTools({ mode: 'detach' }))

// handle 'window.open'
process.on('add-new-contents', (e, source, newTab, disposition, size, userGesture) => {
  // ensure new tab is not attached
  if (!newTab.hostWebContents) {
    log('[tab]  here comes new tab: %s', newTab.id)
    // create new window for popups
    if (!popup || popup.isDestroyed()) {
      popup = new BrowserWindow(windowConfig)
      log('[pop]  open new popup window[%s]', popup.id)
    }
    popup.once('close', () => {
      newTab.isDestroyed() || newTab.emit('close')
    })
    popup.loadURL(`chrome://brave/${rootPath}/static/popup.html?guestInstanceId=${newTab.guestInstanceId}&isDev=${isDev}`)
    isDev && popup.webContents.openDevTools()

    newTab.once('close', () => {
      popup = null
      newTab.forceClose()
      newTab.destroy()
    })
  }
})

// handle outside navigation
ipcMain.on('PopupNavigation', (event, url) => {
  log('[pop]  start popup navigation')
  if (!popup || popup.isDestroyed()) {
    popup = new BrowserWindow(windowConfig)
    log('[pop]  open new popup window[%s]', popup.id)
  }
  url = encodeURIComponent(url)
  popup.loadURL(`chrome://brave/${rootPath}/static/popup.html?watcher=true&isDev=${isDev}&url=${url}`)
  isDev && popup.webContents.openDevTools()
})
