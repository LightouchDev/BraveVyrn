<template>
  <webview
    id="game-web"
    :src="siteUrl"
    @tab-id-changed="init"
    @load-start="urlFilter"
    @did-navigate="log"
    @dom-ready="log"
  />
</template>

<script>
import { mapState } from 'vuex'

import debug from 'debug'
import { extID, log, productName, site } from '../../../../utils'
import { setTimeout } from 'timers';
const { ipcRenderer } = chrome

const { searchParams: params } = new URL(location.href)

const hostLog = debug(`${productName}:page`)
let gameView, preload

function send (...args) {
  ipcRenderer.send('toGameView', args)
}

// IPC message from gameView
ipcRenderer.on('hostLog', (event, args) => hostLog(...args))

export default {
  computed: {
    siteUrl () {
      log('url is %s, path is %s', location.search, params.get('url'))
      return params.get('url') || site
    }
  },
  methods: {
    // update current tabID
    init ({tabID}) {
      log('get tabID: %s', tabID)
      ipcRenderer.send('GameViewChanged', tabID)

      /**
       * init
       */
      gameView = document.querySelector('webview')
      gameView.executeJavaScript = function (scriptString) {
        gameView.executeScriptInTab(extID, scriptString, { mainWorld: true })
      }
      gameView.send = send
      window.gameView = gameView
    },
    urlFilter ({ url, isMainFrame, isErrorPage }) {
      if(isMainFrame && !isErrorPage && url.indexOf(site)) {
        gameView.stop()
        ipcRenderer.send('PopupNavigation', url)
      }
    },
    log (event) {
      log(event.type)
    }
  }
}
</script>

<style lang="scss">
#game-web{
  height: 100vh;
  z-index: 1;
}
</style>
