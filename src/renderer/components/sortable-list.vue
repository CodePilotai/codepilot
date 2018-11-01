<template lang="html">
  <ul class="ml-0 list-reset">
    <slot/>
  </ul>
</template>

<script>
import { ContainerMixin } from 'vue-slicksort'

export default {
  mixins: [ContainerMixin]
}
</script>
