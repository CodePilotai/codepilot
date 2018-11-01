<template>
  <a
    class="align-middle font-medium"
    @click="openLink"
  >
    <slot/>
  </a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      default: ''
    }
  },
  methods: {
    openLink(event) {
      event.preventDefault()
      if (this.href) {
        this.$electron.shell.openExternal(this.href)
      } else if (this.$listeners.click) {
        this.$emit('click', event)
      }
    }
  }
}
</script>
