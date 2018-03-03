'use strict'

import debug from 'debug'

/**
 * Oneshot event listener
 * @param   {object}    element     - html element
 * @param   {string}    event       - event
 * @param   {function}  callback    - callback
 * @param   {boolean}   useCapture  - useCapture
 */
function oneshotListener (element, event, callback, useCapture) {
  element.addEventListener(event, function handler (event) {
    this.removeEventListener(event.type, handler)
    return callback(event)
  }, useCapture)
}

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min // The maximum is exclusive and the minimum is inclusive
}

const isDev = process.env.NODE_ENV === 'development'
const { productName } = require('../package.json')

const log = debug(`${productName}:info`)
const err = debug(`${productName}:warn`)

let rootPath

if (typeof window === 'undefined') {
  rootPath = isDev
    ? 'dist/muon'
    : require('path').resolve(__dirname)
}

const site = 'http://game.granbluefantasy.jp'

// I'm really sorry for borrowing this.
const extKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnyf33j7vc/kGNyfIs5CxClolTTKaepTmovmM6qDN4TI5RXJslU3JwQEw7hC1dcBFvhezTQlCiWYqgBXg5TnhcS0z3qniUuvTWUep4x1X/MfO4+qPMwek6TDkvo5bTFvr5NscrTUh3YB///MKvxQA5Fuhm1YFTl48nFbBlV9F1Lg/i+HbZNnlJRzvCK4olWe0Iqw5WYZqyJNsESYfznpUUbiHdS5II1OxTlBY5eUgE9mORNU/KGhNOFRiUa14GC8yE5z/shOK05fCCvaUrwKkTFNtSebtkexTJuIRrvUBfZIvV6Dp46ktP2slMexFMmM04lInixTCbf0NuhgmLIA/qwIDAQAB'
const extID = 'eablgejicbklomgaiclcolfilbkckngf'

export { extKey, extID, isDev, productName, rootPath, site }
export { err, log, getRandomInt, oneshotListener }
