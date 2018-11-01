<template>
  <div class="w-full px-4 h-16 pb-6 relative flex">
    <textarea
      v-model="message"
      class="w-full h-full py-3 px-4 mr-2 font-sans text-grey-text resize-none bg-grey-darker border rounded focus:border-primary focus:shadow no-outline leading-none"
      placeholder="message..."
      maxlength="20000"
      @keydown.enter="submitMessage"
    />
    <div class="flex">
      <AppButton
        class="w-12"
        type="primary"
        @click="submitMessage"
      >
        <AppIcon
          icon="arrow-up"
          class="text-white"
        />
      </AppButton>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: ''
    }
  },
  methods: {
    submitMessage(event) {
      if (!event.shiftKey) {
        event.preventDefault()
      } else {
        return
      }

      if (this.message.length === 0) return

      this.$emit('submit', {
        text: this.message
      })

      this.message = ''
    }
  }
}
</script>
