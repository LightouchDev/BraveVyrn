<template>
  <div id="wrapper">
    <the-sub-menu-bar id="the-sub-menu-bar" :style="subBarStyle"/>
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
import hotkeys from './Main/hotkeys'

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
    )
  },
  computed: {
    ...mapState({
      GameView: 'GameView'  // fetch state.GameView into this.GameView
    }),
    commonStyle () {
      return {
        zoom: this.GameView.zoom
      }
    },
    subBarStyle () {
      return {
        left: this.GameView.baseWidth * this.GameView.zoom + 'px'
      }
    }
  },
  // inject hotkey when dom mounted
  mounted () {
    hotkeys.call(this)
  }
}
</script>
