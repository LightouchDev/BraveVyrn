import { app, BrowserWindow, ipcMain, webContents } from 'electron'
import { isDev, log, rootPath, site } from '../utils'
import contextMenu from './contextMenu'

/**
 * Add context menu to each webContent
 */

app.on('web-contents-created', (event, content) => {
  content.on('context-menu', contextMenu(content))
})

/**
 * Handle popups
 */
const windowConfig = {
  width: 1024,
  height: 768
}

// only one popup allowed
let popup

function checkURL (content, url) {
  log('[pop]  caught pop url: %s', url)
  if (url.indexOf(site) === 0) {
    content.stop()
    process.emit('PopupToGameView', url)
    content.hostWebContents.send('PopupClose')
    return true
  }
}

ipcMain.on('UpdatePopupView', (event, tabId) => {
  const content = webContents.fromTabID(tabId)

  isDev && content.openDevTools({ mode: 'detach' })

  checkURL(content, content.getURL()) ||
    content.on('did-navigate', (event, url) => checkURL(content, url))
})

// handle 'window.open'
process.on('add-new-contents', (e, source, newTab, disposition, size, userGesture) => {
  // ensure new tab is not attached
  if (!newTab.hostWebContents && newTab.guestInstanceId > 0) {
    log('[tab]  here comes new tab: %s', newTab.id)
    // create new window for popups
    if (!popup || popup.isDestroyed()) {
      popup = new BrowserWindow(windowConfig)
      log('[pop]  open new popup window[%s]', popup.id)
    }
    popup.once('close', () => {
      newTab.isDestroyed() || newTab.emit('close')
    })
    popup.loadURL(`chrome://brave/${rootPath}/static/popup.html?guestInstanceId=${newTab.guestInstanceId}`)
    isDev && popup.webContents.openDevTools({ mode: 'detach' })

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
  popup.loadURL(`chrome://brave/${rootPath}/static/popup.html?url=${url}`)
  isDev && popup.webContents.openDevTools({ mode: 'detach' })
})
