'use strict'

import { dialog } from 'electron'
import i18n from '../i18n'

// FIXME: using html dialog instead

/**
 * muonCb (returnValue, unknownString, suppress)
 *
 * @param {boolean} returnValue
 * @param {string}  unknownString
 * @param {boolean} suppress      - if true, would hide all future dialog and always return false
 */

process.on('window-alert', (webContents, extraData, title, message, defaultPromptText,
  shouldDisplaySuppressCheckbox, isBeforeUnloadDialog, isReload, muonCb) => {
  dialog.showMessageBox({
    type: 'info',
    buttons: [ i18n.t('common.ok') ],
    message
  }, (response) => {
    console.log('response is', response)
    muonCb(false, '', false)
  })
})

process.on('window-confirm', (webContents, extraData, title, message, defaultPromptText,
  shouldDisplaySuppressCheckbox, isBeforeUnloadDialog, isReload, muonCb) => {
  dialog.showMessageBox({
    type: 'info',
    buttons: [ i18n.t('common.ok'), i18n.t('common.cancel') ],
    message
  }, (response) => {
    console.log('response is', response)
    muonCb(!response, '', false)
  })
})

process.on('window-prompt', (webContents, extraData, title, message, defaultPromptText,
  shouldDisplaySuppressCheckbox, isBeforeUnloadDialog, isReload, muonCb) => {
  console.warn('window.prompt is not supported yet')
  muonCb(null, '', false)
})
