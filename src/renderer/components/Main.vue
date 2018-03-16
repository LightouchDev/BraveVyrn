<template>
  <div id="wrapper">
    <the-game-loader/>
    <the-sub-menu-bar/>
    <the-sub-layer/>
  </div>
</template>

<style lang="scss">
body {
  overflow: hidden;
}

#wrapper {
  > * {
    position: fixed;
  }
}
</style>

<script>
import { mapState } from 'vuex'
import isUndefined from 'lodash/isUndefined'
import TheGameLoader from './Main/TheGameLoader'
import hotkeys from './Main/hotkeys'

// prevent unexpected drag and drop event
document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())

export default {
  name: 'Main',
  components: {
    TheGameLoader,
    TheSubMenuBar: () => import(
      /* webpackChunkName: "TheSubMenuBar" */
      './Main/TheSubMenuBar'
    ),
    TheSubLayer: () => import(
      /* webpackChunkName: "TheSubLayer" */
      './Main/TheSubLayer'
    )
  },
  // inject hotkey when dom mounted
  mounted () {
    hotkeys.call(this)
  }
}
</script>
