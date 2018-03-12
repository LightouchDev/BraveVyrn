<template>
  <div class="container">
    <the-raid-finder />
  </div>
</template>

<style lang="scss" scoped>
.container {
  z-index: 2;
}
</style>
<script>
import TheRaidFinder from './TheDashboard/TheRaidFinder'

export default {
  name: 'TheDashboard',
  components: {
    TheRaidFinder
  }
}
</script>
