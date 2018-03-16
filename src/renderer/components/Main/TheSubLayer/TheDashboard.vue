<template>
  <div id="the-dashboard">
    <the-tab-bar/>
    <the-main-page v-show="typeCheck('main')"/>
    <the-raid-finder v-show="typeCheck('raid')"/>
    <the-option-page v-show="typeCheck('option')"/>
  </div>
</template>

<style lang="scss">
#the-dashboard {
  height: 100%;
  .scrollable {
    overflow-y: scroll;
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
