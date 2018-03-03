'use strict'

import { ipcMain, screen } from 'electron'
import { clone, isEqual } from 'lodash'

const delayLength = process.platform === 'darwin' ? 600 : 80

let previousSize
let windowSize = {
  min: 320,
  max: 640,
  width: 480,
  autoResize: false
}

function init (mainWindow) {
  const { commit } = global

  const [ windowWidth, windowHeight ] = mainWindow.getSize()
  const [ contentWidth, contentHeight ] = mainWindow.getContentSize()
  const extraWidth = windowWidth - contentWidth
  const extraHeight = windowHeight - contentHeight

  /**
   * Resize depend on windowSize object
   */
  let delayResize = null
  mainWindow.on('resize', event => {
    clearInterval(delayResize)
    delayResize = setInterval(() => {
      const [winWidth, winHeight] = mainWindow.getSize()
      if (windowSize.autoResize) {
        // limit the minimum window width
        if (winWidth < windowSize.min) {
          mainWindow.setSize(windowSize.min, winHeight)
        }
        // limit the maximum window width
        if (winWidth > windowSize.max) {
          mainWindow.setSize(windowSize.max, winHeight)
        }
      } else {
        mainWindow.setSize(windowSize.width, winHeight)
      }
      clearInterval(delayResize)
    }, delayLength)
  })

  /**
   * Remember window position and height
   */
  let delaySavePos = null
  mainWindow.on('move', () => {
    clearTimeout(delaySavePos)
    delaySavePos = setTimeout(() => {
      const [x, y] = mainWindow.getPosition()
      commit('Config/UPDATE', { x, y })
    }, delayLength)
  })
  let delaySaveHeight = null
  mainWindow.on('resize', () => {
    clearTimeout(delaySaveHeight)
    delaySaveHeight = setTimeout(() => {
      const [ width, height ] = mainWindow.getContentSize()
      commit('Config/UPDATE', { width, height })
    }, delayLength)
  })

  /**
   * Change Window size
   */
  ipcMain.on('SendWindowSize', (event, size) => {
    windowSize = {
      min: size.min + extraWidth,
      max: size.min * 2 + extraWidth,
      width: size.width + extraWidth,
      autoResize: size.autoResize
    }
    if (!isEqual(windowSize, previousSize)) {
      let [ x, y ] = mainWindow.getPosition()
      let height = mainWindow.getContentSize()[1]
      const {
        height: availHeight,
        width: availWidth,
        x: availLeft,
        y: availTop
      } = screen.getDisplayNearestPoint({ x, y }).workArea
      const remainX = availWidth - windowSize.width + availLeft
      if (x > remainX) {
        x = remainX > 0 ? remainX : 0
      }
      const remainY = availHeight - height + availTop
      if (y > remainY) {
        y = remainY > 0 ? remainY : 0
      }
      if (height > availHeight) {
        height = availHeight
      } else {
        height = height + extraHeight
      }
      mainWindow.setBounds({
        x,
        y,
        width: windowSize.width,
        height
      })
      previousSize = clone(windowSize)
    }
  })
}

export default init
