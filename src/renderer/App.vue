<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { productName } from '../utils'
export default {
  name: `${productName}`
}
</script>

<style lang="scss">
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
