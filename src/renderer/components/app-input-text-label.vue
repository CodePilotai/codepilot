<template>
  <label class="block uppercase tracking-wide text-grey-text text-xs font-bold mb-1 mt-4 truncate">
    <slot/>
  </label>
</template>

<script>
export default {
  props: {
    minimized: {
      type: Boolean,
      default: false
    }
  }
}
</script>
