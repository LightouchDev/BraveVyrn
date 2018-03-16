<template>
  <div id="the-tab-bar">
    <tab-button
      :icon="mainIcon"
      :label="$t('submenu.tab.main')"
      @click.native="switchTab('main')"
    />
    <tab-button
      :icon="RFIcon"
      :label="$t('submenu.tab.raidFinder')"
      @click.native="switchTab('raid')"
    />
    <tab-button
      :icon="optionIcon"
      :label="$t('submenu.tab.options')"
      @click.native="switchTab('option')"
    />
  </div>
</template>

<style lang="scss">
#the-tab-bar {
  width: 100%;
  height: 36px;
  background-color: aliceblue;
  display: flex;
  justify-content: space-between;

  #tabButton:first-child {
    margin-left: 0;
    margin-right: 2px;
  }
  #tabButton {
    margin-left: 2px;
    margin-right: 2px;
  }
  #tabButton:last-child {
    margin-left: 2px;
    margin-right: 0;
  }
}
</style>

<script>
import { faIdCard, faCompass, faSun } from '@fortawesome/fontawesome-free-regular'
import TabButton from './TheTabBar/TabButton'

export default {
  name: 'TheTabBar',
  components: {
    TabButton
  },
  data () {
    return {
      mainIcon: faIdCard,
      RFIcon: faCompass,
      optionIcon: faSun
    }
  },
  methods: {
    switchTab (tab) {
      if (this.$store.state.GameView.dashTab !== tab) {
        this.$store.dispatch('GameView/Update', { dashTab: tab })
      }
    }
  }
}
</script>
