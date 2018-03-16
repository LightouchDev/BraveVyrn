<template>
  <div id="overlay" :style="style">
    <div id="placeholder" v-show="isPlaceholder">
      <div
        id="side-bar"
        :style="sideBarStyle"
        v-show="isMbga"
      >MBGA bar</div>
      <div id="game" :style="zoom">
        <div
          id="main-view"
          :style="mainViewStyle"
        >Main view</div>
        <div
          id="submenu"
          :style="subMenuStyle"
        >Submenu</div>
      </div>
    </div>
    <div
      v-for="element in elements"
      :key="element.key"
      :id="element.id"
      :class="[element.class ? element.class : '']"
      :data-preset="element.preset ? element.preset : ''"
      :style="[element.style, zoom]"
      v-on="element.clickable ? { mouseup: eventMap } : ''"
    />
  </div>
</template>

<style lang="scss" scoped>
#overlay {
  width: 100%;
  height: 100vh;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
  user-select: none;
  overflow: hidden;
  position: absolute;
  > div {
    position: absolute;
    pointer-events: auto;
  }
  #placeholder {
    left: 0;
    #side-bar {
      height: 100vh;
      background-color: aqua;
      writing-mode: vertical-rl;
      float: left;
    }
    #game {
      display: flex;
      > div {
        flex-shrink: 0;
      }
      height: 100vh;
      #main-view {
        background-color: aquamarine;
      }
      #submenu {
        writing-mode: vertical-rl;
        color: $standardWhite;
        background-color: $standardBlack;
      }
    }
  }
}
</style>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      Overlay: 'Overlay',  // fetch state.Overlay into this.Overlay
      GameView: 'GameView' // fetch state.GameView into this.GameView
    }),
    elements () {
      return this.Overlay.elements
    },
    style () {
      const width =
        (this.isMbga ? this.GameView.sidePadding : 0) +
        (this.GameView.baseWidth + this.GameView.subMenuWidth) *
        this.GameView.zoom
      return { width: width + 'px' }
    },
    zoom () {
      return { zoom: this.GameView.zoom }
    },
    isPlaceholder () {
      return localStorage.getItem('placeholder') === 'true'
    },
    isMbga () {
      return this.GameView.platformName === 'mobage'
    },
    sideBarStyle () {
      return { width: this.GameView.sidePadding + 'px' }
    },
    mainViewStyle () {
      return { width: this.GameView.baseWidth + 'px' }
    },
    subMenuStyle () {
      return { width: this.GameView.subMenuWidth + 'px' }
    }
  },
  methods: {
    // map event according to data-preset
    eventMap: function (event) {
      let thisPreset = event.target.dataset.preset
      const data = this.Overlay.data[thisPreset]
      return this[thisPreset](event, data)
    }
  }
}
</script>
