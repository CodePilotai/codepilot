<template>
  <span
    v-if="source === 'font-awesome'"
    :class="'fa fa-' + icon"
    v-on="$listeners"
  />
  <Octicon
    v-else
    :name="icon"
    class="mt-1 align-middle"
    v-on="$listeners"
  />
</template>

<script>
import Octicon from 'vue-octicon/components/Octicon'

export default {
  components: {
    Octicon
  },
  props: {
    source: {
      type: String,
      default: 'font-awesome'
    },
    icon: {
      type: String,
      required: true
    }
  }
}
</script>
