<template>
  <div id="the-sub-menu-bar" :style="commonStyle">
    <sub-menu-botton
      :icon="dashboardIcon"
      :label="$t('submenu.dashboard')"
      @click.native="subLayerToggle('dash')"
    />
  </div>
</template>

<style lang="scss">
#the-sub-menu-bar {
  mix-blend-mode: lighten; /* hack for grdiant text bug */
  bottom: 0;
}
</style>

<script>
import { mapState } from 'vuex'
import SubMenuBotton from './TheSubMenuBar/SubMenuButton'
import { faListAlt, faIdBadge } from '@fortawesome/fontawesome-free-regular'
import forEach from 'lodash/forEach'
import includes from 'lodash/includes'

export default {
  name: 'TheSubMenuBar',
  components: {
    SubMenuBotton
  },
  data () {
    return {
      dashboardIcon: faIdBadge
    }
  },
  computed: {
    ...mapState({
      GameView: 'GameView' // fetch state.GameView into this.GameView
    }),
    commonStyle () {
      return {
        left: this.GameView.baseWidth + 'px',
        zoom: this.GameView.zoom
      }
    }
  },
  methods: {
    subLayerToggle (type) {
      if (!this.GameView.subOpen) {
        this.$bus.$emit('GameViewToggleSubmenu')
      } else if (this.GameView.subType === type) {
        this.$bus.$emit('GameViewToggleSubmenu')
      }
      if (this.GameView.subType !== type) {
        this.$store.dispatch('GameView/Update', { subType: type })
      }
    }
  }
}
</script>
