<template>
  <div class="container">
    <!-- <raid-finder/> -->
  </div>
</template>

<style lang="scss" scoped>
.container {
  z-index: 2;
}
</style>
<script>
import RaidFinder from './TheDashboard/TheRaidFinder'

export default {
  name: 'TheDashboard',
  compoments: {
    RaidFinder
  }
}
</script>
