<template>
  <div
    id="the-sub-layer"
    :style="subLayerStyle"
    v-show="show"
  >
    <the-dashboard v-show="typeCheck('dash')"/>
  </div>
</template>

<style lang="scss">
#the-sub-layer {
  height: 100%;
  background-color: black;
  overflow: hidden;
}
</style>

<script>
import includes from 'lodash/includes'
import { mapState } from 'vuex'

const hostPageType = ['dash', 'dual']

export default {
  name: 'TheSubLayer',
  components: {
    TheDashboard: () => import(
      /* webpackChunkName: "TheDashboard" */
      './TheSubLayer/TheDashboard'
    )
  },
  computed: {
    ...mapState({
      GameView: 'GameView'  // fetch state.GameView into this.GameView
    }),
    show () {
      return includes(hostPageType, this.GameView.subType)
    },
    subLayerStyle () {
      return {
        left: this.GameView.baseWidth + this.GameView.subMenuWidth + 'px',
        width: this.GameView.baseWidth + 'px',
        zoom: this.GameView.zoom
      }
    }
  },
  methods: {
    typeCheck (type) {
      return this.GameView.subType === type
    }
  }
}
</script>
