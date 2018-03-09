<template>
  <div class="container">
    <sub-menu-botton
      :icon="optionIcon"
      :label="optionText"
      @click.native="optionToggle"
    />
  </div>
</template>

<style lang="scss" scoped>
.container {
  bottom: 0px;
  position: absolute;
  text-align: center;
}
</style>

<script>
import { mapState } from 'vuex'
import SubMenuBotton from './TheSubMenuBar/SubMenuButton'
import { faListAlt, faTimesCircle, faIdBadge } from '@fortawesome/fontawesome-free-regular'

export default {
  name: 'TheSubMenuBar',
  components: {
    SubMenuBotton
  },
  computed: {
    ...mapState({
      HostView: 'HostView' // fetch state.HostView into this.HostView
    }),
    optionIcon () {
      return this.HostView.optionOpen ? faTimesCircle : faListAlt
    },
    optionText () {
      return (this.HostView.optionOpen ? this.$t('common.close') : this.$t('common.option')).toUpperCase()
    }
  },
  methods: {
    optionToggle () {
      this.$store.dispatch('HostView/Update', { optionOpen: !this.HostView.optionOpen })
    }
  }
}
</script>
