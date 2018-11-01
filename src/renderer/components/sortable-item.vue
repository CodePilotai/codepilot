<template lang="html">
  <li class="my-1 mx-0 list-reset">
    <slot/>
  </li>
</template>

<script>
import { ElementMixin } from 'vue-slicksort'

export default {
  mixins: [ElementMixin]
}
</script>
