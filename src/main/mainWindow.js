import { app, BrowserWindow, ipcMain, screen } from 'electron'
import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'
import store from './store'
import { delayLength, isDev, log, rootPath } from '../utils'

let mainWindow, previousSize
let windowSize = {
  min: 320,
  max: 640,
  width: 480,
  autoResize: false
}

function init () {
  const { x, y, width, height } = store.state.Config

  mainWindow = new BrowserWindow({
    width: width || 480,
    height: height || 870,
    show: false,
    useContentSize: true,
    fullscreenable: false,
    maximizable: false
  })

  serviceInit()

  if (x >= 0 && y >= 0) {
    mainWindow.setPosition(x, y)
  }

  // show window and inject into it
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    isDev && mainWindow.webContents.openDevTools({ mode: 'detach' })
    startup(mainWindow)
  })

  // exit when main window closed
  mainWindow.on('closed', () => app.quit())

  mainWindow.loadURL(`chrome://brave/${rootPath}/index.html`)

  app.emit('WindowCreated')

  isDev && (global.mainWindow = mainWindow)
}

function serviceInit () {
  process.on('setAlwaysOnTop', (args) => {
    mainWindow.setAlwaysOnTop(args)
    log('[conf] alwaysOnTop is %s', mainWindow.isAlwaysOnTop())
  })

  // open DevTools
  ipcMain.on('HostViewOpenDevTools', () => mainWindow.openDevTools({ mode: 'detach' }))

  // redirect caught url to gameview
  process.on('PopupToGameView', (url) => {
    mainWindow.loadURL(`chrome://brave/${rootPath}/index.html?url=${encodeURIComponent(url)}`)
  })

  process.on('toHostView', (args) =>
    mainWindow.webContents.send(...args))

  app.on('HostReload', () => mainWindow.webContents.reloadIgnoringCache())
}

function startup () {
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
      store.commit('Config/Update', { x, y })
    }, delayLength)
  })
  let delaySaveHeight = null
  mainWindow.on('resize', () => {
    clearTimeout(delaySaveHeight)
    delaySaveHeight = setTimeout(() => {
      const [ width, height ] = mainWindow.getContentSize()
      store.commit('Config/Update', { width, height })
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

/**
 * App behavior
 */
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
    init()
  }
})

app.on('ready', init)
