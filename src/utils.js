import debug from 'debug'

/**
 * Oneshot event listener
 * @param   {object}    element     - html element
 * @param   {string}    event       - event
 * @param   {function}  callback    - callback
 * @param   {boolean}   useCapture  - useCapture
 */
export function oneshotListener (element, event, callback, useCapture) {
  element.addEventListener(event, function handler (event) {
    this.removeEventListener(event.type, handler)
    return callback(event)
  }, useCapture)
}

export function noop () {}
export const isDev = process.env.NODE_ENV === 'development'
export const { productName } = require('../package.json')

export const log = debug(`${productName}:info`)
export const err = debug(`${productName}:warn`)

export const rootPath = process.env.PROCESS_TYPE === 'main'
  ? isDev
    ? 'dist/muon'
    : require('path').resolve(__dirname)
  : null

export const site = 'http://game.granbluefantasy.jp'
export const delayLength = process.platform === 'darwin' ? 600 : 80

// I'm really sorry for borrowing this.
export const extKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnyf33j7vc/kGNyfIs5CxClolTTKaepTmovmM6qDN4TI5RXJslU3JwQEw7hC1dcBFvhezTQlCiWYqgBXg5TnhcS0z3qniUuvTWUep4x1X/MfO4+qPMwek6TDkvo5bTFvr5NscrTUh3YB///MKvxQA5Fuhm1YFTl48nFbBlV9F1Lg/i+HbZNnlJRzvCK4olWe0Iqw5WYZqyJNsESYfznpUUbiHdS5II1OxTlBY5eUgE9mORNU/KGhNOFRiUa14GC8yE5z/shOK05fCCvaUrwKkTFNtSebtkexTJuIRrvUBfZIvV6Dp46ktP2slMexFMmM04lInixTCbf0NuhgmLIA/qwIDAQAB'
export const extID = 'eablgejicbklomgaiclcolfilbkckngf'
