<template>
  <div id="the-dashboard">
    <the-tab-bar/>
    <div class="scrollable">
      <the-main-page v-show="typeCheck('main')"/>
      <the-raid-finder v-show="typeCheck('raid')"/>
      <the-option-page v-show="typeCheck('option')"/>
    </div>
  </div>
</template>

<style lang="scss">
#the-dashboard {
  height: 100%;
  .scrollable {
    height: calc(100% - 36px);
    overflow-y: overlay;
    &::-webkit-scrollbar {
      width: 3px;
      background: #ccc;
      opacity: 0.3;
    }
    &::-webkit-scrollbar-button {
      display: none;
    }
    &::-webkit-scrollbar-piece {
      background: #eee;
    }
    &::-webkit-scrollbar-thumb {
      background: #666;
    }
  }
}
</style>
<script>
export default {
  name: 'TheDashboard',
  components: {
    TheMainPage: () => import(
      /* webpackChunkName: "TheMainPage" */
      './TheDashboard/TheMainPage'
    ),
    TheOptionPage: () => import(
      /* webpackChunkName: "TheOptionPage" */
      './TheDashboard/TheOptionPage'
    ),
    TheRaidFinder: () => import(
      /* webpackChunkName: "TheRaidFinder" */
      './TheDashboard/TheRaidFinder'
    ),
    TheTabBar: () => import(
      /* webpackChunkName: "TheTabBar" */
      './TheDashboard/TheTabBar'
    )
  },
  methods: {
    typeCheck (type) {
      return this.$store.state.GameView.dashTab === type
    }
  }
}
</script>
