<template>
  <AppModal
    title="Warning!"
    @close="confirm"
  >
    <p>Warning: {{ message }}</p>
    <AppButton
      class="w-full"
      @click="confirm"
    >
      Continue
    </AppButton>
  </AppModal>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  },
  methods: {
    confirm() {
      this.$emit('continue')
    }
  }
}
</script>
