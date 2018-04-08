import { ipcMain } from 'electron'
import URLParser from 'url-parser'

function hostLog (...args) {
  process.emit('toHostView', ['hostLog', args])
}

ipcMain.on('game-ajax', (event, {url, dataType, data}) => {
  const URL = URLParser(url)
  hostLog('[AJAX] %s: %o', URL.pathname, data)
})

ipcMain.on('game-raid', (event, data) => hostLog('[RAID] %o', data))
