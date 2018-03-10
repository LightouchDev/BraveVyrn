<template>
  <div :style="style">
    <game-web/>
    <overlay/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import GameWeb from './TheGameLoader/GameWeb'
const { ipcRenderer } = chrome

let delayResize = null
const delayLength = process.platform === 'darwin' ? 600 : 80

export default {
  name: 'TheGameLoader',
  components: {
    GameWeb,
    Overlay: () => import(
      /* webpackChunkName: "Overlay" */
      './TheGameLoader/Overlay'
    )
  },
  computed: {
    ...mapState({
      GameView: 'GameView', // fetch state.GameView into this.GameView
      HostView: 'HostView'  // fetch state.HostView into this.HostView
    }),
    gameViewWidth () {
      return (
        Math.trunc(this.GameView.baseSize * this.GameView.zoom) +
        this.sidePadding +
        this.GameView.unknownPadding
      )
    },
    dashWidth () {
      return this.HostView.dashOpen ? this.HostView.dashWidth : 0
    },
    sidePadding () {
      if (this.GameView.maintenance) {
        // Fix window size
        this.$nextTick(() =>
          this.$bus.$emit('GameViewExecuteScript', 'window.fitScreenByZoom(window.displayInitialize())'))
        return 0
      }

      return (this.GameView.isJssdkSideMenu && this.GameView.platformName === 'mobage')
        ? this.GameView.sidePadding
        : 0
    },
    windowWidth () {
      const windowWidth = Math.trunc(this.GameView.zoom * this.windowBase + this.dashWidth)
      if (screen.availWidth < windowWidth && this.GameView.autoResize) {
        this.calcZoom(screen.availWidth / this.windowBase)
      }
      return windowWidth
    },
    windowBase () {
      return ((this.$store.state.Config.subHide && !this.GameView.subOpen) ? 0 : this.GameView.subMenuWidth) +
        this.GameView.baseWidth * (this.GameView.subOpen ? 2 : 1)
    },
    style () {
      this.setupWindow() // setup window when dom changed every time.
      return {
        'width': `${this.gameViewWidth}px`,
        'margin-left': `-${this.sidePadding}px`
      }
    }
  },
  methods: {
    // calculate proper zoom size
    calcZoom (zoom) {
      if (!zoom && this.GameView.autoResize) {
        zoom = window.innerWidth / this.windowBase
      }

      zoom > 2 && (zoom = 2)
      zoom < 1 && (zoom = 1)

      this.$store.dispatch('GameView/Update', { zoom: zoom })
    },
    setupWindow () {
      if (window.onresize) {
        if (!this.GameView.autoResize) {
          // unregister resize event when game is not resposive
          window.onresize = null
          delayResize = null
        }
      } else if (this.GameView.autoResize) {
        // register resize event when game is resposive
        window.onresize = () => {
          clearTimeout(delayResize)
          delayResize = setTimeout(() => {
            this.calcZoom()
          }, delayLength)
        }
      }
      // setup browser window size
      ipcRenderer.send('SendWindowSize', {
        min: this.windowBase,
        width: this.windowWidth,
        autoResize: this.GameView.autoResize
      })
    }
  }
}
</script>
