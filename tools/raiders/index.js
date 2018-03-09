'use strict'

const { URL } = require('url')
const io = require('socket.io-client')

const server = new URL('http://spur.us.to/gbf')

let socket

// Setup and connect to gbf-raiders
if (server.pathname === '/') {
  socket = io(server.origin)
} else {
  socket = io(server.origin, {
    path: server.pathname
  })
}

const axios = require('axios')

let wasDown = false
let previousDown

// simulate fetch api with axios.get
axios.get(server.href + '/getraids')
  .then(function (response) {
    // we can get response data with response.data
    // console.log(response)
  })
  .catch(function (error) {
    console.log(error)
  })

setInterval(() => {
  if (socket !== null && socket.connected) {
    if (wasDown) {
      console.log('Recovering from connection down...')
      wasDown = false
    }
  } else {
    wasDown = true
  }
  if (previousDown !== wasDown) {
    console.log(`Connection Status: ${socket.connected ? 'UP' : 'DOWN'}`)
    previousDown = wasDown
  }
}, 5000)

// subscribe tiamat raids for example
socket.emit('subscribe', {
  room: 'lvl50tiamatomega'
})
socket.emit('subscribe', {
  room: 'lvl100tiamatimpossible'
})

socket.on('tweet', data => {
  console.log(data)
})
