<template>
  <AppButton
    :icon="toggleState.icon"
    type="bordered"
    @click="switchState"
  >
    <span v-if="!toggleState.icon">
      {{ toggleState.label }}
    </span>
  </AppButton>
</template>

<script>
export default {
  props: {
    toggleButtons: {
      type: Array,
      default: null
    },
    value: {
      type: Object,
      default: null
    }
  },
  computed: {
    toggleState() {
      return this.toggleButtons.find(button => this.value === button)
    }
  },
  methods: {
    switchState() {
      const newState = this.toggleButtons.find(
        button => button.key !== this.toggleState.key
      )
      this.$emit('toggle', newState)
    }
  }
}
</script>
