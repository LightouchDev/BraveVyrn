import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import { app, Menu } from 'electron'
import i18n, { locale } from './lib/i18nWrapper'

let selectionMenu = {}
let inputMenu = {}

function updateMenu () {
  const itemText = {}
  forEach(['undo', 'redo', 'cut', 'copy', 'paste', 'selectAll'], item => {
    Object.defineProperty(itemText, item, {
      get () {
        return i18n.t(`contextMenu.${item}`)
      }
    })
  })

  selectionMenu = Menu.buildFromTemplate([
    { label: itemText.copy, role: 'copy', accelerator: 'CommandOrControl+C' },
    { type: 'separator' },
    { label: itemText.selectAll, role: 'selectall', accelerator: 'CommandOrControl+A' }
  ])

  inputMenu = Menu.buildFromTemplate([
    { label: itemText.undo, role: 'undo', accelerator: 'CommandOrControl+Z' },
    { label: itemText.redo, role: 'redo', accelerator: 'CommandOrControl+Y' },
    { type: 'separator' },
    { label: itemText.cut, role: 'cut', accelerator: 'CommandOrControl+X' },
    { label: itemText.copy, role: 'copy', accelerator: 'CommandOrControl+C' },
    { label: itemText.paste, role: 'paste', accelerator: 'CommandOrControl+V' },
    { type: 'separator' },
    { label: itemText.selectAll, role: 'selectall', accelerator: 'CommandOrControl+A' }
  ])
}

function newListener (webContents) {
  return function (event, params) {
    if (!isEmpty(locale)) {
      const { selectionText, isEditable } = params
      if (isEditable) {
        inputMenu.popup(webContents)
      } else if (selectionText && selectionText.trim() !== '') {
        selectionMenu.popup(webContents)
      }
    }
  }
}

/**
 * update when locale ready
 */
app.on('LocaleUpdate', updateMenu)

/**
 * Add context menu to each webContent
 */
app.on('web-contents-created', (event, content) => {
  content.on('context-menu', newListener(content))
})
