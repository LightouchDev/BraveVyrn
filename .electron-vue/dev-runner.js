'use strict'

process.env.NODE_ENV = 'development'

const chalk = require('chalk')
const electron = require('electron')
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const webpack = require('webpack')

const mainConfig = require('./webpack.main.config')
const rendererConfig = require('./webpack.renderer.config')
const preloadConfig = require('./webpack.preload.config')

let electronProcess = null
let manualRestart = false

let socket

const httpServer = require('http').createServer()
httpServer.listen(0, '127.0.0.1', () => {
  const { port } = httpServer.address()
  fs.writeFileSync(path.join(__dirname, 'port.txt'), port, 'utf8')

  const io = require('socket.io')(httpServer, {
    serveClient: false
  })
  io.on('connection', (client) => {
    socket = client
  })
})


function logStats (proc, data) {
  let log = ''

  log += chalk.yellow.bold(`┏ ${proc} Process ${new Array((19 - proc.length) + 1).join('-')}`)
  log += '\n\n'

  if (typeof data === 'object') {
    data.toString({
      colors: true,
      chunks: false
    }).split(/\r?\n/).forEach(line => {
      log += '  ' + line + '\n'
    })
  } else {
    log += `  ${data}\n`
  }

  log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n'

  console.log(log)
}

function startRenderer () {
  return new Promise((resolve, reject) => {
    const compiler = webpack(rendererConfig)

    const watching = compiler.watch({}, (error, stats) => {
      if (error) {
        console.log(error)
        return
      }

      logStats('Renderer', stats)

      socket && socket.emit('renderer')

      resolve()
    })
  })
}

function startMain () {
  return new Promise((resolve, reject) => {
    const compiler = webpack(mainConfig)

    compiler.plugin('watch-run', (compilation, done) => {
      logStats('Main', chalk.white.bold('compiling...'))
      done()
    })

    compiler.watch({}, (error, stats) => {
      if (error) {
        console.log(error)
        return
      }

      logStats('Main', stats)

      if (electronProcess && electronProcess.kill) {
        manualRestart = true
        process.kill(electronProcess.pid)
        electronProcess = null
        startElectron()

        setTimeout(() => {
          manualRestart = false
        }, 5000)
      }

      resolve()
    })
  })
}

function startPreload () {
  return new Promise((resolve, reject) => {
    const compiler = webpack(preloadConfig)

    compiler.watch({}, (error, stats) => {
      if (error) {
        console.log(error)
        return
      }

      logStats('Preload', stats)

      socket && socket.emit('preload')

      resolve()
    })
  })
}

function startElectron () {
  electronProcess = spawn(electron, ['--inspect=5858', path.join(__dirname, '../dist/muon/main.js')])

  electronProcess.stdout.on('data', data => {
    electronLog(data, 'blue', '[info]')
  })
  electronProcess.stderr.on('data', data => {
    electronLog(data, 'red', '[warn]')
  })

  electronProcess.on('close', () => {
    if (!manualRestart) process.exit()
  })
}

function electronLog (data, color, prefix) {
  let log = ''
  data = data.toString().split(/\r?\n/)
  data.forEach(line => {
    if (/[0-9A-z]+/.test(line)) {
      console.log(chalk[color].bold(prefix), line)
    }
  })
}

function init () {
  // greeting
  console.log(chalk.yellow.bold('\n  electron-vue'))
  console.log(chalk.blue('  getting ready...') + '\n')

  Promise.all([startRenderer(), startMain(), startPreload()])
    .then(() => {
      startElectron()
    })
    .catch(err => {
      console.error(err)
    })
}

init()
