<template>
  <div id="subMenuButton">
    <font-awesome-icon
      :icon="icon"
      transform="grow-14 down-7"
    />
    <div id="subMenuLabel">{{ label }}</div>
  </div>
</template>

<style lang="scss">
#subMenuButton {
  color: #c5f7f9;
  width: 64px;
  height: 45px;
  margin: 9px 0 9px;
  position: relative;
  text-align: center;
  user-select: none;
  @include gradient-text('linear-gradient(#c5f7f9, #94d4dd, #c5f7f9)', 'dark');
  > * {
    pointer-events: none;
  }
}
#subMenuLabel {
  font-size: 11px;
  font-weight: bold;
  position: absolute;
  line-height: 1;
  left: 0;
  right: 0;
  bottom: 0;
  @include gradient-text('linear-gradient(#c5f7f9, #94d4dd, #c5f7f9)', 'dark');
}
</style>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
export default {
  name: 'SubMenuBotton',
  components: {
    FontAwesomeIcon
  },
  props: [
    'icon',
    'label'
  ]
}
</script>

