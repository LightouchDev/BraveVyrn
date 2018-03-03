'use strict'
// import { log } from '../utils'

export default {
  /**
   * Prevent mute when window inactive
   */
  noMuteWhenBlur () {
    window.addEventListener('blur', function (event) {
      event.stopImmediatePropagation()
    })
  }
}
