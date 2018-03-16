<template>
  <div id="tabButton">
    <font-awesome-icon
      :icon="icon"
      transform="down-3"
    />
    <div id="tabLabel">{{ label }}</div>
  </div>
</template>

<style lang="scss">
#tabButton {
  height: 36px;
  text-align: center;
  border-color: gray;
  border-style: dotted;
  border-width: 1px;
  box-sizing: border-box;
  flex-grow: 1;
  flex-basis: 0;
  user-select: none;
  > * {
    pointer-events: none;
  }
}
#tabLabel {
  font-size: 10px;
  font-weight: bold;
  line-height: 1.5
}

</style>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
export default {
  name: 'TabButton',
  components: {
    FontAwesomeIcon
  },
  props: [
    'icon',
    'label'
  ]
}
</script>
