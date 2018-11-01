<template>
  <span
    v-show="iconClass"
    :class="[
      iconClass,
      $style.fileIcon
    ]"
    class="inline-block my-0 mx-1 align-middle"
  />
</template>

<script>
export default {
  props: {
    iconClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.file-icon {
  &::before {
    font-size: 1.3em;
  }
}
</style>
