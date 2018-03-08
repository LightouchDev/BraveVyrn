<template>
  <div id="wrapper">
    <the-dashboard id="the-dashboard" :style="[commonStyle, dashStyle]"/>
    <the-sub-menu-bar id="the-sub-menu-bar" :style="[commonStyle, subBarStyle]"/>
    <the-option-layer id="the-option-layer" :style="commonStyle"/>
    <the-game-loader id="the-game-loader"/>
  </div>
</template>

<style lang="scss">
body {
  overflow: hidden;
}

#wrapper {
  display: flex;
  > div {
    flex-shrink: 0;
  }
}

#the-dashboard {
  background: $standardBlack;
}
</style>

<script>
import { mapState } from 'vuex'
import isUndefined from 'lodash/isUndefined'
import TheGameLoader from './Main/TheGameLoader'
import registerHotkey from '../libs/registerHotkey'

// prevent unexpected drag and drop event
document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())

export default {
  name: 'Main',
  components: {
    TheGameLoader,
    TheSubMenuBar: () => import(
      /* webpackChunkName: "TheSubMenuBar" */
      './Main/TheSubMenuBar'
    ),
    TheOptionLayer: () => import(
      /* webpackChunkName: "TheOptionLayer" */
      './Main/TheOptionLayer'
    ),
    TheDashboard: () => import(
      /* webpackChunkName: "TheDashboard" */
      './Main/TheDashboard'
    )
  },
  computed: {
    ...mapState({
      HostView: 'HostView', // fetch state.HostView into this.HostView
      GameView: 'GameView'  // fetch state.GameView into this.GameView
    }),
    commonStyle () {
      return {
        zoom: this.GameView.zoom
      }
    },
    dashStyle () {
      return {
        width: this.HostView.dashOpen ? this.HostView.dashWidth + 'px' : 0
      }
    },
    subBarStyle () {
      return {
        left: this.GameView.baseWidth + (this.HostView.dashOpen ? this.HostView.dashWidth : 0) + 'px'
      }
    }
  },
  // inject hotkey when dom mounted
  mounted () {
    const { ipcRenderer } = chrome

    // prevent 'this' target issue
    const bus = this.$bus

    function gameViewDevTools () {
      ipcRenderer.send('GameViewOpenDevTools')
    }

    function gameViewRefresh () {
      bus.$emit('GameViewReload')
    }

    function gameViewRefreshIgnoringCache () {
      ipcRenderer.send('GameViewReloadIgnoringCache')
    }

    // Set hotkey
    if (process.platform === 'darwin') {
      // Command + Option + I: open game view DevTools on OSX
      registerHotkey('Command+Option+I', gameViewDevTools)
      // Command + R: refresh game view on OSX
      registerHotkey('Command+R', gameViewRefresh)
      // Command + Shift + R: refresh game view and ignores cache on OSX
      registerHotkey('Command+Shift+R', gameViewRefreshIgnoringCache)
    } else {
      // F12: open game view DevTools
      registerHotkey('F12', gameViewDevTools)
      // F5: refresh game view
      registerHotkey('F5', gameViewRefresh)
      // Ctrl + R: refresh game view
      registerHotkey('Ctrl+R', gameViewRefresh)
      // Shift + F5: refresh game view and ignores cache
      registerHotkey('Shift+F5', gameViewRefreshIgnoringCache)
      // Ctrl + Shift + R: refresh game view and ignores cache
      registerHotkey('Ctrl+Shift+R', gameViewRefreshIgnoringCache)
    }

    // Ctrl + Alt + I: open hostView DevTools
    registerHotkey('Ctrl+Alt+I', () => ipcRenderer.send('HostViewOpenDevTools'))

    // H: hide submenu
    registerHotkey('H', () => {
      const { subHide } = this.$store.state.Config
      if (!subHide && this.GameView.subOpen) {
        bus.$emit('GameViewExecuteScript', 'Game.submenu.mainView.toggleSubmenu()')
      }
      this.$store.dispatch('Config/Update', {
        subHide: !subHide
      })
    })

    registerHotkey.startListen()
  }
}
</script>
