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

/*
function send (...args) {
  ipcRenderer.send('toGameView', args)
}
*/

// IPC message from gameView
ipcRenderer.on('hostLog', (event, args) => hostLog(...args))

export default {
  computed: {
    siteUrl () {
      log('url is %s, path is %s', location.search, params.get('url'))
      const url = localStorage.getItem('placeholder') === 'true'
        ? ''
        : params.get('url') || site
      return url
    }
  },
  methods: {
    execScript (scriptString) {
      this.$el.executeScriptInTab(extID, scriptString, { mainWorld: true })
    },
    // update current tabID
    init ({tabID}) {
      log('get tabID: %s', tabID)
      ipcRenderer.send('GameViewChanged', tabID)
    },
    urlFilter ({ url, isMainFrame, isErrorPage }) {
      if(isMainFrame && !isErrorPage && url.indexOf(site)) {
        this.$el.stop()
        ipcRenderer.send('PopupNavigation', url)
      }
    },
    reload () {
      this.$el.reload()
    },
    log (event) {
      log(event.type)
    }
  },
  mounted () {
    // register global event
    this.$bus.$on('GameViewReload', this.reload)
    this.$bus.$on('GameViewExecuteScript', this.execScript)
  }
}
</script>

<style lang="scss">
#game-web{
  height: 100vh;
  z-index: 1;
}
</style>
