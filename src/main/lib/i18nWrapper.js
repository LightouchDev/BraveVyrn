import { app, ipcMain } from 'electron'
import get from 'lodash/get'

export let locale

function t (key) {
  return get(locale, key)
}

ipcMain.on('LocaleUpdate', (event, messages) => {
  locale = messages
  app.emit('LocaleUpdate')
})

export default { t }
