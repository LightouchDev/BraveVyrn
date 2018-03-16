<template>
  <div>
    
  </div>
</template>
<style lang="scss">
</style>

<script>
import { mapState } from 'vuex'
import { log, err } from '@/../utils'

export default {
  name: 'TheRaidFinder',
  mounted () {
    const { raidFinderURL } = this.$store.state.Config
    const raidFinder = new URL(raidFinderURL)
    const self = this

    // fetch supported raid list
    fetch(raidFinder.href + '/getraids')
      .then(Response => Response.json())
      .then(value => {
        self.$data.raidList = value
      })

    const socket = require('socket.io-client')(
      raidFinder.origin,
      raidFinder.pathname !== '/' && { path: raidFinder.pathname })

    // register event to trigger dom update
    socket.on('connect', self.$forceUpdate)
    socket.on('reconnect', self.$forceUpdate)
    socket.on('disconnect', self.$forceUpdate)
    socket.on('error', self.$forceUpdate)

    // debug info
    socket.on('connect', () =>
      log('RaidFinder: connect successful.'))
    socket.on('reconnect', attemptNumber =>
      log('RaidFinder: reconnect successful after %s times retry.', attemptNumber))
    socket.on('disconnect', reason =>
      log('RaidFinder: disconnected (%s)', reason))
    socket.on('error', error =>
      err('RaidFinder error: %s', error))

    // export socket to this instance
    self.$socket = socket
  }
}
</script>
