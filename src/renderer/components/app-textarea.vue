<template>
  <textarea
    ref="textarea"
    :value="value"
    class="w-full overflow-y-scroll py-3 px-4 mb-3 font-mono text-grey-text resize-none bg-grey-darker border rounded focus:border-primary focus:shadow no-outline"
    rows="8"
    @input="$emit('input', $event.target.value)"
  />
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  }
}
</script>
