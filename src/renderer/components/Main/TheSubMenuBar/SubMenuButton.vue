<template>
  <div class="button">
    <font-awesome-icon
      :icon="icon"
      transform="grow-14 down-7"
    />
    <div class="label">{{ label }}</div>
  </div>
</template>

<style lang="scss" scoped>
.button {
  z-index: 2;
  color: #c5f7f9;
  width: 64px;
  height: 45px;
  margin: 9px 0 9px;
  position: relative;
  @include gradient-text('linear-gradient(#c5f7f9, #94d4dd, #c5f7f9)', 'dark');
}
.label {
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0.75px;
  pointer-events: none;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  text-shadow:
    -1px -1px 2px $standardBlack,
     1px -1px 2px $standardBlack,
    -1px  1px 2px $standardBlack,
     1px  1px 2px $standardBlack;
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

